/**
 * Ball Trajectory Physics Engine
 *
 * Generates realistic 3D ball trajectories for DRS simulation using
 * projectile motion with gravity, air drag, spin (Magnus effect),
 * and bounce modelling.
 *
 * Coordinate system (metres):
 *   x = across the pitch (0 = middle stump, positive = off side for RHB)
 *   y = height above ground
 *   z = along the pitch (0 = bowling crease, positive toward batsman)
 *
 * Pitch length ≈ 20.12 m (22 yards).
 */

// ── Constants ──────────────────────────────────────────────────────
const G = 9.81; // m/s²
const PITCH_LENGTH = 20.12; // metres
const STUMP_HEIGHT = 0.711; // metres (28 inches)
const STUMP_WIDTH = 0.2286; // metres (9 inches across three stumps)
const HALF_STUMP_W = STUMP_WIDTH / 2;
const AIR_DENSITY = 1.225; // kg/m³
const BALL_MASS = 0.156; // kg
const BALL_RADIUS = 0.0364; // m
const BALL_AREA = Math.PI * BALL_RADIUS * BALL_RADIUS;
const DRAG_COEFF = 0.45; // cricket ball Cd
const CL_SPIN = 0.25; // lift coefficient per unit angular velocity ratio
const DT = 0.001; // integration timestep (s)
const BOUNCE_RESTITUTION = 0.58; // coefficient of restitution on pitch
const FRICTION_COEFF = 0.45; // lateral friction multiplier on bounce

// ── Input types ────────────────────────────────────────────────────
export type DeliveryInput = {
  /** Release speed in km/h (120-155 for pace, 70-100 for spin) */
  speed: number;
  /** Line: lateral offset at release in metres (−0.3 = leg, 0 = middle, +0.3 = off) */
  line: number;
  /** Length: 0-1 fraction of pitch (0 = yorker, 0.4 = good, 0.7 = short) */
  length: number;
  /** Swing: lateral movement in metres (negative = inswingers for RHB) */
  swing: number;
  /** Seam deviation off the pitch in metres */
  seamDeviation: number;
  /** Spin rate in RPM (0 for seamers, 1500-3000 for spinners) */
  spinRate: number;
  /** Spin axis tilt in degrees (0 = pure backspin, 90 = side spin) */
  spinAxis: number;
  /** Release height in metres (typically 1.9-2.3) */
  releaseHeight: number;
  /** Bowler type for label purposes */
  bowlerType: "PACE" | "SPIN";
};

export type TrajectoryPoint = {
  x: number;
  y: number;
  z: number;
  t: number;
};

export type BallTrajectory = {
  /** Full pre-bounce trajectory points (sampled every ~2cm along z) */
  preBounce: TrajectoryPoint[];
  /** Bounce point */
  bouncePoint: TrajectoryPoint;
  /** Post-bounce trajectory points through to stumps plane */
  postBounce: TrajectoryPoint[];
  /** Projected trajectory if the ball continued without the bat */
  projected: TrajectoryPoint[];
  /** Impact point at batsman's crease (z ≈ 18.3m, roughly 4ft in front of stumps) */
  impactPoint: TrajectoryPoint;
  /** Point where ball crosses the stump plane (z = pitchLength) */
  stumpPlanePoint: TrajectoryPoint;
  /** Whether the ball hits the stumps */
  hittingWickets: boolean;
  /** Pitching analysis */
  pitchingAnalysis: "IN LINE" | "OUTSIDE OFF" | "OUTSIDE LEG";
  /** Impact analysis */
  impactAnalysis: "IN LINE" | "OUTSIDE OFF" | "OUTSIDE LEG";
  /** Wickets analysis */
  wicketsAnalysis: "HITTING" | "MISSING" | "CLIPPING";
  /** Confidence percentage */
  confidence: number;
  /** Computed stats */
  stats: {
    releaseSpeed: number;
    bounceHeight: number;
    deviationAngle: number;
    seamAngle: number;
    spinRate: number;
    velocity: number;
  };
};

// ── Helpers ────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function degToRad(d: number) {
  return (d * Math.PI) / 180;
}

function radToDeg(r: number) {
  return (r * 180) / Math.PI;
}

// ── Core trajectory computation ────────────────────────────────────
export function computeTrajectory(input: DeliveryInput): BallTrajectory {
  const speedMs = (input.speed * 1000) / 3600;
  const releaseZ = 0;
  const releaseY = input.releaseHeight;
  const releaseX = input.line;

  // Target bounce z based on length (fraction of pitch)
  const targetBounceZ = PITCH_LENGTH * clamp(1 - input.length, 0.25, 0.95);

  // Compute initial velocity components
  const elevAngle = Math.atan2(
    releaseY - 0.1, // we want the ball to come down to pitch height ~0.1m at bounce
    targetBounceZ
  );
  // Adjust for the parabolic arc — iterative would be ideal but we use an approximation
  const vz = speedMs * Math.cos(elevAngle * 0.35);
  const vy = -speedMs * Math.sin(elevAngle * 0.35);
  // Swing component
  const vx = (input.swing * speedMs) / (targetBounceZ || 1) * 0.3;

  // Spin angular velocity
  const omega = (input.spinRate * 2 * Math.PI) / 60; // rad/s
  const spinAxisRad = degToRad(input.spinAxis);
  // Spin force direction (simplified Magnus)
  const spinLateralForce = CL_SPIN * omega * Math.sin(spinAxisRad);
  const spinVerticalForce = CL_SPIN * omega * Math.cos(spinAxisRad) * 0.3;

  // ── Simulate flight ──
  let x = releaseX;
  let y = releaseY;
  let z = releaseZ;
  let vxCur = vx;
  let vyCur = vy;
  let vzCur = vz;
  let t = 0;

  const preBounce: TrajectoryPoint[] = [];
  let lastSampledZ = -1;

  // Phase 1: Pre-bounce (until y ≤ 0 or z ≥ pitchLength)
  while (y > 0 && z < PITCH_LENGTH) {
    // Air drag
    const v = Math.sqrt(vxCur * vxCur + vyCur * vyCur + vzCur * vzCur);
    const dragMag = 0.5 * AIR_DENSITY * DRAG_COEFF * BALL_AREA * v * v;
    const dragX = v > 0 ? (-dragMag * vxCur) / v / BALL_MASS : 0;
    const dragY = v > 0 ? (-dragMag * vyCur) / v / BALL_MASS : 0;
    const dragZ = v > 0 ? (-dragMag * vzCur) / v / BALL_MASS : 0;

    // Magnus / spin
    const magnusX = spinLateralForce / BALL_MASS * 0.0001;
    const magnusY = spinVerticalForce / BALL_MASS * 0.00005;

    // Update velocities
    vxCur += (dragX + magnusX + (input.swing * 0.5) / (PITCH_LENGTH / speedMs)) * DT;
    vyCur += (-G + dragY + magnusY) * DT;
    vzCur += dragZ * DT;

    // Update positions
    x += vxCur * DT;
    y += vyCur * DT;
    z += vzCur * DT;
    t += DT;

    // Sample every ~0.3m along z for rendering
    if (z - lastSampledZ > 0.3) {
      preBounce.push({ x, y: Math.max(y, 0), z, t });
      lastSampledZ = z;
    }
  }

  // Bounce point
  const bouncePoint: TrajectoryPoint = {
    x,
    y: 0,
    z: Math.min(z, PITCH_LENGTH),
    t,
  };

  // ── Phase 2: Post-bounce ──
  // Apply bounce physics
  vyCur = -vyCur * BOUNCE_RESTITUTION;
  // Seam deviation on bounce
  vxCur += input.seamDeviation * (speedMs * 0.1);
  // Spin effect amplified after bounce
  vxCur += spinLateralForce * 0.003;
  // Friction slows forward speed
  vzCur *= 0.92;

  const postBounce: TrajectoryPoint[] = [];
  const projected: TrajectoryPoint[] = [];
  let impactPoint: TrajectoryPoint | null = null;
  let stumpPlanePoint: TrajectoryPoint | null = null;

  const IMPACT_Z = PITCH_LENGTH - 1.22; // ~4ft in front of stumps

  while (z < PITCH_LENGTH + 1) {
    const v = Math.sqrt(vxCur * vxCur + vyCur * vyCur + vzCur * vzCur);
    const dragMag = 0.5 * AIR_DENSITY * DRAG_COEFF * BALL_AREA * v * v;
    const dragX = v > 0 ? (-dragMag * vxCur) / v / BALL_MASS : 0;
    const dragY = v > 0 ? (-dragMag * vyCur) / v / BALL_MASS : 0;
    const dragZ = v > 0 ? (-dragMag * vzCur) / v / BALL_MASS : 0;

    vxCur += dragX * DT;
    vyCur += (-G + dragY) * DT;
    vzCur += dragZ * DT;

    x += vxCur * DT;
    y += vyCur * DT;
    z += vzCur * DT;
    t += DT;

    if (y < 0) y = 0; // ground clamp

    if (z - lastSampledZ > 0.15) {
      const point = { x, y, z, t };
      if (z <= PITCH_LENGTH) {
        postBounce.push(point);
      } else {
        projected.push(point);
      }
      lastSampledZ = z;
    }

    // Capture impact point (batsman crease area)
    if (!impactPoint && z >= IMPACT_Z) {
      impactPoint = { x, y, z, t };
    }

    // Capture stump plane crossing
    if (!stumpPlanePoint && z >= PITCH_LENGTH) {
      stumpPlanePoint = { x, y, z, t };
    }
  }

  // Fallbacks
  if (!impactPoint) impactPoint = bouncePoint;
  if (!stumpPlanePoint) stumpPlanePoint = { x, y, z: PITCH_LENGTH, t };

  // ── Analysis ──
  // Pitching: is bounce point in line with stumps?
  const pitchingAnalysis: BallTrajectory["pitchingAnalysis"] =
    bouncePoint.x > HALF_STUMP_W + 0.15
      ? "OUTSIDE OFF"
      : bouncePoint.x < -(HALF_STUMP_W + 0.15)
      ? "OUTSIDE LEG"
      : "IN LINE";

  // Impact: is impact point in line?
  const impactAnalysis: BallTrajectory["impactAnalysis"] =
    impactPoint.x > HALF_STUMP_W + 0.15
      ? "OUTSIDE OFF"
      : impactPoint.x < -(HALF_STUMP_W + 0.15)
      ? "OUTSIDE LEG"
      : "IN LINE";

  // Wickets: check stump plane point
  const xHit = Math.abs(stumpPlanePoint.x) <= HALF_STUMP_W + 0.02;
  const yHit = stumpPlanePoint.y > 0 && stumpPlanePoint.y <= STUMP_HEIGHT;
  const xClip =
    Math.abs(stumpPlanePoint.x) > HALF_STUMP_W &&
    Math.abs(stumpPlanePoint.x) <= HALF_STUMP_W + 0.05;
  const yClip =
    stumpPlanePoint.y > STUMP_HEIGHT - 0.02 &&
    stumpPlanePoint.y <= STUMP_HEIGHT + 0.03;

  const hittingWickets = xHit && yHit;
  const clipping = (xClip && yHit) || (xHit && yClip);

  const wicketsAnalysis: BallTrajectory["wicketsAnalysis"] = hittingWickets
    ? "HITTING"
    : clipping
    ? "CLIPPING"
    : "MISSING";

  // Confidence: based on how close to stumps
  const xDist = Math.abs(stumpPlanePoint.x) - HALF_STUMP_W;
  const yDist =
    stumpPlanePoint.y > STUMP_HEIGHT
      ? stumpPlanePoint.y - STUMP_HEIGHT
      : stumpPlanePoint.y < 0
      ? Math.abs(stumpPlanePoint.y)
      : 0;
  const totalDist = Math.sqrt(xDist * xDist + yDist * yDist);
  const confidence = clamp(100 - totalDist * 200, 51, 99.8);

  // Deviation angle
  const deviationAngle = radToDeg(
    Math.atan2(
      stumpPlanePoint.x - bouncePoint.x,
      stumpPlanePoint.z - bouncePoint.z
    )
  );

  return {
    preBounce,
    bouncePoint,
    postBounce,
    projected,
    impactPoint,
    stumpPlanePoint,
    hittingWickets,
    pitchingAnalysis,
    impactAnalysis,
    wicketsAnalysis,
    confidence: Math.round(confidence * 10) / 10,
    stats: {
      releaseSpeed: Math.round(input.speed * 10) / 10,
      bounceHeight:
        Math.round(
          (postBounce[0]?.y ?? vyCur * 0.05 * BOUNCE_RESTITUTION) * 100
        ) / 100,
      deviationAngle: Math.round(Math.abs(deviationAngle) * 100) / 100,
      seamAngle:
        Math.round(Math.abs(radToDeg(Math.atan2(input.seamDeviation, 1))) * 10) /
        10,
      spinRate: input.spinRate,
      velocity: Math.round(input.speed * 10) / 10,
    },
  };
}

// ── Preset delivery generators ─────────────────────────────────────
/** Generate a random delivery that is OUT (hitting wickets) */
export function generateOutDelivery(): DeliveryInput {
  return {
    speed: 135 + Math.random() * 15,
    line: (Math.random() - 0.5) * 0.1, // tight to stumps
    length: 0.35 + Math.random() * 0.15, // good length
    swing: (Math.random() - 0.5) * 0.05,
    seamDeviation: (Math.random() - 0.5) * 0.02,
    spinRate: Math.random() * 400,
    spinAxis: Math.random() * 30,
    releaseHeight: 2.0 + Math.random() * 0.2,
    bowlerType: "PACE",
  };
}

/** Generate a random delivery that is NOT OUT (missing wickets) */
export function generateNotOutDelivery(): DeliveryInput {
  const missType = Math.random();
  if (missType < 0.33) {
    // Outside leg
    return {
      speed: 130 + Math.random() * 15,
      line: -(0.2 + Math.random() * 0.15),
      length: 0.3 + Math.random() * 0.2,
      swing: -0.1 - Math.random() * 0.05,
      seamDeviation: -0.03 - Math.random() * 0.02,
      spinRate: 200 + Math.random() * 300,
      spinAxis: 60 + Math.random() * 30,
      releaseHeight: 2.0 + Math.random() * 0.2,
      bowlerType: "PACE",
    };
  } else if (missType < 0.66) {
    // Going over
    return {
      speed: 125 + Math.random() * 10,
      line: (Math.random() - 0.5) * 0.1,
      length: 0.55 + Math.random() * 0.15, // short of a length
      swing: (Math.random() - 0.5) * 0.03,
      seamDeviation: (Math.random() - 0.5) * 0.01,
      spinRate: 100 + Math.random() * 200,
      spinAxis: Math.random() * 20,
      releaseHeight: 2.1 + Math.random() * 0.2,
      bowlerType: "PACE",
    };
  } else {
    // Outside off
    return {
      speed: 135 + Math.random() * 12,
      line: 0.2 + Math.random() * 0.15,
      length: 0.3 + Math.random() * 0.2,
      swing: 0.05 + Math.random() * 0.08,
      seamDeviation: 0.03 + Math.random() * 0.02,
      spinRate: 100 + Math.random() * 200,
      spinAxis: Math.random() * 30,
      releaseHeight: 2.0 + Math.random() * 0.2,
      bowlerType: "PACE",
    };
  }
}

/** Generate a random spin delivery */
export function generateSpinDelivery(out: boolean): DeliveryInput {
  const base: DeliveryInput = {
    speed: 75 + Math.random() * 20,
    line: out ? (Math.random() - 0.5) * 0.08 : (Math.random() > 0.5 ? 0.25 : -0.25) + Math.random() * 0.1,
    length: 0.3 + Math.random() * 0.2,
    swing: 0,
    seamDeviation: 0,
    spinRate: 1800 + Math.random() * 1200,
    spinAxis: 50 + Math.random() * 40,
    releaseHeight: 1.9 + Math.random() * 0.15,
    bowlerType: "SPIN",
  };
  return base;
}

/**
 * Convert a delivery from match data (ball-by-ball) into a DeliveryInput.
 * This maps textual descriptions to numeric physics parameters.
 */
export function deliveryFromMatchData(data: {
  speed?: number;      // km/h — may be missing from some providers
  line?: string;       // "outside off", "middle", "outside leg", etc.
  length?: string;     // "short", "good", "full", "yorker"
  swing?: string;      // "inswingers", "outswingers", "none"
  bowlerType?: string; // "pace", "spin", "medium"
}): DeliveryInput {
  // Speed
  const speed = data.speed ?? (data.bowlerType === "spin" ? 82 : 138);

  // Line mapping
  let line = 0;
  if (data.line?.toLowerCase().includes("off")) line = 0.12 + Math.random() * 0.08;
  else if (data.line?.toLowerCase().includes("leg")) line = -(0.12 + Math.random() * 0.08);
  else line = (Math.random() - 0.5) * 0.08;

  // Length mapping
  let length = 0.4; // default good length
  const len = data.length?.toLowerCase() ?? "";
  if (len.includes("yorker")) length = 0.05 + Math.random() * 0.05;
  else if (len.includes("full")) length = 0.15 + Math.random() * 0.1;
  else if (len.includes("good")) length = 0.35 + Math.random() * 0.1;
  else if (len.includes("short")) length = 0.6 + Math.random() * 0.1;
  else if (len.includes("bouncer")) length = 0.75 + Math.random() * 0.1;

  // Swing
  let swing = 0;
  if (data.swing?.toLowerCase().includes("in")) swing = -0.06 - Math.random() * 0.04;
  else if (data.swing?.toLowerCase().includes("out")) swing = 0.06 + Math.random() * 0.04;

  const isSpin = data.bowlerType?.toLowerCase().includes("spin");

  return {
    speed,
    line,
    length,
    swing,
    seamDeviation: isSpin ? 0 : (Math.random() - 0.5) * 0.03,
    spinRate: isSpin ? 1800 + Math.random() * 1000 : Math.random() * 300,
    spinAxis: isSpin ? 50 + Math.random() * 40 : Math.random() * 20,
    releaseHeight: 2.0 + Math.random() * 0.2,
    bowlerType: isSpin ? "SPIN" : "PACE",
  };
}

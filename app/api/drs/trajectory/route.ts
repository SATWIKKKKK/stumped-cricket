import { NextRequest, NextResponse } from "next/server";
import {
  computeTrajectory,
  generateOutDelivery,
  generateNotOutDelivery,
  generateSpinDelivery,
  deliveryFromMatchData,
  type DeliveryInput,
} from "@/lib/physics/trajectory";

/**
 * GET  /api/drs/trajectory?preset=out|not_out|spin_out|spin_not_out
 * POST /api/drs/trajectory  — accepts a full DeliveryInput body or match-data body
 *
 * Returns the computed 3D trajectory with analysis.
 */
export async function GET(req: NextRequest) {
  const preset = req.nextUrl.searchParams.get("preset") ?? "out";

  let input: DeliveryInput;
  switch (preset) {
    case "not_out":
      input = generateNotOutDelivery();
      break;
    case "spin_out":
      input = generateSpinDelivery(true);
      break;
    case "spin_not_out":
      input = generateSpinDelivery(false);
      break;
    case "out":
    default:
      input = generateOutDelivery();
      break;
  }

  const trajectory = computeTrajectory(input);

  return NextResponse.json({
    input,
    trajectory: {
      preBounce: trajectory.preBounce,
      bouncePoint: trajectory.bouncePoint,
      postBounce: trajectory.postBounce,
      projected: trajectory.projected,
      impactPoint: trajectory.impactPoint,
      stumpPlanePoint: trajectory.stumpPlanePoint,
      hittingWickets: trajectory.hittingWickets,
      pitchingAnalysis: trajectory.pitchingAnalysis,
      impactAnalysis: trajectory.impactAnalysis,
      wicketsAnalysis: trajectory.wicketsAnalysis,
      confidence: trajectory.confidence,
      stats: trajectory.stats,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let input: DeliveryInput;

    // If body has "speed" at top-level, treat as full DeliveryInput
    if (typeof body.speed === "number" && typeof body.line === "number") {
      input = {
        speed: body.speed,
        line: body.line,
        length: body.length ?? 0.4,
        swing: body.swing ?? 0,
        seamDeviation: body.seamDeviation ?? 0,
        spinRate: body.spinRate ?? 0,
        spinAxis: body.spinAxis ?? 0,
        releaseHeight: body.releaseHeight ?? 2.1,
        bowlerType: body.bowlerType ?? "PACE",
      };
    } else {
      // Treat as match data (ball-by-ball from provider)
      input = deliveryFromMatchData({
        speed: body.speed ?? body.releaseSpeed,
        line: body.line,
        length: body.length,
        swing: body.swing,
        bowlerType: body.bowlerType ?? body.type,
      });
    }

    const trajectory = computeTrajectory(input);

    return NextResponse.json({
      input,
      trajectory: {
        preBounce: trajectory.preBounce,
        bouncePoint: trajectory.bouncePoint,
        postBounce: trajectory.postBounce,
        projected: trajectory.projected,
        impactPoint: trajectory.impactPoint,
        stumpPlanePoint: trajectory.stumpPlanePoint,
        hittingWickets: trajectory.hittingWickets,
        pitchingAnalysis: trajectory.pitchingAnalysis,
        impactAnalysis: trajectory.impactAnalysis,
        wicketsAnalysis: trajectory.wicketsAnalysis,
        confidence: trajectory.confidence,
        stats: trajectory.stats,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

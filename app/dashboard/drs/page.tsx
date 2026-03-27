"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Radar, Eye, Activity, Play, RotateCcw, CheckCircle2,
  XCircle, Volume2, Zap, Target,
} from "lucide-react";

type Verdict = "OUT" | "NOT_OUT" | null;

type TrajectoryData = {
  pitching: string;
  impact: string;
  wickets: string;
  confidence: number;
  velocity: number;
  spinRate: number;
  bounceHeight: number;
  seamAngle: number;
  deviation: number;
};

type TrajectoryPoint = { x: number; y: number; z: number; t: number };

type APITrajectory = {
  preBounce: TrajectoryPoint[];
  bouncePoint: TrajectoryPoint;
  postBounce: TrajectoryPoint[];
  projected: TrajectoryPoint[];
  impactPoint: TrajectoryPoint;
  stumpPlanePoint: TrajectoryPoint;
  hittingWickets: boolean;
  pitchingAnalysis: string;
  impactAnalysis: string;
  wicketsAnalysis: string;
  confidence: number;
  stats: {
    releaseSpeed: number;
    bounceHeight: number;
    deviationAngle: number;
    seamAngle: number;
    spinRate: number;
    velocity: number;
  };
};

const cameraAngles = ["BEHIND STUMPS", "SIDE ON POV", "DRONE ORTHO"];

const ballPathDefaults: TrajectoryData = {
  pitching: "IN LINE",
  impact: "IN LINE",
  wickets: "HITTING",
  confidence: 94.2,
  velocity: 142.5,
  spinRate: 2400,
  bounceHeight: 0.68,
  seamAngle: 4.2,
  deviation: 3.24,
};

const reasoningOut = [
  "Ball trajectory indicates sharp deviation from release point.",
  "Impact confirmed below knee roll; 3D projection clears all height variance.",
  "No edge detected via acoustic sensor array. Ultra-edge signal flatline.",
];

const reasoningNotOut = [
  "Ball impact outside leg stump line; trajectory deviation exceeds threshold.",
  "Height analysis indicates ball going over stumps with high probability.",
  "Faint edge detected via Ultra-edge acoustic sensor at final frame.",
];

/** Convert physics API 3D points into SVG path for the viewport */
function buildSvgPath(
  pre: TrajectoryPoint[],
  post: TrajectoryPoint[],
  viewBox: { w: number; h: number }
): { prePath: string; postPath: string; impactCx: number; impactCy: number } {
  const allZ = [...pre, ...post].map((p) => p.z);
  const minZ = Math.min(...allZ, 0);
  const maxZ = Math.max(...allZ, 20.12);
  const rangeZ = maxZ - minZ || 1;

  const toSvg = (p: TrajectoryPoint) => {
    const sx = viewBox.w / 2 + p.x * 150; // scale x around centre
    const sy = viewBox.h - ((p.z - minZ) / rangeZ) * viewBox.h * 0.85 - 30;
    return { sx, sy };
  };

  const prePoints = pre.map(toSvg);
  const postPoints = post.map(toSvg);

  const toD = (pts: { sx: number; sy: number }[]) => {
    if (pts.length === 0) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(" ");
  };

  const lastPost = postPoints[postPoints.length - 1] ?? prePoints[prePoints.length - 1] ?? { sx: 400, sy: 285 };

  return {
    prePath: toD(prePoints),
    postPath: toD(postPoints),
    impactCx: lastPost.sx,
    impactCy: lastPost.sy,
  };
}

export default function DRSSimulatorPage() {
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [frame, setFrame] = useState(42);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ballData, setBallData] = useState<TrajectoryData>(ballPathDefaults);
  const [svgPaths, setSvgPaths] = useState({ prePath: "M 50,400 Q 300,50 400,320", postPath: "", impactCx: 400, impactCy: 285 });

  const fetchTrajectory = useCallback(async (preset: string) => {
    try {
      const res = await fetch(`/api/drs/trajectory?preset=${preset}`);
      if (!res.ok) return;
      const data = await res.json();
      const traj: APITrajectory = data.trajectory;
      setBallData({
        pitching: traj.pitchingAnalysis,
        impact: traj.impactAnalysis,
        wickets: traj.wicketsAnalysis,
        confidence: traj.confidence,
        velocity: traj.stats.velocity,
        spinRate: traj.stats.spinRate,
        bounceHeight: traj.stats.bounceHeight,
        seamAngle: traj.stats.seamAngle,
        deviation: traj.stats.deviationAngle,
      });
      setSvgPaths(buildSvgPath(traj.preBounce, traj.postBounce, { w: 800, h: 450 }));
    } catch {
      /* keep existing data on error */
    }
  }, []);

  // Fetch initial trajectory on mount
  useEffect(() => { fetchTrajectory("out"); }, [fetchTrajectory]);

  function simulateReview(result: Verdict) {
    setIsAnimating(true);
    setVerdict(null);
    const preset = result === "NOT_OUT" ? "not_out" : "out";
    fetchTrajectory(preset);
    let f = 0;
    const interval = setInterval(() => {
      f += 1;
      setFrame(f);
      if (f >= 42) {
        clearInterval(interval);
        setVerdict(result);
        setIsAnimating(false);
      }
    }, 50);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="border-l-4 border-[#b4c5ff] pl-6 sm:pl-7">
        <h1
          className="text-[36px] sm:text-[52px] lg:text-[64px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none"
          style={{ fontFamily: "'Epilogue', sans-serif" }}
        >
          DRS Simulator
        </h1>
        <span
          className="text-[11px] tracking-[3px] uppercase text-[rgba(226,226,226,0.35)] mt-2 block"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Decision Review System // Ball Tracking // Trajectory Analysis
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Viewport */}
        <div className="lg:col-span-8 relative bg-[#0e0e0e] border border-[rgba(67,70,85,0.3)] overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {/* Pitch Grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(37,99,235,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Wireframe Stumps */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 items-end">
            <div className="w-2 h-32 sm:h-48 bg-[rgba(141,144,160,0.3)]" />
            <div className="w-2 h-32 sm:h-48 bg-[#2563eb]" style={{ boxShadow: "0 0 15px rgba(37,99,235,0.5)" }} />
            <div className="w-2 h-32 sm:h-48 bg-[rgba(141,144,160,0.3)]" />
          </div>

          {/* Ball Trajectory SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450">
            {svgPaths.prePath && (
              <path
                d={svgPaths.prePath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="4"
                strokeDasharray="8 4"
                opacity="0.8"
              >
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
              </path>
            )}
            {svgPaths.postPath && (
              <path
                d={svgPaths.postPath}
                fill="none"
                stroke="#b4c5ff"
                strokeWidth="3"
                strokeDasharray="6 4"
                opacity="0.6"
              />
            )}
            <circle cx={svgPaths.impactCx} cy={svgPaths.impactCy} r="12" fill="#2563eb" className="animate-pulse" style={{ filter: "drop-shadow(0 0 8px #2563eb)" }}>
              <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={svgPaths.impactCx} cy={svgPaths.impactCy} r="6" fill="#e2e2e2" opacity="0.5" />
          </svg>

          {/* Camera Info Overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div
              className="bg-[#2563eb] text-white px-3 py-1 text-[10px] font-bold tracking-[2px] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              LIVE FEED // CAMERA 04
            </div>
            <div
              className="bg-[#2a2a2a] text-[#e2e2e2] px-3 py-1 text-[9px] tracking-[2px] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              LAT: 51.5074&deg; N | LON: 0.1278&deg; W
            </div>
          </div>

          {/* Verdict Overlay */}
          {verdict && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              {verdict === "OUT" ? (
                <div
                  className="bg-[#93000a] border-4 border-[#ffb4ab] px-12 sm:px-16 py-6 sm:py-8 -rotate-3 ticket-cut"
                  style={{ boxShadow: "0 0 40px rgba(147,0,10,0.5)" }}
                >
                  <h2
                    className="text-5xl sm:text-8xl font-black tracking-[-3px] uppercase text-[#ffdad6]"
                    style={{ fontFamily: "'Epilogue', sans-serif" }}
                  >
                    OUT
                  </h2>
                  <div className="w-full h-1 bg-[#ffdad6] mt-2 opacity-50" />
                  <p
                    className="text-center mt-2 text-[#ffdad6] tracking-[0.4em] font-bold text-[10px]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    VERDICT FINAL
                  </p>
                </div>
              ) : (
                <div
                  className="bg-[#064e3b] border-4 border-[#6ee7b7] px-12 sm:px-16 py-6 sm:py-8 rotate-2 ticket-cut"
                  style={{ boxShadow: "0 0 40px rgba(6,78,59,0.5)" }}
                >
                  <h2
                    className="text-5xl sm:text-8xl font-black tracking-[-3px] uppercase text-[#d1fae5]"
                    style={{ fontFamily: "'Epilogue', sans-serif" }}
                  >
                    NOT OUT
                  </h2>
                  <div className="w-full h-1 bg-[#d1fae5] mt-2 opacity-50" />
                  <p
                    className="text-center mt-2 text-[#d1fae5] tracking-[0.4em] font-bold text-[10px]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    VERDICT CONFIRMED
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Camera Angle Selector */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 hidden sm:flex">
            <span className="text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ANGLES
            </span>
            {cameraAngles.map((angle, i) => (
              <button
                key={angle}
                onClick={() => setSelectedAngle(i)}
                className={`px-3 py-2 text-[10px] font-bold tracking-[1px] uppercase transition-all ${
                  i === selectedAngle
                    ? "bg-[#2a2a2a] text-[#e2e2e2] border-r-4 border-[#2563eb]"
                    : "bg-[#1b1b1b] text-[rgba(226,226,226,0.4)] hover:bg-[#2a2a2a]"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {angle}
              </button>
            ))}
          </div>
        </div>

        {/* Ball Path Data Panel */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Stats Card */}
          <div className="bg-[#1b1b1b] p-6 border-l-4 border-[#2563eb]">
            <h3
              className="text-lg font-black tracking-[-1px] mb-6 text-[#e2e2e2]"
              style={{ fontFamily: "'Epilogue', sans-serif" }}
            >
              BALL PATH DATA
            </h3>
            <div className="space-y-4">
              {[
                { label: "PITCHING", value: ballData.pitching },
                { label: "IMPACT", value: ballData.impact },
                { label: "WICKETS", value: ballData.wickets },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-[rgba(141,144,160,1)] tracking-[2px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {item.label}
                    </span>
                    <span
                      className={`px-3 py-1 text-[10px] font-bold tracking-[1px] uppercase ${
                        item.value === "MISSING" || item.value === "OUTSIDE LEG" || item.value === "OUTSIDE LINE"
                          ? "bg-[#064e3b] text-[#d1fae5]"
                          : "bg-[#2563eb] text-white"
                      }`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {item.value}
                    </span>
                  </div>
                  <div className="h-px bg-[#2a2a2a] mt-3" />
                </div>
              ))}
            </div>

            {/* Confidence */}
            <div className="mt-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-[rgba(141,144,160,1)] tracking-[2px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  CONFIDENCE RATING
                </span>
                <span className="text-2xl font-black text-[#2563eb]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  {ballData.confidence}%
                </span>
              </div>
              <div className="h-4 bg-[#0e0e0e] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#2563eb] opacity-20" />
                <div
                  className="h-full bg-[#2563eb] relative z-10 transition-all duration-1000"
                  style={{ width: `${ballData.confidence}%` }}
                >
                  <div className="absolute top-0 right-0 h-full w-4 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Deviation */}
            <div className="mt-4 bg-[#0e0e0e] p-4">
              <span className="text-[9px] text-[#2563eb] tracking-[1px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                DEVIATION ANGLE
              </span>
              <div className="text-2xl font-black text-[#e2e2e2] mt-1" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                {ballData.deviation}&deg;{" "}
                <span className="text-xs font-normal text-[#2563eb]">OFF BREAK</span>
              </div>
            </div>
          </div>

          {/* Tactical Reasoning */}
          <div className="bg-[#2a2a2a] p-6">
            <h4
              className="text-[10px] font-bold tracking-[2px] text-[rgba(141,144,160,1)] mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <Activity size={14} /> TACTICAL REASONING
            </h4>
            <ul className="space-y-3">
              {(verdict === "NOT_OUT" ? reasoningNotOut : reasoningOut).map((r, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#c3c6d7]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-[#2563eb] text-[10px] pt-1 font-mono shrink-0">0{i + 1}/</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => simulateReview("OUT")}
              disabled={isAnimating}
              className="bg-[#93000a] text-[#ffdad6] py-4 font-black text-sm uppercase tracking-[-0.5px] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              style={{ fontFamily: "'Epilogue', sans-serif" }}
            >
              SIMULATE OUT
            </button>
            <button
              onClick={() => simulateReview("NOT_OUT")}
              disabled={isAnimating}
              className="bg-[#064e3b] text-[#d1fae5] py-4 font-black text-sm uppercase tracking-[-0.5px] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              style={{ fontFamily: "'Epilogue', sans-serif" }}
            >
              SIMULATE NOT OUT
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tactical Readout */}
      <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.2)] p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center overflow-x-auto">
        <div className="shrink-0 flex flex-col justify-center">
          <span className="text-[10px] text-[#2563eb] font-bold tracking-[2px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            TIMELINE
          </span>
          <span className="text-3xl font-black italic tracking-[-2px] text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            FRAME {frame.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Frame Timeline */}
        <div className="flex-1 h-12 bg-[#2a2a2a] relative overflow-hidden flex gap-[2px] min-w-[200px]">
          {Array.from({ length: 42 }, (_, i) => (
            <div
              key={i}
              className={`w-1 h-full ${i < frame ? "bg-[#2563eb]" : "bg-[#353535]"}`}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 shrink-0">
          {[
            { label: "SPIN RATE", value: `${ballData.spinRate} RPM` },
            { label: "BOUNCE HEIGHT", value: `${ballData.bounceHeight} M` },
            { label: "SEAM ANGLE", value: `${ballData.seamAngle}\u00b0 L` },
            { label: "VELOCITY", value: `${ballData.velocity} KM/H` },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[9px] text-[rgba(226,226,226,0.4)] tracking-[1px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.label}
              </span>
              <span className="text-xs font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Replay Button */}
        <button
          onClick={() => simulateReview(verdict ?? "OUT")}
          disabled={isAnimating}
          className="h-14 w-14 bg-[#2563eb] flex items-center justify-center shrink-0 active:scale-95 transition-transform disabled:opacity-50"
        >
          <Play size={28} className="text-white" />
        </button>
      </div>

      {/* Encryption Footer */}
      <div className="flex flex-wrap justify-between items-center px-2 py-2">
        <div className="flex gap-6">
          <span className="text-[#2563eb] text-[9px] tracking-[2px] uppercase font-mono cursor-pointer">SYS STATUS: ACTIVE</span>
          <span className="text-[rgba(226,226,226,0.4)] text-[9px] tracking-[2px] uppercase font-mono cursor-pointer hover:text-[#2563eb]">DECRYPT</span>
          <span className="text-[rgba(226,226,226,0.4)] text-[9px] tracking-[2px] uppercase font-mono cursor-pointer hover:text-[#2563eb]">PURGE</span>
        </div>
        <span className="text-[rgba(226,226,226,0.4)] text-[9px] tracking-[2px] uppercase font-mono">
          AES-256 ENCRYPTION ACTIVE // CLASSIFIED LOGS
        </span>
      </div>
    </div>
  );
}

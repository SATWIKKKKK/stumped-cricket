"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, RotateCcw, Activity, Target, Eye } from "lucide-react";

type Verdict = "OUT" | "NOT_OUT" | null;

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

type BallStats = {
  pitching: string;
  impact: string;
  wickets: string;
  confidence: number;
  deviation: number;
  velocity: number;
  spinRate: number;
  bounceHeight: number;
};

const cameraAngles = ["BEHIND STUMPS", "SIDE ON POV", "DRONE ORTHO"];

/** Convert 3D trajectory points to SVG path for the behind-stumps pitch view */
function buildPitchSvg(
  pre: TrajectoryPoint[],
  post: TrajectoryPoint[],
  viewBox: { w: number; h: number }
): { mainPath: string; projPath: string; bounceCx: number; bounceCy: number; impactCx: number; impactCy: number } {
  const all = [...pre, ...post];
  const minZ = 0;
  const maxZ = 21;
  const rangeZ = maxZ - minZ;

  const toSvg = (p: TrajectoryPoint) => {
    const sx = viewBox.w / 2 + p.x * 300;
    const sy = viewBox.h - ((p.z - minZ) / rangeZ) * (viewBox.h - 60) - 30;
    return { sx, sy };
  };

  const preP = pre.map(toSvg);
  const postP = post.map(toSvg);
  const toD = (pts: { sx: number; sy: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(" ");

  const bounceP = pre.length > 0 ? toSvg(pre[pre.length - 1]) : { sx: 200, sy: 600 };
  const impactP = postP.length > 0 ? postP[postP.length - 1] : bounceP;

  return {
    mainPath: toD([...preP, ...postP]),
    projPath: "", // projected is beyond stumps
    bounceCx: bounceP.sx,
    bounceCy: bounceP.sy,
    impactCx: impactP.sx,
    impactCy: impactP.sy,
  };
}

export default function DRSTrajectoryPage() {
  const [verdict, setVerdict] = useState<Verdict>("OUT");
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [frame, setFrame] = useState(42);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ballStats, setBallStats] = useState<BallStats>({
    pitching: "IN LINE", impact: "IN LINE", wickets: "HITTING",
    confidence: 99.8, deviation: 3.24, velocity: 142.8,
    spinRate: 2400, bounceHeight: 0.68,
  });
  const [svgData, setSvgData] = useState({ mainPath: "M 200 700 C 200 500 220 350 205 280", projPath: "", bounceCx: 205, bounceCy: 280, impactCx: 205, impactCy: 100 });

  const fetchTrajectory = useCallback(async (preset: string) => {
    try {
      const res = await fetch(`/api/drs/trajectory?preset=${preset}`);
      if (!res.ok) return;
      const data = await res.json();
      const t: APITrajectory = data.trajectory;
      setBallStats({
        pitching: t.pitchingAnalysis,
        impact: t.impactAnalysis,
        wickets: t.wicketsAnalysis,
        confidence: t.confidence,
        deviation: t.stats.deviationAngle,
        velocity: t.stats.velocity,
        spinRate: t.stats.spinRate,
        bounceHeight: t.stats.bounceHeight,
      });
      setSvgData(buildPitchSvg(t.preBounce, t.postBounce, { w: 400, h: 800 }));
    } catch { /* keep existing */ }
  }, []);

  useEffect(() => { fetchTrajectory("out"); }, [fetchTrajectory]);

  function simulate(result: Verdict) {
    setIsAnimating(true);
    setVerdict(null);
    fetchTrajectory(result === "NOT_OUT" ? "not_out" : "out");
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
    <div className="flex flex-col gap-0 h-[calc(100vh-69px-48px)] max-h-[calc(100vh-69px-48px)] overflow-hidden">
      {/* Main Visualization */}
      <div className="flex-1 relative bg-[#0e0e0e] overflow-hidden">
        {/* Perspective Pitch Grid */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="relative w-[120%] h-[150%] origin-center -translate-y-16"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(53,53,53,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(53,53,53,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              transform: "perspective(800px) rotateX(55deg) scale(1.3)",
            }}
          />
        </div>

        {/* Pitch Wireframe with Trajectory */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full max-w-lg" viewBox="0 0 400 800" style={{ filter: "drop-shadow(0 0 10px rgba(37,99,235,0.2))" }}>
            {/* Pitch boundaries */}
            <rect x="150" y="50" width="100" height="700" fill="none" stroke="rgba(53,53,53,0.5)" strokeWidth="2" />
            <line x1="150" y1="680" x2="250" y2="680" stroke="rgba(226,226,226,0.2)" strokeWidth="2" />

            {/* Ball trajectory */}
            <path d={svgData.mainPath} fill="none" stroke="#2563eb" strokeWidth="4">
              <animate attributeName="stroke-dashoffset" from="600" to="0" dur="2s" fill="freeze">
                <set attributeName="begin" to="0s" />
              </animate>
            </path>

            {/* Impact point */}
            <circle cx={svgData.impactCx} cy={svgData.impactCy} r="12" fill="#2563eb" className="animate-pulse" style={{ filter: "drop-shadow(0 0 15px #2563eb)" }} />
            <circle cx={svgData.impactCx} cy={svgData.impactCy} r="4" fill="#e2e2e2" />

            {/* Stumps */}
            <rect x="170" y="50" width="8" height="50" fill="rgba(53,53,53,0.8)" />
            <rect x="195" y="50" width="8" height="50" fill="rgba(53,53,53,0.8)" />
            <rect x="220" y="50" width="8" height="50" fill="rgba(53,53,53,0.8)" />
            <rect x="168" y="46" width="64" height="6" fill="#2563eb" opacity="0.9" />
          </svg>
        </div>

        {/* Verdict Overlay */}
        {verdict && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <div className="bg-[rgba(14,14,14,0.4)] backdrop-blur-xl border-l-4 border-[#2563eb] px-12 sm:px-16 py-6 sm:py-8 flex flex-col items-center">
              <span
                className={`text-6xl sm:text-8xl font-black tracking-[-3px] ${verdict === "OUT" ? "text-[#e2e2e2]" : "text-[#d1fae5]"}`}
                style={{ fontFamily: "'Epilogue', sans-serif" }}
              >
                {verdict === "OUT" ? "OUT" : "NOT OUT"}
              </span>
              <span
                className="text-[#2563eb] font-bold tracking-[0.8em] mt-2 text-[10px]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                VERDICT CONFIRMED
              </span>
            </div>
          </div>
        )}

        {/* Camera Selector */}
        <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          <span className="text-[10px] text-[rgba(226,226,226,0.4)] tracking-[2px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ANGLES
          </span>
          {cameraAngles.map((a, i) => (
            <button
              key={a}
              onClick={() => setSelectedAngle(i)}
              className={`px-3 py-2 text-[10px] sm:text-xs font-bold tracking-[1px] transition-all ${
                i === selectedAngle
                  ? "bg-[#2a2a2a] text-[#e2e2e2] border-r-4 border-[#2563eb]"
                  : "bg-[#1b1b1b] text-[rgba(226,226,226,0.4)] hover:bg-[#2a2a2a]"
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Data Panel */}
        <div className="absolute right-4 sm:right-8 top-8 w-56 sm:w-72 flex flex-col gap-3">
          <div className="bg-[#1b1b1b] p-4 sm:p-6 relative">
            <div className="absolute top-0 right-0 w-8 h-8 bg-[#2563eb] ticket-cut flex items-center justify-center">
              <Activity size={12} className="text-white" />
            </div>
            <span className="text-[10px] text-[#2563eb] font-bold tracking-[2px] mb-4 block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              BALL PATH DATA
            </span>
            <div className="space-y-4">
              {[
                { label: "PITCHING", value: ballStats.pitching },
                { label: "IMPACT", value: ballStats.impact },
                { label: "WICKETS", value: ballStats.wickets },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-end border-b border-[rgba(53,53,53,0.5)] pb-2">
                  <div>
                    <div className="text-[10px] text-[rgba(226,226,226,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {item.label}
                    </div>
                    <div className="text-sm font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {item.value}
                    </div>
                  </div>
                  <div className={`w-3 h-3 mb-1 ${
                    item.value === "MISSING" || item.value.includes("OUTSIDE") ? "bg-[#16a34a]" : "bg-[#2563eb]"
                  }`} />
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#0e0e0e] p-3">
              <span className="text-[9px] text-[#2563eb] tracking-[1px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                DEVIATION ANGLE
              </span>
              <div className="text-2xl font-black text-[#e2e2e2] mt-1" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                {ballStats.deviation}&deg;{" "}
                <span className="text-xs font-normal text-[#2563eb]">OFF BREAK</span>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2a2a] p-3 flex items-center gap-3">
            <Activity size={16} className="text-[#2563eb]" />
            <div>
              <div className="text-[10px] text-[rgba(226,226,226,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                RELEASE VELOCITY
              </div>
              <div className="text-xs font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {ballStats.velocity} KM/H
              </div>
            </div>
          </div>
        </div>

        {/* Simulate Buttons (floating) */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            onClick={() => simulate("OUT")}
            disabled={isAnimating}
            className="bg-[#93000a] text-[#ffdad6] px-4 py-2 text-[10px] font-bold tracking-[1px] uppercase hover:brightness-110 transition-all disabled:opacity-50"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SIMULATE OUT
          </button>
          <button
            onClick={() => simulate("NOT_OUT")}
            disabled={isAnimating}
            className="bg-[#064e3b] text-[#d1fae5] px-4 py-2 text-[10px] font-bold tracking-[1px] uppercase hover:brightness-110 transition-all disabled:opacity-50"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SIMULATE NOT OUT
          </button>
        </div>
      </div>

      {/* Bottom Tactical Readout */}
      <div className="h-36 bg-[#0e0e0e] border-t border-[rgba(53,53,53,0.3)] p-4 sm:p-6 flex gap-4 sm:gap-8 items-center overflow-x-auto shrink-0">
        <div className="shrink-0 flex flex-col justify-center">
          <span className="text-[10px] text-[#2563eb] font-bold tracking-[2px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            TIMELINE
          </span>
          <span className="text-2xl sm:text-3xl font-black italic tracking-[-2px] text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
            FRAME {frame.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Frame Visualizer */}
        <div className="flex-1 h-12 bg-[#2a2a2a] relative overflow-hidden flex gap-[2px] min-w-[150px]">
          {Array.from({ length: 42 }, (_, i) => (
            <div key={i} className={`w-1 h-full ${i < frame ? "bg-[#2563eb]" : "bg-[#353535]"}`} />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 shrink-0">
          {[
            { label: "SPIN RATE", value: `${ballStats.spinRate} RPM` },
            { label: "BOUNCE HEIGHT", value: `${ballStats.bounceHeight} M` },
            { label: "SEAM ANGLE", value: `${ballStats.deviation}\u00b0` },
            { label: "CONFIDENCE", value: `${ballStats.confidence}%` },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[9px] text-[rgba(226,226,226,0.4)] tracking-[1px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.label}
              </span>
              <span className={`text-xs font-bold ${s.label === "CONFIDENCE" ? "text-[#2563eb]" : "text-[#e2e2e2]"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => simulate(verdict ?? "OUT")}
          disabled={isAnimating}
          className="h-14 w-14 bg-[#2563eb] flex items-center justify-center shrink-0 active:scale-95 transition-transform disabled:opacity-50"
        >
          <Play size={28} className="text-white" />
        </button>
      </div>
    </div>
  );
}

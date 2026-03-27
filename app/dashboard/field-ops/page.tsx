"use client";

import { useState } from "react";
import {
  Target, AlertTriangle, Crosshair, Activity, TrendingUp,
  BarChart2, Shield, Zap,
} from "lucide-react";

type Fielder = {
  id: string;
  label: string;
  top: string;
  left: string;
};

const defaultFielders: Fielder[] = [
  { id: "slip1", label: "SLIP 01", top: "30%", left: "40%" },
  { id: "point1", label: "POINT 01", top: "60%", left: "20%" },
  { id: "thirdman", label: "THIRD MAN", top: "15%", left: "65%" },
  { id: "longon", label: "LONG ON", top: "80%", left: "70%" },
  { id: "midwicket", label: "MID WICKET", top: "55%", left: "65%" },
  { id: "cover", label: "COVER", top: "40%", left: "25%" },
  { id: "midoff", label: "MID OFF", top: "25%", left: "35%" },
  { id: "fineleg", label: "FINE LEG", top: "70%", left: "80%" },
  { id: "gully", label: "GULLY", top: "35%", left: "30%" },
];

const zonePenetration = [
  { zone: "OFF SIDE ARC", value: 42 },
  { zone: "LEG SIDE ARC", value: 58 },
  { zone: "V ZONE VERTICAL", value: 25 },
];

const tacticalReasons = [
  { id: "REASON 01", text: "Batsman displays 68% high-risk aerial tendency against short-pitched deliveries in the current sector." },
  { id: "REASON 02", text: "Surface friction data suggests increased lateral movement; Slips-01 and 02 deployment mandatory for optimal capture." },
];

export default function FieldPlacementPage() {
  const [fielders] = useState(defaultFielders);
  const [engineOp] = useState("AGGRESSIVE CLOSE");
  const profileImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDQux-Wr_JZvlc_07K3zKfwy7FloGCqw0PpnfqvKPsBSC5LWkoyABDSsIbWPMM0aSIx0V5SKON_RO2jhvy__pW_a0k2c_6sQYLDSvUaBLHvoHSQoC7mTcCYRxSMSuc8DZqJffKEeK4PVsegQlFSxMIWsuSDkabKZNgkfXS3VDnaZbrJ_Fp-RGPQKg0_fYEodw9H01f-AwSgkKaNsTdNlvuz8fiuvtrCQC2S3TJguytsGXlSxWg3b4bLY29FmVSX5-YGW9aEg3P2GGY";

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="border-l-4 border-[#b4c5ff] pl-6 sm:pl-7">
        <h1
          className="text-[36px] sm:text-[52px] lg:text-[64px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none"
          style={{ fontFamily: "'Epilogue', sans-serif" }}
        >
          Field Placement
        </h1>
        <span
          className="text-[11px] tracking-[3px] uppercase text-[rgba(226,226,226,0.35)] mt-2 block"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          AI Engine // Tactical Positioning // Zone Analysis
        </span>
      </div>

      {/* Status Chip */}
      <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1 w-fit border border-[rgba(37,99,235,0.2)]">
        <div className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
        <span className="text-[10px] text-[rgba(226,226,226,0.6)] font-bold tracking-[2px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          ENGINE STABLE :: 0.04ms
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Field Visualization */}
        <div className="lg:col-span-8 bg-[#1b1b1b] p-4 relative overflow-hidden border border-[rgba(67,70,85,0.2)]">
          {/* Engine Op Label */}
          <div className="absolute top-4 left-4 z-10 bg-[#2a2a2a] p-3 border-l-4 border-[#2563eb]">
            <p className="text-[10px] text-[#2563eb] font-black tracking-[2px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              LIVE FIELD MAP
            </p>
            <h2 className="text-lg font-black tracking-[-1px] leading-none mt-1 text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              ENGINE OP: {engineOp}
            </h2>
          </div>

          {/* Cricket Field */}
          <div className="relative w-full aspect-square max-w-2xl mx-auto flex items-center justify-center">
            {/* Outfield circle */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "10px solid rgba(53,53,53,0.15)",
                background: "radial-gradient(circle at center, #1b1b1b 0%, #131313 70%)",
              }}
            />
            {/* Inner circle */}
            <div className="absolute inset-[15%] rounded-full border border-dashed border-[rgba(37,99,235,0.2)]" />

            {/* Pitch */}
            <div className="absolute w-[10%] h-[25%] bg-[rgba(53,53,53,0.4)] border border-[rgba(37,99,235,0.3)]" />

            {/* Heatmap zones */}
            <div className="absolute top-1/4 right-[20%] w-48 h-48 rounded-full blur-2xl opacity-60" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 70%)" }} />
            <div className="absolute bottom-1/4 left-[30%] w-32 h-32 rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)" }} />

            {/* Batsman */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-4 h-4 bg-white border-2 border-[#2563eb] rotate-45 mb-1" style={{ boxShadow: "0 0 15px rgba(255,255,255,0.5)" }} />
              <span className="text-[8px] text-[#e2e2e2] opacity-80" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                BATSMAN 01
              </span>
            </div>

            {/* Fielder Markers */}
            {fielders.map((f) => (
              <div
                key={f.id}
                className="absolute flex flex-col items-center"
                style={{ top: f.top, left: f.left }}
              >
                <div className="w-3 h-3 bg-[#2563eb] rounded-full animate-pulse" style={{ boxShadow: "0 0 10px #2563eb" }} />
                <span className="text-[8px] text-[#2563eb] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          {/* HUD Overlays */}
          <div className="absolute bottom-4 right-4 flex gap-3">
            <div className="bg-[rgba(42,42,42,0.8)] backdrop-blur-md p-3 border border-[rgba(53,53,53,0.3)]">
              <p className="text-[8px] opacity-40 mb-1 text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                PROBABILITY OUT
              </p>
              <p className="text-xl font-black text-[#2563eb]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                74.2%
              </p>
            </div>
            <div className="bg-[rgba(42,42,42,0.8)] backdrop-blur-md p-3 border border-[rgba(53,53,53,0.3)]">
              <p className="text-[8px] opacity-40 mb-1 text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                VARIANCE INDEX
              </p>
              <p className="text-xl font-black text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                0.12
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          {/* Tactical Reasoning */}
          <div className="bg-[#2a2a2a] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Shield size={64} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-[-1px] mb-4 text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              TACTICAL REASONING
            </h3>
            <div className="space-y-4">
              {tacticalReasons.map((r) => (
                <div key={r.id} className="flex gap-3 items-start">
                  <span
                    className="bg-[#2563eb] text-white text-[10px] px-2 py-1 shrink-0"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {r.id}
                  </span>
                  <p className="text-sm text-[rgba(226,226,226,0.8)] italic leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Penetration Data */}
          <div className="bg-[#1b1b1b] p-6 border border-[rgba(67,70,85,0.2)]">
            <h3 className="text-xs font-bold text-[#2563eb] tracking-[2px] uppercase mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ZONE PENETRATION DATA
            </h3>
            <div className="space-y-4">
              {zonePenetration.map((z) => (
                <div key={z.zone} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span className="text-[#e2e2e2]">{z.zone}</span>
                    <span className="text-[#e2e2e2]">{z.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#0e0e0e]">
                    <div
                      className={`h-full ${z.value > 30 ? "bg-[#2563eb]" : "bg-[rgba(226,226,226,0.2)]"}`}
                      style={{ width: `${z.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Breach Alert */}
          <div className="bg-[rgba(147,0,10,0.15)] border border-[rgba(255,180,171,0.3)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-[#ffb4ab]" />
              <p className="text-[10px] text-[#ffb4ab] font-bold uppercase tracking-[2px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                SIGNAL BREACH: ANOMALY DETECTED
              </p>
            </div>
            <p className="text-[11px] text-[rgba(255,180,171,0.8)] leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
              External scout reports suggest pitch degradation in Sector 4 exceeds baseline modeling. Recommendation: Increase Spin-Bias.
            </p>
          </div>

          {/* Deploy Button */}
          <button
            className="w-full bg-[#e2e2e2] text-[#131313] py-4 font-black uppercase tracking-[-1px] hover:bg-[#2563eb] hover:text-white transition-all ticket-cut"
            style={{ fontFamily: "'Epilogue', sans-serif" }}
          >
            OVERRIDE AND DEPLOY FIELD
          </button>
        </div>
      </div>
    </div>
  );
}

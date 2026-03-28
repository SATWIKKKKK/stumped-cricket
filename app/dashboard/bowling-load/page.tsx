"use client";

import { useState, useMemo } from "react";
import { Activity, AlertTriangle, TrendingUp, Heart, Zap, Shield, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

/* ---------- bowler data ---------- */
const bowlers = [
  {
    id: "JB001",
    name: "J. BUMRAH",
    unit: "INDIA // PACE",
    deliveries: 246,
    intensity: 87.3,
    stressIndex: 72.4,
    strainLevel: "ELEVATED",
    fatigueZone: "AMBER",
    sessions: [
      { label: "SESSION_01", load: 42, stress: 34 },
      { label: "SESSION_02", load: 58, stress: 51 },
      { label: "SESSION_03", load: 71, stress: 62 },
      { label: "SESSION_04", load: 65, stress: 58 },
      { label: "SESSION_05", load: 79, stress: 68 },
      { label: "SESSION_06", load: 84, stress: 72 },
    ],
    bodyMap: {
      shoulder: { risk: "LOW", load: 45 },
      elbow: { risk: "MODERATE", load: 62 },
      lowerBack: { risk: "ELEVATED", load: 78 },
      knee: { risk: "LOW", load: 38 },
      ankle: { risk: "MODERATE", load: 55 },
    },
    injuryRisk: 34,
    recommendation: "REDUCE_LOAD — Current trajectory suggests a 34% chance of soft-tissue injury within the next 72 hours if no rest protocol is activated.",
  },
  {
    id: "MA002",
    name: "M. STARC",
    unit: "AUS // PACE",
    deliveries: 312,
    intensity: 91.7,
    stressIndex: 81.2,
    strainLevel: "CRITICAL",
    fatigueZone: "RED",
    sessions: [
      { label: "SESSION_01", load: 55, stress: 48 },
      { label: "SESSION_02", load: 68, stress: 62 },
      { label: "SESSION_03", load: 82, stress: 75 },
      { label: "SESSION_04", load: 78, stress: 71 },
      { label: "SESSION_05", load: 89, stress: 80 },
      { label: "SESSION_06", load: 94, stress: 86 },
    ],
    bodyMap: {
      shoulder: { risk: "MODERATE", load: 64 },
      elbow: { risk: "HIGH", load: 82 },
      lowerBack: { risk: "CRITICAL", load: 91 },
      knee: { risk: "MODERATE", load: 58 },
      ankle: { risk: "LOW", load: 42 },
    },
    injuryRisk: 67,
    recommendation: "IMMEDIATE_REST — Biomechanical stress models indicate a 67% probability of injury. Mandatory rest window of 96 hours recommended.",
  },
  {
    id: "RA003",
    name: "R. ASHWIN",
    unit: "INDIA // SPIN",
    deliveries: 192,
    intensity: 62.1,
    stressIndex: 41.8,
    strainLevel: "NOMINAL",
    fatigueZone: "GREEN",
    sessions: [
      { label: "SESSION_01", load: 28, stress: 22 },
      { label: "SESSION_02", load: 35, stress: 30 },
      { label: "SESSION_03", load: 42, stress: 36 },
      { label: "SESSION_04", load: 38, stress: 32 },
      { label: "SESSION_05", load: 45, stress: 39 },
      { label: "SESSION_06", load: 48, stress: 42 },
    ],
    bodyMap: {
      shoulder: { risk: "LOW", load: 35 },
      elbow: { risk: "LOW", load: 28 },
      lowerBack: { risk: "LOW", load: 42 },
      knee: { risk: "LOW", load: 25 },
      ankle: { risk: "LOW", load: 20 },
    },
    injuryRisk: 12,
    recommendation: "CLEAR_FOR_DUTY — All biomechanical indicators within safe parameters. Bowler cleared for full workload.",
  },
];

function riskColor(risk: string) {
  switch (risk) {
    case "LOW": return "#22c55e";
    case "MODERATE": return "#f59e0b";
    case "ELEVATED": return "#f97316";
    case "HIGH": return "#ef4444";
    case "CRITICAL": return "#dc2626";
    default: return "#6b7280";
  }
}

function zoneColor(zone: string) {
  switch (zone) {
    case "GREEN": return "#22c55e";
    case "AMBER": return "#f59e0b";
    case "RED": return "#ef4444";
    default: return "#6b7280";
  }
}

export default function BowlingLoadPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [selectedId, setSelectedId] = useState(bowlers[0].id);
  const bowler = useMemo(() => bowlers.find((b) => b.id === selectedId)!, [selectedId]);

  const bg = dark ? "#131313" : "#fcfcfc";
  const cardBg = dark ? "#1b1b1b" : "#ffffff";
  const deepBg = dark ? "#0e0e0e" : "#f5f5f5";
  const text = dark ? "#e2e2e2" : "#1a1a1a";
  const sub = dark ? "rgba(195,198,215,0.5)" : "rgba(60,60,60,0.5)";
  const border = dark ? "rgba(67,70,85,0.2)" : "rgba(200,200,200,0.4)";

  const loadMax = Math.max(...bowler.sessions.map((s) => s.load));

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto" style={{ color: text }}>
      {/* Header */}
      <div className="border-l-4 border-[#2563eb] pl-6">
        <h1 className="text-[36px] sm:text-[52px] lg:text-[64px] font-black tracking-[-3px] uppercase leading-none" style={{ fontFamily: "'Epilogue', sans-serif", color: text }}>
          Bowling Load
        </h1>
        <span className="text-[11px] tracking-[3px] uppercase mt-2 block" style={{ fontFamily: "'Space Grotesk', sans-serif", color: sub }}>
          Biomechanical Stress & Injury Prediction Engine
        </span>
      </div>

      {/* Bowler Selector */}
      <div className="flex flex-wrap gap-2">
        {bowlers.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedId(b.id)}
            className="px-4 py-2 text-[10px] font-bold tracking-[1px] uppercase transition-all flex items-center gap-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: b.id === selectedId ? "#2563eb" : cardBg,
              color: b.id === selectedId ? "#fff" : sub,
              border: `1px solid ${b.id === selectedId ? "#2563eb" : border}`,
            }}
          >
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: zoneColor(b.fatigueZone) }} />
            {b.name}
          </button>
        ))}
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "DELIVERY_COUNT", value: bowler.deliveries, icon: <Activity size={14} className="text-[#2563eb]" /> },
          { label: "INTENSITY_INDEX", value: `${bowler.intensity}%`, icon: <Zap size={14} className="text-[#2563eb]" /> },
          { label: "STRESS_INDEX", value: `${bowler.stressIndex}%`, icon: <Heart size={14} className="text-[#ef4444]" /> },
          { label: "STRAIN_LEVEL", value: bowler.strainLevel, icon: <AlertTriangle size={14} style={{ color: riskColor(bowler.strainLevel) }} /> },
        ].map((s) => (
          <div key={s.label} className="p-5 border" style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-[2px] uppercase font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>{s.label}</span>
              {s.icon}
            </div>
            <div className="text-2xl font-black" style={{ fontFamily: "'Epilogue',sans-serif", color: text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Load Accumulation Chart */}
        <div className="lg:col-span-8 p-6 border" style={{ background: cardBg, borderColor: border }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xs tracking-[3px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>
              LOAD_ACCUMULATION // SESSION_TRACKER
            </h3>
            <TrendingUp size={14} className="text-[#2563eb]" />
          </div>
          <div className="flex items-end gap-2 sm:gap-4 h-48 sm:h-56">
            {bowler.sessions.map((s) => (
              <div key={s.label} className="flex flex-col flex-1 items-center gap-1">
                <span className="text-[10px] font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: riskColor(s.stress > 70 ? "HIGH" : s.stress > 50 ? "MODERATE" : "LOW") }}>
                  {s.load}
                </span>
                <div className="w-full flex flex-col items-center gap-[2px]" style={{ height: "100%" }}>
                  <div
                    className="w-full rounded-t transition-all"
                    style={{
                      height: `${(s.load / loadMax) * 100}%`,
                      background: `linear-gradient(to top, ${riskColor(s.stress > 70 ? "HIGH" : s.stress > 50 ? "MODERATE" : "LOW")}, #2563eb)`,
                      minHeight: 8,
                    }}
                  />
                </div>
                <span className="text-[8px] tracking-widest uppercase mt-1" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>
                  {s.label.replace("SESSION_", "S")}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            {[["LOW", "#22c55e"], ["MODERATE", "#f59e0b"], ["HIGH", "#ef4444"]].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1 text-[9px] tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>
                <span className="w-2 h-2 rounded-full" style={{ background: c }} /> {l}
              </span>
            ))}
          </div>
        </div>

        {/* Fatigue Zone & Injury Risk */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fatigue Zone */}
          <div className="p-6 border border-l-4" style={{ background: cardBg, borderColor: border, borderLeftColor: zoneColor(bowler.fatigueZone) }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xs tracking-[3px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>FATIGUE_ZONE</h3>
              <Shield size={14} style={{ color: zoneColor(bowler.fatigueZone) }} />
            </div>
            <div className="text-3xl font-black mb-2" style={{ fontFamily: "'Epilogue',sans-serif", color: zoneColor(bowler.fatigueZone) }}>{bowler.fatigueZone}</div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: deepBg }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${bowler.intensity}%`, background: zoneColor(bowler.fatigueZone) }} />
            </div>
          </div>

          {/* Injury Prediction */}
          <div className="p-6 border" style={{ background: bowler.injuryRisk > 50 ? "rgba(239,68,68,0.08)" : cardBg, borderColor: bowler.injuryRisk > 50 ? "rgba(239,68,68,0.3)" : border }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xs tracking-[3px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>INJURY_PREDICTION</h3>
              <AlertTriangle size={14} style={{ color: bowler.injuryRisk > 50 ? "#ef4444" : "#f59e0b" }} />
            </div>
            <div className="text-5xl font-black mb-3" style={{ fontFamily: "'Epilogue',sans-serif", color: bowler.injuryRisk > 50 ? "#ef4444" : "#f59e0b" }}>{bowler.injuryRisk}%</div>
            <p className="text-[11px] leading-relaxed" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>{bowler.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Body Map */}
      <div className="p-6 border" style={{ background: cardBg, borderColor: border }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xs tracking-[3px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>BIOMECHANICAL_STRESS_MAP</h3>
          <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>UNIT: {bowler.name}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(bowler.bodyMap).map(([part, data]) => (
            <div key={part} className="p-4 border text-center" style={{ background: deepBg, borderColor: `${riskColor(data.risk)}44` }}>
              <div className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>
                {part.replace(/([A-Z])/g, "_$1").toUpperCase()}
              </div>
              <div className="text-2xl font-black mb-1" style={{ fontFamily: "'Epilogue',sans-serif", color: riskColor(data.risk) }}>{data.load}%</div>
              <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 inline-block" style={{
                fontFamily: "'Space Grotesk',sans-serif",
                background: `${riskColor(data.risk)}22`,
                color: riskColor(data.risk),
              }}>
                {data.risk}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

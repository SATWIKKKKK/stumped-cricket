"use client";

import { useState, useEffect } from "react";
import { FileText, TrendingUp, Star, Clock, Eye, BarChart2 } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import type { MatchItem } from "@/lib/server/types";

/* ---------- mock narrative data ---------- */
const narratives = [
  {
    id: "FF04-X",
    title: "THE SILENT EXECUTION",
    subtitle: "An exhaustive synthesis of tactical maneuvers and momentum shifts during the final series engagement.",
    timestamp: "2024.10.24 // 22:15_UTC",
    body: [
      "The tension was palpable from the first delivery. The narrative wasn't just written in the scorecards, but in the micro-adjustments made by the tactical unit in the second powerplay. AI analysis suggests a deviation from standard field placements that triggered a collapse in the opposition's middle order. Every run felt calculated, every wicket a product of algorithmic precision rather than mere chance.",
      "Transitioning into the death overs, the data stream peaked. Momentum analysis indicated a 64% probability of defensive failure, yet the primary operator maintained a structural integrity that defied the predictive model. The final outcome wasn't just a win — it was a message sent across the league, a testament to industrial-grade cricket intelligence.",
    ],
    keyMoments: [
      { over: "12.4_OV", title: "RADICAL_SHIFT", desc: "System identified vulnerability in deep square leg. Tactical adjustment led to instantaneous dismissal of leading run-scorer." },
      { over: "18.2_OV", title: "SIGNAL_MAXIMA", desc: "Three consecutive boundaries pushed the win probability beyond the 90% threshold for the first time in the series." },
      { over: "19.6_OV", title: "TERMINATION", desc: "Clean sweep. Final wicket secured with a delivery exceeding 145km/h with a 12-degree deviation." },
    ],
    momentum: { peak: 88.4, volatility: "LOW" },
    playerRatings: [
      { rank: 1, name: "V. KOHLI", unit: "UNIT_C", rating: 9.2 },
      { rank: 2, name: "J. BUMRAH", unit: "UNIT_S", rating: 8.8 },
      { rank: 3, name: "R. JADEJA", unit: "UNIT_A", rating: 8.1 },
    ],
  },
  {
    id: "FF05-Y",
    title: "THE FINAL BREACH",
    subtitle: "A masterclass in cognitive cricket — dismantling the opposition's core algorithms through sustained pressure.",
    timestamp: "2024.11.02 // 18:30_UTC",
    body: [
      "From the outset, the bowling unit operated with surgical precision. Each delivery was a data point in a larger tactical narrative, designed to exploit micro-weaknesses identified in pre-match neural analysis. The opening partnership fell within the powerplay, setting the tone for a systematic deconstruction.",
      "The middle overs saw a calibrated approach — varying pace and line to create confusion in the opposition's AI-assisted batting models. By the time the death overs arrived, the outcome was a mathematical certainty.",
    ],
    keyMoments: [
      { over: "4.3_OV", title: "INITIAL_BREACH", desc: "In-swinging yorker dismantled the opening stance. First wicket in the powerplay." },
      { over: "14.1_OV", title: "PATTERN_BREAK", desc: "Unexpected slower ball at 112km/h broke the predictive model. Key dismissal." },
      { over: "18.5_OV", title: "CASCADE_FAILURE", desc: "Three wickets in seven deliveries. Opposition batting algorithm collapsed." },
    ],
    momentum: { peak: 92.1, volatility: "MODERATE" },
    playerRatings: [
      { rank: 1, name: "J. BUMRAH", unit: "UNIT_S", rating: 9.5 },
      { rank: 2, name: "R. ASHWIN", unit: "UNIT_A", rating: 8.9 },
      { rank: 3, name: "S. GILL", unit: "UNIT_C", rating: 8.4 },
    ],
  },
];

export default function NarrativePage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [selected, setSelected] = useState(narratives[0]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/matches", { cache: "no-store" });
        const data = (await res.json()) as { data?: MatchItem[] };
        if (!ignore) setMatches(data.data ?? []);
      } catch { /* fallback */ }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  const bg = dark ? "#131313" : "#fcfcfc";
  const cardBg = dark ? "#1b1b1b" : "#ffffff";
  const deepBg = dark ? "#0e0e0e" : "#f5f5f5";
  const text = dark ? "#e2e2e2" : "#1a1a1a";
  const sub = dark ? "rgba(195,198,215,0.5)" : "rgba(60,60,60,0.5)";
  const border = dark ? "rgba(67,70,85,0.2)" : "rgba(200,200,200,0.4)";

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto" style={{ color: text }}>
      {/* Header */}
      <div className="border-l-4 border-[#2563eb] pl-6">
        <h1 className="text-[36px] sm:text-[52px] lg:text-[64px] font-black tracking-[-3px] uppercase leading-none" style={{ fontFamily: "'Epilogue', sans-serif", color: text }}>
          Match Narrative
        </h1>
        <span className="text-[11px] tracking-[3px] uppercase mt-2 block" style={{ fontFamily: "'Space Grotesk', sans-serif", color: sub }}>
          AI-Generated Post-Match Analysis // Classified Intel
        </span>
      </div>

      {/* Report Selector */}
      <div className="flex flex-wrap gap-2">
        {narratives.map((n) => (
          <button
            key={n.id}
            onClick={() => setSelected(n)}
            className="px-4 py-2 text-[10px] font-bold tracking-[1px] uppercase transition-all"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: n.id === selected.id ? "#2563eb" : cardBg,
              color: n.id === selected.id ? "#fff" : sub,
              border: `1px solid ${n.id === selected.id ? "#2563eb" : border}`,
            }}
          >
            MATCH #{n.id}
          </button>
        ))}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 text-[10px] font-bold tracking-[1px] uppercase transition-all ml-auto"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            background: "#2563eb",
            color: "white",
            opacity: generating ? 0.6 : 1,
          }}
        >
          {generating ? "GENERATING..." : "GENERATE_REPORT"}
        </button>
      </div>

      {/* Hero Header */}
      <div className="border-b-4 border-[#2563eb] pb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", background: text, color: bg }}>CLASSIFIED_INTEL</span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#2563eb]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>MATCH_ID: #{selected.id}</span>
        </div>
        <h2 className="font-black text-[40px] sm:text-[56px] lg:text-[72px] leading-none tracking-[-3px] uppercase mb-6" style={{ fontFamily: "'Epilogue',sans-serif", color: text }}>
          {selected.title.split(" ").slice(0, -1).join(" ")} <br />
          <span className="text-[#2563eb]">{selected.title.split(" ").slice(-1)[0]}</span>
        </h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <p className="max-w-xl text-lg leading-relaxed italic" style={{ color: sub }}>&quot;{selected.subtitle}&quot;</p>
          <div className="text-right">
            <div className="text-[10px] tracking-[3px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>TIMESTAMP</div>
            <div className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>{selected.timestamp}</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Article */}
        <article className="lg:col-span-8 space-y-8">
          {selected.body.map((para, i) => (
            <p
              key={i}
              className={`text-lg leading-relaxed text-justify ${i === 0 ? "first-letter:float-left first-letter:text-[5.5rem] first-letter:leading-[1] first-letter:pr-4 first-letter:font-black first-letter:text-[#2563eb]" : ""}`}
              style={{ fontFamily: "'Inter',sans-serif", color: i === 0 ? text : sub }}
            >
              {para}
            </p>
          ))}

          {/* Key Moments */}
          <section className="p-6 sm:p-8 mt-8 border-l-4 border-[#2563eb] relative overflow-hidden" style={{ background: dark ? "#1b1b1b" : "#f0f0f0" }}>
            <h3 className="font-bold text-xs tracking-[4px] text-[#2563eb] uppercase mb-8" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>KEY_MOMENTS</h3>
            <div className="space-y-6">
              {selected.keyMoments.map((km) => (
                <div key={km.over} className="flex gap-6 items-start">
                  <div className="font-bold text-[#2563eb] shrink-0 text-sm" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{km.over}</div>
                  <div className="border-l pl-6" style={{ borderColor: border }}>
                    <h4 className="font-bold text-sm uppercase mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>{km.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: sub }}>{km.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Momentum */}
          <div className="p-6 border" style={{ background: dark ? "#1f1f1f" : "#fff", borderColor: border }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xs tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>MOMENTUM_ANALYSIS</h3>
              <TrendingUp size={14} className="text-[#2563eb]" />
            </div>
            <div className="h-32 w-full relative flex items-end overflow-hidden mb-4" style={{ background: deepBg }}>
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="momGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path d="M0 40 L0 30 Q 25 10 40 25 T 70 5 T 100 15 L 100 40 Z" fill="url(#momGrad)" fillOpacity={0.4} stroke="#2563EB" strokeWidth={0.5} />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>PEAK_INTEL</div>
                <div className="text-lg font-black text-[#2563eb]" style={{ fontFamily: "'Epilogue',sans-serif" }}>{selected.momentum.peak}%</div>
              </div>
              <div>
                <div className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: sub }}>VOLATILITY</div>
                <div className="text-lg font-black" style={{ fontFamily: "'Epilogue',sans-serif", color: text }}>{selected.momentum.volatility}</div>
              </div>
            </div>
          </div>

          {/* Player Ratings */}
          <div className="border overflow-hidden" style={{ background: deepBg, borderColor: "rgba(37,99,235,0.3)" }}>
            <div className="p-4 bg-[#2563eb] text-white font-black text-xs uppercase tracking-[2px] flex justify-between" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
              PLAYER_RATINGS
              <Star size={14} />
            </div>
            <div>
              {selected.playerRatings.map((p) => (
                <div key={p.rank} className="p-4 flex items-center justify-between border-b" style={{ borderColor: border }}>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold" style={{ color: sub }}>{String(p.rank).padStart(2, "0")}</span>
                    <span className="font-bold text-xs uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>{p.name} [{p.unit}]</span>
                  </div>
                  <div className="font-black" style={{ fontFamily: "'Epilogue',sans-serif", color: p.rank === 1 ? "#2563eb" : sub }}>{p.rating}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Matches from API */}
          {matches.length > 0 && (
            <div className="p-5 border" style={{ background: cardBg, borderColor: border }}>
              <div className="flex items-center gap-2 mb-4">
                <Eye size={14} className="text-[#2563eb]" />
                <span className="text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif", color: text }}>Recent Matches</span>
              </div>
              <div className="space-y-3">
                {matches.slice(0, 4).map((m) => (
                  <div key={m.id} className="p-3 border" style={{ background: deepBg, borderColor: border }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase" style={{ fontFamily: "'Epilogue',sans-serif", color: text }}>{m.team1Code} vs {m.team2Code}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 uppercase" style={{
                        fontFamily: "'Space Grotesk',sans-serif",
                        background: m.status === "LIVE" ? "#2563eb" : (dark ? "rgba(67,70,85,0.3)" : "rgba(200,200,200,0.5)"),
                        color: m.status === "LIVE" ? "#fff" : sub,
                      }}>{m.status}</span>
                    </div>
                    <p className="text-[10px]" style={{ color: sub }}>{m.result || m.format}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

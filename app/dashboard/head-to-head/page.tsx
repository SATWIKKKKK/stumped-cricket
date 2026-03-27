"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Swords, Target, Activity, BarChart2, TrendingUp,
  ChevronDown, Zap,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import type { Player, MatchItem } from "@/lib/server/types";

/* ---------- mock dismissal patterns ---------- */
function buildDismissalHeatmap() {
  const zones = ["Short", "Good Length", "Full", "Yorker", "Bouncer", "Wide"];
  const lines = ["Off Stump", "Middle", "Leg Stump", "Outside Off", "Outside Leg"];
  const data: { zone: string; line: string; count: number }[] = [];
  for (const zone of zones) {
    for (const line of lines) {
      data.push({ zone, line, count: Math.floor(Math.random() * 8) });
    }
  }
  return data;
}

function buildStrikeZone() {
  return Array.from({ length: 30 }, () => ({
    intensity: Math.random(),
  }));
}

function buildOutcomeProbabilities(p1Name: string, p2Name: string) {
  return [
    { outcome: "Dot Ball", p1: Math.floor(Math.random() * 20 + 30), p2: Math.floor(Math.random() * 20 + 30) },
    { outcome: "Single", p1: Math.floor(Math.random() * 15 + 20), p2: Math.floor(Math.random() * 15 + 20) },
    { outcome: "Boundary", p1: Math.floor(Math.random() * 10 + 8), p2: Math.floor(Math.random() * 10 + 8) },
    { outcome: "Six", p1: Math.floor(Math.random() * 8 + 3), p2: Math.floor(Math.random() * 8 + 3) },
    { outcome: "Wicket", p1: Math.floor(Math.random() * 5 + 2), p2: Math.floor(Math.random() * 5 + 2) },
  ];
}

function buildHistoricalEncounters(p1: string, p2: string) {
  const results = ["Dismissed", "Not Out", "Boundary", "Maiden Over", "Dismissed", "Not Out"];
  return Array.from({ length: 6 }, (_, i) => ({
    id: i,
    match: `IPL 202${i}`,
    venue: ["Wankhede", "Chinnaswamy", "Eden Gardens", "Chepauk", "Narendra Modi", "Rajiv Gandhi"][i],
    balls: Math.floor(Math.random() * 20 + 5),
    runs: Math.floor(Math.random() * 40),
    result: results[i],
    date: `${["Mar", "Apr", "May", "Jun", "Jul", "Aug"][i]} 202${i}`,
  }));
}

export default function HeadToHeadPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [player1Idx, setPlayer1Idx] = useState(0);
  const [player2Idx, setPlayer2Idx] = useState(1);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const [pRes, mRes] = await Promise.all([
        fetch("/api/players", { cache: "no-store" }),
        fetch("/api/matches", { cache: "no-store" }),
      ]);
      const p = (await pRes.json()) as { data?: Player[] };
      const m = (await mRes.json()) as { data?: MatchItem[] };
      if (!ignore) {
        setPlayers(p.data ?? []);
        setMatches(m.data ?? []);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const p1 = players[player1Idx] ?? null;
  const p2 = players[player2Idx] ?? null;

  const dismissalHeatmap = useMemo(() => buildDismissalHeatmap(), [player1Idx, player2Idx]);
  const strikeZone = useMemo(() => buildStrikeZone(), [player1Idx, player2Idx]);
  const outcomeProbs = useMemo(
    () => p1 && p2 ? buildOutcomeProbabilities(p1.name, p2.name) : [],
    [p1, p2]
  );
  const encounters = useMemo(
    () => p1 && p2 ? buildHistoricalEncounters(p1.name, p2.name) : [],
    [p1, p2]
  );

  if (!p1 || !p2) {
    return (
      <div className="p-8 flex items-center gap-3 text-[12px] uppercase text-[rgba(195,198,215,0.6)]">
        <Activity className="animate-pulse" size={14} />
        Loading player data...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="border-l-4 border-[#b4c5ff] pl-6 sm:pl-7">
        <h1 className="text-[36px] sm:text-[52px] lg:text-[64px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          Head to Head
        </h1>
        <span className="text-[11px] tracking-[3px] uppercase text-[rgba(226,226,226,0.35)] mt-2 block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Tactical Matrix // Player Comparison
        </span>
      </div>

      {/* Player Selector + Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        {/* Player 1 */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5 sm:p-6">
          <div className="mb-4">
            <div className="relative">
              <select
                value={player1Idx}
                onChange={(e) => setPlayer1Idx(Number(e.target.value))}
                className="appearance-none w-full bg-[#0e0e0e] border border-[rgba(67,70,85,0.2)] px-4 py-2 pr-8 text-[11px] font-bold tracking-[1px] uppercase text-[#e2e2e2] outline-none cursor-pointer"
                style={{ fontFamily: "'Space Grotesk',sans-serif" }}
              >
                {players.map((p, i) => (
                  <option key={p.id} value={i}>{p.name}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[rgba(195,198,215,0.3)] pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-[#2563eb] flex items-center justify-center text-[18px] font-black text-white" style={{ fontFamily: "'Epilogue',sans-serif" }}>
              {p1.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h3 className="text-[16px] font-black uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue',sans-serif" }}>{p1.name}</h3>
              <p className="text-[10px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p1.team} - {p1.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Rank", value: p1.ranking },
              { label: "Score", value: String(p1.score) },
              { label: "Format", value: p1.format },
            ].map((s) => (
              <div key={s.label} className="bg-[#0e0e0e] p-2 text-center">
                <p className="text-[8px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.label}</p>
                <p className="text-[14px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* VS Center */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5 flex flex-col items-center justify-center gap-3">
          <Swords size={28} className="text-[rgba(195,198,215,0.15)]" />
          <p className="text-[32px] font-black text-[rgba(195,198,215,0.1)]" style={{ fontFamily: "'Epilogue',sans-serif" }}>VS</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            <span className="text-[9px] tracking-[1.5px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
              {encounters.length} Encounters
            </span>
          </div>
        </div>

        {/* Player 2 */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5 sm:p-6">
          <div className="mb-4">
            <div className="relative">
              <select
                value={player2Idx}
                onChange={(e) => setPlayer2Idx(Number(e.target.value))}
                className="appearance-none w-full bg-[#0e0e0e] border border-[rgba(67,70,85,0.2)] px-4 py-2 pr-8 text-[11px] font-bold tracking-[1px] uppercase text-[#e2e2e2] outline-none cursor-pointer"
                style={{ fontFamily: "'Space Grotesk',sans-serif" }}
              >
                {players.map((p, i) => (
                  <option key={p.id} value={i}>{p.name}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[rgba(195,198,215,0.3)] pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-[#b4c5ff] flex items-center justify-center text-[18px] font-black text-[#0e0e0e]" style={{ fontFamily: "'Epilogue',sans-serif" }}>
              {p2.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h3 className="text-[16px] font-black uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue',sans-serif" }}>{p2.name}</h3>
              <p className="text-[10px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p2.team} - {p2.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Rank", value: p2.ranking },
              { label: "Score", value: String(p2.score) },
              { label: "Format", value: p2.format },
            ].map((s) => (
              <div key={s.label} className="bg-[#0e0e0e] p-2 text-center">
                <p className="text-[8px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.label}</p>
                <p className="text-[14px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmaps Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Dismissal Heatmap */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={14} className="text-[#2563eb]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Dismissal Heatmap</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr>
                  <th className="p-2 text-[8px] text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}></th>
                  {["Off Stump", "Middle", "Leg Stump", "Outside Off", "Outside Leg"].map((line) => (
                    <th key={line} className="p-2 text-[7px] text-center tracking-[1px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{line}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["Short", "Good Length", "Full", "Yorker", "Bouncer", "Wide"].map((zone) => (
                  <tr key={zone}>
                    <td className="p-2 text-[8px] tracking-[1px] uppercase text-[rgba(195,198,215,0.35)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{zone}</td>
                    {dismissalHeatmap.filter((d) => d.zone === zone).map((d, i) => (
                      <td key={i} className="p-1">
                        <div className="w-full aspect-square flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: d.count > 5 ? `rgba(37,99,235,${d.count / 10})` : d.count > 2 ? `rgba(180,197,255,${d.count / 12})` : `rgba(67,70,85,0.15)`,
                            color: d.count > 3 ? "#e2e2e2" : "rgba(195,198,215,0.3)",
                            fontFamily: "'Space Grotesk',sans-serif",
                          }}>
                          {d.count}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strike Zone Heatmap */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[#b4c5ff]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Strike Zone</span>
          </div>
          <div className="grid grid-cols-6 gap-1 max-w-[320px] mx-auto">
            {strikeZone.map((cell, i) => (
              <div key={i} className="heatmap-cell"
                style={{
                  backgroundColor: cell.intensity > 0.7 ? `rgba(37,99,235,${cell.intensity})` : cell.intensity > 0.4 ? `rgba(180,197,255,${cell.intensity * 0.6})` : `rgba(67,70,85,${cell.intensity * 0.4 + 0.1})`,
                }} />
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 max-w-[320px] mx-auto">
            <span className="text-[8px] text-[rgba(195,198,215,0.3)] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Low Impact</span>
            <div className="flex gap-1">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
                <div key={v} className="w-4 h-2" style={{ backgroundColor: `rgba(37,99,235,${v})` }} />
              ))}
            </div>
            <span className="text-[8px] text-[rgba(195,198,215,0.3)] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>High Impact</span>
          </div>
        </div>
      </div>

      {/* Outcome Probability Bars */}
      <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={14} className="text-[#2563eb]" />
          <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Outcome Probability</span>
          <div className="flex gap-3 ml-auto">
            {[{ label: p1.name.split(" ").pop() ?? p1.name, color: "#2563eb" }, { label: p2.name.split(" ").pop() ?? p2.name, color: "#b4c5ff" }].map((t) => (
              <div key={t.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5" style={{ background: t.color }} />
                <span className="text-[9px] uppercase tracking-[0.5px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk'" }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={outcomeProbs} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.12)" vertical={false} />
            <XAxis dataKey="outcome" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 10, fontFamily: "'Space Grotesk'" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0, fontSize: 10 }} />
            <Bar dataKey="p1" fill="#2563eb" radius={[2, 2, 0, 0]} name={p1.name} />
            <Bar dataKey="p2" fill="#b4c5ff" radius={[2, 2, 0, 0]} name={p2.name} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Historical Encounters Table */}
      <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] overflow-x-auto">
        <div className="px-5 py-3 border-b border-[rgba(67,70,85,0.15)] flex items-center gap-2">
          <TrendingUp size={14} className="text-[#b4c5ff]" />
          <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Historical Encounters</span>
        </div>
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[rgba(67,70,85,0.1)]">
              {["Match", "Venue", "Balls", "Runs", "Result", "Date"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[9px] font-bold tracking-[1.5px] uppercase text-[rgba(195,198,215,0.35)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {encounters.map((e) => (
              <tr key={e.id} className="border-b border-[rgba(67,70,85,0.07)] hover:bg-[rgba(37,99,235,0.04)] transition-colors">
                <td className="px-4 py-2.5 text-[12px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Inter',sans-serif" }}>{e.match}</td>
                <td className="px-4 py-2.5 text-[11px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{e.venue}</td>
                <td className="px-4 py-2.5 text-[12px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{e.balls}</td>
                <td className="px-4 py-2.5 text-[12px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{e.runs}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-[9px] font-bold tracking-[1px] uppercase px-2 py-0.5 ${e.result === "Dismissed" ? "bg-[rgba(255,69,58,0.1)] text-[#ff453a]" : e.result === "Boundary" ? "bg-[rgba(52,199,89,0.1)] text-[#34c759]" : "bg-[rgba(67,70,85,0.2)] text-[rgba(195,198,215,0.4)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                    {e.result}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-[11px] text-[rgba(195,198,215,0.35)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

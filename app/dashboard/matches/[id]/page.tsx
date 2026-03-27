"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Radio, Activity, Target, Zap, TrendingUp, Star,
  ChevronRight, BarChart2,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import type { MatchItem, Player } from "@/lib/server/types";

/* ---------- mock scorecard & ball-by-ball data ---------- */
function buildScorecard(teamCode: string) {
  const names = [
    "R. Sharma", "I. Kishan", "S. Yadav", "T. David", "K. Pollard",
    "H. Pandya", "K. Pandya", "J. Bumrah", "P. Chawla", "R. Chahar", "J. Archer",
  ];
  return names.map((n, i) => ({
    name: n,
    runs: Math.floor(Math.random() * 80),
    balls: Math.floor(Math.random() * 50) + 10,
    fours: Math.floor(Math.random() * 8),
    sixes: Math.floor(Math.random() * 4),
    sr: (Math.random() * 100 + 80).toFixed(1),
    dismissal: i < 8 ? ["c Dhoni b Jadeja", "b Deepak Chahar", "lbw b Moeen", "run out", "st Dhoni b Theekshana", "c Gaikwad b Bravo", "b Jadeja", "not out"][i] : "DNB",
  }));
}

const overData = Array.from({ length: 20 }, (_, i) => ({
  over: i + 1,
  runs: Math.floor(Math.random() * 16) + 2,
  wickets: Math.random() > 0.82 ? 1 : 0,
  runRate: +(Math.random() * 4 + 6).toFixed(1),
}));

const wormData = Array.from({ length: 20 }, (_, i) => ({
  over: i + 1,
  team1: Math.floor((i + 1) * (8 + Math.random() * 3)),
  team2: Math.floor((i + 1) * (7.5 + Math.random() * 3)),
}));

function buildBallByBall() {
  const events = ["1 run", "FOUR", "SIX", "dot ball", "2 runs", "WICKET", "wide", "no ball", "3 runs", "1 run"];
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    over: `${Math.floor(i / 6) + 15}.${(i % 6) + 1}`,
    event: events[Math.floor(Math.random() * events.length)],
    detail: `Delivery ${i + 1}`,
    timestamp: `${19 - Math.floor(i / 6)}:${String(59 - (i % 6) * 9).padStart(2, "0")}`,
  }));
}

/* ---------- wagon wheel segments ---------- */
const wagonSegments = [
  { angle: 0, label: "Cover", runs: 28 }, { angle: 45, label: "Point", runs: 18 },
  { angle: 90, label: "Third Man", runs: 12 }, { angle: 135, label: "Fine Leg", runs: 22 },
  { angle: 180, label: "Mid Wicket", runs: 34 }, { angle: 225, label: "Mid On", runs: 15 },
  { angle: 270, label: "Long On", runs: 20 }, { angle: 315, label: "Long Off", runs: 26 },
];

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const [match, setMatch] = useState<MatchItem | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<"scorecard" | "graphs" | "fantasy">("scorecard");

  useEffect(() => {
    let ignore = false;
    async function load() {
      const [mRes, pRes] = await Promise.all([
        fetch(`/api/matches/${params.id}`, { cache: "no-store" }),
        fetch("/api/players", { cache: "no-store" }),
      ]);
      const mData = (await mRes.json()) as { data?: MatchItem };
      const pData = (await pRes.json()) as { data?: Player[] };
      if (!ignore) {
        setMatch(mData.data ?? null);
        setPlayers(pData.data ?? []);
      }
    }
    if (params.id) load();
    return () => { ignore = true; };
  }, [params.id]);

  const winSplit = useMemo(() => {
    if (!match?.aiPrediction) return { a: 50, b: 50 };
    const m = match.aiPrediction.match(/(\d{1,3})\s*%/);
    if (!m) return { a: 50, b: 50 };
    const a = Math.max(0, Math.min(100, Number(m[1])));
    return { a, b: 100 - a };
  }, [match]);

  const scorecard = useMemo(() => match ? buildScorecard(match.team1Code) : [], [match]);
  const ballByBall = useMemo(() => buildBallByBall(), []);

  const fantasyPicks = useMemo(() => {
    return players.slice(0, 6).map((p) => ({
      name: p.name,
      role: p.role,
      team: p.team,
      points: Math.floor(Math.random() * 60 + 40),
      form: (Math.random() * 3 + 7).toFixed(1),
      ownership: `${Math.floor(Math.random() * 40 + 20)}%`,
    }));
  }, [players]);

  if (!match) {
    return (
      <div className="p-8 flex items-center gap-3 text-[12px] uppercase text-[rgba(195,198,215,0.6)]">
        <Activity className="animate-pulse" size={14} />
        Loading match intelligence...
      </div>
    );
  }

  const isLive = match.status === "LIVE";

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <Link href="/dashboard/matches" className="flex items-center gap-2 text-[rgba(195,198,215,0.4)] hover:text-[#b4c5ff] transition-colors group w-fit">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-bold tracking-[1.2px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Back to Scorecard</span>
      </Link>

      {/* Match Header */}
      <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-8 py-3 border-b border-[rgba(67,70,85,0.15)]">
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`px-3 py-1 flex items-center gap-2 ${isLive ? "bg-[#2563eb]" : "bg-[#353535]"}`}>
              {isLive && <Radio size={10} className="text-white animate-pulse" />}
              <span className="text-[10px] font-bold text-white uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.status}</span>
            </div>
            <span className="text-[11px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.tournament}</span>
            <span className="text-[11px] text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.format}</span>
          </div>
          <span className="text-[10px] text-[#b4c5ff] hidden sm:block" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.venue}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 items-center p-5 sm:p-8">
          <div>
            <p className="text-[10px] tracking-[2px] text-[rgba(195,198,215,0.4)] mb-1 uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.team1}</p>
            <p className="text-[36px] sm:text-[52px] font-black tracking-[-3px] text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue',sans-serif" }}>{match.score1 || "—"}</p>
            <p className="text-[10px] text-[rgba(195,198,215,0.4)] mt-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.overs1 ? `${match.overs1} Overs` : "Yet to bat"}</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-[14px] font-bold text-[rgba(195,198,215,0.15)]" style={{ fontFamily: "'Epilogue',sans-serif" }}>VS</p>
            <div className="w-full max-w-[200px]">
              <div className="flex justify-between mb-1">
                <span className="text-[9px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.team1Code} {winSplit.a}%</span>
                <span className="text-[9px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{winSplit.b}% {match.team2Code}</span>
              </div>
              <div className="h-2.5 bg-[rgba(180,197,255,0.08)] overflow-hidden flex">
                <div className="h-full bg-[#2563eb] transition-all duration-700" style={{ width: `${winSplit.a}%` }} />
                <div className="h-full bg-[rgba(180,197,255,0.2)] flex-1" />
              </div>
              <p className="text-[9px] text-center text-[rgba(195,198,215,0.3)] mt-1.5" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>WIN PREDICTOR</p>
            </div>
            <p className="text-[10px] text-[rgba(195,198,215,0.3)] text-center" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.aiPrediction}</p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] tracking-[2px] text-[rgba(195,198,215,0.4)] mb-1 uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.team2}</p>
            <p className="text-[36px] sm:text-[52px] font-black tracking-[-3px] text-[#b4c5ff] leading-none" style={{ fontFamily: "'Epilogue',sans-serif" }}>{match.score2 || "—"}</p>
            <p className="text-[10px] text-[rgba(195,198,215,0.4)] mt-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.overs2 ? `${match.overs2} Overs` : "Yet to bat"}</p>
          </div>
        </div>

        {match.result && (
          <div className="px-5 sm:px-8 py-3 bg-[rgba(37,99,235,0.06)] border-t border-[rgba(37,99,235,0.15)]">
            <p className="text-[11px] font-bold text-[#b4c5ff] uppercase tracking-[0.5px]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.result}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[rgba(67,70,85,0.15)]">
        {(["scorecard", "graphs", "fantasy"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-[10px] font-bold tracking-[1.2px] uppercase transition-all border-b-2 ${activeTab === tab ? "border-[#2563eb] text-[#e2e2e2] bg-[rgba(37,99,235,0.06)]" : "border-transparent text-[rgba(195,198,215,0.4)] hover:text-[#e2e2e2]"}`}
            style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            {tab === "scorecard" ? "Scorecard" : tab === "graphs" ? "Run Graphs" : "Fantasy Optimizer"}
          </button>
        ))}
      </div>

      {/* Scorecard Tab */}
      {activeTab === "scorecard" && (
        <div className="flex flex-col gap-6">
          {/* Scorecard Table */}
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] overflow-x-auto">
            <div className="px-5 py-3 border-b border-[rgba(67,70,85,0.15)] flex items-center gap-2">
              <div className="w-2 h-2 bg-[#2563eb]" />
              <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                {match.team1} Innings
              </span>
            </div>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[rgba(67,70,85,0.1)]">
                  {["Batter", "Runs", "Balls", "4s", "6s", "SR", "Dismissal"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[9px] font-bold tracking-[1.5px] uppercase text-[rgba(195,198,215,0.35)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scorecard.map((row, i) => (
                  <tr key={i} className="border-b border-[rgba(67,70,85,0.07)] hover:bg-[rgba(37,99,235,0.04)] transition-colors">
                    <td className="px-4 py-2.5 text-[12px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Inter',sans-serif" }}>{row.name}</td>
                    <td className={`px-4 py-2.5 text-[12px] font-bold ${row.runs >= 50 ? "text-[#b4c5ff]" : "text-[#e2e2e2]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{row.runs}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{row.balls}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{row.fours}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{row.sixes}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{row.sr}</td>
                    <td className="px-4 py-2.5 text-[11px] text-[rgba(195,198,215,0.35)]" style={{ fontFamily: "'Inter',sans-serif" }}>{row.dismissal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Wagon Wheel + Tactical Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Wagon Wheel */}
            <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={14} className="text-[#b4c5ff]" />
                <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Wagon Wheel</span>
              </div>
              <div className="relative w-full aspect-square max-w-[280px] mx-auto">
                {/* Pitch circles */}
                <div className="absolute inset-[15%] rounded-full border border-[rgba(67,70,85,0.2)]" />
                <div className="absolute inset-[30%] rounded-full border border-[rgba(67,70,85,0.15)]" />
                <div className="absolute inset-[45%] rounded-full border border-[rgba(67,70,85,0.1)]" />
                {/* Center dot */}
                <div className="absolute inset-[48%] rounded-full bg-[#2563eb]" />
                {/* Segments */}
                {wagonSegments.map((seg) => {
                  const rad = (seg.angle * Math.PI) / 180;
                  const dist = 30 + (seg.runs / 34) * 25;
                  const x = 50 + dist * Math.cos(rad);
                  const y = 50 + dist * Math.sin(rad);
                  return (
                    <div key={seg.label} className="absolute flex flex-col items-center"
                      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
                      <div className="w-3 h-3 rounded-full bg-[#b4c5ff] opacity-70" />
                      <span className="text-[7px] text-[rgba(195,198,215,0.4)] mt-0.5 whitespace-nowrap" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{seg.label}</span>
                      <span className="text-[8px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{seg.runs}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tactical Heatmap */}
            <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-[#2563eb]" />
                <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Tactical Heatmap</span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 36 }, (_, i) => {
                  const intensity = Math.random();
                  return (
                    <div key={i} className="heatmap-cell"
                      style={{
                        backgroundColor: intensity > 0.7 ? `rgba(37,99,235,${intensity})` : intensity > 0.4 ? `rgba(180,197,255,${intensity * 0.6})` : `rgba(67,70,85,${intensity * 0.4 + 0.1})`,
                      }} />
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-3">
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

          {/* Ball by Ball Feed */}
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} className="text-[#b4c5ff]" />
              <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Ball by Ball Feed</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-1 pr-2">
              {ballByBall.map((b) => (
                <div key={b.id} className="flex items-center gap-4 px-3 py-2 hover:bg-[rgba(37,99,235,0.04)] transition-colors border-b border-[rgba(67,70,85,0.07)]">
                  <span className="text-[10px] font-bold text-[#b4c5ff] w-10 shrink-0" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{b.over}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 ${b.event === "FOUR" ? "text-[#34c759] bg-[rgba(52,199,89,0.1)]" : b.event === "SIX" ? "text-[#b4c5ff] bg-[rgba(180,197,255,0.1)]" : b.event === "WICKET" ? "text-[#ff453a] bg-[rgba(255,69,58,0.1)]" : "text-[rgba(195,198,215,0.5)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{b.event}</span>
                  <span className="text-[10px] text-[rgba(195,198,215,0.35)] flex-1" style={{ fontFamily: "'Inter',sans-serif" }}>{b.detail}</span>
                  <span className="text-[9px] text-[rgba(195,198,215,0.25)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{b.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Graphs Tab */}
      {activeTab === "graphs" && (
        <div className="flex flex-col gap-6">
          {/* Run Rate per Over */}
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 size={14} className="text-[#2563eb]" />
                <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Runs Per Over</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={overData} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.12)" vertical={false} />
                <XAxis dataKey="over" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk'" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0, fontSize: 10 }} />
                <Bar dataKey="runs" fill="#2563eb" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Worm Chart */}
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-[#b4c5ff]" />
                <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Run Progression Worm</span>
              </div>
              <div className="flex gap-3">
                {[{ label: match.team1Code, color: "#2563eb" }, { label: match.team2Code, color: "#b4c5ff" }].map((t) => (
                  <div key={t.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5" style={{ background: t.color }} />
                    <span className="text-[9px] uppercase tracking-[0.8px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk'" }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={wormData}>
                <defs>
                  <linearGradient id="t1Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="t2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b4c5ff" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#b4c5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.12)" />
                <XAxis dataKey="over" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0, fontSize: 10 }} />
                <Area type="monotone" dataKey="team1" name={match.team1Code} stroke="#2563eb" fill="url(#t1Grad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="team2" name={match.team2Code} stroke="#b4c5ff" fill="url(#t2Grad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Manhattan */}
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#b4c5ff]" />
              <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Run Rate Trend</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={overData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.12)" />
                <XAxis dataKey="over" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="runRate" stroke="#2563eb" fill="rgba(37,99,235,0.1)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Fantasy Optimizer Tab */}
      {activeTab === "fantasy" && (
        <div className="flex flex-col gap-6">
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
            <div className="flex items-center gap-2 mb-5">
              <Star size={14} className="text-[#b4c5ff]" />
              <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Fantasy Optimizer</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {fantasyPicks.map((p, i) => (
                <div key={i} className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.15)] p-4 hover:border-[rgba(37,99,235,0.3)] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[13px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Inter',sans-serif" }}>{p.name}</p>
                      <p className="text-[9px] tracking-[1px] uppercase text-[rgba(195,198,215,0.4)] mt-0.5" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.role} - {p.team}</p>
                    </div>
                    <div className="px-2 py-1 bg-[rgba(37,99,235,0.15)]">
                      <span className="text-[11px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.points} pts</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[8px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Form</p>
                      <p className="text-[13px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.form}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Ownership</p>
                      <p className="text-[13px] font-bold text-[rgba(195,198,215,0.6)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.ownership}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

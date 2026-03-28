"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { MatchItem, Player, NewsItem, RankingItem, TeamItem } from "@/lib/server/types";

type Props = {
  players: Player[];
  matches: MatchItem[];
  news: NewsItem[];
  rankings: RankingItem[];
  teams: TeamItem[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.3)] px-3 py-2">
        <p className="text-[10px] tracking-[1px] text-[#c3c6d7] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-[11px] font-bold" style={{ color: p.color, fontFamily: "'Space Grotesk', sans-serif" }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const LABEL = "text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]";
const SUB = "text-[9px] text-[rgba(195,198,215,0.6)] uppercase tracking-[0.8px]";
const STAT_LABEL = "text-[9px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.8px] mb-1";
const STAT_VAL = "text-[12px] font-bold text-[#b4c5ff]";
const tickStyle = { fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" };
const fontSG = { fontFamily: "'Space Grotesk', sans-serif" };

export default function DashboardCharts({ players, matches, news, rankings, teams }: Props) {
  const m = useMemo(() => matches[0], [matches]);

  /* Score progression from match scores */
  const scoreProgression = useMemo(() => {
    if (!m) return [];
    const s1 = parseInt(m.score1) || 0;
    const s2 = parseInt(m.score2) || 0;
    return [
      { phase: "PP", [m.team1Code]: Math.round(s1 * 0.25), [m.team2Code]: Math.round(s2 * 0.22) },
      { phase: "Mid-1", [m.team1Code]: Math.round(s1 * 0.45), [m.team2Code]: Math.round(s2 * 0.40) },
      { phase: "Mid-2", [m.team1Code]: Math.round(s1 * 0.60), [m.team2Code]: Math.round(s2 * 0.55) },
      { phase: "Mid-3", [m.team1Code]: Math.round(s1 * 0.75), [m.team2Code]: Math.round(s2 * 0.70) },
      { phase: "Death-1", [m.team1Code]: Math.round(s1 * 0.90), [m.team2Code]: Math.round(s2 * 0.85) },
      { phase: "Final", [m.team1Code]: s1, [m.team2Code]: s2 },
    ];
  }, [m]);

  /* Top player radar */
  const topPlayer = useMemo(() => players[0], [players]);
  const playerRadar = useMemo(() => {
    if (!topPlayer) return [];
    const s = topPlayer.score;
    return [
      { skill: "Batting", value: topPlayer.role === "BAT" ? s : Math.round(s * 0.75) },
      { skill: "Fielding", value: Math.round(s * 0.88) },
      { skill: "Running", value: Math.round(s * 0.92) },
      { skill: "Pressure", value: Math.round(s * 0.99) },
      { skill: "Consistency", value: Math.round(s * 0.94) },
      { skill: "Clutch", value: Math.round(s * 0.97) },
    ];
  }, [topPlayer]);

  /* Win probability from match scores */
  const winProbData = useMemo(() => {
    if (!m) return [];
    const s1 = parseInt(m.score1) || 100;
    const s2 = parseInt(m.score2) || 100;
    const total = s1 + s2;
    const base = (s1 / total) * 100;
    return [
      { over: "1", [m.team1Code]: 50, [m.team2Code]: 50 },
      { over: "4", [m.team1Code]: Math.round(base * 0.9), [m.team2Code]: 0 },
      { over: "8", [m.team1Code]: Math.round(base * 0.85), [m.team2Code]: 0 },
      { over: "12", [m.team1Code]: Math.round(base * 0.95), [m.team2Code]: 0 },
      { over: "16", [m.team1Code]: Math.round(base * 1.05), [m.team2Code]: 0 },
      { over: "20", [m.team1Code]: Math.round(base), [m.team2Code]: 0 },
    ].map(d => {
      const v = Math.min(100, Math.max(0, d[m.team1Code] as number));
      return { ...d, [m.team1Code]: v, [m.team2Code]: 100 - v };
    });
  }, [m]);

  /* Match status distribution */
  const matchStatusData = useMemo(() => {
    const live = matches.filter(x => x.status === "LIVE").length;
    const upcoming = matches.filter(x => x.status === "UPCOMING").length;
    const completed = matches.filter(x => x.status === "COMPLETED").length;
    return [
      { name: "Live", value: live || 1, color: "#ef4444" },
      { name: "Upcoming", value: upcoming || 1, color: "#2563eb" },
      { name: "Completed", value: completed || 1, color: "#b4c5ff" },
    ];
  }, [matches]);

  /* Player intel scores */
  const playerScores = useMemo(() =>
    [...players].sort((a, b) => b.score - a.score).slice(0, 8).map(p => ({
      name: p.name.split(" ").pop() ?? p.name,
      score: p.score,
    })),
    [players]
  );

  /* Team W/L */
  const teamWL = useMemo(() =>
    teams.slice(0, 6).map(t => ({ name: t.code, wins: t.wins, losses: t.losses })),
    [teams]
  );

  /* Rankings */
  const rankingData = useMemo(() =>
    [...rankings].sort((a, b) => b.rating - a.rating).slice(0, 6).map(r => ({
      name: r.player.split(" ").pop() ?? r.player,
      rating: r.rating,
    })),
    [rankings]
  );

  /* Role distribution */
  const roleDistribution = useMemo(() => {
    const roles: Record<string, number> = {};
    players.forEach(p => { roles[p.role] = (roles[p.role] || 0) + 1; });
    const colors = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8", "#1e40af"];
    return Object.entries(roles).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, [players]);

  /* News activity */
  const newsActivity = useMemo(() => {
    const hours = ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];
    return hours.map((h, i) => ({
      hour: h,
      articles: Math.max(1, Math.round(news.length * (0.3 + Math.sin(i * 0.8) * 0.7))),
    }));
  }, [news]);

  return (
    <div className="grid grid-cols-12 gap-6">

      {/* ===== 1. Score Progression (Area) ===== */}
      <div className="col-span-12 lg:col-span-8 bg-[#1b1b1b] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#b4c5ff]" />
            <span className={LABEL} style={fontSG}>
              SCORE PROGRESSION {m ? `[${m.team1Code} vs ${m.team2Code}]` : ""}
            </span>
          </div>
          {m && (
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#2563eb]" />
                <span className={SUB} style={fontSG}>{m.team1Code}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#b4c5ff]" />
                <span className={SUB} style={fontSG}>{m.team2Code}</span>
              </div>
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={scoreProgression}>
            <defs>
              <linearGradient id="t1Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="t2Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b4c5ff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#b4c5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
            <XAxis dataKey="phase" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {m && <Area type="monotone" dataKey={m.team1Code} name={m.team1Code} stroke="#2563eb" strokeWidth={2} fill="url(#t1Grad)" dot={false} />}
            {m && <Area type="monotone" dataKey={m.team2Code} name={m.team2Code} stroke="#b4c5ff" strokeWidth={2} fill="url(#t2Grad)" dot={false} />}
          </AreaChart>
        </ResponsiveContainer>
        {m && (
          <div className="flex gap-4 mt-3">
            <div className="flex-1 bg-[#0e0e0e] px-3 py-2 border-l-2 border-[#2563eb]">
              <p className={STAT_LABEL} style={fontSG}>{m.team1Code}</p>
              <p className={STAT_VAL} style={fontSG}>{m.score1}</p>
            </div>
            <div className="flex-1 bg-[#0e0e0e] px-3 py-2 border-l-2 border-[#b4c5ff]">
              <p className={STAT_LABEL} style={fontSG}>{m.team2Code}</p>
              <p className={STAT_VAL} style={fontSG}>{m.score2}</p>
            </div>
            <div className="flex-1 bg-[#0e0e0e] px-3 py-2 border-l-2 border-[#2563eb]">
              <p className={STAT_LABEL} style={fontSG}>VENUE</p>
              <p className={STAT_VAL} style={fontSG}>{m.venue.split(",")[0]}</p>
            </div>
          </div>
        )}
      </div>

      {/* ===== 2. Top Player Radar ===== */}
      <div className="col-span-12 lg:col-span-4 bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className={LABEL} style={fontSG}>
            PLAYER DNA {topPlayer ? `[${topPlayer.name.split(" ").map(w => w[0]).join("")}]` : ""}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={playerRadar}>
            <PolarGrid stroke="rgba(67,70,85,0.3)" />
            <PolarAngleAxis dataKey="skill" tick={{ ...tickStyle, fill: "rgba(195,198,215,0.5)" }} />
            <Radar name="Player" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
        {topPlayer && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.1)] p-2 text-center">
              <p className="text-[24px] font-bold text-[#e2e2e2]" style={fontSG}>{topPlayer.score}</p>
              <p className="text-[8px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.8px]" style={fontSG}>INTEL SCORE</p>
            </div>
            <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.1)] p-2 text-center">
              <p className="text-[24px] font-bold text-[#b4c5ff]" style={fontSG}>{topPlayer.tier}</p>
              <p className="text-[8px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.8px]" style={fontSG}>TIER CLASS</p>
            </div>
          </div>
        )}
      </div>

      {/* ===== 3. Win Probability (Line) ===== */}
      <div className="col-span-12 lg:col-span-8 bg-[#1b1b1b] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#2563eb]" />
            <span className={LABEL} style={fontSG}>WIN PROBABILITY [OVER-BY-OVER]</span>
          </div>
          {m && (
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#2563eb]" />
                <span className={SUB} style={fontSG}>{m.team1Code}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#b4c5ff]" />
                <span className={SUB} style={fontSG}>{m.team2Code}</span>
              </div>
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={winProbData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
            <XAxis dataKey="over" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={tickStyle} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            {m && <Line type="monotone" dataKey={m.team1Code} name={m.team1Code} stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: "#2563eb" }} />}
            {m && <Line type="monotone" dataKey={m.team2Code} name={m.team2Code} stroke="#b4c5ff" strokeWidth={2} dot={{ r: 3, fill: "#b4c5ff" }} />}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== 4. Match Status (Pie) ===== */}
      <div className="col-span-12 lg:col-span-4 bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#2563eb]" />
          <span className={LABEL} style={fontSG}>MATCH STATUS</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={matchStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
              {matchStatusData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {matchStatusData.map((s) => (
            <div key={s.name} className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.1)] p-2 text-center">
              <p className="text-[14px] font-bold text-[#b4c5ff]" style={fontSG}>{s.value}</p>
              <p className="text-[7px] text-[rgba(195,198,215,0.4)] uppercase tracking-[0.5px]" style={fontSG}>{s.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 5. Player Intel Scores (Horizontal Bar) ===== */}
      <div className="col-span-12 lg:col-span-6 bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className={LABEL} style={fontSG}>PLAYER INTEL SCORES</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={playerScores} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} width={70} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" name="Score" fill="#2563eb" radius={[0, 2, 2, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== 6. Team Win/Loss (Bar) ===== */}
      <div className="col-span-12 lg:col-span-6 bg-[#1b1b1b] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#2563eb]" />
            <span className={LABEL} style={fontSG}>TEAM PERFORMANCE</span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#2563eb] rounded-sm" />
              <span className={SUB} style={fontSG}>W</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#ef4444] rounded-sm" />
              <span className={SUB} style={fontSG}>L</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={teamWL}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
            <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="wins" name="Wins" fill="#2563eb" radius={[2, 2, 0, 0]} />
            <Bar dataKey="losses" name="Losses" fill="#ef4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== 7. World Rankings (Bar) ===== */}
      <div className="col-span-12 lg:col-span-6 bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className={LABEL} style={fontSG}>WORLD RANKINGS</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rankingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
            <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis domain={[700, "auto"]} tick={tickStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rating" name="Rating" fill="#b4c5ff" radius={[2, 2, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-3 mt-3">
          {rankingData.slice(0, 3).map(r => (
            <div key={r.name} className="flex-1 bg-[#0e0e0e] px-3 py-2 border-l-2 border-[#2563eb]">
              <p className={STAT_LABEL} style={fontSG}>{r.name}</p>
              <p className={STAT_VAL} style={fontSG}>{r.rating}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 8. Role Distribution (Pie) ===== */}
      <div className="col-span-12 lg:col-span-3 bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#2563eb]" />
          <span className={LABEL} style={fontSG}>ROLE SPLIT</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={roleDistribution} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}>
              {roleDistribution.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ===== 9. News Pulse (Area) ===== */}
      <div className="col-span-12 lg:col-span-3 bg-[#1b1b1b] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <span className={LABEL} style={fontSG}>NEWS PULSE</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={newsActivity}>
            <defs>
              <linearGradient id="newsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.15)" />
            <XAxis dataKey="hour" tick={{ ...tickStyle, fontSize: 8 }} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} hide />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="articles" name="Articles" stroke="#2563eb" strokeWidth={2} fill="url(#newsGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

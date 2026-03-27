"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart2, Filter, TrendingUp, Activity, Database,
  ChevronDown, Search,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";
import type { Player, MatchItem } from "@/lib/server/types";

/* ---------- filter options ---------- */
const formatOptions = ["All Formats", "T20", "ODI", "Test"];
const roleOptions = ["All Roles", "Batsman", "Bowler", "All Rounder", "Wicket Keeper"];

export default function StatsExplorerPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [formatFilter, setFormatFilter] = useState("All Formats");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "ranking">("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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

  const filtered = useMemo(() => {
    let result = [...players];
    if (formatFilter !== "All Formats") result = result.filter((p) => p.format === formatFilter);
    if (roleFilter !== "All Roles") result = result.filter((p) => p.role === roleFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const aVal = sortBy === "score" ? a.score : Number(a.ranking) || 999;
      const bVal = sortBy === "score" ? b.score : Number(b.ranking) || 999;
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });
    return result;
  }, [players, formatFilter, roleFilter, searchQuery, sortBy, sortDir]);

  /* Progression data (from matches) */
  const progressionData = useMemo(() => {
    return matches.slice(0, 10).map((m, i) => ({
      match: `${m.team1Code} v ${m.team2Code}`,
      idx: i + 1,
      avgScore: Math.floor(Math.random() * 40 + 30),
      runRate: +(Math.random() * 4 + 5.5).toFixed(1),
    }));
  }, [matches]);

  /* Career trajectory */
  const trajectoryData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      rating: Math.floor(Math.random() * 200 + 600),
      form: +(Math.random() * 3 + 6).toFixed(1),
    }));
  }, []);

  const statsOverview = useMemo(() => [
    { label: "Total Players", value: String(players.length), sub: "In Database" },
    { label: "Active", value: String(players.filter((p) => p.status === "ACTIVE").length), sub: "Currently Playing" },
    { label: "Live Matches", value: String(matches.filter((m) => m.status === "LIVE").length), sub: "Active Streams" },
    { label: "Formats", value: String(new Set(players.map((p) => p.format)).size), sub: "Cross Format" },
  ], [players, matches]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="border-l-4 border-[#2563eb] pl-6 sm:pl-7">
        <h1 className="text-[36px] sm:text-[52px] lg:text-[64px] font-black tracking-[-3px] uppercase leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          <span className="text-[#e2e2e2]">Stats</span>{" "}
          <span className="text-[#2563eb]">Explorer</span>
        </h1>
        <span className="text-[11px] tracking-[3px] uppercase text-[rgba(226,226,226,0.35)] mt-2 block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Player Analytics // Performance Data // Career Trajectories
        </span>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statsOverview.map((s) => (
          <div key={s.label} className="bg-[#1b1b1b] border-t-2 border-[rgba(180,197,255,0.2)] p-4">
            <p className="text-[9px] tracking-[1.5px] uppercase text-[rgba(195,198,215,0.35)] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
            <p className="text-[22px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>{s.value}</p>
            <p className="text-[8px] text-[rgba(195,198,215,0.25)] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Parameters */}
      <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={14} className="text-[#2563eb]" />
          <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Filter Parameters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#0e0e0e] border border-[rgba(67,70,85,0.2)] px-3 py-2 min-w-[200px]">
            <Search size={12} className="text-[rgba(195,198,215,0.3)] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players..."
              className="bg-transparent text-[11px] text-[#e2e2e2] placeholder-[rgba(195,198,215,0.3)] outline-none w-full border-none focus:ring-0"
              style={{ fontFamily: "'Inter',sans-serif" }}
            />
          </div>
          {/* Format */}
          <div className="relative">
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="appearance-none bg-[#0e0e0e] border border-[rgba(67,70,85,0.2)] px-4 py-2 pr-8 text-[11px] font-bold tracking-[1px] uppercase text-[rgba(195,198,215,0.5)] outline-none cursor-pointer hover:border-[rgba(37,99,235,0.3)] transition-colors"
              style={{ fontFamily: "'Space Grotesk',sans-serif" }}
            >
              {formatOptions.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[rgba(195,198,215,0.3)] pointer-events-none" />
          </div>
          {/* Role */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none bg-[#0e0e0e] border border-[rgba(67,70,85,0.2)] px-4 py-2 pr-8 text-[11px] font-bold tracking-[1px] uppercase text-[rgba(195,198,215,0.5)] outline-none cursor-pointer hover:border-[rgba(37,99,235,0.3)] transition-colors"
              style={{ fontFamily: "'Space Grotesk',sans-serif" }}
            >
              {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[rgba(195,198,215,0.3)] pointer-events-none" />
          </div>
          {/* Sort */}
          <button
            onClick={() => {
              if (sortBy === "score") {
                setSortDir((d) => (d === "desc" ? "asc" : "desc"));
              } else {
                setSortBy("score");
                setSortDir("desc");
              }
            }}
            className={`px-4 py-2 text-[10px] font-bold tracking-[1px] uppercase transition-colors ${sortBy === "score" ? "bg-[#2563eb] text-white" : "bg-[rgba(67,70,85,0.2)] text-[rgba(195,198,215,0.4)] hover:text-[#e2e2e2]"}`}
            style={{ fontFamily: "'Space Grotesk',sans-serif" }}
          >
            Score {sortBy === "score" ? (sortDir === "desc" ? "↓" : "↑") : ""}
          </button>
          <button
            onClick={() => {
              if (sortBy === "ranking") {
                setSortDir((d) => (d === "desc" ? "asc" : "desc"));
              } else {
                setSortBy("ranking");
                setSortDir("asc");
              }
            }}
            className={`px-4 py-2 text-[10px] font-bold tracking-[1px] uppercase transition-colors ${sortBy === "ranking" ? "bg-[#2563eb] text-white" : "bg-[rgba(67,70,85,0.2)] text-[rgba(195,198,215,0.4)] hover:text-[#e2e2e2]"}`}
            style={{ fontFamily: "'Space Grotesk',sans-serif" }}
          >
            Ranking {sortBy === "ranking" ? (sortDir === "desc" ? "↓" : "↑") : ""}
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] overflow-x-auto">
        <div className="px-5 py-3 border-b border-[rgba(67,70,85,0.15)] flex items-center gap-2">
          <Database size={14} className="text-[#b4c5ff]" />
          <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Player Data Table</span>
          <span className="text-[9px] text-[rgba(195,198,215,0.3)] ml-auto" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{filtered.length} results</span>
        </div>
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[rgba(67,70,85,0.1)]">
              {["Player", "Team", "Format", "Role", "Ranking", "Score", "Status", "Tier"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[9px] font-bold tracking-[1.5px] uppercase text-[rgba(195,198,215,0.35)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map((p) => (
              <tr key={p.id} className="border-b border-[rgba(67,70,85,0.07)] hover:bg-[rgba(37,99,235,0.04)] transition-colors cursor-pointer">
                <td className="px-4 py-2.5 text-[12px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Inter',sans-serif" }}>{p.name}</td>
                <td className="px-4 py-2.5 text-[11px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.team}</td>
                <td className="px-4 py-2.5 text-[11px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.format}</td>
                <td className="px-4 py-2.5 text-[11px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.role}</td>
                <td className="px-4 py-2.5 text-[12px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.ranking}</td>
                <td className="px-4 py-2.5 text-[12px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.score}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-[9px] font-bold tracking-[1px] uppercase px-2 py-0.5 ${p.status === "ACTIVE" ? "bg-[rgba(52,199,89,0.1)] text-[#34c759]" : "bg-[rgba(67,70,85,0.2)] text-[rgba(195,198,215,0.4)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`text-[9px] font-bold tracking-[1px] uppercase px-2 py-0.5 ${p.tier === "ELITE" ? "bg-[rgba(37,99,235,0.15)] text-[#2563eb]" : p.tier === "CORE" ? "bg-[rgba(180,197,255,0.1)] text-[#b4c5ff]" : "bg-[rgba(67,70,85,0.2)] text-[rgba(195,198,215,0.4)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                    {p.tier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Realtime Progression */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-[#2563eb]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Realtime Progression</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={progressionData} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.12)" vertical={false} />
              <XAxis dataKey="match" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 8 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0, fontSize: 10 }} />
              <Bar dataKey="avgScore" fill="#2563eb" radius={[2, 2, 0, 0]} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Career Trajectory */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-[#b4c5ff]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Career Trajectory</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trajectoryData}>
              <defs>
                <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b4c5ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#b4c5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.12)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0, fontSize: 10 }} />
              <Area type="monotone" dataKey="rating" stroke="#b4c5ff" fill="url(#ratingGrad)" strokeWidth={2} dot={{ fill: "#b4c5ff", r: 2 }} name="Rating" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Raw Log Dump */}
      <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.15)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database size={14} className="text-[rgba(195,198,215,0.3)]" />
          <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Raw Data Log</span>
        </div>
        <div className="font-mono text-[10px] text-[rgba(195,198,215,0.5)] leading-[1.8] max-h-[200px] overflow-y-auto">
          {filtered.slice(0, 10).map((p) => (
            <div key={p.id} className="hover:text-[#b4c5ff] transition-colors">
              {`[PLAYER] id=${p.id} name="${p.name}" team="${p.team}" format=${p.format} role=${p.role} rank=${p.ranking} score=${p.score} status=${p.status} tier=${p.tier}`}
            </div>
          ))}
          {matches.slice(0, 5).map((m) => (
            <div key={m.id} className="hover:text-[#2563eb] transition-colors">
              {`[MATCH] id=${m.id} ${m.team1Code} vs ${m.team2Code} status=${m.status} venue="${m.venue}" prediction="${m.aiPrediction}"`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

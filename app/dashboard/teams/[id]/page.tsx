"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Users, Trophy, TrendingUp, Shield, Activity,
  BarChart2, ChevronRight, Star,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import type { TeamItem, Player } from "@/lib/server/types";

/* ---------- mock squad data ---------- */
function buildSquadIntel(players: Player[], teamName: string) {
  const teamPlayers = players.filter((p) => p.team === teamName);
  if (teamPlayers.length > 0) return teamPlayers;
  // fallback squad
  const roles = ["Batsman", "Bowler", "All Rounder", "Wicket Keeper", "Batsman", "Bowler"];
  const names = ["R. Sharma", "J. Bumrah", "S. Yadav", "I. Kishan", "T. David", "P. Chawla"];
  return names.map((name, i) => ({
    id: `sq-${i}`,
    name,
    team: teamName,
    country: "India",
    format: "T20",
    ranking: String(Math.floor(Math.random() * 20) + 1),
    status: "ACTIVE",
    score: Math.floor(Math.random() * 60 + 40),
    tier: i < 2 ? "ELITE" : i < 4 ? "CORE" : "BENCH",
    role: roles[i],
  }));
}

const performanceRadar = [
  { stat: "Batting", value: 78 },
  { stat: "Bowling", value: 65 },
  { stat: "Fielding", value: 72 },
  { stat: "Powerplay", value: 80 },
  { stat: "Death Overs", value: 68 },
  { stat: "Chase Record", value: 74 },
];

function buildTimeline() {
  const events = [
    { season: "2024", result: "Champions", detail: "Won final by 5 wickets" },
    { season: "2023", result: "Playoffs", detail: "Eliminated in Qualifier 2" },
    { season: "2022", result: "5th Place", detail: "Missed playoffs by NRR" },
    { season: "2021", result: "Champions", detail: "Won final by 7 runs" },
    { season: "2020", result: "Runners up", detail: "Lost final by 8 wickets" },
    { season: "2019", result: "Champions", detail: "Won final by 1 run" },
  ];
  return events;
}

const seasonTrend = [
  { season: "2019", wins: 9, position: 1 },
  { season: "2020", wins: 9, position: 2 },
  { season: "2021", wins: 10, position: 1 },
  { season: "2022", wins: 6, position: 5 },
  { season: "2023", wins: 8, position: 4 },
  { season: "2024", wins: 11, position: 1 },
];

export default function TeamDetailPage() {
  const params = useParams<{ id: string }>();
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const [tRes, pRes] = await Promise.all([
        fetch("/api/teams", { cache: "no-store" }),
        fetch("/api/players", { cache: "no-store" }),
      ]);
      const t = (await tRes.json()) as { data?: TeamItem[] };
      const p = (await pRes.json()) as { data?: Player[] };
      if (!ignore) {
        setTeams(t.data ?? []);
        setPlayers(p.data ?? []);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const team = useMemo(() => teams.find((t) => t.id === params.id) ?? null, [teams, params.id]);
  const squad = useMemo(() => team ? buildSquadIntel(players, team.name) : [], [players, team]);
  const timeline = useMemo(() => buildTimeline(), []);

  if (!team) {
    return (
      <div className="p-8 flex items-center gap-3 text-[12px] uppercase text-[rgba(195,198,215,0.6)]">
        <Activity className="animate-pulse" size={14} />
        Loading team intelligence...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <Link href="/dashboard/teams" className="flex items-center gap-2 text-[rgba(195,198,215,0.4)] hover:text-[#b4c5ff] transition-colors group w-fit">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-bold tracking-[1.2px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Back to Teams</span>
      </Link>

      {/* Team Header */}
      <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] overflow-hidden relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #b4c5ff 0px, #b4c5ff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(0deg, #b4c5ff 0px, #b4c5ff 1px, transparent 1px, transparent 60px)" }} />
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 flex items-center justify-center text-[28px] font-black text-white bg-[#2563eb] shrink-0" style={{ fontFamily: "'Epilogue',sans-serif" }}>
              {team.code}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[36px] sm:text-[52px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none glitch-text" style={{ fontFamily: "'Epilogue',sans-serif" }}>
                {team.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="text-[10px] tracking-[2px] uppercase text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{team.league}</span>
                <span className="text-[10px] tracking-[2px] uppercase text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{team.country}</span>
                <span className="text-[10px] tracking-[2px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Captain: {team.captain}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[36px] font-black text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{team.ranking}</span>
              <span className="text-[9px] tracking-[1.5px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>World Rank</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { icon: Trophy, label: "Wins", value: String(team.wins), color: "#34c759" },
              { icon: Shield, label: "Losses", value: String(team.losses), color: "#ff453a" },
              { icon: TrendingUp, label: "NRR", value: team.nrr, color: "#b4c5ff" },
              { icon: Users, label: "Squad Size", value: String(team.players), color: "#e2e2e2" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-[rgba(0,0,0,0.3)] border border-[rgba(67,70,85,0.15)] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={12} className="text-[rgba(195,198,215,0.3)]" />
                    <span className="text-[9px] tracking-[1.5px] uppercase text-[rgba(195,198,215,0.35)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.label}</span>
                  </div>
                  <p className="text-[22px] font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: s.color }}>{s.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Squad Intel */}
      <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Users size={14} className="text-[#2563eb]" />
          <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Squad Intel</span>
          <span className="text-[9px] tracking-[1px] text-[rgba(195,198,215,0.3)] ml-auto" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{squad.length} Players</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {squad.map((p) => (
            <Link key={p.id} href={`/dashboard/players/${p.id}`}
              className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.15)] p-4 hover:border-[rgba(37,99,235,0.3)] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#e2e2e2] truncate" style={{ fontFamily: "'Inter',sans-serif" }}>{p.name}</p>
                  <p className="text-[9px] tracking-[1px] uppercase text-[rgba(195,198,215,0.4)] mt-0.5" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.role}</p>
                </div>
                <div className={`px-2 py-0.5 text-[8px] font-bold tracking-[1px] uppercase ${p.tier === "ELITE" ? "bg-[rgba(37,99,235,0.15)] text-[#2563eb]" : p.tier === "CORE" ? "bg-[rgba(180,197,255,0.1)] text-[#b4c5ff]" : "bg-[rgba(67,70,85,0.2)] text-[rgba(195,198,215,0.4)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                  {p.tier}
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-[8px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Rank</p>
                  <p className="text-[14px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.ranking}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Score</p>
                  <p className="text-[14px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.score}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Status</p>
                  <p className={`text-[10px] font-bold uppercase ${p.status === "ACTIVE" ? "text-[#34c759]" : "text-[rgba(195,198,215,0.4)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.status}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-[rgba(195,198,215,0.2)] group-hover:text-[#b4c5ff] transition-colors mt-3 ml-auto" />
            </Link>
          ))}
        </div>
      </div>

      {/* Performance Vector + Season Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-[#b4c5ff]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Performance Vector</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={performanceRadar}>
              <PolarGrid stroke="rgba(67,70,85,0.2)" />
              <PolarAngleAxis dataKey="stat" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9, fontFamily: "'Space Grotesk'" }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="Team" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Season Trend */}
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-[#2563eb]" />
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Season Wins Trend</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={seasonTrend}>
              <defs>
                <linearGradient id="winsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,85,0.12)" />
              <XAxis dataKey="season" tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(195,198,215,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0e0e0e", border: "1px solid rgba(67,70,85,0.3)", borderRadius: 0, fontSize: 10 }} />
              <Area type="monotone" dataKey="wins" stroke="#2563eb" fill="url(#winsGrad)" strokeWidth={2} dot={{ fill: "#2563eb", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement History Timeline */}
      <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Star size={14} className="text-[#b4c5ff]" />
          <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Engagement History</span>
        </div>
        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-[rgba(67,70,85,0.2)]" />
          <div className="space-y-4 pl-8">
            {timeline.map((e, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-5 top-1.5 w-2.5 h-2.5 ${e.result === "Champions" ? "bg-[#2563eb]" : e.result === "Runners up" ? "bg-[#b4c5ff]" : "bg-[rgba(67,70,85,0.4)]"}`} />
                <div className="flex items-start gap-4">
                  <span className="text-[11px] font-bold text-[#b4c5ff] w-12 shrink-0" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{e.season}</span>
                  <div>
                    <p className={`text-[13px] font-bold uppercase ${e.result === "Champions" ? "text-[#2563eb]" : "text-[#e2e2e2]"}`} style={{ fontFamily: "'Epilogue',sans-serif" }}>{e.result}</p>
                    <p className="text-[11px] text-[rgba(195,198,215,0.4)] mt-0.5" style={{ fontFamily: "'Inter',sans-serif" }}>{e.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

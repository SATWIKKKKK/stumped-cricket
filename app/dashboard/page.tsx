"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, TrendingUp, Users, Trophy, Radio } from "lucide-react";
import DashboardCharts from "@/components/charts/DashboardCharts";
import type { MatchItem, NewsItem, Player, RankingItem, TeamItem } from "@/lib/server/types";

type BootstrapResponse = {
  data?: {
    players?: Player[];
    matches?: MatchItem[];
    news?: NewsItem[];
    rankings?: RankingItem[];
    teams?: TeamItem[];
  };
};

export default function DashboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const response = await fetch("/api/bootstrap", { cache: "no-store" });
        const payload = (await response.json()) as BootstrapResponse;
        if (!ignore) {
          setPlayers(payload.data?.players ?? []);
          setMatches(payload.data?.matches ?? []);
          setNews(payload.data?.news ?? []);
          setRankings(payload.data?.rankings ?? []);
          setTeams(payload.data?.teams ?? []);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    const interval = setInterval(load, 30000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  const liveMatch = useMemo(() => matches.find((m) => m.status === "LIVE") ?? matches[0], [matches]);
  const liveCount = useMemo(() => matches.filter((m) => m.status === "LIVE").length, [matches]);
  const todayMatches = matches.length;
  const topPlayers = useMemo(() => [...players].sort((a, b) => b.score - a.score).slice(0, 3), [players]);

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 sm:gap-12 max-w-[1280px] animate-pulse">
        <div className="border-l-4 border-[rgba(180,197,255,0.2)] pl-5 sm:pl-7 flex flex-col gap-3">
          <div className="h-12 w-64 bg-[#1b1b1b]" />
          <div className="h-3 w-96 bg-[#1b1b1b]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1b1b1b] border-t-2 border-[rgba(180,197,255,0.1)] p-4 sm:p-6 flex flex-col gap-3">
              <div className="h-2 w-24 bg-[#2a2a2a]" />
              <div className="h-8 w-16 bg-[#2a2a2a]" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#1b1b1b] h-[300px]" />
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="bg-[#2a2a2a] h-[200px]" />
            <div className="bg-[#1b1b1b] h-[80px]" />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 bg-[#1b1b1b] h-[280px]" />
          <div className="col-span-12 lg:col-span-4 bg-[#1b1b1b] h-[280px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 sm:gap-12 max-w-[1280px]">
      <div className="border-l-4 border-[#b4c5ff] pl-5 sm:pl-7 flex flex-col gap-2">
        <h1 className=" text-[clamp(36px,6vw,60px)] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          MATCH CENTRE
        </h1>
        <div className="flex items-center gap-4 flex-wrap">
          
          <div className="hidden sm:block flex-1 h-px bg-[rgba(67,70,85,0.2)]" />
          
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          { label: "MATCHES TODAY", value: String(todayMatches), sub: "FROM API", icon: Trophy },
          { label: "LIVE NOW", value: String(liveCount), sub: "ACTIVE STREAMS", icon: Radio },
          { label: "PLAYERS TRACKED", value: String(players.length), sub: "INTEL PROFILES", icon: Users },
          { label: "NEWS FEED", value: String(news.length), sub: "RECENT INTEL", icon: TrendingUp },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#1b1b1b] border-t-2 border-[rgba(180,197,255,0.3)] p-4 sm:p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[1.2px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.label}
                </span>
                <Icon size={13} className="text-[rgba(15,66,232,0.4)]" />
              </div>
              <p className="text-[24px] sm:text-[32px] font-bold text-[#b4c5ff] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </p>
              <span className="text-[8px] sm:text-[9px] tracking-[1.6px] uppercase text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.sub}
              </span>
            </div>
          );
        })}
      </div>

      {!liveMatch && !loading && (
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-6 text-[12px] text-[rgba(195,198,215,0.6)] uppercase tracking-[1px]">
          No matches available yet. Run sync and refresh.
        </div>
      )}

      {liveMatch && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-[#1b1b1b] border-l border-[rgba(180,197,255,0.2)] p-5 sm:p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="text-[11px] sm:text-[12px] font-bold tracking-[1.2px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {liveMatch.tournament}
                  </span>
                  <div className="bg-[#2563eb] px-3 py-1 flex items-center gap-1.5">
                    <Radio size={8} className="text-white" />
                    <span className="text-[9px] font-bold uppercase text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {liveMatch.status}
                    </span>
                  </div>
                </div>

                <h2 className="text-[clamp(22px,4vw,36px)] font-black tracking-[-1.8px] uppercase text-[#e2e2e2] leading-tight mb-5" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  {liveMatch.team1.toUpperCase()} vs {liveMatch.team2.toUpperCase()}
                </h2>

                <div className="flex flex-wrap items-start gap-6 sm:gap-10 mb-6">
                  <div>
                    <p className="text-[9px] text-[rgba(226,226,226,0.3)] uppercase mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.team1Code}</p>
                    <p className="text-[24px] sm:text-[32px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.score1}</p>
                    <p className="text-[10px] text-[rgba(226,226,226,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.overs1} OVS</p>
                  </div>
                  <div className="flex items-center self-center">
                    <span className="text-[16px] text-[rgba(226,226,226,0.2)]" style={{ fontFamily: "'Epilogue', sans-serif" }}>VS</span>
                  </div>
                  <div>
                    <p className="text-[9px] text-[rgba(226,226,226,0.3)] uppercase mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.team2Code}</p>
                    <p className="text-[24px] sm:text-[32px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.score2}</p>
                    <p className="text-[10px] text-[rgba(226,226,226,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.overs2} OVS</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between border-t border-[rgba(67,70,85,0.2)] pt-5">
                  <div>
                    <p className="text-[9px] text-[rgba(226,226,226,0.3)] uppercase mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI PREDICTION</p>
                    <p className="text-[12px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.aiPrediction}</p>
                  </div>
                  <Link href={`/dashboard/matches/${liveMatch.id}`} className="bg-[#b4c5ff] px-5 py-3 flex items-center justify-center gap-2 hover:bg-white transition-colors group self-start sm:self-auto">
                    <span className="text-[14px] sm:text-[16px] font-bold tracking-[1.6px] uppercase text-[#131313]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      LIVE ANALYSIS
                    </span>
                    <ArrowRight size={14} className="text-[#131313] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="bg-[#2a2a2a] border-t-2 border-[rgba(180,197,255,0.3)] pb-5 pt-5 px-5">
              <h3 className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#b4c5ff] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                TOP PLAYERS
              </h3>
              <div className="flex flex-col gap-4">
                {topPlayers.map((p) => (
                  <Link key={p.id} href={`/dashboard/players/${p.id}`} className="border-b border-[rgba(67,70,85,0.1)] last:border-0 pb-4 last:pb-0 pt-1 px-2">
                    <p className="text-[12px] font-bold uppercase text-[#e2e2e2] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {p.team} · {p.role}
                      </span>
                      <span className="text-[10px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.score}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[#2563eb] p-6 flex flex-col items-center text-center">
              <h3 className="text-[18px] sm:text-[20px] font-black tracking-[-0.5px] uppercase text-[#eeefff] mb-1" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                Feed Active
              </h3>
              <p className="text-[10px] uppercase text-[rgba(238,239,255,0.7)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Auto-synced from provider
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <h2 className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            RUN RATE ANALYTICS
          </h2>
        </div>
        <DashboardCharts players={players} matches={matches} news={news} rankings={rankings} teams={teams} />
      </div>
    </div>
  );
}

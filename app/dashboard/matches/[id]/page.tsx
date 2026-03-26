"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Radio } from "lucide-react";
import MatchCharts from "@/components/charts/MatchCharts";
import type { MatchItem } from "@/lib/server/types";

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const [match, setMatch] = useState<MatchItem | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const response = await fetch(`/api/matches/${params.id}`, { cache: "no-store" });
      const payload = (await response.json()) as { data?: MatchItem };
      if (!ignore) {
        setMatch(payload.data ?? null);
      }
    }

    if (params.id) {
      load();
    }

    return () => {
      ignore = true;
    };
  }, [params.id]);

  const winSplit = useMemo(() => {
    if (!match?.aiPrediction) return { a: 50, b: 50 };
    const m = match.aiPrediction.match(/(\d{1,3})\s*%/);
    if (!m) return { a: 50, b: 50 };
    const a = Math.max(0, Math.min(100, Number(m[1])));
    return { a, b: 100 - a };
  }, [match]);

  if (!match) {
    return (
      <div className="p-8 text-[12px] uppercase text-[rgba(195,198,215,0.6)]">
        Loading match detail...
      </div>
    );
  }

  const isLive = match.status === "LIVE";

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6 max-w-[1280px]">
      <Link href="/dashboard/matches" className="flex items-center gap-2 text-[rgba(195,198,215,0.4)] hover:text-[#b4c5ff] transition-colors group w-fit">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-bold tracking-[1.2px] uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>BACK TO SCORECARD</span>
      </Link>

      <div className="bg-[#1b1b1b] p-5 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 flex items-center gap-2 ${isLive ? "bg-[#2563eb]" : "bg-[#353535]"}`}>
              {isLive && <Radio size={10} className="text-white" />}
              <span className="text-[10px] font-bold text-white uppercase" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.status}</span>
            </div>
            <span className="text-[12px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.tournament}</span>
          </div>
          <span className="text-[10px] text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.venue}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-8 items-center">
          <div>
            <p className="text-[11px] text-[rgba(195,198,215,0.4)] mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.team1}</p>
            <p className="text-[32px] sm:text-[48px] font-black tracking-[-2px] text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue',sans-serif" }}>{match.score1}</p>
            <p className="text-[10px] text-[rgba(195,198,215,0.4)] mt-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.overs1} OVS</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-[16px] font-bold text-[rgba(195,198,215,0.2)]" style={{ fontFamily: "'Epilogue',sans-serif" }}>VS</p>
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span className="text-[9px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.team1Code} {winSplit.a}%</span>
                <span className="text-[9px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{winSplit.b}% {match.team2Code}</span>
              </div>
              <div className="h-2 bg-[rgba(180,197,255,0.1)] overflow-hidden flex">
                <div className="h-full bg-[#2563eb]" style={{ width: `${winSplit.a}%` }} />
                <div className="h-full bg-[rgba(180,197,255,0.3)] flex-1" />
              </div>
            </div>
            <p className="text-[10px] text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.aiPrediction}</p>
          </div>

          <div className="text-right">
            <p className="text-[11px] text-[rgba(195,198,215,0.4)] mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.team2}</p>
            <p className="text-[32px] sm:text-[48px] font-black tracking-[-2px] text-[#b4c5ff] leading-none" style={{ fontFamily: "'Epilogue',sans-serif" }}>{match.score2}</p>
            <p className="text-[10px] text-[rgba(195,198,215,0.4)] mt-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{match.overs2} OVS</p>
          </div>
        </div>
      </div>

      <MatchCharts />
    </div>
  );
}

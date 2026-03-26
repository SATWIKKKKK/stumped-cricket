"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import type { MatchItem } from "@/lib/server/types";

function deriveDateLabel(index: number) {
  if (index === 0) return "TODAY";
  if (index === 1) return "NEXT";
  return `BATCH ${index + 1}`;
}

export default function SchedulePage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const response = await fetch("/api/matches", { cache: "no-store" });
      const payload = (await response.json()) as { data?: MatchItem[] };
      if (!ignore) {
        setMatches(payload.data ?? []);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const chunks: MatchItem[][] = [];
    for (let i = 0; i < matches.length; i += 3) {
      chunks.push(matches.slice(i, i + 3));
    }
    return chunks;
  }, [matches]);

  const statusCfg: Record<string, { bg: string; text: string }> = {
    LIVE: { bg: "bg-[#2563eb]", text: "text-white" },
    UPCOMING: { bg: "bg-[#353535]", text: "text-[rgba(226,226,226,0.6)]" },
    COMPLETED: { bg: "bg-[rgba(67,70,85,0.3)]", text: "text-[rgba(195,198,215,0.5)]" },
  };

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1280px]">
      <div className="border-l-4 border-[#b4c5ff] pl-7 flex flex-col gap-2">
        <h1 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          FIXTURE GRID
        </h1>
      </div>

      <div className="flex flex-col gap-10">
        {grouped.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#b4c5ff]" />
                <span className="text-[12px] font-bold tracking-[2px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {deriveDateLabel(idx)}
                </span>
              </div>
              <div className="flex-1 h-px bg-[rgba(67,70,85,0.2)]" />
            </div>

            <div className="flex flex-col gap-3">
              {group.map((match) => {
                const sc = statusCfg[match.status] ?? statusCfg.UPCOMING;
                return (
                  <Link
                    key={match.id}
                    href={`/dashboard/matches/${match.id}`}
                    className="bg-[#1b1b1b] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border border-[rgba(67,70,85,0.1)]"
                  >
                    <div className={`sm:flex ${sc.bg} ${sc.text} px-2 py-1 shrink-0 items-center justify-center w-24`}>
                      <span className="text-[9px] font-bold uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{match.status}</span>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[15px] sm:text-[18px] font-black uppercase text-[#e2e2e2] tracking-[-0.5px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                          {match.team1Code}
                        </span>
                        <span className="text-[11px] text-[rgba(195,198,215,0.2)]" style={{ fontFamily: "'Epilogue', sans-serif" }}>vs</span>
                        <span className="text-[15px] sm:text-[18px] font-black uppercase text-[#e2e2e2] tracking-[-0.5px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                          {match.team2Code}
                        </span>
                        <div className="px-2 py-0.5 text-[8px] font-bold uppercase bg-[rgba(37,99,235,0.2)] text-[#b4c5ff]">
                          {match.format}
                        </div>
                      </div>
                      <span className="text-[10px] text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {match.venue}
                      </span>
                    </div>

                    <div className="flex items-center gap-5 shrink-0">
                      <div>
                        <p className="text-[9px] text-[rgba(195,198,215,0.3)] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI PRED</p>
                        <p className="text-[12px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{match.aiPrediction}</p>
                      </div>
                      <ArrowRight size={14} className="text-[rgba(226,226,226,0.2)]" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

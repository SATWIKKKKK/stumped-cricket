"use client";

import { useEffect, useMemo, useState } from "react";
import { Trophy } from "lucide-react";
import type { RankingItem } from "@/lib/server/types";

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankingItem[]>([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const response = await fetch("/api/rankings", { cache: "no-store" });
      const payload = (await response.json()) as { data?: RankingItem[] };
      if (!ignore) {
        setRankings(payload.data ?? []);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const top = useMemo(() => rankings.slice(0, 3), [rankings]);

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1280px]">
      <div className="border-l-4 border-[#b4c5ff] pl-7 flex flex-col gap-2">
        <h1 className="text-[60px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[60px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          WORLD RANKINGS
        </h1>
        <span className="text-[12px] tracking-[3.6px] uppercase text-[rgba(226,226,226,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          ICC Rankings // AI-Verified Intelligence
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {top.map((r, i) => (
          <div key={r.id} className={`bg-[#1b1b1b] p-6 flex flex-col gap-4 relative overflow-hidden ${i === 0 ? "border-t-2 border-[#b4c5ff]" : "border-t border-[rgba(67,70,85,0.3)]"}`}>
            <div className="flex items-center gap-2">
              {i === 0 && <Trophy size={14} className="text-[#b4c5ff]" />}
              <span className="text-[10px] font-bold tracking-[1.2px] text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                TOP {i + 1}
              </span>
            </div>
            <h3 className="text-[24px] font-black uppercase text-[#e2e2e2] tracking-[-1px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>{r.player}</h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r.country}</span>
              <div className="bg-[#353535] px-2 py-0.5">
                <span className="text-[9px] font-bold uppercase text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r.format}</span>
              </div>
            </div>
            <p className="text-[32px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r.rating}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1b1b1b] p-6">
        <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[rgba(67,70,85,0.2)]">
          {["RNK", "PLAYER", "COUNTRY", "FORMAT", "TYPE", "RATING"].map((h) => (
            <span key={h} className="text-[9px] font-bold uppercase text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{h}</span>
          ))}
        </div>
        {rankings.map((r, idx) => (
          <div key={r.id} className="grid grid-cols-6 gap-3 py-3 border-b border-[rgba(67,70,85,0.1)] items-center">
            <span className="text-[14px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>#{idx + 1}</span>
            <span className="text-[13px] font-bold uppercase text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>{r.player}</span>
            <span className="text-[10px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r.country}</span>
            <span className="text-[10px] text-[rgba(195,198,215,0.6)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r.format}</span>
            <span className="text-[10px] text-[rgba(195,198,215,0.6)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r.type}</span>
            <span className="text-[12px] text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

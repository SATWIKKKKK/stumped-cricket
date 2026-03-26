"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Trophy } from "lucide-react";
import type { Player } from "@/lib/server/types";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const response = await fetch("/api/players", { cache: "no-store" });
      const payload = (await response.json()) as { data?: Player[] };
      if (!ignore) {
        setPlayers(payload.data ?? []);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const leaderboard = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players]);
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1280px]">
      <div className="border-l-4 border-[#b4c5ff] pl-7 flex flex-col gap-2">
        <h1 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          INTEL LEADERBOARD
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {top3.map((player, idx) => (
          <Link key={player.id} href={`/dashboard/players/${player.id}`} className={`bg-[#1b1b1b] p-6 flex flex-col gap-4 relative overflow-hidden ${idx === 0 ? "border-t-2 border-[#b4c5ff]" : "border-t border-[rgba(67,70,85,0.3)]"}`}>
            <div className="flex items-center gap-2">
              {idx === 0 && <Trophy size={14} className="text-[#b4c5ff]" />}
              <span className="text-[11px] font-bold tracking-[1.2px] text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                #{idx + 1} OVERALL
              </span>
            </div>
            <h3 className="text-[20px] sm:text-[24px] font-black uppercase text-[#e2e2e2] tracking-[-1px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              {player.name}
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] text-[rgba(195,198,215,0.5)]">{player.team} · {player.country}</span>
              <div className="px-2 py-0.5 text-[8px] font-bold uppercase bg-[rgba(37,99,235,0.2)] text-[#b4c5ff]">
                {player.role}
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-[36px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{player.score}</span>
              <span className="text-[10px] text-[rgba(195,198,215,0.4)] pb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI POINTS</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-[#1b1b1b] p-5 sm:p-6">
        <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[rgba(67,70,85,0.2)]">
          {["RNK", "PLAYER", "TEAM", "ROLE", "SCORE", ""].map((h) => (
            <span key={h} className="text-[9px] font-bold uppercase text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{h}</span>
          ))}
        </div>
        <div className="flex flex-col">
          {leaderboard.map((player, index) => (
            <Link key={player.id} href={`/dashboard/players/${player.id}`} className="grid grid-cols-6 gap-3 py-3 border-b border-[rgba(67,70,85,0.1)] items-center group">
              <span className="text-[14px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{index + 1}</span>
              <span className="text-[13px] font-bold uppercase text-[#e2e2e2] group-hover:text-[#b4c5ff]" style={{ fontFamily: "'Epilogue', sans-serif" }}>{player.name}</span>
              <span className="text-[11px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{player.team}</span>
              <span className="text-[11px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{player.role}</span>
              <span className="text-[14px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{player.score}</span>
              <ArrowRight size={12} className="text-[rgba(226,226,226,0.2)] group-hover:text-[#b4c5ff]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

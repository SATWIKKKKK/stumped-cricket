"use client";

import { useEffect, useMemo, useState } from "react";
import type { Player } from "@/lib/server/types";

export default function FantasyPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const response = await fetch("/api/players", { cache: "no-store" });
      const payload = (await response.json()) as { data?: Player[] };
      if (!ignore) setPlayers(payload.data ?? []);
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const squad = useMemo(() => [...players].sort((a, b) => b.score - a.score).slice(0, 11), [players]);
  const totalScore = useMemo(() => squad.reduce((sum, p) => sum + p.score, 0), [squad]);

  return (
    <div className="p-8 max-w-[1280px] flex flex-col gap-8">
      <div className="border-l-4 border-[#b4c5ff] pl-7 flex flex-col gap-2">
        <h1 className="text-[60px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[60px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          FANTASY OPTIMIZER
        </h1>
        <span className="text-[12px] tracking-[3.6px] uppercase text-[rgba(226,226,226,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          AI Selected XI // Total Score {totalScore}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {squad.map((p) => (
          <div key={p.id} className="bg-[#1b1b1b] p-5 border border-[rgba(67,70,85,0.2)]">
            <p className="text-[10px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.role}</p>
            <p className="text-[16px] font-black uppercase text-[#e2e2e2] mt-1" style={{ fontFamily: "'Epilogue', sans-serif" }}>{p.name}</p>
            <p className="text-[10px] text-[rgba(195,198,215,0.5)] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.team} · {p.country}</p>
            <p className="text-[20px] font-bold text-[#b4c5ff] mt-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

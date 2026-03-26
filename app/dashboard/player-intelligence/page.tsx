"use client";

import { useEffect, useMemo, useState } from "react";
import type { Player } from "@/lib/server/types";

export default function PlayerIntelligencePage() {
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

  const top = useMemo(() => [...players].sort((a, b) => b.score - a.score).slice(0, 10), [players]);

  return (
    <div className="p-8 max-w-[1280px] flex flex-col gap-8">
      <div className="border-l-4 border-[#b4c5ff] pl-7">
        <h1 className="text-[60px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[60px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          PLAYER INTELLIGENCE
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {top.map((p) => (
          <div key={p.id} className="bg-[#1b1b1b] p-6 border border-[rgba(67,70,85,0.2)]">
            <p className="text-[10px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.role} · {p.tier}</p>
            <h3 className="text-[22px] font-black uppercase text-[#e2e2e2] mt-2" style={{ fontFamily: "'Epilogue', sans-serif" }}>{p.name}</h3>
            <p className="text-[12px] text-[rgba(195,198,215,0.6)] mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.team} · {p.country}</p>
            <div className="mt-3 h-1.5 bg-[#353535] overflow-hidden">
              <div className="h-full bg-[#2563eb]" style={{ width: `${p.score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

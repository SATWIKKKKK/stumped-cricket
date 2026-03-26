"use client";

import { useEffect, useMemo, useState } from "react";
import type { MatchItem } from "@/lib/server/types";

export default function HeadToHeadPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const response = await fetch("/api/matches", { cache: "no-store" });
      const payload = (await response.json()) as { data?: MatchItem[] };
      if (!ignore) setMatches(payload.data ?? []);
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const pairs = useMemo(() => matches.slice(0, 8), [matches]);

  return (
    <div className="p-8 max-w-[1280px] flex flex-col gap-8">
      <div className="border-l-4 border-[#b4c5ff] pl-7">
        <h1 className="text-[60px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[60px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          HEAD TO HEAD
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {pairs.map((m) => (
          <div key={m.id} className="bg-[#1b1b1b] p-6 border border-[rgba(67,70,85,0.2)]">
            <p className="text-[10px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.tournament}</p>
            <h3 className="text-[22px] font-black uppercase text-[#e2e2e2] mt-2" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              {m.team1Code} vs {m.team2Code}
            </h3>
            <p className="text-[12px] text-[rgba(195,198,215,0.6)] mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.result}</p>
            <p className="text-[12px] text-[#b4c5ff] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.aiPrediction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

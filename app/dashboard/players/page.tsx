"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Player } from "@/lib/server/types";

const roleColors: Record<string, string> = {
  BAT: "bg-[rgba(37,99,235,0.2)] text-[#b4c5ff]",
  BOWL: "bg-[rgba(255,69,58,0.15)] text-[#ff6b6b]",
  WK: "bg-[rgba(180,197,255,0.15)] text-[#b4c5ff]",
  SPIN: "bg-[rgba(37,99,235,0.2)] text-[#b4c5ff]",
  ALL: "bg-[rgba(52,199,89,0.15)] text-[#34c759]",
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState("ALL");

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

  const filtered = useMemo(() => {
    if (filter === "ALL") return players;
    if (filter === "ALL-ROUND") return players.filter((p) => p.role === "ALL");
    return players.filter((p) => p.role === filter);
  }, [filter, players]);

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6 sm:gap-8 max-w-[1280px]">
      <div className="border-l-4 border-[#b4c5ff] pl-5 sm:pl-7 flex flex-col gap-2">
        <h1 className="text-[clamp(32px,6vw,60px)] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          PLAYER SENSORS
        </h1>
        <span className="text-[11px] sm:text-[12px] tracking-[3px] sm:tracking-[3.6px] uppercase text-[rgba(226,226,226,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          AI Intelligence Profiles // {players.length} Assets Tracked
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {["ALL", "BAT", "BOWL", "WK", "ALL-ROUND", "SPIN"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] font-bold tracking-[1.2px] uppercase transition-colors ${
              f === filter ? "bg-[#2563eb] text-white" : "bg-[#1b1b1b] text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] border border-[rgba(67,70,85,0.2)]"
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((player) => (
          <Link
            key={player.id}
            href={`/dashboard/players/${player.id}`}
            className="bg-[#1b1b1b] p-5 sm:p-6 flex flex-col gap-4 hover:bg-[#2a2a2a] transition-colors group border border-[rgba(67,70,85,0.1)] hover:border-[rgba(180,197,255,0.2)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] sm:text-[18px] font-black tracking-[-0.8px] uppercase text-[#e2e2e2] group-hover:text-[#b4c5ff] transition-colors leading-tight" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  {player.name}
                </h3>
                <p className="text-[10px] text-[rgba(195,198,215,0.4)] mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {player.team} · {player.country}
                </p>
              </div>
              <div className={`px-2 py-0.5 shrink-0 text-[8px] font-bold uppercase ${roleColors[player.role] ?? ""}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {player.role}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#353535] p-2.5">
                <p className="text-[8px] text-[rgba(195,198,215,0.5)] uppercase tracking-[1px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>RANKING</p>
                <p className="text-[13px] sm:text-[14px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{player.ranking}</p>
              </div>
              <div className="bg-[#353535] p-2.5">
                <p className="text-[8px] text-[rgba(195,198,215,0.5)] uppercase tracking-[1px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>STATUS</p>
                <p className="text-[13px] sm:text-[14px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{player.status}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-[rgba(195,198,215,0.4)] uppercase tracking-[1px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>INTEL SCORE</span>
                <span className="text-[10px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{player.score}/100</span>
              </div>
              <div className="h-1.5 bg-[#353535] w-full overflow-hidden">
                <div className="h-full bg-[#2563eb]" style={{ width: `${player.score}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[rgba(67,70,85,0.1)]">
              <span className="text-[9px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TIER: {player.tier}</span>
              <ArrowRight size={12} className="text-[rgba(226,226,226,0.2)] group-hover:text-[#b4c5ff] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

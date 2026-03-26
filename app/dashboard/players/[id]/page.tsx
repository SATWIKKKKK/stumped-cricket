"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";
import PlayerCharts from "@/components/charts/PlayerCharts";
import type { Player } from "@/lib/server/types";

function makeDna(player: Player) {
  const base = Math.max(40, Math.min(99, player.score));
  return [
    { label: "FORM INDEX", value: base },
    { label: "PRESSURE RESILIENCE", value: Math.max(35, base - 4) },
    { label: "TACTICAL IMPACT", value: Math.max(30, base - 8) },
    { label: "CLUTCH PROBABILITY", value: Math.max(30, base - 2) },
  ];
}

export default function PlayerDetailPage() {
  const params = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const response = await fetch(`/api/players/${params.id}`, { cache: "no-store" });
      const payload = (await response.json()) as { data?: Player };
      if (!ignore) {
        setPlayer(payload.data ?? null);
      }
    }

    if (params.id) {
      load();
    }

    return () => {
      ignore = true;
    };
  }, [params.id]);

  const dna = useMemo(() => (player ? makeDna(player) : []), [player]);

  if (!player) {
    return <div className="p-8 text-[12px] uppercase text-[rgba(195,198,215,0.6)]">Loading player profile...</div>;
  }

  const recentForm = [
    String(Math.max(0, player.score - 18)),
    String(Math.max(0, player.score - 29)),
    String(Math.max(0, player.score - 41)),
    String(Math.max(0, player.score - 7)),
    String(Math.max(0, player.score - 23)),
    String(Math.max(0, player.score - 14)),
  ];
  const stats = [
    { label: "INTEL SCORE", value: String(player.score) },
    { label: "RANKING", value: player.ranking },
    { label: "ROLE", value: player.role },
    { label: "STATUS", value: player.status },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-8">
      <div className="px-4 sm:px-10 pt-6 sm:pt-8">
        <Link href="/dashboard/players" className="flex items-center gap-2 text-[rgba(195,198,215,0.4)] hover:text-[#b4c5ff] transition-colors group w-fit">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-[1.2px] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            BACK TO SENSORS
          </span>
        </Link>
      </div>

      <div className="mx-4 sm:mx-8 bg-[#1b1b1b] px-6 sm:px-12 py-8 sm:py-12 flex flex-col gap-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-0.5 w-8 bg-[#b4c5ff]" />
          <span className="text-[11px] font-bold tracking-[3.6px] text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ELITE ASSET
          </span>
        </div>

        <h1 className="text-[clamp(36px,7vw,80px)] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          {player.name}
        </h1>

        <div className="bg-[#e2e2e2] px-3 py-1 self-start">
          <span className="text-[12px] font-bold tracking-[1.4px] text-[#131313]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            PLAYER ID: {player.id}
          </span>
        </div>

        <div className="text-[11px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {player.team} · {player.country}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#353535] p-4">
            <p className="text-[10px] text-[rgba(195,198,215,0.6)] tracking-[1px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>RANKING</p>
            <p className="text-[20px] sm:text-[24px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{player.ranking}</p>
          </div>
          <div className="bg-[#353535] p-4">
            <p className="text-[10px] text-[rgba(195,198,215,0.6)] tracking-[1px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>STATUS</p>
            <p className="text-[20px] sm:text-[24px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{player.status}</p>
          </div>
        </div>
      </div>

      <div className="mx-4 sm:mx-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        <div className="bg-[#1b1b1b] p-6 sm:p-8 flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#b4c5ff]" />
            <span className="text-[11px] sm:text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              PLAYER DNA
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {dna.map((metric) => (
              <div key={metric.label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[1px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {metric.label}
                  </span>
                  <span className="text-[10px] tracking-[1px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {metric.value}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#353535] overflow-hidden">
                  <div className="h-full bg-[#2563eb]" style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 bg-[#1b1b1b] p-6 sm:p-8 flex flex-col gap-5 sm:gap-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#b4c5ff]" />
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                SCORING DENSITY
              </span>
            </div>
            <Zap size={16} className="text-[#b4c5ff]" />
          </div>
          <PlayerCharts recentForm={recentForm} stats={stats} dna={dna} />
        </div>
      </div>
    </div>
  );
}

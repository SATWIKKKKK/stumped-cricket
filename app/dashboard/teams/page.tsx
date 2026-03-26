"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { TeamItem } from "@/lib/server/types";

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    let ignore = false;

    async function load() {
      const response = await fetch("/api/teams", { cache: "no-store" });
      const payload = (await response.json()) as { data?: TeamItem[] };
      if (!ignore) {
        setTeams(payload.data ?? []);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const visible = useMemo(() => {
    if (filter === "ALL") return teams;
    return teams.filter((t) => t.league.toUpperCase().includes(filter));
  }, [teams, filter]);

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1280px]">
      <div className="border-l-4 border-[#b4c5ff] pl-7 flex flex-col gap-2">
        <h1 className="text-[60px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[60px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          TEAM SQUADS
        </h1>
        <span className="text-[12px] tracking-[3.6px] uppercase text-[rgba(226,226,226,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Squad Intelligence // {teams.length} Teams Tracked
        </span>
      </div>

      <div className="flex gap-3">
        {["ALL", "IPL", "INTL"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 text-[11px] font-bold tracking-[1.2px] uppercase transition-colors ${f === filter ? "bg-[#2563eb] text-white" : "bg-[#1b1b1b] text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] border border-[rgba(67,70,85,0.2)]"}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {visible.map((team) => (
          <div key={team.id} className="bg-[#1b1b1b] p-6 flex flex-col gap-5 border border-[rgba(67,70,85,0.1)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 flex items-center justify-center text-[16px] font-black text-white mb-3 bg-[#2563eb]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  {team.code.slice(0, 2)}
                </div>
                <h3 className="text-[16px] font-black uppercase text-[#e2e2e2] tracking-[-0.5px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  {team.name}
                </h3>
                <p className="text-[10px] text-[rgba(195,198,215,0.4)] mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{team.league} · {team.country}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[20px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{team.ranking}</span>
                <span className="text-[9px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>RANKING</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#353535] p-3 text-center">
                <p className="text-[18px] font-bold text-[#34c759]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{team.wins}</p>
                <p className="text-[8px] uppercase text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>WINS</p>
              </div>
              <div className="bg-[#353535] p-3 text-center">
                <p className="text-[18px] font-bold text-[#ff453a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{team.losses}</p>
                <p className="text-[8px] uppercase text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LOSSES</p>
              </div>
              <div className="bg-[#353535] p-3 text-center">
                <p className={`text-[14px] font-bold ${team.nrr.startsWith("+") ? "text-[#34c759]" : "text-[#ff453a]"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{team.nrr}</p>
                <p className="text-[8px] uppercase text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>NRR</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[rgba(67,70,85,0.1)] pt-3">
              <div>
                <p className="text-[9px] text-[rgba(195,198,215,0.3)] uppercase mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CAPTAIN</p>
                <p className="text-[11px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>{team.captain}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{team.players} players</span>
                <ArrowRight size={12} className="text-[rgba(226,226,226,0.3)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

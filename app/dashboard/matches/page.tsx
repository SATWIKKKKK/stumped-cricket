"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";

type Match = {
  id: string;
  status: "LIVE" | "UPCOMING" | "COMPLETED";
  tournament: string;
  format: string;
  team1: string;
  team1Code: string;
  score1: string;
  overs1: string;
  team2: string;
  team2Code: string;
  score2: string;
  overs2: string;
  venue: string;
  result: string;
  aiPrediction: string;
};

const filters = ["ALL", "T20", "ODI", "TEST", "T20I"] as const;

const statusConfig: Record<Match["status"], { color: string; bg: string; label: string }> = {
  LIVE: { color: "text-white", bg: "bg-[#2563eb]", label: "LIVE" },
  UPCOMING: { color: "text-[#e2e2e2]", bg: "bg-[#353535]", label: "UPCOMING" },
  COMPLETED: { color: "text-[rgba(195,198,215,0.6)]", bg: "bg-[rgba(67,70,85,0.3)]", label: "COMPLETED" },
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadMatches() {
      try {
        const response = await fetch("/api/matches", { cache: "no-store" });
        const payload = (await response.json()) as { data?: Match[] };
        if (!ignore) {
          setMatches(payload.data ?? []);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMatches();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredMatches = useMemo(() => {
    if (activeFilter === "ALL") return matches;
    return matches.filter((m) => m.format.toUpperCase() === activeFilter);
  }, [activeFilter, matches]);

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1280px]">
      {/* Header */}
      <div className="border-l-4 border-[#b4c5ff] pl-7 flex flex-col gap-2">
        <h1
          className="text-[60px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[60px]"
          style={{ fontFamily: "'Epilogue', sans-serif" }}
        >
          SCORECARD GRID
        </h1>
        <div className="flex items-center gap-4">
          <span
            className="text-[12px] tracking-[3.6px] uppercase text-[rgba(226,226,226,0.4)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {`AI Match Analysis // All Formats`}
          </span>
          <div className="flex-1 h-px bg-[rgba(67,70,85,0.2)]" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2563eb] status-live" />
            <span className="text-[10px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {matches.filter((m) => m.status === "LIVE").length} LIVE NOW
            </span>
          </div>
        </div>
      </div>

      {/* Format filter */}
      <div className="flex gap-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2 text-[11px] font-bold tracking-[1.2px] uppercase transition-colors ${
              f === activeFilter
                ? "bg-[#2563eb] text-white"
                : "bg-[#1b1b1b] text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2] border border-[rgba(67,70,85,0.2)]"
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Matches list */}
      <div className="flex flex-col gap-4">
        {loading && (
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-6 text-[12px] text-[rgba(195,198,215,0.6)] uppercase tracking-[1px]">
            Loading match data...
          </div>
        )}

        {!loading && filteredMatches.length === 0 && (
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-6 text-[12px] text-[rgba(195,198,215,0.6)] uppercase tracking-[1px]">
            No matches found for this filter.
          </div>
        )}

        {filteredMatches.map((match) => {
          const cfg = statusConfig[match.status] ?? statusConfig.COMPLETED;
          return (
            <Link
              key={match.id}
              href={`/dashboard/matches/${match.id}`}
              className="bg-[#1b1b1b] p-6 flex items-center justify-between gap-6 hover:bg-[#2a2a2a] transition-colors group border border-[rgba(67,70,85,0.1)] hover:border-[rgba(180,197,255,0.2)]"
            >
              {/* Left: teams & score */}
              <div className="flex-1 flex flex-col gap-3">
                {/* Tournament + format + status */}
                <div className="flex items-center gap-3">
                  <div className={`${cfg.bg} px-2 py-0.5 flex items-center gap-1`}>
                    {match.status === "LIVE" && <Radio size={8} className="text-white" />}
                    <span className={`text-[9px] font-bold uppercase ${cfg.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {cfg.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {match.tournament}
                  </span>
                  <div className="bg-[rgba(67,70,85,0.3)] px-2 py-0.5">
                    <span className="text-[9px] font-bold uppercase text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {match.format || "UNKNOWN"}
                    </span>
                  </div>
                </div>

                {/* Teams vs scores */}
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <p className="text-[18px] font-black uppercase text-[#e2e2e2] tracking-[-0.5px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                      {match.team1Code}
                    </p>
                    <p className="text-[10px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {match.team1}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[20px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {match.score1}
                    </p>
                    {match.overs1 !== "-" && (
                      <p className="text-[9px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {match.overs1} OVS
                      </p>
                    )}
                  </div>
                  <div className="w-8 h-px bg-[rgba(67,70,85,0.3)] relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1b1b1b] px-1 text-[10px] text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                      VS
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[20px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {match.score2}
                    </p>
                    {match.overs2 !== "-" && (
                      <p className="text-[9px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {match.overs2} OVS
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[18px] font-black uppercase text-[#e2e2e2] tracking-[-0.5px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                      {match.team2Code}
                    </p>
                    <p className="text-[10px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {match.team2}
                    </p>
                  </div>
                </div>

                {/* Venue + result */}
                <div className="flex items-center gap-4">
                  <p className="text-[10px] text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {match.venue}
                  </p>
                  <div className="w-px h-3 bg-[rgba(67,70,85,0.3)]" />
                  <p className="text-[10px] text-[#b4c5ff] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {match.result}
                  </p>
                </div>
              </div>

              {/* Right: AI prediction + arrow */}
              <div className="flex items-center gap-6 shrink-0">
                <div className="flex flex-col items-end">
                  <p className="text-[9px] text-[rgba(195,198,215,0.3)] uppercase tracking-[1px] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    AI PREDICTION
                  </p>
                  <p className="text-[14px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {match.aiPrediction}
                  </p>
                </div>
                <ArrowRight size={16} className="text-[rgba(226,226,226,0.3)] group-hover:text-[#b4c5ff] transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

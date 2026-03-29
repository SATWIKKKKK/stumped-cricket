"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Zap } from "lucide-react";
import { ALL_CRICKET_TEAMS, type CricketTeam } from "@/lib/data/cricket-teams";

type Props = {
  onSubmit: (team1Code: string, team2Code: string) => void;
  loading?: boolean;
};

const LEAGUES = [...new Set(ALL_CRICKET_TEAMS.map((t) => t.league))];

export default function TeamSelector({ onSubmit, loading }: Props) {
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  const [team1, setTeam1] = useState<CricketTeam | null>(null);
  const [team2, setTeam2] = useState<CricketTeam | null>(null);
  const [focus1, setFocus1] = useState(false);
  const [focus2, setFocus2] = useState(false);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  const filterTeams = useCallback((query: string, exclude?: CricketTeam | null) => {
    if (!query.trim()) return ALL_CRICKET_TEAMS.filter((t) => t !== exclude).slice(0, 20);
    const q = query.toLowerCase();
    return ALL_CRICKET_TEAMS
      .filter((t) => t !== exclude)
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.league.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q)
      )
      .slice(0, 15);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref1.current && !ref1.current.contains(e.target as Node)) setFocus1(false);
      if (ref2.current && !ref2.current.contains(e.target as Node)) setFocus2(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const results1 = filterTeams(query1, team2);
  const results2 = filterTeams(query2, team1);

  const selectTeam1 = (t: CricketTeam) => {
    setTeam1(t);
    setQuery1(t.name);
    setFocus1(false);
  };

  const selectTeam2 = (t: CricketTeam) => {
    setTeam2(t);
    setQuery2(t.name);
    setFocus2(false);
  };

  const clearTeam1 = () => {
    setTeam1(null);
    setQuery1("");
  };

  const clearTeam2 = () => {
    setTeam2(null);
    setQuery2("");
  };

  const handleSubmit = () => {
    if (team1 && team2) onSubmit(team1.code, team2.code);
  };

  const fontSG = { fontFamily: "'Space Grotesk', sans-serif" };
  const fontEP = { fontFamily: "'Epilogue', sans-serif" };

  return (
    <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-5 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-[#2563eb]" />
        <h2
          className="text-[12px] sm:text-[14px] font-black tracking-[2.4px] uppercase text-[#e2e2e2]"
          style={fontEP}
        >
          MATCHUP SELECTOR
        </h2>
        <div className="flex-1 h-px bg-[rgba(67,70,85,0.2)]" />
        <span
          className="text-[9px] tracking-[1px] uppercase text-[rgba(195,198,215,0.4)]"
          style={fontSG}
        >
          {ALL_CRICKET_TEAMS.length} TEAMS · {LEAGUES.length} LEAGUES
        </span>
      </div>

      {/* Inputs row */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        {/* Team 1 input */}
        <div className="flex-1 relative" ref={ref1}>
          <label
            className="text-[9px] font-bold tracking-[1.6px] uppercase text-[rgba(195,198,215,0.5)] mb-2 block"
            style={fontSG}
          >
            TEAM 1
          </label>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(195,198,215,0.3)]"
            />
            <input
              type="text"
              value={query1}
              onChange={(e) => {
                setQuery1(e.target.value);
                if (team1) setTeam1(null);
              }}
              onFocus={() => setFocus1(true)}
              placeholder="Search team, league, or country..."
              className="w-full bg-[#0e0e0e] border border-[rgba(67,70,85,0.3)] text-[12px] text-[#e2e2e2] pl-9 pr-9 py-3 outline-none focus:border-[#2563eb] transition-colors placeholder-[#6b7280]"
              style={fontSG}
            />
            {team1 && (
              <button
                onClick={clearTeam1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(195,198,215,0.4)] hover:text-[#e2e2e2]"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {/* Selected badge */}
          {team1 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="bg-[#2563eb] px-3 py-1">
                <span className="text-[10px] font-bold text-white tracking-[0.8px]" style={fontSG}>
                  {team1.code}
                </span>
              </div>
              <span className="text-[9px] text-[rgba(195,198,215,0.5)] tracking-[0.5px]" style={fontSG}>
                {team1.league}
              </span>
            </div>
          )}
          {/* Dropdown */}
          {focus1 && !team1 && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#0e0e0e] border border-[rgba(67,70,85,0.3)] max-h-[280px] overflow-y-auto">
              {results1.length === 0 && (
                <div className="px-4 py-3 text-[10px] text-[rgba(195,198,215,0.4)]" style={fontSG}>
                  No teams found
                </div>
              )}
              {results1.map((t) => (
                <button
                  key={t.code}
                  onClick={() => selectTeam1(t)}
                  className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-[rgba(37,99,235,0.08)] transition-colors border-b border-[rgba(67,70,85,0.1)] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-[#b4c5ff] w-[44px]" style={fontSG}>
                      {t.code}
                    </span>
                    <span className="text-[11px] text-[#e2e2e2]" style={fontSG}>
                      {t.name}
                    </span>
                  </div>
                  <span className="text-[8px] text-[rgba(195,198,215,0.35)] tracking-[0.8px] uppercase" style={fontSG}>
                    {t.league}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* VS divider */}
        <div className="flex items-end justify-center pb-3">
          <span
            className="text-[14px] font-black text-[rgba(180,197,255,0.3)] tracking-[2px]"
            style={fontEP}
          >
            VS
          </span>
        </div>

        {/* Team 2 input */}
        <div className="flex-1 relative" ref={ref2}>
          <label
            className="text-[9px] font-bold tracking-[1.6px] uppercase text-[rgba(195,198,215,0.5)] mb-2 block"
            style={fontSG}
          >
            TEAM 2
          </label>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(195,198,215,0.3)]"
            />
            <input
              type="text"
              value={query2}
              onChange={(e) => {
                setQuery2(e.target.value);
                if (team2) setTeam2(null);
              }}
              onFocus={() => setFocus2(true)}
              placeholder="Search team, league, or country..."
              className="w-full bg-[#0e0e0e] border border-[rgba(67,70,85,0.3)] text-[12px] text-[#e2e2e2] pl-9 pr-9 py-3 outline-none focus:border-[#2563eb] transition-colors placeholder-[#6b7280]"
              style={fontSG}
            />
            {team2 && (
              <button
                onClick={clearTeam2}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(195,198,215,0.4)] hover:text-[#e2e2e2]"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {team2 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="bg-[#b4c5ff] px-3 py-1">
                <span className="text-[10px] font-bold text-[#131313] tracking-[0.8px]" style={fontSG}>
                  {team2.code}
                </span>
              </div>
              <span className="text-[9px] text-[rgba(195,198,215,0.5)] tracking-[0.5px]" style={fontSG}>
                {team2.league}
              </span>
            </div>
          )}
          {focus2 && !team2 && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#0e0e0e] border border-[rgba(67,70,85,0.3)] max-h-[280px] overflow-y-auto">
              {results2.length === 0 && (
                <div className="px-4 py-3 text-[10px] text-[rgba(195,198,215,0.4)]" style={fontSG}>
                  No teams found
                </div>
              )}
              {results2.map((t) => (
                <button
                  key={t.code}
                  onClick={() => selectTeam2(t)}
                  className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-[rgba(37,99,235,0.08)] transition-colors border-b border-[rgba(67,70,85,0.1)] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-[#b4c5ff] w-[44px]" style={fontSG}>
                      {t.code}
                    </span>
                    <span className="text-[11px] text-[#e2e2e2]" style={fontSG}>
                      {t.name}
                    </span>
                  </div>
                  <span className="text-[8px] text-[rgba(195,198,215,0.35)] tracking-[0.8px] uppercase" style={fontSG}>
                    {t.league}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="flex items-end">
          <button
            disabled={!team1 || !team2 || loading}
            onClick={handleSubmit}
            className={`px-6 py-3 flex items-center gap-2 transition-all tracking-[1.2px] uppercase text-[11px] font-bold ${
              team1 && team2
                ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8] cursor-pointer"
                : "bg-[rgba(37,99,235,0.15)] text-[rgba(180,197,255,0.4)] cursor-not-allowed"
            }`}
            style={fontSG}
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border border-white/30 border-t-white animate-spin" />
                LOADING
              </>
            ) : (
              <>
                <Zap size={13} />
                ANALYZE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

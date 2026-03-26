"use client";

import { useEffect, useMemo, useState } from "react";
import { Radio, Zap } from "lucide-react";

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

const ballByBall = [
  { over: "17.6", ball: ".", runs: 1, player: "Dhoni", bowler: "Bumrah", commentary: "Dhoni taps it to mid-on for a single. Clever cricket." },
  { over: "17.5", ball: "W", runs: 0, player: "Conway", bowler: "Bumrah", commentary: "WICKET! Conway lbw b Bumrah. Massive breakthrough! The crowd erupts." },
  { over: "17.4", ball: "4", runs: 4, player: "Conway", bowler: "Bumrah", commentary: "Conway drives through the covers for four! Magnificent shot." },
  { over: "17.3", ball: ".", runs: 0, player: "Conway", bowler: "Bumrah", commentary: "Defended back to the bowler. Tight delivery on off stump." },
  { over: "17.2", ball: "6", runs: 6, player: "Dhoni", bowler: "Bumrah", commentary: "DHONI pulls Bumrah over mid-wicket for SIX! Vintage helicopter shot." },
  { over: "17.1", ball: ".", runs: 1, player: "Dhoni", bowler: "Bumrah", commentary: "Pushed to short cover for a quick single. Dhoni stays on strike." },
  { over: "16.6", ball: ".", runs: 2, player: "Rayudu", bowler: "Malinga", commentary: "Worked to fine leg for two. CSK picking up the required rate." },
  { over: "16.5", ball: "W", runs: 0, player: "Rayudu", bowler: "Malinga", commentary: "WICKET! Rayudu c Rohit b Malinga. That's his 4th of the match!" },
];

const ballColor: Record<string, string> = {
  "W": "bg-[#ff453a] text-white",
  "6": "bg-[#2563eb] text-white",
  "4": "bg-[#b4c5ff] text-[#131313]",
  ".": "bg-[#353535] text-[rgba(226,226,226,0.5)]",
  "1": "bg-[#1b1b1b] text-[rgba(226,226,226,0.5)] border border-[rgba(67,70,85,0.3)]",
  "2": "bg-[#1b1b1b] text-[rgba(226,226,226,0.5)] border border-[rgba(67,70,85,0.3)]",
};

export default function LivePage() {
  const [activeTab, setActiveTab] = useState<"COMMENTARY" | "SCORECARD" | "AI ANALYSIS">("COMMENTARY");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatch, setLoadingMatch] = useState(true);

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
          setLoadingMatch(false);
        }
      }
    }

    loadMatches();
    const interval = setInterval(loadMatches, 30000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  const liveMatch = useMemo(() => {
    const direct = matches.find((m) => m.status === "LIVE");
    return direct ?? matches[0] ?? null;
  }, [matches]);

  const winSplit = useMemo(() => {
    if (!liveMatch?.aiPrediction) {
      return { a: 50, b: 50 };
    }

    const match = liveMatch.aiPrediction.match(/(\d{1,3})\s*%/);
    if (!match) {
      return { a: 50, b: 50 };
    }

    const a = Math.max(0, Math.min(100, Number(match[1])));
    return { a, b: 100 - a };
  }, [liveMatch]);

  if (loadingMatch && !liveMatch) {
    return (
      <div className="p-8">
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-6 text-[12px] text-[rgba(195,198,215,0.6)] uppercase tracking-[1px]">
          Loading live match data...
        </div>
      </div>
    );
  }

  if (!liveMatch) {
    return (
      <div className="p-8">
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-6 text-[12px] text-[rgba(195,198,215,0.6)] uppercase tracking-[1px]">
          No match data available yet. Run provider sync to load real matches.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1280px]">
      {/* Header */}
      <div className="border-l-4 border-[#2563eb] pl-7 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-[#2563eb] px-3 py-1 flex items-center gap-2">
            <Radio size={10} className="text-white" />
            <span className="text-[10px] font-bold text-white uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.status}</span>
          </div>
          <span className="text-[12px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {liveMatch.tournament} · {liveMatch.venue}
          </span>
        </div>
        <h1 className="text-[48px] font-black tracking-[-2.4px] uppercase text-[#e2e2e2] leading-[48px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          {liveMatch.team1Code} vs {liveMatch.team2Code}<br />
          <span className="text-[#2563eb]">LIVE MATCH</span>
        </h1>
      </div>

      {/* Live scoreboard */}
      <div className="bg-[#1b1b1b] p-8">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Team 1 */}
          <div className="col-span-4">
            <p className="text-[12px] text-[rgba(195,198,215,0.4)] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.team1}</p>
            <p className="text-[56px] font-black tracking-[-2.8px] text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>{liveMatch.score1}</p>
            <p className="text-[12px] text-[rgba(195,198,215,0.4)] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.overs1} OVERS</p>
          </div>

          {/* Middle info */}
          <div className="col-span-4 flex flex-col items-center gap-4">
            <div className="w-px h-16 bg-[rgba(67,70,85,0.3)]" />
            <div className="bg-[#0e0e0e] border border-[rgba(37,99,235,0.3)] px-6 py-3 flex flex-col items-center">
              <p className="text-[10px] tracking-[1px] uppercase text-[rgba(195,198,215,0.4)] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>NEED TO WIN</p>
              <p className="text-[18px] font-black text-[#b4c5ff]" style={{ fontFamily: "'Epilogue', sans-serif" }}>{liveMatch.result}</p>
              <p className="text-[10px] text-[rgba(195,198,215,0.3)] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.aiPrediction}</p>
            </div>
            {/* AI prediction */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.team1Code} WIN PROB</span>
                <span className="text-[9px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.team2Code} WIN PROB</span>
              </div>
              <div className="h-2 bg-[rgba(180,197,255,0.1)] overflow-hidden flex">
                <div className="h-full bg-[#2563eb]" style={{ width: `${winSplit.a}%` }} />
                <div className="h-full bg-[rgba(180,197,255,0.3)] flex-1" />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{winSplit.a}%</span>
                <span className="text-[10px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{winSplit.b}%</span>
              </div>
            </div>
          </div>

          {/* Team 2 */}
          <div className="col-span-4 text-right">
            <p className="text-[12px] text-[rgba(195,198,215,0.4)] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.team2}</p>
            <p className="text-[56px] font-black tracking-[-2.8px] text-[#b4c5ff] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>{liveMatch.score2}</p>
            <p className="text-[12px] text-[rgba(195,198,215,0.4)] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveMatch.overs2} OVERS</p>
          </div>
        </div>

        {/* Current over */}
        <div className="mt-6 pt-6 border-t border-[rgba(67,70,85,0.2)]">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[9px] uppercase text-[rgba(195,198,215,0.3)] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CURRENT OVER (17)</p>
              <div className="flex gap-1.5">
                {[".", "6", ".", "W", "4", "."].map((b, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 flex items-center justify-center text-[11px] font-black ${ballColor[b] ?? ballColor["."]}`}
                    style={{ fontFamily: "'Epilogue', sans-serif" }}
                  >
                    {b}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex gap-6">
              {[
                { label: "BATTING", name: "MS DHONI", stat: "52(38)" },
                { label: "BATTING", name: "AMBATI RAYUDU", stat: "OUT 28(19)" },
                { label: "BOWLING", name: "JASPRIT BUMRAH", stat: "3.3-0-28-3" },
              ].map((p) => (
                <div key={p.name} className="text-right">
                  <p className="text-[9px] uppercase text-[rgba(195,198,215,0.3)] mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.label}</p>
                  <p className="text-[12px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>{p.name}</p>
                  <p className="text-[10px] text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.stat}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {(["COMMENTARY", "SCORECARD", "AI ANALYSIS"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-[11px] font-bold tracking-[1.2px] uppercase transition-colors ${activeTab === tab ? "bg-[#2563eb] text-white" : "bg-[#1b1b1b] text-[rgba(226,226,226,0.4)] hover:text-[#e2e2e2]"}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ball by ball */}
      {activeTab === "COMMENTARY" && (
        <div className="bg-[#1b1b1b] p-6 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#2563eb] status-live" />
            <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              BALL BY BALL [LIVE]
            </span>
          </div>
          {ballByBall.map((b, i) => (
            <div key={i} className="flex items-start gap-4 py-3 border-b border-[rgba(67,70,85,0.1)] last:border-0">
              <span className="text-[10px] font-bold text-[#2563eb] w-10 shrink-0 mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {b.over}
              </span>
              <div
                className={`w-7 h-7 shrink-0 flex items-center justify-center text-[11px] font-black ${ballColor[b.ball] ?? ballColor["."]}`}
                style={{ fontFamily: "'Epilogue', sans-serif" }}
              >
                {b.ball}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-0.5">
                  <span className="text-[10px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{b.player}</span>
                  <span className="text-[9px] text-[rgba(195,198,215,0.3)]">v</span>
                  <span className="text-[10px] text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{b.bowler}</span>
                </div>
                <p className="text-[12px] text-[#c3c6d7] leading-5" style={{ fontFamily: "'Inter', sans-serif" }}>{b.commentary}</p>
              </div>
              <div className="shrink-0">
                <span className={`text-[12px] font-bold ${b.runs > 4 ? "text-[#2563eb]" : b.runs === 0 && b.ball === "W" ? "text-[#ff453a]" : "text-[rgba(195,198,215,0.5)]"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {b.runs > 0 ? `+${b.runs}` : b.ball === "W" ? "OUT" : "0"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Analysis tab */}
      {activeTab === "AI ANALYSIS" && (
        <div className="bg-[#1b1b1b] p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#b4c5ff]" />
            <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AI MATCH INTELLIGENCE
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "BATTING TRAJECTORY", body: "CSK's run rate has dropped below the required 18.40. With 15 balls left and 46 needed, the AI model gives them only a 22% chance of winning. Bumrah's yorkers are neutralizing attacking options.", confidence: "0.94" },
              { title: "BOWLING PATTERN", body: "Bumrah is operating at 91.2% effectiveness in the death overs tonight. His variations â€” the slower yorker and the bouncer sequence â€” are severely restricting the CSK lower order.", confidence: "0.89" },
              { title: "FIELDING ANALYSIS", body: "MI's field placement is optimized for right-hand batters. With Dhoni on strike, the deep mid-wicket is the primary boundary option. Fielders positioned at 40-yard circle on the off side.", confidence: "0.92" },
              { title: "MATCH PREDICTION", body: "Based on 10,000 simulated outcomes with identical match states, Mumbai Indians win 78% of scenarios. The next 5 balls are critical â€” any two boundaries will shift the equation significantly.", confidence: "0.97" },
            ].map((insight) => (
              <div key={insight.title} className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.2)] p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{insight.title}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CONF:</span>
                    <span className="text-[10px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{insight.confidence}</span>
                  </div>
                </div>
                <p className="text-[13px] text-[#c3c6d7] leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>{insight.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Globe, Trophy, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown,
  Star, Users, Activity, ChevronRight, Clock,
} from "lucide-react";
import type { MatchItem, Player, NewsItem } from "@/lib/server/types";

/* ---------- mock community data ---------- */
function buildLeaderboard() {
  const users = [
    { name: "CricketGuru99", accuracy: 87, streak: 12, rank: 1, badge: "ELITE" },
    { name: "BowlMasterX", accuracy: 82, streak: 8, rank: 2, badge: "PRO" },
    { name: "StumpedFan", accuracy: 79, streak: 6, rank: 3, badge: "PRO" },
    { name: "SixHitter42", accuracy: 76, streak: 5, rank: 4, badge: "RISING" },
    { name: "SpinWizard", accuracy: 74, streak: 4, rank: 5, badge: "RISING" },
    { name: "PaceDemon", accuracy: 71, streak: 3, rank: 6, badge: "RISING" },
    { name: "SlipCatcher", accuracy: 69, streak: 2, rank: 7, badge: "ACTIVE" },
    { name: "YorkerKing88", accuracy: 67, streak: 1, rank: 8, badge: "ACTIVE" },
  ];
  return users;
}

function buildCommFeed() {
  return [
    { id: 1, user: "CricketGuru99", avatar: "CG", content: "Bumrah's yorker accuracy in death overs is unmatched. 94% dot ball rate in last 3 matches.", time: "2m ago", likes: 24, replies: 5, tag: "ANALYSIS" },
    { id: 2, user: "BowlMasterX", avatar: "BM", content: "CSK middle order looking fragile. Expecting MI to dominate the powerplay.", time: "8m ago", likes: 18, replies: 3, tag: "PREDICTION" },
    { id: 3, user: "StumpedFan", avatar: "SF", content: "Historical data shows teams batting first at Wankhede win 62% of T20s. Worth factoring in.", time: "15m ago", likes: 32, replies: 8, tag: "STATS" },
    { id: 4, user: "SixHitter42", avatar: "SH", content: "Rohit Sharma averages 48.3 in IPL playoffs. Captain's knock incoming?", time: "22m ago", likes: 15, replies: 2, tag: "DISCUSSION" },
    { id: 5, user: "SpinWizard", avatar: "SW", content: "Pitch report suggests turn from over 12 onwards. Spinners will be key in middle overs.", time: "30m ago", likes: 21, replies: 4, tag: "PITCH" },
  ];
}

export default function CommunityPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const [mRes, pRes] = await Promise.all([
        fetch("/api/matches", { cache: "no-store" }),
        fetch("/api/players", { cache: "no-store" }),
      ]);
      const m = (await mRes.json()) as { data?: MatchItem[] };
      const p = (await pRes.json()) as { data?: Player[] };
      if (!ignore) {
        setMatches(m.data ?? []);
        setPlayers(p.data ?? []);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const leaderboard = useMemo(() => buildLeaderboard(), []);
  const feed = useMemo(() => buildCommFeed(), []);

  const predictions = useMemo(() => {
    return matches.slice(0, 4).map((m) => {
      const homeVotes = Math.floor(Math.random() * 60 + 30);
      const awayVotes = 100 - homeVotes;
      return {
        id: m.id,
        match: `${m.team1Code} vs ${m.team2Code}`,
        tournament: m.tournament,
        status: m.status,
        team1: m.team1Code,
        team2: m.team2Code,
        homeVotes,
        awayVotes,
        totalVotes: Math.floor(Math.random() * 500 + 200),
      };
    });
  }, [matches]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="border-l-4 border-[#b4c5ff] pl-6 sm:pl-7">
        <h1 className="text-[36px] sm:text-[52px] lg:text-[64px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          Community Hub
        </h1>
        <span className="text-[11px] tracking-[3px] uppercase text-[rgba(226,226,226,0.35)] mt-2 block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Predictions // Analysis // Discussion
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Leaderboard + Predictions */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Accuracy Leaderboard */}
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)]">
            <div className="px-5 py-3 border-b border-[rgba(67,70,85,0.15)] flex items-center gap-2">
              <Trophy size={14} className="text-[#b4c5ff]" />
              <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Prediction Leaderboard</span>
            </div>
            <div className="divide-y divide-[rgba(67,70,85,0.1)]">
              {leaderboard.map((user) => (
                <div key={user.rank} className="px-5 py-3 flex items-center gap-3 hover:bg-[rgba(37,99,235,0.04)] transition-colors">
                  <span className={`text-[14px] font-black w-6 text-center ${user.rank <= 3 ? "text-[#b4c5ff]" : "text-[rgba(195,198,215,0.3)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{user.rank}</span>
                  <div className="w-7 h-7 rounded-full bg-[rgba(37,99,235,0.15)] flex items-center justify-center text-[9px] font-bold text-[#2563eb]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#e2e2e2] truncate" style={{ fontFamily: "'Inter',sans-serif" }}>{user.name}</p>
                    <p className="text-[9px] text-[rgba(195,198,215,0.35)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{user.streak} streak</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{user.accuracy}%</p>
                    <span className={`text-[7px] font-bold tracking-[1px] uppercase px-1.5 py-0.5 ${user.badge === "ELITE" ? "bg-[rgba(37,99,235,0.15)] text-[#2563eb]" : user.badge === "PRO" ? "bg-[rgba(180,197,255,0.1)] text-[#b4c5ff]" : "bg-[rgba(67,70,85,0.2)] text-[rgba(195,198,215,0.4)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                      {user.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Predictions Queue */}
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)]">
            <div className="px-5 py-3 border-b border-[rgba(67,70,85,0.15)] flex items-center gap-2">
              <Activity size={14} className="text-[#2563eb]" />
              <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Live Predictions</span>
            </div>
            <div className="divide-y divide-[rgba(67,70,85,0.1)]">
              {predictions.map((pred) => (
                <div key={pred.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold text-[#e2e2e2] uppercase" style={{ fontFamily: "'Epilogue',sans-serif" }}>{pred.match}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 uppercase ${pred.status === "LIVE" ? "bg-[#2563eb] text-white" : "bg-[rgba(67,70,85,0.3)] text-[rgba(195,198,215,0.5)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                      {pred.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-bold text-[#2563eb] w-8" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{pred.team1}</span>
                    <div className="flex-1 h-2 bg-[rgba(67,70,85,0.2)] overflow-hidden flex">
                      <div className="h-full bg-[#2563eb] transition-all" style={{ width: `${pred.homeVotes}%` }} />
                      <div className="h-full bg-[rgba(180,197,255,0.3)] flex-1" />
                    </div>
                    <span className="text-[9px] font-bold text-[#b4c5ff] w-8 text-right" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{pred.team2}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#2563eb]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{pred.homeVotes}%</span>
                    <span className="text-[8px] text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{pred.totalVotes} votes</span>
                    <span className="text-[9px] text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{pred.awayVotes}%</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-1.5 bg-[rgba(37,99,235,0.1)] text-[#2563eb] text-[9px] font-bold uppercase tracking-[1px] hover:bg-[rgba(37,99,235,0.2)] transition-colors flex items-center justify-center gap-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                      <ThumbsUp size={10} /> {pred.team1}
                    </button>
                    <button className="flex-1 px-3 py-1.5 bg-[rgba(180,197,255,0.08)] text-[#b4c5ff] text-[9px] font-bold uppercase tracking-[1px] hover:bg-[rgba(180,197,255,0.15)] transition-colors flex items-center justify-center gap-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                      <ThumbsUp size={10} /> {pred.team2}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tactical Comm Feed */}
        <div className="lg:col-span-2">
          <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)]">
            <div className="px-5 py-3 border-b border-[rgba(67,70,85,0.15)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-[#b4c5ff]" />
                <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Tactical Comm Feed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
                <span className="text-[9px] text-[#34c759] uppercase tracking-[1px]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Live</span>
              </div>
            </div>

            <div className="divide-y divide-[rgba(67,70,85,0.1)]">
              {feed.map((post) => (
                <div key={post.id} className="p-5 hover:bg-[rgba(37,99,235,0.03)] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[rgba(37,99,235,0.15)] flex items-center justify-center text-[10px] font-bold text-[#2563eb] shrink-0" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                      {post.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[12px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Inter',sans-serif" }}>{post.user}</span>
                        <span className={`text-[7px] font-bold tracking-[1px] uppercase px-1.5 py-0.5 ${post.tag === "ANALYSIS" ? "bg-[rgba(37,99,235,0.15)] text-[#2563eb]" : post.tag === "PREDICTION" ? "bg-[rgba(180,197,255,0.1)] text-[#b4c5ff]" : post.tag === "STATS" ? "bg-[rgba(52,199,89,0.1)] text-[#34c759]" : "bg-[rgba(67,70,85,0.2)] text-[rgba(195,198,215,0.4)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                          {post.tag}
                        </span>
                        <span className="text-[9px] text-[rgba(195,198,215,0.3)] flex items-center gap-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                          <Clock size={9} /> {post.time}
                        </span>
                      </div>
                      <p className="text-[12px] text-[rgba(195,198,215,0.7)] mt-2 leading-[1.6]" style={{ fontFamily: "'Inter',sans-serif" }}>
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <button className="flex items-center gap-1 text-[rgba(195,198,215,0.35)] hover:text-[#b4c5ff] transition-colors">
                          <ThumbsUp size={12} />
                          <span className="text-[10px]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-[rgba(195,198,215,0.35)] hover:text-[#b4c5ff] transition-colors">
                          <MessageSquare size={12} />
                          <span className="text-[10px]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{post.replies}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compose */}
            <div className="p-5 border-t border-[rgba(67,70,85,0.15)]">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Share your tactical analysis..."
                  className="flex-1 bg-[#0e0e0e] border border-[rgba(67,70,85,0.2)] px-4 py-2.5 text-[12px] text-[#e2e2e2] placeholder-[rgba(195,198,215,0.3)] outline-none focus:border-[rgba(37,99,235,0.4)] transition-colors"
                  style={{ fontFamily: "'Inter',sans-serif" }}
                />
                <button className="px-5 py-2.5 bg-[#2563eb] text-white text-[10px] font-bold tracking-[1px] uppercase hover:bg-[#1d4ed8] transition-colors shrink-0" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

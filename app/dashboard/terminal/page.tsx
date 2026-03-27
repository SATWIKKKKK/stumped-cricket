"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  MessageSquare, Send, Zap, Activity, Clock,
  BarChart2, Users, Sparkles,
} from "lucide-react";
import type { MatchItem, Player } from "@/lib/server/types";

type Message = {
  id: number;
  role: "user" | "bot";
  content: string;
  timestamp: string;
};

type Session = {
  id: number;
  title: string;
  time: string;
  messages: number;
};

const suggestionChips = [
  "Who is the top scorer this IPL?",
  "Compare Kohli vs Sharma in T20s",
  "Best economy bowlers in powerplay",
  "Pitch report for Wankhede",
  "Win probability MI vs CSK",
  "Fantasy XI for today",
];

const pastSessions: Session[] = [
  { id: 1, title: "IPL 2024 Analysis", time: "2h ago", messages: 12 },
  { id: 2, title: "T20 World Cup Predictions", time: "1d ago", messages: 8 },
  { id: 3, title: "Bowling Strategy Deep Dive", time: "3d ago", messages: 15 },
  { id: 4, title: "Fantasy Team Optimizer", time: "5d ago", messages: 6 },
];

function generateBotResponse(input: string, players: Player[], matches: MatchItem[]): string {
  const lower = input.toLowerCase();

  if (lower.includes("top scorer") || lower.includes("best bats")) {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    if (sorted.length > 0) {
      return `Based on current data, the top scorer is ${sorted[0].name} (${sorted[0].team}) with a score of ${sorted[0].score}. They are ranked #${sorted[0].ranking} and play as a ${sorted[0].role}.\n\nTop 3:\n1. ${sorted[0]?.name} - ${sorted[0]?.score}\n2. ${sorted[1]?.name ?? "N/A"} - ${sorted[1]?.score ?? "N/A"}\n3. ${sorted[2]?.name ?? "N/A"} - ${sorted[2]?.score ?? "N/A"}`;
    }
    return "No player data available yet. Try syncing the database first.";
  }

  if (lower.includes("live") || lower.includes("match")) {
    const live = matches.filter((m) => m.status === "LIVE");
    if (live.length > 0) {
      return live.map((m) => `${m.team1Code} ${m.score1} (${m.overs1} ov) vs ${m.team2Code} ${m.score2} (${m.overs2} ov) - ${m.venue}\nPrediction: ${m.aiPrediction}`).join("\n\n");
    }
    const upcoming = matches.filter((m) => m.status === "UPCOMING");
    if (upcoming.length > 0) {
      return `No live matches right now. Upcoming: ${upcoming.map((m) => `${m.team1Code} vs ${m.team2Code} at ${m.venue}`).join(", ")}`;
    }
    return "No live or upcoming matches found in the current feed.";
  }

  if (lower.includes("compare") || lower.includes("vs")) {
    return "Head-to-head comparison requires two specific players. Based on current data:\n\n- Use the Head to Head page for detailed player matchups\n- I can compare stats, form, and recent performances\n- Specify two player names for a detailed breakdown";
  }

  if (lower.includes("pitch") || lower.includes("venue") || lower.includes("wankhede")) {
    return "Venue Intel Report:\n\n- Average first innings score: 168\n- Pace vs Spin: 58% pace-friendly\n- Dew factor: Moderate after 8 PM\n- Boundary count avg: 14.2 per innings\n\nCheck the Venue Intel page for detailed pitch analysis.";
  }

  if (lower.includes("fantasy") || lower.includes("dream")) {
    const sorted = [...players].sort((a, b) => b.score - a.score).slice(0, 5);
    return `Fantasy XI Suggestions:\n\n${sorted.map((p, i) => `${i + 1}. ${p.name} (${p.role}) - Form: ${p.score}`).join("\n")}\n\nCaptain pick: ${sorted[0]?.name ?? "N/A"}\nVice-captain: ${sorted[1]?.name ?? "N/A"}`;
  }

  return `I can help you with cricket analytics. Try asking about:\n\n- Live match scores and predictions\n- Top scorers and player rankings\n- Head-to-head comparisons\n- Venue and pitch reports\n- Fantasy team suggestions\n\nI have ${players.length} players and ${matches.length} matches in my database.`;
}

export default function StumpBotPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      content: "Welcome to StumpBot AI. I am your cricket intelligence assistant. Ask me about live matches, player stats, predictions, venue reports, or fantasy team suggestions.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const [pRes, mRes] = await Promise.all([
        fetch("/api/players", { cache: "no-store" }),
        fetch("/api/matches", { cache: "no-store" }),
      ]);
      const p = (await pRes.json()) as { data?: Player[] };
      const m = (await mRes.json()) as { data?: MatchItem[] };
      if (!ignore) {
        setPlayers(p.data ?? []);
        setMatches(m.data ?? []);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateBotResponse(msg, players, matches);
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto h-[calc(100vh-69px-48px)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2563eb] flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[28px] font-black tracking-[-1px] uppercase text-[#e2e2e2] leading-none" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              StumpBot AI
            </h1>
            <span className="text-[9px] tracking-[2px] uppercase text-[rgba(195,198,215,0.35)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Cricket Intelligence Assistant
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
          <span className="text-[9px] tracking-[1px] uppercase text-[#34c759]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Online</span>
          <span className="text-[9px] text-[rgba(195,198,215,0.25)] ml-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{players.length} players // {matches.length} matches loaded</span>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Sessions Sidebar */}
        <div className="hidden lg:flex flex-col w-56 shrink-0 bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)]">
          <div className="px-4 py-3 border-b border-[rgba(67,70,85,0.15)] flex items-center gap-2">
            <Clock size={12} className="text-[rgba(195,198,215,0.3)]" />
            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[rgba(195,198,215,0.5)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Sessions</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[rgba(67,70,85,0.1)]">
            <div className="px-4 py-3 bg-[rgba(37,99,235,0.06)] border-l-2 border-[#2563eb]">
              <p className="text-[11px] font-bold text-[#e2e2e2] truncate" style={{ fontFamily: "'Inter',sans-serif" }}>Current Session</p>
              <p className="text-[9px] text-[rgba(195,198,215,0.3)] mt-0.5" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{messages.length} messages</p>
            </div>
            {pastSessions.map((s) => (
              <div key={s.id} className="px-4 py-3 hover:bg-[rgba(37,99,235,0.03)] transition-colors cursor-pointer">
                <p className="text-[11px] text-[rgba(195,198,215,0.6)] truncate" style={{ fontFamily: "'Inter',sans-serif" }}>{s.title}</p>
                <p className="text-[9px] text-[rgba(195,198,215,0.25)] mt-0.5" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.time} - {s.messages} msgs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#1b1b1b] border border-[rgba(67,70,85,0.15)] min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] sm:max-w-[70%] ${msg.role === "user" ? "bg-[#2563eb]" : "bg-[#0e0e0e] border border-[rgba(67,70,85,0.15)]"} px-4 py-3`}>
                  {msg.role === "bot" && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles size={10} className="text-[#b4c5ff]" />
                      <span className="text-[8px] font-bold tracking-[1.5px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>StumpBot</span>
                    </div>
                  )}
                  <p className={`text-[12px] leading-[1.7] whitespace-pre-line ${msg.role === "user" ? "text-white" : "text-[rgba(195,198,215,0.7)]"}`} style={{ fontFamily: "'Inter',sans-serif" }}>
                    {msg.content}
                  </p>
                  <p className={`text-[8px] mt-2 ${msg.role === "user" ? "text-[rgba(255,255,255,0.5)]" : "text-[rgba(195,198,215,0.25)]"}`} style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.15)] px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b4c5ff] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b4c5ff] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b4c5ff] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10px] text-[rgba(195,198,215,0.3)]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Analyzing...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length <= 2 && (
            <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1.5 bg-[rgba(37,99,235,0.08)] border border-[rgba(37,99,235,0.15)] text-[10px] text-[#b4c5ff] hover:bg-[rgba(37,99,235,0.15)] hover:border-[rgba(37,99,235,0.3)] transition-all"
                  style={{ fontFamily: "'Space Grotesk',sans-serif" }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-[rgba(67,70,85,0.15)] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask StumpBot about cricket stats, predictions, comparisons..."
                className="flex-1 bg-[#0e0e0e] border border-[rgba(67,70,85,0.2)] px-4 py-2.5 text-[12px] text-[#e2e2e2] placeholder-[rgba(195,198,215,0.3)] outline-none focus:border-[rgba(37,99,235,0.4)] transition-colors"
                style={{ fontFamily: "'Inter',sans-serif" }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="px-5 py-2.5 bg-[#2563eb] text-white flex items-center gap-2 hover:bg-[#1d4ed8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={14} />
                <span className="text-[10px] font-bold tracking-[1px] uppercase hidden sm:inline" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

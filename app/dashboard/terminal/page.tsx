"use client";

import { useEffect, useMemo, useState } from "react";
import type { MatchItem, NewsItem } from "@/lib/server/types";

export default function TerminalPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const [mRes, nRes] = await Promise.all([fetch("/api/matches", { cache: "no-store" }), fetch("/api/news", { cache: "no-store" })]);
      const m = (await mRes.json()) as { data?: MatchItem[] };
      const n = (await nRes.json()) as { data?: NewsItem[] };
      if (!ignore) {
        setMatches(m.data ?? []);
        setNews(n.data ?? []);
      }
    }
    load();
    const interval = setInterval(load, 20000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  const logs = useMemo(() => {
    const matchLogs = matches.map((m) => `[MATCH] ${m.team1Code} vs ${m.team2Code} :: ${m.status} :: ${m.result}`);
    const newsLogs = news.map((n) => `[NEWS] ${n.tag} :: ${n.title}`);
    return [...matchLogs, ...newsLogs].slice(0, 20);
  }, [matches, news]);

  return (
    <div className="p-8 max-w-[1280px] flex flex-col gap-8">
      <div className="border-l-4 border-[#b4c5ff] pl-7">
        <h1 className="text-[60px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[60px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          SYSTEM TERMINAL
        </h1>
      </div>

      <div className="bg-[#0e0e0e] border border-[rgba(67,70,85,0.4)] p-5 font-mono text-[12px] text-[#c3c6d7] leading-6">
        {logs.map((line, idx) => (
          <div key={`${line}-${idx}`}>{line}</div>
        ))}
      </div>
    </div>
  );
}

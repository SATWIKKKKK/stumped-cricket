"use client";

import { useEffect, useMemo, useState } from "react";
import type { MatchItem, NewsItem } from "@/lib/server/types";

export default function AlertsPage() {
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
    const interval = setInterval(load, 30000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  const alerts = useMemo(() => {
    const live = matches.filter((m) => m.status === "LIVE").map((m) => ({
      level: "LIVE",
      title: `${m.team1Code} vs ${m.team2Code}`,
      detail: m.result,
    }));

    const intel = news.slice(0, 8).map((n) => ({
      level: n.tag,
      title: n.title,
      detail: `${n.time} · ${n.reads} reads`,
    }));

    return [...live, ...intel];
  }, [matches, news]);

  return (
    <div className="p-8 max-w-[1280px] flex flex-col gap-8">
      <div className="border-l-4 border-[#b4c5ff] pl-7">
        <h1 className="text-[60px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[60px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          ALERT GRID
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        {alerts.map((a, idx) => (
          <div key={`${a.title}-${idx}`} className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-5">
            <p className="text-[10px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{a.level}</p>
            <h3 className="text-[16px] font-black uppercase text-[#e2e2e2] mt-1" style={{ fontFamily: "'Epilogue', sans-serif" }}>{a.title}</h3>
            <p className="text-[12px] text-[rgba(195,198,215,0.6)] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{a.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

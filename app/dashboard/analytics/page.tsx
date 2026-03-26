"use client";

import { useEffect, useMemo, useState } from "react";
import AnalyticsCharts from "@/components/charts/AnalyticsCharts";
import type { MatchItem, NewsItem } from "@/lib/server/types";

export default function AnalyticsPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const [mRes, nRes] = await Promise.all([
        fetch("/api/matches", { cache: "no-store" }),
        fetch("/api/news", { cache: "no-store" }),
      ]);
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

  const liveCount = matches.filter((m) => m.status === "LIVE").length;
  const completedCount = matches.filter((m) => m.status === "COMPLETED").length;
  const hype = Math.min(99, Math.max(45, 40 + liveCount * 12 + Math.floor(news.length / 2)));

  const sentimentStats = useMemo(
    () => [
      { label: "HYPE", value: `${hype}%`, sub: "FAN ENGAGEMENT" },
      { label: "LIVE MATCHES", value: String(liveCount), sub: "ACTIVE STREAMS" },
      { label: "COMPLETED", value: String(completedCount), sub: "RESULT FEEDS" },
      { label: "NEWS ITEMS", value: String(news.length), sub: "INTEL VOLUME" },
    ],
    [hype, liveCount, completedCount, news.length]
  );

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1280px]">
      <div className="flex flex-col gap-2 border-l-4 border-[#2563eb] pl-7">
        <h1 className="text-[72px] font-black tracking-[-3.6px] uppercase leading-[72px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          <span className="text-[#e2e2e2]">FAN SENTIMENT</span>
          <br />
          <span className="text-[#2563eb]">PULSE MONITOR</span>
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {sentimentStats.map((s) => (
          <div key={s.label} className="bg-[#1b1b1b] border-t-2 border-[rgba(180,197,255,0.3)] p-4">
            <p className="text-[9px] tracking-[1px] uppercase text-[rgba(195,198,215,0.4)] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
            <p className="text-[20px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Epilogue', sans-serif" }}>{s.value}</p>
            <p className="text-[8px] text-[rgba(195,198,215,0.3)] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1b1b1b] p-6">
        <p className="text-[12px] uppercase text-[#b4c5ff] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Live Feed Mentions</p>
        <div className="grid grid-cols-2 gap-3">
          {news.slice(0, 8).map((n) => (
            <div key={n.id} className="bg-[#0e0e0e] p-4 border border-[rgba(67,70,85,0.2)]">
              <p className="text-[10px] text-[#b4c5ff] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{n.tag}</p>
              <p className="text-[12px] text-[#e2e2e2] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{n.title}</p>
            </div>
          ))}
        </div>
      </div>

      <AnalyticsCharts />
    </div>
  );
}

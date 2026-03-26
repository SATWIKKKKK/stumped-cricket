"use client";

import { useEffect, useMemo, useState } from "react";
import type { MatchItem, NewsItem } from "@/lib/server/types";

export default function ArchivePage() {
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
    return () => {
      ignore = true;
    };
  }, []);

  const archiveItems = useMemo(() => {
    const matchItems = matches.map((m) => ({
      type: "MATCH",
      title: `${m.team1Code} vs ${m.team2Code}`,
      subtitle: `${m.tournament} · ${m.result}`,
    }));
    const newsItems = news.map((n) => ({
      type: "NEWS",
      title: n.title,
      subtitle: `${n.time} · ${n.reads} reads`,
    }));
    return [...matchItems, ...newsItems].slice(0, 20);
  }, [matches, news]);

  return (
    <div className="p-8 max-w-[1280px] flex flex-col gap-8">
      <div className="border-l-4 border-[#b4c5ff] pl-7">
        <h1 className="text-[60px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[60px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          ARCHIVE
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {archiveItems.map((item, idx) => (
          <div key={`${item.title}-${idx}`} className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-5">
            <p className="text-[10px] uppercase text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.type}</p>
            <h3 className="text-[14px] font-black uppercase text-[#e2e2e2] mt-1" style={{ fontFamily: "'Epilogue', sans-serif" }}>{item.title}</h3>
            <p className="text-[11px] text-[rgba(195,198,215,0.6)] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

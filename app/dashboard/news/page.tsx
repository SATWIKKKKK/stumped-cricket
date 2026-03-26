"use client";

import { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import type { NewsItem } from "@/lib/server/types";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const response = await fetch("/api/news", { cache: "no-store" });
        const payload = (await response.json()) as { data?: NewsItem[] };
        if (!ignore) {
          setNews(payload.data ?? []);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    const interval = setInterval(load, 45000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  const featured = news[0];
  const trending = useMemo(() => news.slice(0, 4), [news]);
  const allArticles = useMemo(() => news.slice(0, 12), [news]);

  return (
    <div className="p-8 flex flex-col gap-12 max-w-[1280px]">
      <div className="border-l-4 border-[#b4c5ff] pl-7 flex flex-col gap-2">
        <h1 className="text-[60px] font-black tracking-[-3px] uppercase text-[#e2e2e2] leading-[60px]" style={{ fontFamily: "'Epilogue', sans-serif" }}>
          Match Intel
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-[12px] tracking-[3.6px] uppercase text-[rgba(226,226,226,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            AI-Curated Cricket Intelligence // Real-Time Feeds
          </span>
          <div className="flex-1 h-px bg-[rgba(67,70,85,0.2)]" />
        </div>
      </div>

      {loading && (
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-6 text-[12px] text-[rgba(195,198,215,0.6)] uppercase tracking-[1px]">
          Loading news feed...
        </div>
      )}

      {!loading && !featured && (
        <div className="bg-[#1b1b1b] border border-[rgba(67,70,85,0.2)] p-6 text-[12px] text-[rgba(195,198,215,0.6)] uppercase tracking-[1px]">
          No news available yet.
        </div>
      )}

      {featured && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-[#1b1b1b] border-l border-[rgba(180,197,255,0.2)] p-8">
            <p className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#b4c5ff] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {featured.tag}
            </p>
            <h2 className="text-[36px] font-black tracking-[-1.8px] uppercase text-[#e2e2e2] leading-[40px] mb-4" style={{ fontFamily: "'Epilogue', sans-serif" }}>
              {featured.title}
            </h2>
            <p className="text-[16px] text-[#c3c6d7] leading-7 mb-8 max-w-[672px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {featured.summary}
            </p>
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] text-[rgba(226,226,226,0.3)] uppercase mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Published</p>
                <p className="text-[12px] font-bold text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{featured.time}</p>
              </div>
              <div>
                <p className="text-[10px] text-[rgba(226,226,226,0.3)] uppercase mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Reads</p>
                <p className="text-[12px] font-bold text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{featured.reads}</p>
              </div>
            </div>
          </div>

          <div className="col-span-4 flex flex-col gap-6">
            <div className="bg-[#2a2a2a] border-t-2 border-[rgba(180,197,255,0.3)] p-6">
              <h3 className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#b4c5ff] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                LIVE TRENDING
              </h3>
              <div className="flex flex-col gap-4">
                {trending.map((item, i) => (
                  <div key={item.id} className="border-b border-[rgba(67,70,85,0.1)] last:border-0 pb-4 last:pb-0 pt-2 px-2">
                    <p className="text-[10px] font-bold text-[#b4c5ff] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      #{String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="text-[12px] font-bold uppercase text-[#e2e2e2] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {item.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {item.reads} reads
                      </span>
                      <TrendingUp size={10} className="text-[#2563eb]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-[#b4c5ff]" />
          <h2 className="text-[12px] font-bold tracking-[2.4px] uppercase text-[#e2e2e2]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ALL INTEL FEEDS
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {allArticles.map((article) => (
            <div key={article.id} className="bg-[#1b1b1b] p-5 flex items-start justify-between gap-4 border border-[rgba(67,70,85,0.1)]">
              <div className="flex flex-col gap-2">
                <div className="self-start px-2 py-px text-[9px] font-bold uppercase bg-[#353535] text-[#c3c6d7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {article.tag}
                </div>
                <p className="text-[14px] font-bold uppercase text-[#e2e2e2] leading-5" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  {article.title}
                </p>
                <div className="flex gap-3">
                  <span className="text-[10px] text-[rgba(195,198,215,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{article.time}</span>
                  <span className="text-[10px] text-[#b4c5ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{article.reads} reads</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { listNews } from "@/lib/server/repositories";
import { fetchNews } from "@/lib/providers/cricket/cricbuzz";
import type { NewsItem } from "@/lib/server/types";

export const revalidate = 60;

function timeAgo(epochMs: string): string {
  const diff = Date.now() - Number(epochMs);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function GET() {
  if (process.env.CRICBUZZ_API_KEY) {
    try {
      const stories = await fetchNews();
      const news: NewsItem[] = stories.map((s) => ({
        id: String(s.story!.id),
        tag: s.story!.context ?? "NEWS",
        title: s.story!.hline,
        summary: s.story!.intro,
        time: timeAgo(s.story!.pubTime),
        reads: "-",
      }));
      return NextResponse.json({ data: news });
    } catch { /* fall through */ }
  }
  const news = await listNews();
  return NextResponse.json({ data: news });
}

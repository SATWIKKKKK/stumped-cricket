import { NextResponse } from "next/server";
import { listMatches } from "@/lib/server/repositories";
import { fetchLiveMatches, fetchRecentMatches, fetchUpcomingMatches } from "@/lib/providers/cricket/cricbuzz";
import type { MatchItem } from "@/lib/server/types";

export const revalidate = 60;

function mapCbMatch(m: { matchInfo: any; matchScore?: any }): MatchItem {
  const info = m.matchInfo;
  const best = (s: any) => s?.inngs2 ?? s?.inngs1;
  const t1 = best(m.matchScore?.team1Score);
  const t2 = best(m.matchScore?.team2Score);
  const state = info.state?.toLowerCase() ?? "";
  const status: MatchItem["status"] =
    state === "complete" || state.includes("won") ? "COMPLETED" :
    state === "preview" || state === "upcoming" || state === "dormant" ? "UPCOMING" : "LIVE";
  return {
    id: String(info.matchId),
    status,
    tournament: info.seriesName,
    format: info.matchFormat === "TEST" ? "TEST" : info.matchFormat === "ODI" ? "ODI" : "T20",
    team1: info.team1.teamName,
    team1Code: info.team1.teamSName,
    score1: t1 ? `${t1.runs}/${t1.wickets}` : "-",
    overs1: t1 ? `${t1.overs}` : "-",
    team2: info.team2.teamName,
    team2Code: info.team2.teamSName,
    score2: t2 ? `${t2.runs}/${t2.wickets}` : "-",
    overs2: t2 ? `${t2.overs}` : "-",
    venue: info.venueInfo ? `${info.venueInfo.ground}, ${info.venueInfo.city}` : "TBC",
    result: info.status,
    aiPrediction: "-",
  };
}

export async function GET() {
  if (process.env.CRICBUZZ_API_KEY) {
    try {
      const [live, recent, upcoming] = await Promise.all([
        fetchLiveMatches().catch(() => []),
        fetchRecentMatches().catch(() => []),
        fetchUpcomingMatches().catch(() => []),
      ]);
      const all = [...live, ...recent, ...upcoming];
      const seen = new Set<number>();
      const unique = all.filter((m) => { if (seen.has(m.matchInfo.matchId)) return false; seen.add(m.matchInfo.matchId); return true; });
      return NextResponse.json({ data: unique.map(mapCbMatch) });
    } catch { /* fall through */ }
  }
  const matches = await listMatches();
  return NextResponse.json({ data: matches });
}

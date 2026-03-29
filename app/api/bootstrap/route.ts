import { NextResponse } from "next/server";
import {
  listMatches,
  listNews,
  listPlayers,
  listRankings,
  listTeams,
} from "@/lib/server/repositories";
import { CricbuzzProvider } from "@/lib/providers/cricket/cricbuzz";
import type { MatchItem, NewsItem, TeamItem } from "@/lib/server/types";

export const revalidate = 60;

export async function GET() {
  // Use Cricbuzz API when key is available
  if (process.env.CRICBUZZ_API_KEY) {
    try {
      const cb = new CricbuzzProvider();
      const snapshot = await cb.fetchSnapshot();

      const matches: MatchItem[] = snapshot.matches.map((m) => ({
        id: m.externalId,
        status: m.status,
        tournament: m.tournament,
        format: m.format,
        team1: m.team1,
        team1Code: m.team1Code,
        score1: m.score1,
        overs1: m.overs1,
        team2: m.team2,
        team2Code: m.team2Code,
        score2: m.score2,
        overs2: m.overs2,
        venue: m.venue,
        result: m.result,
        aiPrediction: "-",
      }));

      const news: NewsItem[] = snapshot.news.map((n) => ({
        id: n.externalId,
        tag: n.tag,
        title: n.title,
        summary: n.summary,
        time: n.time,
        reads: n.reads,
      }));

      const teams: TeamItem[] = snapshot.teams.map((t) => ({
        id: t.externalId,
        name: t.name,
        code: t.code,
        league: t.league,
        country: t.country,
        ranking: t.ranking,
        wins: t.wins,
        losses: t.losses,
        nrr: t.nrr,
        captain: t.captain,
        players: t.players,
      }));

      // Still pull players/rankings from DB if available (Cricbuzz doesn't give player rankings)
      const [players, rankings] = await Promise.all([
        listPlayers(),
        listRankings(),
      ]);

      return NextResponse.json({
        data: { players, matches, teams, news, rankings },
      });
    } catch (err) {
      console.error("Cricbuzz fetch failed, falling back to DB/mock:", err);
    }
  }

  // Fallback to DB/mock
  const [players, matches, teams, news, rankings] = await Promise.all([
    listPlayers(),
    listMatches(),
    listTeams(),
    listNews(),
    listRankings(),
  ]);

  return NextResponse.json({
    data: { players, matches, teams, news, rankings },
  });
}

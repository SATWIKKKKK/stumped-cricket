import { NextResponse } from "next/server";
import { listTeams } from "@/lib/server/repositories";
import { CricbuzzProvider } from "@/lib/providers/cricket/cricbuzz";
import type { TeamItem } from "@/lib/server/types";

export const revalidate = 60;

export async function GET() {
  if (process.env.CRICBUZZ_API_KEY) {
    try {
      const cb = new CricbuzzProvider();
      const snapshot = await cb.fetchSnapshot();
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
      return NextResponse.json({ data: teams });
    } catch { /* fall through */ }
  }
  const teams = await listTeams();
  return NextResponse.json({ data: teams });
}

import { NextResponse } from "next/server";
import {
  listMatches,
  listNews,
  listPlayers,
  listRankings,
  listTeams,
} from "@/lib/server/repositories";

export async function GET() {
  const [players, matches, teams, news, rankings] = await Promise.all([
    listPlayers(),
    listMatches(),
    listTeams(),
    listNews(),
    listRankings(),
  ]);

  return NextResponse.json({
    data: {
      players,
      matches,
      teams,
      news,
      rankings,
    },
  });
}

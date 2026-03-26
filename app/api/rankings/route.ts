import { NextResponse } from "next/server";
import { listRankings } from "@/lib/server/repositories";

export async function GET() {
  const rankings = await listRankings();
  return NextResponse.json({ data: rankings });
}

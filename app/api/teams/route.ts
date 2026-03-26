import { NextResponse } from "next/server";
import { listTeams } from "@/lib/server/repositories";

export async function GET() {
  const teams = await listTeams();
  return NextResponse.json({ data: teams });
}

import { NextResponse } from "next/server";
import { listPlayers } from "@/lib/server/repositories";

export async function GET() {
  const players = await listPlayers();
  return NextResponse.json({ data: players });
}

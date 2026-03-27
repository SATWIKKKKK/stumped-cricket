import { NextResponse } from "next/server";
import { getPlayerById } from "@/lib/server/repositories";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = await getPlayerById(id);
  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }
  return NextResponse.json({ data: player });
}

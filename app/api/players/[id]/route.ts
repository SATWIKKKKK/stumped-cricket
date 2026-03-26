import { NextResponse } from "next/server";
import { getPlayerById } from "@/lib/server/repositories";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const player = await getPlayerById(params.id);
  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }
  return NextResponse.json({ data: player });
}

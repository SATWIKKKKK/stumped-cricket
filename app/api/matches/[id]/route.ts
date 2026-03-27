import { NextResponse } from "next/server";
import { getMatchById } from "@/lib/server/repositories";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatchById(id);
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }
  return NextResponse.json({ data: match });
}

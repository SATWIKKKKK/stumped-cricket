import { NextResponse } from "next/server";
import { listMatches } from "@/lib/server/repositories";

export async function GET() {
  const matches = await listMatches();
  return NextResponse.json({ data: matches });
}

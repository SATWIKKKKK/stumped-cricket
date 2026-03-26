import { NextResponse } from "next/server";
import { syncCricketData } from "@/lib/server/ingestion/sync-cricket";

function isAuthorized(request: Request) {
  const expected = process.env.CRICKET_SYNC_SECRET;
  if (!expected) {
    return process.env.NODE_ENV !== "production";
  }

  const received = request.headers.get("x-sync-secret") || "";
  return received === expected;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized sync request" }, { status: 401 });
  }

  try {
    const summary = await syncCricketData();
    return NextResponse.json({ data: summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync failure";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    data: {
      route: "sync-cricket",
      usage: "POST with x-sync-secret header",
      provider: process.env.CRICKET_PROVIDER || "free-dev",
    },
  });
}

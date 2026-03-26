import { NextResponse } from "next/server";
import { listPlayerTrackingEvents, trackPlayerEvent } from "@/lib/server/repositories";

export async function GET() {
  const events = await listPlayerTrackingEvents();
  return NextResponse.json({ data: events });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.playerId || !body?.eventType || !body?.source) {
    return NextResponse.json(
      { error: "playerId, eventType and source are required" },
      { status: 400 }
    );
  }

  const event = await trackPlayerEvent({
    playerId: String(body.playerId),
    eventType: String(body.eventType),
    source: String(body.source),
  });

  return NextResponse.json({ data: event }, { status: 201 });
}

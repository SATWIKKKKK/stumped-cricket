import { NextResponse } from "next/server";
import { listNews } from "@/lib/server/repositories";

export async function GET() {
  const news = await listNews();
  return NextResponse.json({ data: news });
}

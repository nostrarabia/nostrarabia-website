import { NextResponse } from "next/server";
import { fetchMediaStatus } from "@/lib/service-status";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await fetchMediaStatus(), {
    headers: { "Cache-Control": "no-store" },
  });
}

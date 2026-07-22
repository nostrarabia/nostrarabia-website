import { NextResponse } from "next/server";
import { fetchRelayStatus } from "@/lib/service-status";

// The whole point of this route is to say when the probe ran. A cached response
// would serve an old checkedAt as though it were current, so the route stays
// dynamic and the upstream call is rate-limited inside the library instead.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await fetchRelayStatus(), {
    headers: { "Cache-Control": "no-store" },
  });
}

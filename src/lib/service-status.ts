import { z } from "zod";

export type ServiceState = "online" | "degraded" | "offline" | "unknown";

export type ServiceStatus = {
  state: ServiceState;
  /** ISO time the probe actually ran. Never the time the response was served. */
  checkedAt: string;
  latencyMs?: number;
  errorCode?: string;
  /** Relay only. */
  name?: string;
  software?: string;
  version?: string;
  supportedNips?: number[];
};

const PROBE_TIMEOUT_MS = 5_000;
/** Above this a reachable service is reported slow rather than healthy. */
const DEGRADED_ABOVE_MS = 2_000;
/** Upstream probes are memoised for this long. See the note on honesty below. */
const MEMO_TTL_MS = 20_000;
/** A NIP-11 document is a few kilobytes. This is generous and still bounded. */
const MAX_BODY_BYTES = 64 * 1024;

const Nip11Schema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    software: z.string().optional(),
    version: z.string().optional(),
    supported_nips: z.array(z.number()).optional(),
  })
  .loose();

/**
 * The memo caches the in-flight PROMISE, and it caches the whole result with
 * its timestamp. Two separate defects were behind that shape.
 *
 * Caching only settled values let N concurrent requests to /api/relay-status
 * all miss and open N connections to the relay, turning a public endpoint
 * into a 1:1 request amplifier aimed at our own infrastructure. Sharing the
 * promise collapses a burst into one upstream call.
 *
 * Stamping a fresh checkedAt on a cached verdict, which is what letting Next
 * cache the fetch would do, produces a pill that says "checked 2 seconds ago"
 * on the back of a probe that ran a minute earlier. That is a lie told by an
 * honesty widget, so the verdict and its timestamp are cached inseparably.
 */
const memo = new Map<string, { at: number; value: Promise<ServiceStatus> }>();

function memoised(key: string, run: () => Promise<ServiceStatus>): Promise<ServiceStatus> {
  const hit = memo.get(key);
  if (hit && Date.now() - hit.at < MEMO_TTL_MS) return hit.value;
  const pending = run().catch((err) => {
    // Never leave a rejected promise cached, or one transient failure poisons
    // the endpoint for the whole TTL.
    memo.delete(key);
    throw err;
  });
  memo.set(key, { at: Date.now(), value: pending });
  return pending;
}

/**
 * Reads at most `max` bytes and throws past that.
 *
 * The obvious shape, clearing the abort timer as soon as the response resolves
 * and then calling response.json(), bounds only time-to-headers. A host that
 * answers 200 and then trickles or stalls its body, which includes a hung
 * upstream, a proxy in front of it, or a hijacked record, would hang the route
 * handler indefinitely with no size ceiling. The body is therefore consumed
 * inside the same abort window as the headers.
 */
async function readCapped(response: Response, max: number): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel();
      throw new Error("body-too-large");
    }
    chunks.push(value);
  }
  const joined = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    joined.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(joined);
}

type Probe = { status: number; ok: boolean; body: string; latencyMs: number };

async function timedRequest(
  url: string,
  { headers, wantBody }: { headers?: HeadersInit; wantBody: boolean },
): Promise<Probe> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  const started = Date.now();
  try {
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
      cache: "no-store",
      redirect: "follow",
    });
    let body = "";
    if (wantBody && response.ok) {
      body = await readCapped(response, MAX_BODY_BYTES);
    } else {
      // Release the connection rather than leaving a body dangling.
      await response.body?.cancel().catch(() => {});
    }
    return { status: response.status, ok: response.ok, body, latencyMs: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

function failure(checkedAt: string, err: unknown): ServiceStatus {
  const aborted = err instanceof Error && err.name === "AbortError";
  const oversized = err instanceof Error && err.message === "body-too-large";
  if (oversized) return { state: "degraded", checkedAt, errorCode: "oversized-response" };
  // A timeout means we learned nothing, so we must not assert that it is down.
  return aborted
    ? { state: "unknown", checkedAt, errorCode: "timeout" }
    : { state: "offline", checkedAt, errorCode: "unreachable" };
}

/** NIP-11 probe of the relay over its https root. */
export function fetchRelayStatus(): Promise<ServiceStatus> {
  return memoised("relay", async () => {
    const checkedAt = new Date().toISOString();
    try {
      const probe = await timedRequest("https://relay.nostrarabia.com", {
        headers: { Accept: "application/nostr+json" },
        wantBody: true,
      });

      // The upstream status is bucketed rather than echoed verbatim, so an
      // upstream error page cannot put arbitrary detail into our public JSON.
      if (!probe.ok) {
        return { state: "offline", checkedAt, errorCode: probe.status >= 500 ? "upstream-error" : "upstream-refused" };
      }

      let parsed;
      try {
        parsed = Nip11Schema.safeParse(JSON.parse(probe.body));
      } catch {
        return { state: "degraded", checkedAt, latencyMs: probe.latencyMs, errorCode: "malformed-json" };
      }
      if (!parsed.success) {
        return { state: "degraded", checkedAt, latencyMs: probe.latencyMs, errorCode: "nip11-malformed" };
      }

      return {
        state: probe.latencyMs > DEGRADED_ABOVE_MS ? "degraded" : "online",
        checkedAt,
        latencyMs: probe.latencyMs,
        name: parsed.data.name,
        software: parsed.data.software,
        version: parsed.data.version,
        supportedNips: parsed.data.supported_nips,
      };
    } catch (err) {
      return failure(checkedAt, err);
    }
  });
}

/**
 * Reachability probe of the Blossom media server.
 *
 * Deliberately proves only that the host answers. It says nothing about whether
 * YOU can upload, which is a signed-auth question the pill has no business
 * implying an answer to. The body is never read.
 */
export function fetchMediaStatus(): Promise<ServiceStatus> {
  return memoised("media", async () => {
    const checkedAt = new Date().toISOString();
    try {
      const probe = await timedRequest("https://media.nostrarabia.com", { wantBody: false });
      if (probe.status >= 500) {
        return { state: "offline", checkedAt, latencyMs: probe.latencyMs, errorCode: "upstream-error" };
      }
      if (!probe.ok) {
        return { state: "degraded", checkedAt, latencyMs: probe.latencyMs, errorCode: "upstream-refused" };
      }
      return {
        state: probe.latencyMs > DEGRADED_ABOVE_MS ? "degraded" : "online",
        checkedAt,
        latencyMs: probe.latencyMs,
      };
    } catch (err) {
      return failure(checkedAt, err);
    }
  });
}

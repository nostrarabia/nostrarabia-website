"use client";

import React from "react";

export type ServiceState = "online" | "degraded" | "offline" | "checking" | "unknown";

/** A successful check older than this stops counting as knowledge. */
const STALE_AFTER_MS = 120_000;
/** Comfortably inside the staleness window, so a live pill never decays. */
const REPROBE_MS = 60_000;
const TICK_MS = 5_000;

const CONFIG: Record<
  ServiceState,
  { label: string; tone: string; shape: React.ReactNode }
> = {
  // Shape carries the meaning as well as colour, so state survives greyscale
  // and colour blindness (WCAG 1.4.1).
  online: {
    label: "متاح",
    tone: "text-brand-success",
    shape: <circle cx="6" cy="6" r="4" fill="currentColor" />,
  },
  degraded: {
    label: "بطيء",
    tone: "text-brand-warning",
    shape: (
      <>
        <circle cx="6" cy="6" r="4" fill="currentColor" />
        <rect x="1" y="5" width="10" height="2" fill="var(--color-brand-bg)" />
      </>
    ),
  },
  offline: {
    label: "غير متاح",
    tone: "text-brand-danger",
    shape: (
      <>
        <circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="2.5" y1="9.5" x2="9.5" y2="2.5" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  checking: {
    label: "جارٍ الفحص",
    tone: "text-brand-neutral",
    shape: (
      <path
        d="M6 2 A4 4 0 0 1 10 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    ),
  },
  unknown: {
    label: "الحالة غير معروفة",
    tone: "text-brand-neutral",
    shape: (
      <circle
        cx="6"
        cy="6"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
    ),
  },
};

/**
 * "بطيء" means slow, and only the latency branches earn it. A reachable service
 * answering with malformed NIP-11, an oversized body, or a 4xx is degraded too,
 * but calling that "slow" tells the reader something the probe never measured.
 * Same state and same colour, honest label.
 */
const DEGRADED_NOT_SLOW = new Set([
  "nip11-malformed",
  "malformed-json",
  "oversized-response",
  "upstream-refused",
]);

const relative = new Intl.RelativeTimeFormat("ar", { numeric: "auto" });

function lastChecked(checkedAt: string | null, now: number): string | null {
  if (!checkedAt) return null;
  const t = Date.parse(checkedAt);
  if (Number.isNaN(t)) return null;
  const elapsed = Math.max(0, Math.round((now - t) / 1000));
  return elapsed < 60
    ? relative.format(-elapsed, "second")
    : relative.format(-Math.round(elapsed / 60), "minute");
}

interface StatusPillProps {
  /** Same-origin probe returning { state, checkedAt }. */
  endpoint: string;
  /** Names the service for a screen reader, e.g. "الريلاي". */
  service: string;
}

/**
 * Five states, and green is not reachable by accident.
 *
 *  1. The initial state, the server-rendered output and every error branch all
 *     resolve to "unknown". No code path produces green without a completed,
 *     successful fetch in this page session.
 *  2. "unknown" and "checking" are grey. Grey is the only colour that carries
 *     neither reassurance nor alarm.
 *  3. Every settled state carries the time of the check. A pill with no
 *     timestamp is a stale pill.
 *  4. A successful check older than 120 seconds decays back to "unknown", so
 *     green cannot persist by inertia on a tab left open.
 *  5. A failure to reach our own probe is "unknown", never "offline". We would
 *     not know that the relay is down, only that we could not ask.
 *
 * The pill means reachable. It does not mean you can publish here, which is why
 * the publishing rules are their own section rather than a tooltip.
 */
export function StatusPill({ endpoint, service }: StatusPillProps) {
  const [state, setState] = React.useState<ServiceState>("unknown");
  const [checkedAt, setCheckedAt] = React.useState<string | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);
  const [now, setNow] = React.useState<number>(0);

  const generation = React.useRef(0);

  React.useEffect(() => {
    let cancelled = false;
    let slowProbe: ReturnType<typeof setTimeout> | undefined;

    /**
     * probe() is now called from three places: mount, the 60s interval, and
     * every visibilitychange. Nothing tracked in-flight state, so results
     * applied last-to-SETTLE rather than last-to-START.
     *
     * The damaging order: a reader returns to the tab while a probe is still
     * stalled on a slow radio, the visibility probe hits the 20s server memo and
     * paints green, then the older probe finally rejects and its catch clears
     * the state back to grey with no timestamp, where it sits for a minute
     * although a newer check had succeeded. That is the same class of lie the
     * memo comment in service-status.ts exists to prevent.
     *
     * A generation token makes a superseded probe unable to write anything.
     */
    async function probe() {
      const mine = ++generation.current;
      const current = () => !cancelled && mine === generation.current;
      /**
       * "Checking" is shown only once the probe is actually slow. Flashing a
       * spinner for a memoised twenty-millisecond response is theatre, and the
       * server must not render "checking" at all: with JavaScript disabled
       * nothing is ever checked, and a pill claiming to be checking forever is
       * the same class of lie as a green pill with no probe behind it. Unknown
       * is the honest state for a page that cannot run this code.
       */
      clearTimeout(slowProbe);
      slowProbe = setTimeout(() => {
        if (current()) setState((s) => (s === "unknown" ? "checking" : s));
      }, 250);

      try {
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data: { state?: string; checkedAt?: string; errorCode?: string } = await res.json();
        if (!current()) return;
        const next = data.state;
        setState(next === "online" || next === "degraded" || next === "offline" ? next : "unknown");
        setCheckedAt(data.checkedAt ?? null);
        setErrorCode(data.errorCode ?? null);
      } catch {
        // A superseded probe must never clear a newer success.
        if (current()) {
          setState("unknown");
          setCheckedAt(null);
          setErrorCode(null);
        }
      } finally {
        clearTimeout(slowProbe);
        if (current()) setNow(Date.now());
      }
    }

    void probe();

    /**
     * Re-probe, and do it faster than the staleness window.
     *
     * Probing only on mount meant that at 120 seconds the decay below fired,
     * both pills went grey permanently, and the display interval carried on
     * ticking forever with nothing behind it. A reader who leaves the homepage
     * open, which is exactly what someone copying a relay address into another
     * app does, was shown "unknown" for a service that was up the whole time.
     *
     * Nothing runs while the tab is hidden, and returning to a hidden tab
     * re-probes immediately rather than waiting out the interval.
     */
    const reprobe = setInterval(() => {
      if (document.visibilityState === "visible") void probe();
    }, REPROBE_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") void probe();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearTimeout(slowProbe);
      clearInterval(reprobe);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [endpoint]);

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Decay. Applied at render so it cannot be forgotten by a code path.
  let shown = state;
  if (checkedAt && now) {
    const age = now - Date.parse(checkedAt);
    if (Number.isNaN(age) || age > STALE_AFTER_MS) shown = "unknown";
  }

  const config = CONFIG[shown];
  const label =
    shown === "degraded" && errorCode && DEGRADED_NOT_SLOW.has(errorCode)
      ? "استجابة غير سليمة"
      : config.label;
  // Reads the clock from state only. Calling Date.now() during render would make
  // the render impure and, worse, would let the timestamp drift away from the
  // value the decay check above was computed against.
  const stamp = shown === "checking" || !now ? null : lastChecked(checkedAt, now);

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span
        role="status"
        aria-live="polite"
        className={`inline-flex h-7 items-center gap-2 rounded-full border border-brand-border-ui px-3 text-[13px] font-bold whitespace-nowrap ${config.tone}`}
      >
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 shrink-0 ${shown === "checking" ? "animate-spin motion-reduce:animate-none" : ""}`}
          aria-hidden="true"
          focusable="false"
        >
          {config.shape}
        </svg>
        <span className="sr-only">{service}: </span>
        {label}
      </span>
      {stamp && (
        <span className="text-[13px] leading-[1.65] text-brand-muted">
          آخر فحص <bdi dir="rtl">{stamp}</bdi>
        </span>
      )}
    </span>
  );
}

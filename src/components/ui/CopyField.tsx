"use client";

import React from "react";

type CopyState = "idle" | "copied" | "failed";

interface CopyFieldProps {
  /** The machine value. Always rendered LTR-isolated, never truncated. */
  value: string;
  /** Accessible name for the copy control, e.g. "نسخ عنوان الريلاي". */
  label: string;
  /** Purple tick marking where Arabic ends and machine text begins. */
  seam?: boolean;
  className?: string;
}

/**
 * The clipboard failure paths the old RelayCopy swallowed into console.error.
 *
 * On a non-secure context, an older Safari, or an in-app webview (Telegram, X,
 * a real and large share of Arabic mobile traffic) the write rejects, nothing
 * visible happens, and the site looks broken. Each branch below is therefore
 * user-visible:
 *
 *   available + success -> check glyph, "تم النسخ" announced, auto-clears in 2s
 *   available + failure -> danger glyph, an alert that does NOT auto-dismiss,
 *                          and the value is programmatically selected so one
 *                          keystroke finishes the job
 *   unavailable         -> the button never renders. A disabled copy button is
 *                          worse than no button. The value becomes select-all
 *                          with a long-press hint.
 *
 * There is deliberately no loading state. Clipboard writes are instantaneous and
 * a spinner would be theatre.
 */
/**
 * Clipboard availability is a fact about the browser, not React state, so it is
 * read as an external store rather than discovered in an effect and written back
 * into state. The server snapshot is `true`, so the button is present in the
 * static HTML and there is no layout shift for the overwhelming majority whose
 * browser does support it. The rare unsupported client corrects itself on
 * hydration, which is exactly what this hook exists to do.
 *
 * Availability never changes during a page's life, so subscribe is a no-op that
 * returns its own unsubscribe.
 */
const subscribeToNothing = () => () => {};
const clipboardAvailable = () =>
  typeof navigator !== "undefined" && !!navigator.clipboard?.writeText;
const clipboardAssumedOnServer = () => true;

export function CopyField({ value, label, seam = true, className = "" }: CopyFieldProps) {
  const [state, setState] = React.useState<CopyState>("idle");
  const valueRef = React.useRef<HTMLElement>(null);

  const unavailable = !React.useSyncExternalStore(
    subscribeToNothing,
    clipboardAvailable,
    clipboardAssumedOnServer,
  );

  React.useEffect(() => {
    if (state !== "copied") return;
    const t = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(t);
  }, [state]);

  const selectValue = React.useCallback(() => {
    const node = valueRef.current;
    if (!node || typeof window === "undefined") return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
      selectValue();
    }
  }, [value, selectValue]);

  return (
    <span className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span
        className={
          seam
            ? "flex items-center border-s-2 border-brand-purple ps-3"
            : "flex items-center"
        }
      >
        <bdi
          ref={valueRef}
          dir="ltr"
          lang="en"
          className={`font-mono text-[15px] tabular-nums [overflow-wrap:anywhere] ${
            unavailable ? "select-all" : ""
          }`}
        >
          {value}
        </bdi>
      </span>

      {unavailable ? (
        <span className="text-[13px] leading-[1.65] text-brand-muted">
          اضغط مطوّلًا للنسخ
        </span>
      ) : (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={label}
          // The pressed state reuses the hover tokens rather than a background
          // shift. active:bg-brand-surface measured 1.098:1 against the page and
          // exactly 1.000:1 where the button already sits on a surface, which is
          // weaker than the hairline token this stylesheet itself calls
          // decorative-only and forbids on a control.
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg border border-brand-border-ui px-4 text-[14px] font-bold text-brand-text transition-colors hover:border-brand-orange hover:text-brand-orange active:border-brand-orange active:text-brand-orange active:opacity-75"
        >
          {state === "copied" ? (
            <span className="text-brand-success" aria-hidden="true">
              ✓
            </span>
          ) : state === "failed" ? (
            <span className="text-brand-danger" aria-hidden="true">
              ×
            </span>
          ) : null}
          انسخ
        </button>
      )}

      {/* Success is transient and non-blocking, so it is announced politely. */}
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "تم النسخ" : ""}
      </span>

      {/* Failure requires the reader to act, so it is visible, assertive, and it
          does not auto-dismiss. */}
      {state === "failed" && (
        <span
          role="alert"
          className="basis-full text-[13px] leading-[1.65] text-brand-danger"
        >
          تعذّر النسخ تلقائيًا، وقد حُدِّد النص لك، فانسخه الآن.
        </span>
      )}
    </span>
  );
}

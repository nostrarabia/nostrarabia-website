/**
 * One list, imported by both next.config.ts and src/proxy.ts.
 *
 * Next applies config-level headers() to rendered responses but NOT to
 * redirects, which are resolved earlier in the routing pipeline. Verified: the
 * /learn/apps redirect and Next's own trailing-slash normalisation both
 * answered with 0 of 6 headers. The proxy therefore issues our redirect itself
 * and attaches this same list, so the two can never drift apart.
 */
const isDev = process.env.NODE_ENV === "development";

/**
 * 'unsafe-eval' is required by the dev-time React refresh runtime and by nothing
 * in a production build, so it is granted in development only.
 *
 * 'unsafe-inline' on script-src stays, and it is worth being blunt about what
 * that costs rather than filing it as a nit: with it granted, script-src stops
 * an attacker from loading a remote script but not from running an injected
 * inline one, so the policy's real containment is object-src 'none',
 * base-uri 'self', form-action 'self' and frame-ancestors 'none'. Removing it
 * needs a per-request nonce, and a nonce forces every route to render
 * dynamically, which would trade this site's entire static shell for a
 * directive App Router's own bootstrap script would then need re-granted.
 * The trade is recorded, not hidden. Revisit if Next ships static nonces.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    // Not includeSubDomains. relay. and media. are separately-operated hosts,
    // and this site has no business dictating transport policy to them.
    key: "Strict-Transport-Security",
    value: "max-age=63072000",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

import { NextResponse, type NextRequest } from "next/server";
import { SECURITY_HEADERS } from "../security-headers";

/**
 * This exists for one reason: a redirect declared in next.config.ts is resolved
 * before headers() runs, so it answers with none of the security headers.
 * Verified against the built site, where /learn/apps returned 307 with 0 of 6.
 *
 * Issuing the redirect here instead means the same header list covers it.
 *
 * content/ar/apps.md is status: draft, predates the verified app directory and
 * answers the same question with a shorter list. Two answers to one question is
 * a content defect. The markdown is untouched and this is a temporary redirect,
 * so restoring the page is deleting this block.
 */
const REDIRECTS: Record<string, string> = {
  "/learn/apps": "/apps",
  /**
   * content/ar/home.md is the pre-rebuild homepage copy, still statically
   * generated at /learn/home, and it contains a link to /relay/connect, a route
   * that does not exist. A reader arriving from an old share therefore read
   * superseded copy and then hit a 404. Same reasoning as apps.md, same
   * reversibility: the markdown is untouched.
   */
  "/learn/home": "/",
  /**
   * The community page now lists the 35 member identities, generated from the
   * served nostr.json and cross-checked against the relay whitelist. The
   * markdown route rendered the same prose without the list.
   */
  "/learn/community": "/community",
};

function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const { key, value } of SECURITY_HEADERS) {
    response.headers.set(key, value);
  }
  return response;
}

export function proxy(request: NextRequest) {
  const destination = REDIRECTS[request.nextUrl.pathname];
  if (destination) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL(destination, request.nextUrl), 307),
    );
  }
  return NextResponse.next();
}

// Scoped to exactly the paths that need it. Running on every request would put
// a compute hop in front of a site that is otherwise entirely static, to no end.
export const config = {
  matcher: ["/learn/apps", "/learn/home", "/learn/community"],
};

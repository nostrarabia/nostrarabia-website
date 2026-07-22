import type { MetadataRoute } from "next";

/**
 * A second, canonical signal alongside the per-page robots meta tag.
 *
 * Both are resolved at BUILD time, not per request, so flipping
 * NOSTRARABIA_ALLOW_INDEXING in the host's environment does nothing on its own.
 * It takes a redeploy. That is stated here rather than left for a maintainer to
 * discover by watching a site stay invisible after they thought they had
 * switched it on.
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.NOSTRARABIA_ALLOW_INDEXING === "true";
  return {
    rules: indexable ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
  };
}

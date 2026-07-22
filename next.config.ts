import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./security-headers";

const nextConfig: NextConfig = {
  // Emit a self-contained Node server bundle at .next/standalone so the Docker
  // image can run `node server.js` without the full node_modules tree.
  output: "standalone",

  // Every other response header here is set deliberately, so advertising the
  // framework on all of them is free reconnaissance for anyone scanning hosts
  // to try the next framework advisory against.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
      {
        /**
         * C01. This file carries NIP-05 verification for 35 community
         * identities, including sooly@ and tkay@. Nostr clients fetch it
         * cross-origin, so a missing Access-Control-Allow-Origin fails
         * verification even when the file is served perfectly. Losing it raises
         * no error on our side and silently un-verifies 35 people across every
         * Nostr client.
         */
        source: "/.well-known/nostr.json",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Content-Type", value: "application/json" },
        ],
      },
    ];
  },

  // The /learn/apps redirect deliberately lives in src/proxy.ts rather than
  // here. Config-level redirects resolve before headers are applied, so one
  // declared here would answer with none of the six headers above.
};

export default nextConfig;

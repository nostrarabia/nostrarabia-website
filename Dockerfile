# syntax=docker/dockerfile:1
# Multi-stage build for the Next.js 16 app using `output: "standalone"`.
# Produces a small runtime image that serves the live app (SSR + the
# /api/relay-status and /api/media-status routes), not a static export.

# --- deps: install from the committed lockfile -------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- builder: compile the standalone server ----------------------------------
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- runner: minimal image that runs the server ------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# `output: standalone` bundles a minimal server + node_modules but NOT public/
# or the prerendered static assets, so copy those in explicitly.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Content pages are prerendered at build time, so the runtime does not read these
# today; carried in as insurance so a future request-time content read cannot
# ENOENT (standalone output tracing would not otherwise include content/).
COPY --from=builder /app/content ./content

USER nextjs
EXPOSE 3000

# Liveness: the homepage must render. Uses Node's global fetch, no extra tools.
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]

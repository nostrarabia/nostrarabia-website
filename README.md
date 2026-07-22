# NostrArabia website

The Arabic-first onboarding site for [Nostr](https://nostr.com) — an educator,
navigator, relay gateway and community directory that takes an Arabic speaker
from zero to a safely created identity, a connected relay and a first note.

- **Live:** https://nostrarabia.com
- **Relay:** `wss://relay.nostrarabia.com`
- **Media:** https://media.nostrarabia.com

## Binding rule

This site never asks anyone to paste, upload, transmit or store an `nsec`
(a Nostr private key). It teaches key safety; it is not a key custodian. Any
change that would break that rule is a bug.

## Tech

Next.js 16 (App Router, React 19, TypeScript, Tailwind). The homepage shows a
**live** relay/media status — `/api/relay-status` and `/api/media-status` probe
the servers on request — so the app must run as a live server, not a static
export. The content under `content/ar/` is right-to-left Arabic.

`public/.well-known/nostr.json` serves NIP-05 verification for the community's
identities and is sent with `Access-Control-Allow-Origin: *` so Nostr clients
can verify it cross-origin.

## Run locally

```bash
npm install
npm run build
npm start        # http://localhost:3000
```

`npm run dev` for the dev server, `npm run typecheck` and `npm run lint` for the gates.

## Deploy with Docker

The app is designed to be dockerized and served behind a reverse proxy. The
included `Dockerfile` builds the Next.js standalone server:

```bash
docker build -t nostrarabia-website .
docker run -p 3000:3000 nostrarabia-website
```

Point your reverse proxy at port `3000`. The container runs the Node server, so
the live status routes and the security headers are served by the app itself.

## Data

The app catalogue (`src/data/apps.json`) and the member directory
(`src/data/members.json`) are committed, verified data files. They are the
source of truth for what the deployed site shows.

## Licence

Code is [MIT](LICENSE). Content (the Arabic educational material under
`content/`) is [CC BY-SA 4.0](LICENSE-CONTENT) — reuse and translate it freely,
attribute the source, and keep the same licence.

# SparkEngine — Project Goal

**Last updated**: 2026-07-04 (portfolio audit)
**Status**: MVP deployed, dormant since ~2026-04-12
**Live**: https://sparkengine-3740d.web.app (verified live 2026-07-04)

## Goal

AI-powered business idea generation platform ("Spark - Intelligent Idea Management").
Pipeline-first architecture: automated daily generation of scored startup/business ideas
from live signals (X/Twitter via Grok, Polymarket, Google News, App Store niche scraping),
processed by Gemini (signal analysis → idea generation → scoring), delivered to a
Next.js dashboard with a 33-control Personalization Engine.

## Current State (audited 2026-07-04)

- **MVP shipped 2026-04-08/09** by multi-agent agency (8 Cloud Functions, Firestore, Next.js static export on Firebase Hosting).
- **Last meaningful work 2026-04-12**: landing page + mobile layout + app route restructure — deployed to hosting but **never committed** (lives only as uncommitted working-tree files; last commit is 2026-04-09).
- **Dormant ~3 months.** No revenue model implemented. No known active users (scheduled pipelines find 0 users with auto-generation enabled).
- **Idle burn is near-zero**: daily (6 AM UTC) and weekly (Sun 2 AM UTC) scheduled functions still run but short-circuit at 0 users — no AI calls made. Confirmed via Cloud Logging through 2026-07-04.
- Monetization spec exists but is unimplemented: `docs/Token-Based-Business-Model.md` (token/credit hybrid, dated 2026-04-12, uncommitted).

## Success Criteria (original MVP — met)

- [x] Daily scheduled generation deployed
- [x] Manual generate endpoint + dashboard deployed
- [x] Personalization Engine (33 controls, 10 presets)
- [ ] Monetization (token system) — spec only, not built
- [ ] Real users / first dollar — not started

## Key Docs

- `PROGRESS.md` — MVP progress tracker (as of Apr 8)
- `docs/product/prd.md`, `docs/product/personalization-spec.md`
- `docs/Token-Based-Business-Model.md` — monetization spec (unimplemented)
- `docs/opportunities.md` — audit findings + strategic options (2026-07-04)
- `team_inbox/global-status.md` — current status snapshot

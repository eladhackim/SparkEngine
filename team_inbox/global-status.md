# SparkEngine — Global Status

**Updated**: 2026-07-04 (portfolio audit — read-only, no code changes)
**Phase**: DORMANT (MVP deployed, no activity since 2026-04-12)

## Snapshot

| Item | Status |
|---|---|
| Live URL | https://sparkengine-3740d.web.app — UP (HTTP 200, verified 2026-07-04) |
| Last commit | 2026-04-09 (`f2edb40` — user preferences in AI idea generation) |
| Last real work | 2026-04-12 (mobile landing page, deployed but UNCOMMITTED) |
| Deployed functions | 8 ACTIVE (gen2, us-central1): generateIdeasHttp, generateIdeasScheduled, generateNicheIdeasScheduled, get/save/reset Preferences, applyPreset, listPresets |
| Scheduled jobs | Daily 6AM UTC + weekly Sun 2AM UTC — still firing, but 0 users enabled → 0 AI calls → near-zero idle burn |
| Revenue | $0 — no monetization implemented (spec exists: docs/Token-Based-Business-Model.md) |
| Users | 0 with auto-generation enabled (per function logs); total signups unknown |
| Tests | NONE (no test scripts, no test files) |
| Uncommitted | 99 paths on main, including live production code (app/page.tsx landing, app/login, app/signup, app/dashboard) |
| Worktrees | 9 stale (8 SparkEngine-worktree-* + SparkEngine-appstore-backend in ~/StudioProjects), all "prunable", dated April |

## Risks / Blockers

1. **Live site source is uncommitted** — the Apr 12 deploy came from working-tree files never committed to git. Data-loss risk. Needs Elad decision: commit or discard.
2. **No monetization path started** — token spec approved by no one; needs Elad go/no-go.
3. **HTTP generate endpoint is public Cloud Run URL** — auth enforcement should be re-verified before any relaunch.
4. **9 stale worktrees + 6 stale branches** — cleanup pending (do not delete without Elad approval).

## Decision Needed From Elad

Kill / freeze / relaunch. See `docs/opportunities.md` for options. Recommendation from 2026-07-04 audit: **freeze cleanly** (commit the working tree, keep hosting, disable schedulers) unless Elad commits to a monetization sprint.

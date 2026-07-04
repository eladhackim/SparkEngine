# SparkEngine — Opportunities & Strategic Options

**Source**: Portfolio audit 2026-07-04. Merged with existing thinking in
`docs/Token-Based-Business-Model.md` (2026-04-12) and `docs/product/features-roadmap.md`.

## Context

MVP live at https://sparkengine-3740d.web.app since Apr 2026. Dormant ~3 months.
$0 revenue, no known active users, no monetization implemented. Idle infra cost is
near-zero (scheduled AI pipelines short-circuit at 0 users; static hosting).
Cheap to keep alive — but also generating nothing.

## Quick Wins (days)

1. **Commit the working tree.** The live site's landing page + auth/dashboard restructure exist only as uncommitted files (deployed Apr 12, last commit Apr 9). One commit removes the single biggest asset-loss risk. (Needs Elad approval per audit rules — no commits were made.)
2. **Prune 9 stale worktrees + merged branches** (`git worktree prune` + branch cleanup). All marked prunable. (Needs Elad approval — not done in audit.)
3. **Disable the 2 Cloud Scheduler jobs if freezing** — they burn ~seconds of Cloud Run daily for nothing. Trivial cost either way; hygiene only.
4. **Verify auth on `generateIdeasHttp`** — public Cloud Run URL; confirm it rejects unauthenticated calls before any promotion.

## Medium Bets (2–4 weeks)

1. **Token monetization Phase 1** — spec already written (`docs/Token-Based-Business-Model.md`): free tier 300 tokens, Starter $19/mo, Stripe, out-of-tokens upsell modal. Estimated 2–3 weeks in the spec. This is the only defined path to first dollar.
2. **Distribution experiment before building billing**: the product has zero users — monetization code monetizes nobody. Cheaper test: launch on Product Hunt / indie-hacker channels with the existing free product, measure signups + generation volume, only then build billing.
3. **App Store Niche Discovery as the wedge** — the niche-discovery pipeline (free app-store scrapers + Gemini) is the most differentiated feature vs generic "AI idea generator" competitors (IdeaBuddy, Validator AI, Dimeadozen, plain ChatGPT). Could be repackaged as a focused "find your next app niche" tool with clearer willingness-to-pay (indie iOS/Android devs).

## Big Swings (quarter+)

1. **Idea-to-validation platform**: extend from generation to validation (landing-page tests, waitlist scoring) — larger market, but crowded and far from current state.
2. **B2B/API**: sell the pipeline (signals → scored ideas) to incubators/newsletters. Spec's Business tier gestures at this. Unvalidated.

## Kill / Pivot Assessment (honest)

- 3 months dormant, $0 revenue, 0 active users, founder attention elsewhere (PokerTime, youtube-text-finder is the Gemini spend driver — not Spark).
- Idle cost is near-zero, so there is no financial forcing function to kill it.
- **Recommendation: FREEZE cleanly, don't kill.** Commit the working tree, prune worktrees, disable schedulers, keep hosting live as a portfolio piece. Revisit only if Elad commits to a 3–4 week sprint: distribution test first, token billing second. Building the token system without users is the wrong order.
- **Kill trigger**: if a distribution test (medium bet 2) yields negligible signups, archive the repo and shut down functions.

**Decision owner**: Elad. Nothing above is auto-executable except worktree/scheduler hygiene, and those still need explicit approval.

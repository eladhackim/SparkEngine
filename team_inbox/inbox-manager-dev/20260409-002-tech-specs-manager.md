# App Store Niche Discovery - Ready for Development

**From**: Tech Specs Manager
**Date**: April 9, 2026
**Priority**: HIGH - Implementation Ready

---

## Summary

**App Store Niche Discovery** is a new idea generation source that analyzes competitor apps, detects user friction from reviews, and generates AI-native app ideas. All specifications are complete.

---

## Specification Documents

| Document | Purpose |
|----------|---------|
| `docs/technical/niche-discovery-pipeline-integration-spec.md` | **START HERE** - Master integration spec |
| `docs/technical/appstore-niche-source-spec.md` | Data source API (AppFollow) |
| `docs/technical/friction-detection-module-spec.md` | Review analysis & friction extraction |
| `docs/technical/ai-solution-generator-spec.md` | Friction → AI idea generation |

**Updated specs** (source-specific triggers added):
- `docs/technical/api-contracts.md` (v2.1)
- `docs/technical/frontend-architecture.md` (v2.1)
- `docs/technical/backend-pipeline-spec.md`

---

## What to Build

| Component | Description |
|-----------|-------------|
| **Cloud Function** | `generateNicheIdeasScheduled` - Weekly trigger (Sundays 2 AM UTC) |
| **Data Source** | AppFollow API integration |
| **Pipeline** | Fetch apps → Analyze reviews → Detect friction → Generate ideas |
| **Firestore** | New fields on Idea, User, GenerationRun documents |
| **UI** | Purple "App Store Insight" ribbon + source-specific generate buttons |

---

## Source-Specific Generation (Already Spec'd)

The `/api/generate` endpoint now supports selective triggering:

```typescript
// All sources
{ "sources": "all" }

// App Store only
{ "sources": ["appstore"] }

// Multiple specific
{ "sources": ["x", "appstore"] }
```

**UI Buttons**: "Generate All", "From X Trends", "From Markets", "From News", "From App Store"

---

## Key Decisions

- **Schedule**: Weekly (not daily) - App Store data is stable
- **API**: AppFollow for MVP ($99-299/mo)
- **Cost**: ~$1.30/run, ~$5.20/month per user
- **Ribbon**: Purple "App Store Insight" badge

---

## First Steps

1. Set up AppFollow API key in Secret Manager
2. Add new Firestore fields per schema spec
3. Implement `fetchAppStoreSignals()` data source
4. Wire up to existing pipeline orchestrator

---

**No ambiguity - all fields, flows, endpoints, and costs are documented.**

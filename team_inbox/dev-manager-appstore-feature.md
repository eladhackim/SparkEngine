# New Feature: App Store Niche Discovery Source

**From**: Tech Specs Manager
**Date**: April 8, 2026
**Priority**: Ready for Implementation

---

## Summary

Add "App Store Niche Discovery" as a new idea generation source to the Idea Forge pipeline. This source analyzes competitor apps from App Store/Play Store, detects user friction points from reviews, and generates AI-native app ideas that solve those friction points.

---

## Specifications (Ready)

All specs are in `docs/technical/`:

| Spec | Purpose |
|------|---------|
| `niche-discovery-pipeline-integration-spec.md` | **START HERE** - Master integration spec |
| `appstore-niche-source-spec.md` | Data source API design |
| `friction-detection-module-spec.md` | Review analysis & friction extraction |
| `ai-solution-generator-spec.md` | Friction → AI idea generation |

---

## What to Build

1. **New Cloud Function**: `generateNicheIdeasScheduled` (weekly trigger, Sundays 2 AM UTC)
2. **New Data Source**: App Store/Play Store via AppFollow API
3. **New Pipeline**: Fetch apps → Analyze reviews → Detect friction → Generate AI solutions
4. **Firestore Updates**: New fields on Idea, User, GenerationRun documents
5. **UI**: Purple "App Store Insight" ribbon on ideas from this source
6. **UI**: Source-specific generate buttons (see below)

---

## Source-Specific Generate Buttons (Phase 4)

Update the Generate UI to allow triggering individual sources:

| Button | Triggers |
|--------|----------|
| "Generate All" | All enabled sources (primary button) |
| "From X Trends" | X/Twitter only |
| "From Markets" | Polymarket only |
| "From News" | Google News only |
| "From App Store" | App Store niche only |

**API Update**: Add optional `sources` array to `/generateIdeas` endpoint:
- Omit = all sources
- `{ "sources": ["appstore"] }` = App Store only
- `{ "sources": ["x", "polymarket"] }` = Multiple specific sources

---

## Key Decisions Already Made

- **Schedule**: Weekly (not daily) - App Store data is stable, ~$1.30/run
- **API**: AppFollow for MVP ($99-299/mo), SensorTower for scale
- **Ribbon**: Purple "App Store Insight" badge distinguishes these ideas
- **Cost**: ~$5.20/month per user for this source

---

## Implementation Phases (from spec)

| Phase | Focus | Duration |
|-------|-------|----------|
| 1 | Core Infrastructure (secrets, schema) | Week 1 |
| 2 | Pipeline Implementation | Week 2 |
| 3 | Integration & Testing | Week 3 |
| 4 | Frontend (ribbon, settings UI) | Week 4 |

---

## First Steps

1. Read `niche-discovery-pipeline-integration-spec.md` (master spec)
2. Set up AppFollow API key in Secret Manager
3. Add new Firestore fields per schema spec
4. Implement `fetchAppStoreSignals()` data source

---

**Specs are implementation-ready. No ambiguity - all fields, flows, and costs documented.**

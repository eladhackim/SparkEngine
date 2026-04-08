# Friction Mapping Framework

**SparkEngine Technical Documentation**
**Version**: 1.0
**Date**: April 8, 2026
**Author**: Aviv-Yamamoto (Tech Specs Team)

---

## Executive Summary

This document defines the systematic methodology for identifying, categorizing, scoring, and prioritizing user friction points in competitor mobile applications. The framework combines Jobs-to-be-Done (JTBD) theory, customer journey mapping, and quantitative scoring to produce actionable friction maps that inform AI-powered solution opportunities.

---

## 1. Task Audit Methodology

### 1.1 Jobs-to-be-Done (JTBD) Foundation

Before mapping individual friction points, we must understand the user's core "job" - the fundamental goal they're trying to accomplish. This provides context for evaluating whether friction is blocking critical paths or peripheral features.

**JTBD Statement Format:**
```
When [situation], I want to [motivation], so I can [expected outcome].
```

**Example:**
```
When I'm planning meals for the week, I want to quickly generate a shopping list,
so I can save time at the grocery store.
```

### 1.2 Primary Value Path Analysis

For each competitor app, identify the primary value path - the minimum steps required to deliver the app's core value proposition.

| Analysis Component | Questions to Answer |
|-------------------|---------------------|
| **Ultimate Goal** | What is the user's desired end state? What success looks like? |
| **Minimum Path** | What are the fewest steps needed to achieve that goal? |
| **Critical Steps** | Which steps cannot be skipped or automated? |
| **Value Delivery Point** | At which step does the user receive meaningful value? |

### 1.3 Step-by-Step Task Audit Template

For each workflow, document every step using this classification system:

| Step # | Action Description | Step Type | Effort Level | Time Required | User Value | Automation Potential |
|--------|-------------------|-----------|--------------|---------------|------------|---------------------|
| 1 | [Specific action] | Input/Decision/Navigation/Waiting | High/Med/Low | X seconds/minutes | High/Med/Low/None | Full/Partial/None |
| 2 | ... | ... | ... | ... | ... | ... |

**Step Type Definitions:**

| Type | Description | Examples |
|------|-------------|----------|
| **Input** | User enters data manually | Typing text, selecting dates, uploading images |
| **Decision** | User must choose between options | Selecting categories, confirming actions, setting preferences |
| **Navigation** | User moves between screens/sections | Tapping menus, scrolling, switching tabs |
| **Waiting** | User waits for system response | Loading screens, processing, syncing |
| **Verification** | User reviews/confirms information | Checking previews, reviewing summaries |

**Effort Level Criteria:**

| Level | Definition | Indicators |
|-------|------------|------------|
| **High** | Significant cognitive or physical effort | Multiple fields, complex decisions, repetitive tapping |
| **Medium** | Moderate effort required | Single field entry, simple selection, standard navigation |
| **Low** | Minimal effort | Single tap, auto-filled data, clear binary choice |

### 1.4 Eight-Step Job Execution Analysis

Based on Outcome-Driven Innovation methodology, analyze each workflow through these eight phases:

1. **Define**: How does the user identify what they need to accomplish?
2. **Locate**: How do they find the necessary resources/features?
3. **Prepare**: What setup is required before executing?
4. **Confirm**: How do they verify readiness to proceed?
5. **Execute**: What is the core action to complete the job?
6. **Monitor**: How do they track progress during execution?
7. **Modify**: How can they adjust if something goes wrong?
8. **Conclude**: How do they know the job is complete?

Document friction encountered at each phase.

---

## 2. Friction Categories

### 2.1 Primary Friction Types

| Category | Description | Common Manifestations | AI Addressability |
|----------|-------------|----------------------|-------------------|
| **Input Friction** | Manual data entry requirements | Form fields, text input, photo uploads, date pickers | **High** - AI can auto-fill, predict, OCR |
| **Decision Friction** | Choices user must make | Category selection, option configuration, approval prompts | **Medium** - AI can suggest defaults |
| **Navigation Friction** | Effort to reach features | Deep menu hierarchies, hidden features, unclear pathways | **Medium** - AI can surface relevant actions |
| **Cognitive Friction** | Mental effort required | Complex UI, learning curve, unclear terminology | **High** - AI can simplify, explain, guide |
| **Repetitive Friction** | Same actions done repeatedly | Re-entering data, repeated confirmations, manual syncing | **High** - AI can automate patterns |
| **Waiting Friction** | Time delays | Loading screens, processing time, sync delays | **Low** - Infrastructure dependent |

### 2.2 Secondary Friction Indicators

These behavioral signals indicate friction presence (from user reviews and session analysis):

| Signal | Indicates | Friction Type |
|--------|-----------|---------------|
| **Rage clicks/taps** | Unresponsive UI, confusion | Navigation, Waiting |
| **Form abandonment** | Too much input required | Input |
| **Feature non-discovery** | Hidden or unclear access | Navigation, Cognitive |
| **Repeated errors** | Poor validation, unclear requirements | Input, Cognitive |
| **Support requests** | Unclear workflows | Cognitive |
| **Workarounds mentioned** | Missing or broken features | All types |

### 2.3 Friction by User Journey Stage

| Journey Stage | Common Friction Points | Priority |
|---------------|----------------------|----------|
| **Onboarding** | Account creation, permission requests, tutorial completion | Critical |
| **First Value** | Initial setup, first action completion | Critical |
| **Core Usage** | Primary feature interaction, data entry | High |
| **Retention** | Notifications, reminders, progress tracking | Medium |
| **Advanced Features** | Discovery, configuration, customization | Low |

---

## 3. Delta Analysis Framework

### 3.1 Delta Analysis Template

For each identified friction point, complete this analysis:

```markdown
## Delta Analysis: [Friction Point Name]

### Current State
- **What the app does**: [Describe current functionality]
- **User workflow**: [Step-by-step current process]
- **Time/effort required**: [Quantified measurement]
- **Error rate/pain indicators**: [From reviews or data]

### Desired State (from user feedback)
- **What users wish it could do**: [Specific capability requested]
- **Expected workflow**: [How users imagine it should work]
- **Expected effort level**: [User's time/effort expectation]
- **Implied automation**: [What users expect to happen automatically]

### Delta (Gap Analysis)
- **Capability gap**: [Specific missing functionality]
- **Effort reduction possible**: [X% reduction achievable]
- **Technical feasibility**: [Easy/Medium/Hard/Research needed]
- **Data requirements**: [What data is needed to bridge gap]
- **AI solution type**: [Prediction/Generation/Automation/Analysis]
```

### 3.2 Delta Quantification Guidelines

**Effort Reduction Calculation:**

```
Current Effort = (Steps × Avg Time per Step) + (Decisions × Decision Time) + Waiting Time
Desired Effort = Minimum viable steps × Optimized time
Delta % = ((Current - Desired) / Current) × 100
```

**Example:**
```
Current: 8 steps × 15 sec + 3 decisions × 10 sec + 5 sec waiting = 155 seconds
Desired: 2 steps × 5 sec = 10 seconds
Delta: ((155 - 10) / 155) × 100 = 93.5% effort reduction possible
```

### 3.3 Feasibility Assessment Matrix

| Factor | Easy (Score: 1) | Medium (Score: 2) | Hard (Score: 3) |
|--------|-----------------|-------------------|-----------------|
| **Data Availability** | Data already in app | Data can be inferred | External data needed |
| **AI Complexity** | Simple pattern matching | ML model required | Novel research needed |
| **Integration Effort** | API exists | Custom integration | Platform changes |
| **Privacy Concerns** | No sensitive data | Anonymizable data | PII required |

**Feasibility Score** = Sum of factors (4-12 scale)
- 4-6: Easy
- 7-9: Medium
- 10-12: Hard

---

## 4. Friction Scoring System

### 4.1 Composite Scoring Formula

Each friction point receives a composite score from 0-100:

| Criterion | Weight | Score Range | Scoring Guide |
|-----------|--------|-------------|---------------|
| **Frequency** | 30% | 1-5 | How often users encounter this |
| **Severity** | 25% | 1-5 | Level of user frustration/impact |
| **Automation Feasibility** | 25% | 1-5 | How achievable is AI solution |
| **Competitive Differentiation** | 20% | 1-5 | Uniqueness of solving this |

**Composite Score** = (F×0.30 + S×0.25 + A×0.25 + C×0.20) × 20

### 4.2 Detailed Scoring Rubrics

**Frequency Score:**
| Score | Definition | Evidence |
|-------|------------|----------|
| 5 | Every session | Core workflow, mandatory step |
| 4 | Most sessions | Primary feature, common path |
| 3 | Weekly | Secondary feature, occasional use |
| 2 | Monthly | Advanced feature, rare path |
| 1 | Rarely | Edge case, uncommon scenario |

**Severity Score:**
| Score | Definition | Evidence |
|-------|------------|----------|
| 5 | Blocking | Users abandon app, seek alternatives |
| 4 | High frustration | Multiple negative reviews mention this |
| 3 | Moderate annoyance | Some complaints, workarounds used |
| 2 | Minor inconvenience | Mentioned but not emphasized |
| 1 | Negligible | Not mentioned in reviews |

**Automation Feasibility Score:**
| Score | Definition | Technical Requirement |
|-------|------------|----------------------|
| 5 | Trivial | Simple logic, no ML needed |
| 4 | Easy | Basic ML, established patterns |
| 3 | Medium | Standard ML with training data |
| 2 | Hard | Advanced ML, complex inference |
| 1 | Research needed | Novel approach required |

**Competitive Differentiation Score:**
| Score | Definition | Market Position |
|-------|------------|-----------------|
| 5 | Unique solution | No competitor solves this |
| 4 | Better solution | Competitors have weak solutions |
| 3 | Comparable | Similar solutions exist |
| 2 | Incremental | Slightly better than competitors |
| 1 | Me-too | Competitors already solve well |

### 4.3 Priority Tiers

Based on composite scores, friction points are classified into priority tiers:

| Tier | Score Range | Action |
|------|-------------|--------|
| **P0 - Critical** | 80-100 | Must address in MVP |
| **P1 - High** | 60-79 | Address in v1.0 |
| **P2 - Medium** | 40-59 | Roadmap for v1.x |
| **P3 - Low** | 20-39 | Consider for future |
| **P4 - Backlog** | 0-19 | Document only |

---

## 5. Output Templates

### 5.1 Individual Friction Point Template

```markdown
## Friction Point: [FP-XXX] [Descriptive Name]

### Classification
- **App**: [Competitor app name]
- **Category**: [Input/Decision/Navigation/Cognitive/Repetitive/Waiting]
- **Journey Stage**: [Onboarding/First Value/Core Usage/Retention/Advanced]
- **Priority Tier**: [P0/P1/P2/P3/P4]

### Current User Flow
1. [Step 1 description]
2. [Step 2 description]
3. [Step n description]

**Total Steps**: X | **Estimated Time**: Y seconds | **Effort Level**: High/Med/Low

### User Pain Evidence
> "[Direct quote from app review]" - [Source]

> "[Another quote]" - [Source]

**Pain Indicators**:
- [Indicator 1]
- [Indicator 2]

### Delta Analysis

| Dimension | Current State | Desired State | Gap |
|-----------|---------------|---------------|-----|
| Steps Required | X | Y | -Z steps |
| Time Required | X sec | Y sec | -Z% |
| Data Entry | Manual | Auto | Full automation |
| Decisions | X choices | Y choices | -Z decisions |

### Scoring

| Criterion | Score (1-5) | Rationale |
|-----------|-------------|-----------|
| Frequency | X | [Why this score] |
| Severity | X | [Why this score] |
| Automation Feasibility | X | [Why this score] |
| Competitive Differentiation | X | [Why this score] |

**Composite Score**: XX/100 | **Priority**: PX

### AI Solution Opportunity
**Solution Type**: [Prediction/Generation/Automation/Analysis/Assistance]

**Concept**: [Brief description of how AI could address this friction]

**Data Requirements**: [What data would be needed]

**Technical Approach**: [High-level implementation idea]

---
```

### 5.2 App-Level Friction Map Template

```markdown
# Friction Map: [App Name]

**Analysis Date**: [Date]
**App Version**: [Version analyzed]
**Platform**: iOS / Android / Both
**Review Period**: [Date range of reviews analyzed]

## App Overview
- **Primary JTBD**: [When... I want to... so I can...]
- **Core Value Proposition**: [What the app promises]
- **Primary User Persona**: [Brief description]

## Friction Summary

### By Category
| Category | Count | Avg Score | Top Issue |
|----------|-------|-----------|-----------|
| Input | X | XX | [Brief description] |
| Decision | X | XX | [Brief description] |
| Navigation | X | XX | [Brief description] |
| Cognitive | X | XX | [Brief description] |
| Repetitive | X | XX | [Brief description] |
| Waiting | X | XX | [Brief description] |

### By Priority
| Priority | Count | Combined Score Impact |
|----------|-------|----------------------|
| P0 - Critical | X | XX% of total friction |
| P1 - High | X | XX% of total friction |
| P2 - Medium | X | XX% of total friction |
| P3+ - Lower | X | XX% of total friction |

## Primary Value Path Analysis
[Detailed step-by-step of main user workflow with friction points marked]

## Top 5 Friction Points

1. **[FP-XXX] [Name]** - Score: XX - [One-line summary]
2. **[FP-XXX] [Name]** - Score: XX - [One-line summary]
3. **[FP-XXX] [Name]** - Score: XX - [One-line summary]
4. **[FP-XXX] [Name]** - Score: XX - [One-line summary]
5. **[FP-XXX] [Name]** - Score: XX - [One-line summary]

## Detailed Friction Point Analysis
[Individual friction point entries using template 5.1]

## AI Opportunity Summary
[Table of all friction points with AI solution opportunities]

---
```

### 5.3 Cross-App Comparison Template

```markdown
# Cross-App Friction Analysis

## Apps Analyzed
1. [App 1 Name] - [Brief description]
2. [App 2 Name] - [Brief description]
3. [App 3 Name] - [Brief description]

## Comparative Friction Heatmap

| Friction Category | App 1 | App 2 | App 3 | Industry Average |
|-------------------|-------|-------|-------|------------------|
| Input | X/5 | X/5 | X/5 | X/5 |
| Decision | X/5 | X/5 | X/5 | X/5 |
| Navigation | X/5 | X/5 | X/5 | X/5 |
| Cognitive | X/5 | X/5 | X/5 | X/5 |
| Repetitive | X/5 | X/5 | X/5 | X/5 |
| Waiting | X/5 | X/5 | X/5 | X/5 |
| **Total** | XX | XX | XX | XX |

## Common Friction Patterns
[Friction points that appear across multiple apps]

## Unique Friction Points
[Friction points specific to individual apps]

## AI Solution Priority Matrix
[Ranked list of friction points by opportunity score]

---
```

---

## 6. Common Friction Patterns Reference

### 6.1 Onboarding Friction Patterns

| Pattern | Description | AI Solution Approach |
|---------|-------------|---------------------|
| **Long Sign-up Forms** | Multiple fields required before value | Progressive profiling, social login |
| **Permission Overload** | Too many permissions requested upfront | Contextual permission requests |
| **Mandatory Tutorials** | Forced walkthrough before use | Contextual help, smart defaults |
| **Profile Configuration** | Extensive setup before first use | AI-inferred preferences |
| **Verification Delays** | Email/phone verification blocking progress | Background verification |

### 6.2 Data Entry Friction Patterns

| Pattern | Description | AI Solution Approach |
|---------|-------------|---------------------|
| **Manual List Building** | Item-by-item entry | Bulk import, photo OCR, voice input |
| **Date/Time Selection** | Complex date pickers | Natural language parsing |
| **Category Assignment** | Manual organization | Auto-categorization |
| **Repeated Information** | Same data entered multiple times | Auto-fill, memory |
| **Format Requirements** | Strict input formatting | Flexible parsing, auto-format |

### 6.3 Navigation Friction Patterns

| Pattern | Description | AI Solution Approach |
|---------|-------------|---------------------|
| **Deep Hierarchies** | Many taps to reach features | Quick actions, shortcuts |
| **Hidden Features** | Useful features hard to find | Proactive suggestions |
| **Mode Switching** | Frequent context changes | Unified workflows |
| **Search Limitations** | Poor search results | Smart search, filters |

### 6.4 Repetitive Friction Patterns

| Pattern | Description | AI Solution Approach |
|---------|-------------|---------------------|
| **Weekly Reset Tasks** | Same actions every week | Automated routines |
| **Manual Sync** | User-initiated data sync | Background sync, smart refresh |
| **Confirmation Fatigue** | Excessive "Are you sure?" prompts | Smart confirmation (risky actions only) |
| **Re-authentication** | Frequent login requirements | Biometric, session management |

---

## 7. AI-Addressable Friction Categories

### 7.1 High AI Addressability (70-100% automation potential)

| Friction Type | AI Capability | Example |
|---------------|---------------|---------|
| **Data extraction from images** | Computer Vision, OCR | Receipt scanning, document parsing |
| **Natural language input** | NLP, Intent Recognition | Voice commands, conversational input |
| **Predictive suggestions** | ML Prediction | Auto-complete, smart defaults |
| **Pattern recognition** | ML Classification | Auto-categorization, anomaly detection |
| **Content generation** | LLM Generation | Draft creation, summarization |

### 7.2 Medium AI Addressability (30-70% automation potential)

| Friction Type | AI Capability | Limitation |
|---------------|---------------|------------|
| **Decision support** | Recommendation Systems | User must still decide |
| **Workflow optimization** | Process Mining | Depends on user patterns |
| **Error prevention** | Validation Models | Can't prevent all errors |
| **Personalization** | Preference Learning | Needs usage data |

### 7.3 Low AI Addressability (0-30% automation potential)

| Friction Type | Why AI Limited | Alternative Approach |
|---------------|----------------|---------------------|
| **Platform limitations** | OS/hardware constraints | Better UX design |
| **External dependencies** | Third-party services | Integration improvements |
| **Human judgment required** | Subjective decisions | Better information presentation |
| **Trust/security concerns** | User must verify | Transparency, explainability |

---

## 8. Application Process

### 8.1 Phase 2b Workflow

When market intelligence is received, apply this framework as follows:

1. **Review Market Intelligence**
   - Read competitor feature inventories
   - Study user pain points from reviews
   - Note preliminary friction opportunities

2. **For Each Competitor App:**
   - Define primary JTBD
   - Map primary value path
   - Conduct step-by-step task audit
   - Identify all friction points
   - Categorize by friction type
   - Complete delta analysis for each

3. **Score All Friction Points**
   - Apply scoring rubrics
   - Calculate composite scores
   - Assign priority tiers

4. **Create Deliverables**
   - Individual friction maps per app
   - Cross-app comparison analysis
   - Prioritized friction point list

5. **Handoff to Phase 3**
   - Deliver `docs/technical/friction-analysis.md`
   - Brief Wei-Ivanov on top opportunities
   - Highlight highest-scoring AI solutions

---

## References

- [Nielsen Norman Group - Journey Mapping Methodology](https://www.nngroup.com/)
- [Jobs-to-be-Done Framework - Tony Ulwick](https://jobs-to-be-done.com/jobs-to-be-done-a-framework-for-customer-needs-c883cbf61c90)
- [Measuring UX Friction in Practice](https://www.counting-stuff.com/measuring-ux-friction-in-practice/)
- [Journey Mapping for UX Friction - UpTop](https://uptopcorp.com/blog/use-journey-mapping-to-identify-resolve-ux-friction/)
- [User Flow Best Practices 2026](https://mockflow.com/blog/ux-user-flow-best-practices)
- [JTBD in UX Research - User Interviews](https://www.userinterviews.com/ux-research-field-guide-chapter/jobs-to-be-done-jtbd-framework)
- [Designing User Flows with JTBD - SIVO Insights](https://mrx.sivoinsights.com/blog/designing-user-flows-using-jobs-to-be-done)

---

*Document prepared for SparkEngine Phase 2 Technical Specifications*
*Ready for application upon Phase 1 completion*

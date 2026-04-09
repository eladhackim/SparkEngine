# Personalization Engine - Product Specification

**Status**: Product Specification
**Version**: 2.0
**Date**: April 9, 2026
**Author**: Zoe-Quinn (Product Specs Worker)
**Priority**: HIGH - Key differentiation feature

---

## 1. Overview

### 1.1 Feature Summary

The **Personalization Engine** is a comprehensive control panel that allows users to tailor the AI idea generation pipeline with professional-grade precision. Think **Bloomberg Terminal for idea generation** - every knob matters, every setting has purpose.

> **"Your ideas, your way. Tweak once, generate forever."**

### 1.2 User Value Proposition

| Value | Description |
|-------|-------------|
| **Precision** | 30+ controls enable exact specification of desired ideas |
| **Relevance** | Ideas match user's technical skills, market focus, and business goals |
| **Efficiency** | No more filtering through unsuitable ideas |
| **Investment** | Deep configuration creates personal investment and switching cost |
| **Professional** | Industry-standard presets for serious business exploration |

### 1.3 Strategic Rationale

| Strategic Goal | How Personalization Achieves It |
|----------------|--------------------------------|
| **User Value** | Ideas match what user can actually build - higher conversion to action |
| **Stickiness** | 30+ configured controls = massive switching cost |
| **Differentiation** | No competitor offers this depth of AI idea personalization |
| **Retention** | Users return to refine preferences as they learn and grow |
| **Engagement** | Satisfying controls create "power user" experience |

### 1.4 Design Philosophy

> **"Control panel for a power user"**

- Every control should feel meaningful and impactful
- Professional, industry-standard terminology
- Organized into logical, collapsible sections
- Presets serve as starting templates, not shortcuts

---

## 2. User Stories

### 2.1 P0 - Core Personalization

#### US-PERS-01: Navigate Control Sections

**As a** solo founder
**I want** to navigate organized sections of personalization controls
**So that** I can efficiently find and adjust specific settings

**Acceptance Criteria:**
- [ ] Given I open personalization settings, when the page loads, then I see 5 collapsible sections: Technical Requirements, Market & Audience, Business Model, Idea Characteristics, Personal Fit
- [ ] Given I view a section header, when collapsed, then I see a summary of current settings (e.g., "Backend: Moderate, Mobile: Required")
- [ ] Given I click a section header, when collapsed, then it expands with smooth animation (300ms)
- [ ] Given a section is expanded, when I click the header again, then it collapses
- [ ] Given multiple sections, when I expand one, then other sections remain in their current state (not auto-collapse)
- [ ] Given I'm on mobile, when viewing sections, then they stack vertically with full-width headers

**Priority:** P0
**Complexity:** Medium

---

#### US-PERS-02: Reset Section to Defaults

**As a** solo founder
**I want** to reset a specific section to default values
**So that** I can start fresh without affecting other sections

**Acceptance Criteria:**
- [ ] Given I view an expanded section, when I look at the section header, then I see a "Reset" button/icon
- [ ] Given I click "Reset" on a section, when clicked, then a confirmation dialog appears
- [ ] Given I confirm reset, when confirmed, then all controls in that section return to default values with animation
- [ ] Given I reset a section, when reset completes, then other sections remain unchanged
- [ ] Given I reset a section, when viewing profile completeness, then the score updates accordingly

**Priority:** P0
**Complexity:** Low

---

#### US-PERS-03: Configure Technical Requirements

**As a** solo founder
**I want** to specify detailed technical requirements across multiple dimensions
**So that** ideas match my exact technical capabilities and constraints

**Acceptance Criteria:**
- [ ] Given I expand Technical Requirements section, when viewing, then I see 8 controls for technical configuration
- [ ] Given I adjust Frontend Complexity slider, when set to "No UI", then generated ideas favor backend/API-only products
- [ ] Given I adjust Backend Requirements slider, when set to "Distributed Systems", then ideas may include complex infrastructure
- [ ] Given I toggle Mobile Required, when enabled, then ideas include mobile app components
- [ ] Given I adjust Data/ML Requirements, when set to "Advanced ML", then ideas leverage machine learning
- [ ] Given I save settings, when generating, then AI prompt includes all technical constraints

**Priority:** P0
**Complexity:** Medium

---

#### US-PERS-04: Configure Market & Audience

**As a** solo founder
**I want** to specify target market and audience characteristics
**So that** ideas align with my go-to-market capabilities

**Acceptance Criteria:**
- [ ] Given I expand Market & Audience section, when viewing, then I see 7 controls for market configuration
- [ ] Given I select Geographic Focus chips, when selecting "US" and "EU", then ideas focus on these regions
- [ ] Given I select Customer Segment chips, when selecting "Startup" and "SMB", then ideas target these segments
- [ ] Given I check Industry Verticals, when checking "Health" and "Finance", then ideas focus on these industries
- [ ] Given I select User Personas, when selecting "Developers", then ideas target developer audiences
- [ ] Given I configure B2B/B2C toggle, when set to "B2B", then consumer-focused ideas are deprioritized

**Priority:** P0
**Complexity:** Medium

---

#### US-PERS-05: Configure Business Model

**As a** solo founder
**I want** to specify business model preferences in detail
**So that** ideas match how I want to build and monetize

**Acceptance Criteria:**
- [ ] Given I expand Business Model section, when viewing, then I see 7 controls for business configuration
- [ ] Given I select Business Type toggles, when selecting "SaaS" and "Marketplace", then ideas focus on these models
- [ ] Given I adjust Pricing Model chips, when selecting "Freemium", then monetization strategies include freemium
- [ ] Given I select Sales Motion, when selecting "Self-serve", then ideas favor product-led growth
- [ ] Given I adjust Competition Level slider, when set to "Blue Ocean", then ideas target underserved markets
- [ ] Given I adjust Defensibility slider, when set to "High Moat", then ideas include strong competitive advantages

**Priority:** P0
**Complexity:** Medium

---

#### US-PERS-06: Configure Idea Characteristics

**As a** solo founder
**I want** to specify desired characteristics of generated ideas
**So that** ideas have the qualities I'm looking for

**Acceptance Criteria:**
- [ ] Given I expand Idea Characteristics section, when viewing, then I see 6 controls for idea qualities
- [ ] Given I adjust Novelty Level slider, when set to "First-of-kind", then ideas are more innovative
- [ ] Given I adjust Virality Potential slider, when set to "High", then ideas include viral mechanics
- [ ] Given I adjust Network Effects slider, when set to "Strong", then ideas leverage network effects
- [ ] Given I select Regulatory Complexity, when set to "None", then heavily regulated industries are excluded
- [ ] Given I adjust Capital Requirements, when set to "Bootstrap", then ideas are fundable without VC

**Priority:** P0
**Complexity:** Medium

---

#### US-PERS-07: Configure Personal Fit

**As a** solo founder
**I want** to specify my personal constraints and capabilities
**So that** ideas match what I can realistically execute

**Acceptance Criteria:**
- [ ] Given I expand Personal Fit section, when viewing, then I see 5 controls for personal configuration
- [ ] Given I adjust Domain Expertise slider, when set to "Generalist", then ideas don't require deep domain knowledge
- [ ] Given I select Time Commitment, when selecting "Side Project", then ideas are appropriate for part-time work
- [ ] Given I adjust Runway Requirements slider, when set to "Immediate Revenue", then ideas have fast monetization paths
- [ ] Given I use Topic Focus tags, when adding "AI" and "Automation", then ideas skew toward these domains
- [ ] Given I use Topic Avoidance tags, when adding "Crypto", then blockchain ideas are excluded

**Priority:** P0
**Complexity:** Medium

---

#### US-PERS-08: Apply Professional Preset

**As a** solo founder
**I want** to apply industry-standard preset profiles
**So that** I can quickly configure for specific business categories

**Acceptance Criteria:**
- [ ] Given I open personalization settings, when I view the presets section, then I see 10 professional preset cards
- [ ] Given I view preset cards, when displayed, then each shows: name, icon, brief description, key characteristics
- [ ] Given I click "SaaS B2B" preset, when applied, then all 30+ controls update to enterprise software defaults
- [ ] Given I click "Developer Tools" preset, when applied, then controls favor API/SDK/CLI products
- [ ] Given I apply a preset, when I view sections, then I can still modify any individual control
- [ ] Given I have custom settings, when clicking a preset, then a confirmation warns changes will overwrite
- [ ] Given I apply a preset, when applied, then all control changes animate in a satisfying cascade

**Priority:** P0
**Complexity:** Medium

---

#### US-PERS-09: Use Preset as Starting Point

**As a** solo founder
**I want** to use a preset as a starting template and customize from there
**So that** I can efficiently configure without starting from scratch

**Acceptance Criteria:**
- [ ] Given I apply a preset, when viewing controls, then all values are set but editable
- [ ] Given I modify a control after applying preset, when changed, then a "Modified" indicator appears
- [ ] Given I have modified controls, when viewing preset section, then current preset shows "Customized" badge
- [ ] Given I want to revert, when I click the preset again, then it offers "Reapply" to reset to original preset values
- [ ] Given I've customized, when profile completeness is calculated, then modifications count toward completion

**Priority:** P0
**Complexity:** Low

---

### 2.2 P1 - Enhanced Personalization

#### US-PERS-10: View Preference Profile Visualization

**As a** solo founder
**I want** to see a visual representation of my preference profile
**So that** I understand my idea "personality" at a glance

**Acceptance Criteria:**
- [ ] Given I have configured preferences, when I view personalization settings, then I see a radar/spider chart
- [ ] Given the chart is displayed, when viewing axes, then they show key dimensions: Technical, Market, Risk, Timeline, Capital
- [ ] Given I adjust any setting, when the chart updates, then changes animate smoothly
- [ ] Given I hover on a chart axis, when displayed, then I see the current value and contributing controls
- [ ] Given I view the chart, when displayed, then I can expand it to see more detailed breakdown

**Priority:** P1
**Complexity:** Medium

---

#### US-PERS-11: Track Profile Completeness

**As a** solo founder
**I want** to see how complete my personalization profile is
**So that** I'm motivated to configure all settings for better results

**Acceptance Criteria:**
- [ ] Given I open personalization settings, when displayed, then I see a "Profile Completeness" score (0-100%)
- [ ] Given some sections are unconfigured, when viewing, then incomplete sections are highlighted
- [ ] Given I configure a new control, when saved, then the completeness score increases with animation
- [ ] Given I reach 100% completeness, when displayed, then I see a celebration animation
- [ ] Given the score is displayed, when I hover, then I see breakdown by section

**Priority:** P1
**Complexity:** Low

---

#### US-PERS-12: Search Controls

**As a** power user
**I want** to search across all personalization controls
**So that** I can quickly find and adjust specific settings

**Acceptance Criteria:**
- [ ] Given I'm on the personalization page, when I focus the search field, then all controls become searchable
- [ ] Given I type "mobile", when searching, then controls matching "mobile" are highlighted/filtered
- [ ] Given search results are shown, when I click a result, then that section expands and scrolls to the control
- [ ] Given I clear search, when cleared, then normal section view is restored

**Priority:** P1
**Complexity:** Medium

---

### 2.3 P2 - Advanced Personalization

#### US-PERS-13: Preview Matching Ideas

**As a** solo founder
**I want** to see example ideas that would match my current settings
**So that** I can validate my configuration before generating

**Acceptance Criteria:**
- [ ] Given I adjust any personalization setting, when changed, then a preview panel shows 2-3 example idea titles
- [ ] Given the preview is displayed, when I view examples, then they update in real-time as I adjust
- [ ] Given I hover on a preview idea, when displayed, then I see why it matches my settings
- [ ] Given I'm satisfied with preview, when I click "Generate Now", then generation uses current settings

**Priority:** P2
**Complexity:** High

---

#### US-PERS-14: Export/Import Profile

**As a** power user
**I want** to export my preference profile as a shareable format
**So that** I can back up my settings or share with others

**Acceptance Criteria:**
- [ ] Given I view personalization settings, when I click "Export", then my profile downloads as JSON
- [ ] Given I have a JSON profile file, when I click "Import", then I can upload and apply it
- [ ] Given I import a profile, when imported, then all controls update to match the file
- [ ] Given the exported file, when shared, then another user can import it

**Priority:** P2
**Complexity:** Medium

---

#### US-PERS-15: Track Preference Evolution

**As a** solo founder
**I want** to see how my preferences have evolved over time
**So that** I can understand my journey and growth

**Acceptance Criteria:**
- [ ] Given I view personalization settings, when I click "History", then I see a timeline of changes
- [ ] Given the history is displayed, when I view entries, then each shows date, what changed, before/after
- [ ] Given I view history, when displayed, then I can click any past state to restore it
- [ ] Given I have history, when viewing, then insights show patterns

**Priority:** P2
**Complexity:** High

---

## 3. Control Inventory

### 3.1 Overview

**Total Controls: 33** organized into 5 collapsible sections.

| Section | Controls | Purpose |
|---------|----------|---------|
| Technical Requirements | 8 | Define technical scope and capabilities |
| Market & Audience | 7 | Specify target market and customer segments |
| Business Model | 7 | Configure business structure and monetization |
| Idea Characteristics | 6 | Define qualities of generated ideas |
| Personal Fit | 5 | Match ideas to personal constraints |

---

### 3.2 Section 1: Technical Requirements (8 Controls)

| # | Control | Type | Default | Options/Range | AI Prompt Influence |
|---|---------|------|---------|---------------|---------------------|
| 1 | **Frontend Complexity** | Slider (5) | 3 | No UI → Simple → Moderate → Complex SPA → Advanced | Sets `frontendScope` constraint |
| 2 | **Backend Requirements** | Slider (5) | 3 | Serverless → Simple API → Standard → Complex → Distributed Systems | Sets `backendScope` constraint |
| 3 | **Data/ML Requirements** | Slider (5) | 1 | None → Basic Analytics → Data Pipeline → ML Integration → Advanced ML | Sets `mlRequirements` constraint |
| 4 | **Mobile Requirements** | Toggle (3) | None | None / Responsive Web / Native Apps | Sets `mobileRequirement` |
| 5 | **Integration Complexity** | Slider (5) | 2 | Standalone → Few APIs → Moderate → Heavy → Enterprise Integrations | Sets `integrationScope` |
| 6 | **Infrastructure Needs** | Slider (5) | 2 | Managed/Serverless → Basic VPS → Standard → Complex → Multi-region | Sets `infrastructureScope` |
| 7 | **Security Requirements** | Toggle (3) | Standard | Basic → Standard → Enterprise-grade | Sets `securityLevel` |
| 8 | **Real-time Requirements** | Toggle | Off | Off / On (WebSocket/real-time features) | Sets `realtimeRequired` |

---

### 3.3 Section 2: Market & Audience (7 Controls)

| # | Control | Type | Default | Options/Range | AI Prompt Influence |
|---|---------|------|---------|---------------|---------------------|
| 9 | **Geographic Focus** | Multi-chips | Global | Global, US, EU, APAC, LATAM, MENA, Africa | Sets `geographicFocus` |
| 10 | **Customer Segment** | Multi-chips | All | Startup, SMB, Mid-market, Enterprise, Consumer | Sets `customerSegment` |
| 11 | **Industry Verticals** | Checkboxes | All | Health, Finance, Education, Retail, Manufacturing, Media, Real Estate, Legal, HR, Logistics | Sets `industryVerticals` |
| 12 | **User Personas** | Multi-chips | All | Developers, Designers, Marketers, Sales, Executives, Operations, Creators, Consumers | Sets `targetPersonas` |
| 13 | **B2B / B2C Focus** | Toggle (3) | Both | B2B Only / Both / B2C Only | Sets `businessFocus` |
| 14 | **Market Maturity** | Slider (5) | 3 | Emerging → Growing → Mature → Saturated → Declining | Sets `marketMaturity` preference |
| 15 | **Audience Size** | Slider (5) | 3 | Niche (<10K) → Small → Medium → Large → Mass Market (100M+) | Sets `audienceSize` target |

---

### 3.4 Section 3: Business Model (7 Controls)

| # | Control | Type | Default | Options/Range | AI Prompt Influence |
|---|---------|------|---------|---------------|---------------------|
| 16 | **Business Type** | Multi-toggle | All | SaaS, Marketplace, Service, Agency, Physical Product, Content/Media, Platform | Sets `businessTypes` |
| 17 | **Pricing Model** | Multi-chips | All | Free, Freemium, Subscription, One-time, Usage-based, Enterprise | Sets `pricingModels` |
| 18 | **Sales Motion** | Multi-chips | All | Self-serve, Sales-assisted, Enterprise Sales, Channel/Partners | Sets `salesMotion` |
| 19 | **Go-to-Market** | Multi-chips | All | Product-led, Sales-led, Community-led, Content-led, Partnership-led | Sets `gtmStrategy` |
| 20 | **Competition Level** | Slider (5) | 3 | Blue Ocean → Low → Moderate → High → Red Ocean | Sets `competitionPreference` |
| 21 | **Defensibility** | Slider (5) | 3 | Low Moat → Some → Moderate → Strong → High Moat | Sets `defensibilityTarget` |
| 22 | **Revenue Potential** | Slider (5) | 3 | Lifestyle ($10K/mo) → Small ($50K) → Medium ($200K) → Large ($1M+) → Massive ($10M+) | Sets `revenueTarget` |

---

### 3.5 Section 4: Idea Characteristics (6 Controls)

| # | Control | Type | Default | Options/Range | AI Prompt Influence |
|---|---------|------|---------|---------------|---------------------|
| 23 | **Novelty Level** | Slider (5) | 3 | Proven Model → Variation → Balanced → Novel → First-of-kind | Controls AI `temperature` + prompt |
| 24 | **Virality Potential** | Slider (5) | 2 | None → Low → Moderate → High → Viral-first | Sets `viralityTarget` |
| 25 | **Network Effects** | Slider (5) | 2 | None → Weak → Moderate → Strong → Critical | Sets `networkEffectsTarget` |
| 26 | **Regulatory Complexity** | Toggle (4) | Low | None → Low → Moderate → Heavily Regulated | Sets `regulatoryTolerance` |
| 27 | **Capital Requirements** | Slider (5) | 2 | Bootstrap → Seed-able → Series A → Growth → Venture-scale | Sets `capitalRequirements` |
| 28 | **Time to Revenue** | Slider (5) | 2 | Immediate → 1-3 mo → 3-6 mo → 6-12 mo → 1+ year | Sets `revenueTimeline` |

---

### 3.6 Section 5: Personal Fit (5 Controls)

| # | Control | Type | Default | Options/Range | AI Prompt Influence |
|---|---------|------|---------|---------------|---------------------|
| 29 | **Domain Expertise** | Slider (5) | 2 | Generalist → Some → Moderate → Specialist → Deep Expert | Sets `domainRequirement` |
| 30 | **Time Commitment** | Toggle (3) | Full-time | Side Project / Part-time / Full-time | Sets `timeCommitment` |
| 31 | **Runway Tolerance** | Slider (5) | 3 | Immediate Revenue → 3 mo → 6 mo → 12 mo → Long Runway OK | Sets `runwayTolerance` |
| 32 | **Topic Focus** | Tag input | Empty | Free-form + suggestions (max 15) | Adds `includeTags` to prompt |
| 33 | **Topic Avoidance** | Tag input | Empty | Free-form + suggestions (max 10) | Adds `excludeTags` to prompt |

---

### 3.7 Control Interaction Details

#### Sliders (5-step)
```
[Level 1]----[Level 2]----[Level 3]----[Level 4]----[Level 5]
```
- **Behavior**: Discrete steps with snap
- **Feedback**: Label updates on drag, value shown above thumb
- **Animation**: 200ms ease-out snap

#### Multi-Toggle
- **Behavior**: Multiple can be active simultaneously
- **Feedback**: Active = filled, Inactive = outline
- **Animation**: 150ms color/state transition

#### Multi-Chips
- **Behavior**: Click to select/deselect, multiple allowed
- **Feedback**: Checkmark on selected, scale pop (1.05x)
- **Animation**: 100ms spring

#### Tag Input
- **Behavior**: Type to search, autocomplete suggestions
- **Limits**: Topic Focus max 15, Topic Avoidance max 10
- **Animation**: Tags slide in (150ms)

---

## 4. Preset Profiles

### 4.1 Overview

**10 Professional Presets** organized by business category. Each preset configures all 33 controls to sensible defaults for that category.

---

### 4.2 SaaS B2B

> Enterprise software and business tools

| Section | Key Settings |
|---------|--------------|
| **Technical** | Backend: Complex, Frontend: Complex SPA, Security: Enterprise |
| **Market** | B2B Only, Enterprise + Mid-market, Global/US/EU |
| **Business** | SaaS, Subscription + Enterprise pricing, Sales-assisted |
| **Characteristics** | High defensibility, Strong network effects, Series A capital OK |
| **Personal** | Full-time, 6-12 mo runway, Moderate domain expertise |

**Icon**: Building
**Color**: Blue

---

### 4.3 Consumer App (B2C)

> Mass-market mobile and web applications

| Section | Key Settings |
|---------|--------------|
| **Technical** | Mobile: Native, Frontend: Complex SPA, Real-time: On |
| **Market** | B2C Only, Consumer, Global, Mass Market audience |
| **Business** | Platform, Freemium + Ads, Product-led |
| **Characteristics** | High virality, Strong network effects, Venture-scale |
| **Personal** | Full-time, Long runway, Generalist OK |

**Icon**: Smartphone
**Color**: Purple

---

### 4.4 Developer Tools

> APIs, SDKs, CLIs, and developer infrastructure

| Section | Key Settings |
|---------|--------------|
| **Technical** | Backend: Distributed, No UI/Simple, High integration |
| **Market** | B2B, Developers persona, Global, Startup + SMB |
| **Business** | SaaS + Platform, Usage-based + Freemium, Product-led + Community-led |
| **Characteristics** | High defensibility, Moderate novelty, Bootstrap to Seed |
| **Personal** | Full-time, Specialist domain (engineering), 6 mo runway |

**Icon**: Code
**Color**: Green

---

### 4.5 Creator Economy

> Tools for creators, influencers, and content producers

| Section | Key Settings |
|---------|--------------|
| **Technical** | Frontend: Complex, Mobile: Responsive, Real-time: On |
| **Market** | B2C + B2B, Creators persona, Global, Medium audience |
| **Business** | Platform + SaaS, Freemium + Transaction fees, Product-led + Content-led |
| **Characteristics** | High virality, Network effects, Seed-able capital |
| **Personal** | Full-time, Generalist, 3-6 mo to revenue |

**Icon**: Star
**Color**: Pink

---

### 4.6 SMB Services

> Software and services for small businesses

| Section | Key Settings |
|---------|--------------|
| **Technical** | Backend: Standard, Frontend: Moderate, Integration: Moderate |
| **Market** | B2B, SMB segment, US/EU focus, Small-Medium audience |
| **Business** | SaaS + Service, Subscription, Self-serve + Sales-assisted |
| **Characteristics** | Moderate competition, Low-moderate moat, Bootstrap |
| **Personal** | Full-time or Part-time, Some domain expertise, 3 mo runway |

**Icon**: Store
**Color**: Orange

---

### 4.7 Marketplace

> Two-sided platforms connecting buyers and sellers

| Section | Key Settings |
|---------|--------------|
| **Technical** | Backend: Complex, Frontend: Complex, Real-time: On |
| **Market** | Both B2B + B2C, Multiple segments, Regional focus |
| **Business** | Marketplace, Transaction fees, Product-led |
| **Characteristics** | Critical network effects, Blue ocean preferred, Growth capital |
| **Personal** | Full-time, Moderate domain, Long runway OK |

**Icon**: Repeat
**Color**: Teal

---

### 4.8 AI-First

> Products powered by artificial intelligence and ML

| Section | Key Settings |
|---------|--------------|
| **Technical** | ML: Advanced, Backend: Distributed, Infrastructure: Complex |
| **Market** | B2B primary, Enterprise + Mid-market, Global |
| **Business** | SaaS + Platform, Usage-based, Product-led + Sales-assisted |
| **Characteristics** | High novelty, High defensibility, Venture-scale capital |
| **Personal** | Full-time, Specialist (ML), Long runway |

**Icon**: Brain
**Color**: Indigo

---

### 4.9 Fintech

> Financial services, payments, and banking technology

| Section | Key Settings |
|---------|--------------|
| **Technical** | Security: Enterprise, Backend: Complex, Integration: Heavy |
| **Market** | B2B + B2C, Finance vertical, US/EU, Regulated |
| **Business** | Platform + SaaS, Transaction fees + Subscription, Sales-assisted |
| **Characteristics** | Heavily regulated, High defensibility, Growth capital |
| **Personal** | Full-time, Deep domain (finance), Long runway |

**Icon**: DollarSign
**Color**: Emerald

---

### 4.10 Health & Wellness

> Healthcare, fitness, and mental health products

| Section | Key Settings |
|---------|--------------|
| **Technical** | Mobile: Native, Security: Enterprise, Data: Moderate |
| **Market** | B2C primary, Health vertical, Global, Large audience |
| **Business** | SaaS + Platform, Subscription + Freemium, Product-led + Content-led |
| **Characteristics** | Moderate regulation, High social impact, Seed-able |
| **Personal** | Full-time, Some domain expertise, 6 mo runway |

**Icon**: Heart
**Color**: Red

---

### 4.11 E-commerce

> Online retail, D2C brands, and shopping technology

| Section | Key Settings |
|---------|--------------|
| **Technical** | Frontend: Complex, Mobile: Responsive, Integration: Heavy |
| **Market** | B2C, Retail vertical, Regional, Mass market |
| **Business** | Platform + Physical, Transaction fees + One-time, Product-led |
| **Characteristics** | High competition, Moderate moat, Bootstrap to Seed |
| **Personal** | Full-time, Generalist, Immediate to 3 mo revenue |

**Icon**: ShoppingCart
**Color**: Amber

---

## 5. UX Requirements

### 5.1 Section Layout

#### Collapsed Section
```
┌─────────────────────────────────────────────────────────────┐
│ ▶ Technical Requirements          [Reset]                   │
│   Backend: Complex • Mobile: Native • ML: Advanced          │
└─────────────────────────────────────────────────────────────┘
```

#### Expanded Section
```
┌─────────────────────────────────────────────────────────────┐
│ ▼ Technical Requirements          [Reset]                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend Complexity                                        │
│  [No UI]──[Simple]──[●Moderate]──[Complex]──[Advanced]     │
│                                                             │
│  Backend Requirements                                       │
│  [Serverless]──[Simple]──[Standard]──[●Complex]──[Distrib] │
│                                                             │
│  ... more controls ...                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Interaction Patterns

#### Section Collapse/Expand
- **Animation**: Height transition (300ms ease-in-out)
- **Indicator**: Chevron rotates 90° on expand
- **Summary**: Shows 3-4 key settings when collapsed

#### Preset Application
- **Confirmation**: Modal if user has custom settings
- **Animation**: Staggered update cascade (50ms per control, 1.5s total)
- **Feedback**: Success toast with preset name

#### Control Changes
- **Auto-save**: Changes save after 500ms debounce
- **Feedback**: Subtle pulse animation on saved control
- **Modified indicator**: Dot appears if different from preset default

### 5.3 Animation Specifications

| Animation | Duration | Easing | Notes |
|-----------|----------|--------|-------|
| Section expand/collapse | 300ms | ease-in-out | Height + opacity |
| Slider snap | 200ms | ease-out | Thumb position |
| Toggle state | 150ms | ease-in-out | Color + icon |
| Chip selection | 100ms | spring(1, 0.5) | Scale 1.05x |
| Preset cascade | 1500ms | staggered | 50ms per control |
| Completeness score | 500ms | ease-out | Counter increment |
| Section summary update | 200ms | ease-out | Text crossfade |

### 5.4 Mobile Adaptations

| Feature | Desktop | Mobile |
|---------|---------|--------|
| **Sections** | Two-column grid | Single column stack |
| **Presets** | Horizontal scroll | Vertical cards |
| **Sliders** | Standard track | Larger touch (56px height) |
| **Tag input** | Dropdown suggestions | Bottom sheet |
| **Save button** | Sticky footer | FAB (floating action) |
| **Search** | Inline header | Expandable field |

### 5.5 Accessibility

- All controls keyboard navigable (Tab, Arrow keys, Enter/Space)
- Section collapse/expand via Enter or Space
- Screen reader announces section state and control values
- Focus trap within expanded section until collapsed
- High contrast mode support
- Reduced motion option (instant transitions)

---

## 6. Lock-in & Engagement Features

### 6.1 Profile Completeness Score

**Calculation by Section:**

| Section | Weight | Completion Criteria |
|---------|--------|---------------------|
| Technical Requirements | 20% | At least 5 of 8 controls modified |
| Market & Audience | 20% | At least 4 of 7 controls modified |
| Business Model | 20% | At least 4 of 7 controls modified |
| Idea Characteristics | 20% | At least 3 of 6 controls modified |
| Personal Fit | 20% | At least 3 of 5 controls modified + 3 topic tags |

**Score Display:**
- 0-25%: "Getting Started" - Gray bar
- 26-50%: "Building Profile" - Yellow bar
- 51-75%: "Well Configured" - Blue bar
- 76-99%: "Power User" - Green bar
- 100%: "Fully Personalized" - Gold bar + badge

### 6.2 Achievement System

| Achievement | Trigger | Badge |
|-------------|---------|-------|
| **First Steps** | Modify any control | Bronze gear |
| **Section Master** | Complete one section 100% | Silver section icon |
| **Full Profile** | Reach 100% completeness | Gold profile badge |
| **Explorer** | Apply 5 different presets | Compass |
| **Customizer** | Modify 10+ controls after applying preset | Wrench |
| **Focused** | Add 10+ topic focus tags | Target |
| **Power User** | Use personalization for 30 days | Crown |

---

## 7. Technical Considerations

### 7.1 Firestore Schema

```typescript
// /users/{userId} document
interface UserPreferences {
  // Technical Requirements
  technical: {
    frontendComplexity: 1 | 2 | 3 | 4 | 5;
    backendRequirements: 1 | 2 | 3 | 4 | 5;
    dataMLRequirements: 1 | 2 | 3 | 4 | 5;
    mobileRequirements: 'none' | 'responsive' | 'native';
    integrationComplexity: 1 | 2 | 3 | 4 | 5;
    infrastructureNeeds: 1 | 2 | 3 | 4 | 5;
    securityRequirements: 'basic' | 'standard' | 'enterprise';
    realtimeRequired: boolean;
  };

  // Market & Audience
  market: {
    geographicFocus: string[];  // ['global', 'us', 'eu', ...]
    customerSegment: string[];  // ['startup', 'smb', ...]
    industryVerticals: string[];  // ['health', 'finance', ...]
    userPersonas: string[];  // ['developers', 'marketers', ...]
    businessFocus: 'b2b' | 'both' | 'b2c';
    marketMaturity: 1 | 2 | 3 | 4 | 5;
    audienceSize: 1 | 2 | 3 | 4 | 5;
  };

  // Business Model
  business: {
    businessTypes: string[];  // ['saas', 'marketplace', ...]
    pricingModels: string[];  // ['freemium', 'subscription', ...]
    salesMotion: string[];  // ['self-serve', 'sales-assisted', ...]
    goToMarket: string[];  // ['product-led', 'sales-led', ...]
    competitionLevel: 1 | 2 | 3 | 4 | 5;
    defensibility: 1 | 2 | 3 | 4 | 5;
    revenuePotential: 1 | 2 | 3 | 4 | 5;
  };

  // Idea Characteristics
  characteristics: {
    noveltyLevel: 1 | 2 | 3 | 4 | 5;
    viralityPotential: 1 | 2 | 3 | 4 | 5;
    networkEffects: 1 | 2 | 3 | 4 | 5;
    regulatoryComplexity: 'none' | 'low' | 'moderate' | 'heavy';
    capitalRequirements: 1 | 2 | 3 | 4 | 5;
    timeToRevenue: 1 | 2 | 3 | 4 | 5;
  };

  // Personal Fit
  personal: {
    domainExpertise: 1 | 2 | 3 | 4 | 5;
    timeCommitment: 'side-project' | 'part-time' | 'full-time';
    runwayTolerance: 1 | 2 | 3 | 4 | 5;
    topicFocus: string[];  // max 15
    topicAvoidance: string[];  // max 10
  };

  // Metadata
  activePreset: string | null;  // Current preset ID or null if custom
  presetModified: boolean;
  profileCompleteness: number;
  lastUpdated: Timestamp;
}
```

### 7.2 AI Prompt Construction

```typescript
function buildConstraintsFromPreferences(prefs: UserPreferences): string {
  const constraints: string[] = [];

  // Technical constraints
  const techLevels = ['minimal', 'basic', 'moderate', 'complex', 'advanced'];
  constraints.push(`Technical scope: Frontend ${techLevels[prefs.technical.frontendComplexity - 1]}, Backend ${techLevels[prefs.technical.backendRequirements - 1]}`);

  if (prefs.technical.mobileRequirements !== 'none') {
    constraints.push(`Mobile: ${prefs.technical.mobileRequirements} required`);
  }

  if (prefs.technical.dataMLRequirements > 2) {
    constraints.push(`ML/Data: ${techLevels[prefs.technical.dataMLRequirements - 1]} level`);
  }

  // Market constraints
  if (prefs.market.businessFocus !== 'both') {
    constraints.push(`Focus: ${prefs.market.businessFocus.toUpperCase()} only`);
  }

  if (prefs.market.customerSegment.length < 5) {
    constraints.push(`Target customers: ${prefs.market.customerSegment.join(', ')}`);
  }

  if (prefs.market.industryVerticals.length < 10) {
    constraints.push(`Industries: ${prefs.market.industryVerticals.join(', ')}`);
  }

  // Business constraints
  if (prefs.business.businessTypes.length < 7) {
    constraints.push(`Business models: ${prefs.business.businessTypes.join(', ')}`);
  }

  // Topic constraints
  if (prefs.personal.topicFocus.length > 0) {
    constraints.push(`INCLUDE topics: ${prefs.personal.topicFocus.join(', ')}`);
  }

  if (prefs.personal.topicAvoidance.length > 0) {
    constraints.push(`EXCLUDE topics: ${prefs.personal.topicAvoidance.join(', ')}`);
  }

  return constraints.join('\n');
}

function getTemperature(noveltyLevel: number): number {
  const temps = [0.3, 0.5, 0.7, 0.85, 1.0];
  return temps[noveltyLevel - 1];
}
```

---

## 8. Priority & Phasing

### 8.1 MVP (P0)

**Goal**: Ship comprehensive personalization with all 33 controls and 10 presets

| Feature | Stories | Rationale |
|---------|---------|-----------|
| 5 Collapsible sections | US-PERS-01 | Core navigation structure |
| Section reset | US-PERS-02 | Essential for usability |
| Technical Requirements (8 controls) | US-PERS-03 | High-impact section |
| Market & Audience (7 controls) | US-PERS-04 | Critical for targeting |
| Business Model (7 controls) | US-PERS-05 | Core differentiation |
| Idea Characteristics (6 controls) | US-PERS-06 | Quality control |
| Personal Fit (5 controls) | US-PERS-07 | User matching |
| 10 Professional presets | US-PERS-08, US-PERS-09 | Quick start |

**P0 Total**: 9 user stories, 33 controls, 10 presets

---

### 8.2 v1.1 (P1)

**Goal**: Add engagement features and polish

| Feature | Stories | Rationale |
|---------|---------|-----------|
| Preference radar chart | US-PERS-10 | Visual engagement |
| Profile completeness | US-PERS-11 | Gamification |
| Control search | US-PERS-12 | Power user efficiency |

**P1 Total**: 3 user stories

---

### 8.3 Future (P2)

**Goal**: Advanced features for power users

| Feature | Stories | Rationale |
|---------|---------|-----------|
| Live preview | US-PERS-13 | Validation UX |
| Export/Import | US-PERS-14 | Profile portability |
| Evolution tracking | US-PERS-15 | Deep engagement |

**P2 Total**: 3 user stories

---

## 9. Open Questions

### 9.1 Product Decisions

| Question | Options | Recommendation |
|----------|---------|----------------|
| **Can users create custom presets?** | Yes / No | No for MVP - 10 presets is sufficient |
| **Should presets be prominent or secondary?** | Above sections / Sidebar | Above sections - drives adoption |
| **Completeness: Gate generation?** | Required / Optional | Optional - never block core feature |

### 9.2 Technical Decisions

| Question | Options | Recommendation |
|----------|---------|----------------|
| **Preference sync frequency** | Real-time / Debounced / Manual save | Debounced (500ms) - balance UX and writes |
| **Default section state** | All collapsed / First expanded / All expanded | First section expanded |
| **Control validation** | Client-only / Server validation | Client + server validation |

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Controls configured** | Average 15+ per user | Mean non-default controls |
| **Preset usage** | 60% apply at least one | Users who apply preset |
| **Section engagement** | All 5 sections visited by 50% | Section expand events |
| **Profile completeness** | Average 70%+ | Mean completeness score |
| **Time in personalization** | 5+ min first session | Session duration |
| **Idea relevance lift** | +25% "Pursuing" rate | Ideas moved to Pursuing |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 9, 2026 | Zoe-Quinn | Initial specification (10 controls, 5 presets) |
| 2.0 | April 9, 2026 | Zoe-Quinn | Major revision: 33 controls, 10 professional presets, 5 sections |

---

*Spec created for Idea Forge product team. "Bloomberg Terminal for idea generation" - every knob matters.*

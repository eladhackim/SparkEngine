# Idea Forge: Scoring System Design

**Author**: Worker Ayelet-Davis
**Date**: 2026-04-08
**Status**: Research Complete

---

## Executive Summary

This document defines a comprehensive scoring system for evaluating business and app ideas in Idea Forge. The system uses 10 parameters across 3 categories, scored on a 1-5 scale with customizable weights, enabling users to filter, sort, and prioritize ideas based on their personal criteria and risk tolerance.

---

## 1. Core Parameters (5 Required Dimensions)

### 1.1 Business Potential (BP)

**Definition**: The overall revenue opportunity and market viability of the idea.

**Scoring Factors**:
| Factor | Weight | Description |
|--------|--------|-------------|
| Market Size | 30% | TAM/SAM/SOM assessment |
| Monetization Clarity | 25% | How obvious/proven is the revenue model |
| Revenue Quality | 25% | Recurring vs one-time, margins |
| Willingness to Pay | 20% | Evidence of customer spending in this space |

**Score Guide**:
- **5** - Large market ($1B+), clear monetization, high-margin recurring revenue, proven spending
- **4** - Substantial market ($100M+), solid monetization path, good margins
- **3** - Moderate market ($10M+), viable monetization, decent margins
- **2** - Small niche market, unclear monetization, thin margins
- **1** - Tiny/unproven market, no clear path to revenue

**AI Assessment**: Can estimate from market research, comparable companies, industry reports. Medium confidence.

---

### 1.2 Development Complexity (DC)

**Definition**: The technical effort, resources, and expertise required to build the product.

**Scoring Factors**:
| Factor | Weight | Description |
|--------|--------|-------------|
| Technical Difficulty | 35% | Novel algorithms, hard problems, cutting-edge tech |
| Required Integrations | 25% | Third-party APIs, services, dependencies |
| Team Requirements | 20% | Specialists needed (ML, security, etc.) |
| Maintenance Burden | 20% | Ongoing operational complexity |

**Score Guide** (Note: Lower complexity = Higher score for usability):
- **5** - Simple: Standard web/mobile app, common tech stack, solo developer possible
- **4** - Moderate: Some specialized components, 2-3 person team
- **3** - Significant: Multiple complex systems, requires specialists
- **2** - High: Cutting-edge tech, large team, significant R&D
- **1** - Extreme: Research-level problems, massive infrastructure, long dev cycles

**AI Assessment**: Can estimate from tech requirements, comparable products. High confidence for standard apps, lower for novel tech.

---

### 1.3 Time to Market (TTM)

**Definition**: How quickly a viable product can reach customers.

**Scoring Factors**:
| Factor | Weight | Description |
|--------|--------|-------------|
| MVP Timeline | 40% | Time to first usable version |
| External Dependencies | 30% | Waiting on APIs, partnerships, approvals |
| Content/Data Requirements | 20% | Need to build datasets, content libraries |
| Regulatory Timeline | 10% | Compliance, certifications, legal review |

**Score Guide**:
- **5** - Very Fast: MVP in 2-4 weeks, launch in 1-2 months
- **4** - Fast: MVP in 1-2 months, launch in 3-4 months
- **3** - Moderate: MVP in 3-4 months, launch in 6 months
- **2** - Slow: MVP in 6+ months, launch in 12+ months
- **1** - Very Slow: Multi-year development, significant blockers

**AI Assessment**: Can estimate from feature scope and complexity. Medium-high confidence.

---

### 1.4 Competition Level (CL)

**Definition**: The existing competitive landscape and barriers to entry.

**Scoring Factors**:
| Factor | Weight | Description |
|--------|--------|-------------|
| Number of Competitors | 25% | Direct and indirect competitors |
| Competitor Quality | 30% | How good are existing solutions |
| Market Concentration | 25% | Dominated by few players or fragmented |
| Switching Costs | 20% | How hard to win users from incumbents |

**Score Guide** (Higher = More favorable competitive position):
- **5** - Blue Ocean: No direct competitors, first-mover opportunity
- **4** - Low Competition: Few weak competitors, clear differentiation possible
- **3** - Moderate: Established players but room for new entrants
- **2** - Crowded: Many competitors, hard to differentiate
- **1** - Dominated: Market controlled by 1-2 giants, high switching costs

**AI Assessment**: Can research competitors, analyze market. High confidence for factual assessment.

---

### 1.5 Risk Level (RL)

**Definition**: The overall risk profile across technical, market, and execution dimensions.

**Scoring Factors**:
| Factor | Weight | Description |
|--------|--------|-------------|
| Technical Risk | 25% | Can it actually be built? Unproven tech? |
| Market Risk | 30% | Will people actually want/pay for this? |
| Execution Risk | 25% | Can the team deliver? Resource constraints? |
| Regulatory Risk | 20% | Legal, compliance, policy changes |

**Score Guide** (Higher = Lower risk = Better):
- **5** - Very Low Risk: Proven tech, validated market, experienced team
- **4** - Low Risk: Minor uncertainties, mostly de-risked
- **3** - Moderate Risk: Some significant unknowns
- **2** - High Risk: Multiple major uncertainties
- **1** - Very High Risk: Unproven on multiple fronts, many ways to fail

**AI Assessment**: Can identify risk factors but subjective weighting. Medium confidence.

---

## 2. Additional Parameters (5 Optional Dimensions)

### 2.1 Trend Alignment (TA)

**Definition**: How well the idea aligns with current market trends and timing.

**Score Guide**:
- **5** - Perfect Timing: Riding a major trend wave (AI in 2024-26, mobile in 2010-15)
- **4** - Good Timing: Relevant to growing trends
- **3** - Neutral: Not trend-dependent
- **2** - Early: Ahead of the market, may need to educate
- **1** - Late: Trend is peaking or declining

**AI Assessment**: Can analyze trend data, search volume, funding activity. High confidence.

---

### 2.2 Founder-Market Fit (FMF)

**Definition**: How well the idea matches the user's skills, experience, and network.

**Score Guide**:
- **5** - Perfect Fit: Deep domain expertise, relevant network, prior success
- **4** - Strong Fit: Significant relevant experience
- **3** - Moderate Fit: Some transferable skills
- **2** - Weak Fit: Would need to learn/hire significantly
- **1** - Poor Fit: No relevant background

**AI Assessment**: Requires user profile input. Can suggest based on stated skills. Medium confidence.

---

### 2.3 Growth Potential (GP)

**Definition**: The potential for organic, viral, or network-driven growth.

**Score Guide**:
- **5** - Viral Built-In: Product inherently spreads (social, sharing, network effects)
- **4** - Strong Organic: Natural word-of-mouth, SEO-friendly, community-driven
- **3** - Moderate: Standard marketing required but effective
- **2** - Weak: Requires significant paid acquisition
- **1** - Poor: High CAC, low retention, no organic channels

**AI Assessment**: Can analyze based on product type and comparable companies. Medium confidence.

---

### 2.4 Defensibility (DEF)

**Definition**: The ability to build sustainable competitive advantages (moats).

**Score Guide**:
- **5** - Strong Moats: Network effects, data advantages, patents, brand
- **4** - Good Defensibility: Some sustainable advantages
- **3** - Moderate: Can differentiate but advantages are copyable
- **2** - Weak: Easy to replicate, commodity risk
- **1** - None: Pure execution play, no lasting advantages

**AI Assessment**: Can analyze moat potential from product characteristics. Medium confidence.

---

### 2.5 Capital Efficiency (CE)

**Definition**: How much funding is needed and the path to profitability.

**Score Guide**:
- **5** - Bootstrappable: Can reach profitability with minimal/no external funding
- **4** - Lean: Needs small seed round, quick path to revenue
- **3** - Moderate: Standard startup funding path
- **2** - Capital Intensive: Requires significant funding before revenue
- **1** - Very Capital Intensive: Multi-round funding before break-even

**AI Assessment**: Can estimate from business model and comparable companies. Medium-high confidence.

---

## 3. Scoring Mechanics

### 3.1 Scale Recommendation

**Recommended: 1-5 Integer Scale**

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| 1-5 | Simple, intuitive, fast to assign | Less granular | **Primary choice** |
| 1-10 | More precision | Harder to distinguish 6 vs 7 | Alternative |
| 1-100 | Maximum precision | False precision, decision fatigue | Not recommended |

**Rationale**: For subjective assessments, 1-5 provides enough differentiation without false precision. Users can quickly understand that 4 is "good" and 2 is "concerning."

### 3.2 Weighting Strategy

**Default Weights** (customizable by user):

| Parameter | Default Weight | Rationale |
|-----------|---------------|-----------|
| Business Potential | 20% | Revenue is ultimate goal |
| Development Complexity | 15% | Affects execution feasibility |
| Time to Market | 15% | Speed matters for validation |
| Competition Level | 15% | Market dynamics crucial |
| Risk Level | 15% | Downside protection |
| Trend Alignment | 5% | Timing bonus |
| Founder-Market Fit | 5% | Execution advantage |
| Growth Potential | 5% | Scale bonus |
| Defensibility | 3% | Long-term value |
| Capital Efficiency | 2% | Resource constraints |

**Total**: 100%

**User Customization Options**:
- **Conservative Profile**: Higher weight on Risk, Competition, Capital Efficiency
- **Aggressive Profile**: Higher weight on Business Potential, Growth, Trend Alignment
- **Solo Founder Profile**: Higher weight on Complexity, Time to Market, Capital Efficiency
- **Custom**: User sets their own weights

### 3.3 Composite Score Calculation

```
Composite Score = Sum(Parameter Score * Parameter Weight)
```

**Example**:
- BP: 4 * 0.20 = 0.80
- DC: 3 * 0.15 = 0.45
- TTM: 4 * 0.15 = 0.60
- CL: 3 * 0.15 = 0.45
- RL: 3 * 0.15 = 0.45
- (Additional parameters...)
- **Composite: 3.5 / 5.0**

### 3.4 AI vs Human Scoring

| Approach | When to Use |
|----------|-------------|
| **AI Auto-Score** | Initial assessment, bulk scoring, objective parameters (Competition, Trend) |
| **AI Suggest + Human Review** | Subjective parameters, final scores |
| **Human Only** | Founder-Market Fit, personal passion metrics |

**Recommendation**:
1. AI generates initial scores for all parameters
2. Scores marked with confidence level (High/Medium/Low)
3. User can accept, adjust, or override any score
4. System learns from user adjustments over time

---

## 4. Actionability

### 4.1 Decision Thresholds

| Composite Score | Category | Action |
|-----------------|----------|--------|
| **4.0 - 5.0** | **HOT** | Pursue immediately, deep-dive research |
| **3.0 - 3.9** | **WARM** | Worth exploring, needs validation |
| **2.0 - 2.9** | **PARK** | Save for later, conditions may change |
| **1.0 - 1.9** | **DISCARD** | Not viable, archive |

### 4.2 Handling Trade-offs

**Problem**: Ideas can score high on some dimensions but low on others (e.g., high potential but high risk).

**Solution: Trade-off Flags**

| Flag | Condition | Meaning |
|------|-----------|---------|
| **High Risk / High Reward** | BP >= 4 AND RL <= 2 | Big opportunity but risky |
| **Hidden Gem** | BP >= 4 AND CL >= 4 | Great potential, low competition |
| **Grind Play** | BP >= 3 AND DC <= 2 | Solid but hard to build |
| **Quick Win** | TTM >= 4 AND CE >= 4 | Fast and cheap to validate |
| **Moonshot** | BP = 5 AND (DC <= 2 OR RL <= 2) | Huge potential, major challenges |

### 4.3 Portfolio View

Users should see ideas grouped by:
1. **Score Tier** (Hot/Warm/Park/Discard)
2. **Trade-off Profile** (flags above)
3. **Effort Level** (Quick Win vs Long-term)

---

## 5. Visual Display Concept

### 5.1 Idea Card (List View)

```
+------------------------------------------------------------------+
| [Icon] Idea Name                                    Score: 3.8/5 |
|                                                      [HOT]       |
| One-line description of the idea...                              |
|                                                                  |
| BP: ████░ 4  |  DC: ███░░ 3  |  TTM: ████░ 4                    |
| CL: ███░░ 3  |  RL: ███░░ 3  |                                   |
|                                                                  |
| Flags: [High Risk/High Reward] [Quick Win]                       |
+------------------------------------------------------------------+
```

### 5.2 Idea Detail View

```
+------------------------------------------------------------------+
| Idea Name                                                        |
| "One-line tagline"                                               |
|                                                                  |
| COMPOSITE SCORE                                                  |
| ████████████████████████████████████░░░░ 3.8/5.0 [WARM]         |
|                                                                  |
| CORE PARAMETERS                                                  |
| Business Potential   ████░ 4.0  [AI: High Confidence]           |
| Dev Complexity       ███░░ 3.0  [AI: Medium Confidence]          |
| Time to Market       ████░ 4.0  [User Adjusted]                  |
| Competition Level    ███░░ 3.0  [AI: High Confidence]           |
| Risk Level           ███░░ 3.0  [AI: Medium Confidence]          |
|                                                                  |
| ADDITIONAL PARAMETERS                                            |
| Trend Alignment      ████░ 4.0                                   |
| Founder-Market Fit   ██░░░ 2.0  [Needs your skills input]       |
| Growth Potential     ███░░ 3.0                                   |
| Defensibility        ██░░░ 2.0                                   |
| Capital Efficiency   ████░ 4.0                                   |
|                                                                  |
| TRADE-OFF FLAGS                                                  |
| [!] High Risk / High Reward - High upside but significant risks |
| [+] Quick Win - Fast to validate with low capital               |
|                                                                  |
| [Edit Scores] [Change Weights] [Compare with Others]            |
+------------------------------------------------------------------+
```

### 5.3 Comparison View (Spider/Radar Chart Concept)

```
                    Business Potential
                           5
                           |
                      4    |
         Defensibility  \  |  /  Dev Complexity
                    3    \ | /
                      2   \|/   2
         Growth ----1-----+-----1---- Time to Market
                      2   /|\   2
                    3    / | \
         Capital Eff   /  |  \  Competition
                      4    |
                           |
                           5
                     Risk Level

        ---- Idea A (solid line)
        .... Idea B (dotted line)
```

---

## 6. Edge Cases

### 6.1 Insufficient Data

**Scenario**: AI cannot confidently score a parameter (novel market, no comparables).

**Handling**:
- Mark score as "Low Confidence" or "Needs Research"
- Don't include in composite until validated
- Prompt user to provide manual assessment
- Offer research suggestions (e.g., "Search for X to validate market size")

### 6.2 Polarized Scores

**Scenario**: Idea scores 5 on some parameters, 1 on others.

**Handling**:
- Flag prominently: "Polarized - Review Required"
- Don't auto-categorize; require manual decision
- Show breakdown prominently, not just composite
- Suggest: "This idea has high potential but critical risks. Consider if risks are addressable."

### 6.3 Score Inflation/Deflation

**Scenario**: User consistently scores higher/lower than AI suggestions.

**Handling**:
- Track user's scoring patterns
- Optionally normalize or flag bias
- Show: "Your scores tend to be X% higher than AI estimates"

### 6.4 Stale Scores

**Scenario**: Market conditions change, old scores become inaccurate.

**Handling**:
- Timestamp all scores
- Auto-flag ideas not reviewed in 30/60/90 days
- Offer "Re-score" option that refreshes AI assessments
- Highlight: "Competition score may be outdated - 3 new competitors since last review"

### 6.5 Zero Business Potential but High Passion

**Scenario**: User loves an idea that scores poorly.

**Handling**:
- Allow "Passion Override" flag
- Track separately from data-driven list
- Don't delete, move to "Passion Projects" category
- Display: "This idea scores low on business metrics but you've marked it as a passion project"

---

## 7. Data Model Sketch

```typescript
interface IdeaScore {
  ideaId: string;

  // Core Parameters
  businessPotential: ParameterScore;
  developmentComplexity: ParameterScore;
  timeToMarket: ParameterScore;
  competitionLevel: ParameterScore;
  riskLevel: ParameterScore;

  // Additional Parameters
  trendAlignment?: ParameterScore;
  founderMarketFit?: ParameterScore;
  growthPotential?: ParameterScore;
  defensibility?: ParameterScore;
  capitalEfficiency?: ParameterScore;

  // Computed
  compositeScore: number; // 1.0 - 5.0
  tier: 'hot' | 'warm' | 'park' | 'discard';
  tradeoffFlags: TradeoffFlag[];

  // Meta
  lastUpdated: Timestamp;
  scoringMethod: 'ai_auto' | 'ai_assisted' | 'manual';
}

interface ParameterScore {
  value: number; // 1-5
  confidence: 'high' | 'medium' | 'low';
  source: 'ai' | 'user' | 'ai_adjusted';
  reasoning?: string;
  lastUpdated: Timestamp;
}

interface UserWeights {
  userId: string;
  preset: 'default' | 'conservative' | 'aggressive' | 'solo_founder' | 'custom';
  weights: {
    businessPotential: number; // 0.0 - 1.0, all must sum to 1.0
    developmentComplexity: number;
    // ... etc
  };
}
```

---

## 8. Recommendations Summary

| Aspect | Recommendation |
|--------|----------------|
| **Scale** | 1-5 integers |
| **Core Parameters** | 5 (BP, DC, TTM, CL, RL) |
| **Additional Parameters** | 5 optional (TA, FMF, GP, DEF, CE) |
| **Weighting** | Default weights with user customization |
| **AI Role** | Auto-score with confidence, user can adjust |
| **Thresholds** | 4.0+ Hot, 3.0-3.9 Warm, 2.0-2.9 Park, <2.0 Discard |
| **Trade-offs** | Flag system for polarized/notable patterns |
| **Display** | Compact cards + detailed breakdown + comparison charts |

---

## 9. Next Steps for Implementation

1. **Phase 1**: Implement core 5 parameters with simple 1-5 scoring
2. **Phase 2**: Add AI auto-scoring with confidence levels
3. **Phase 3**: Add additional 5 parameters as optional
4. **Phase 4**: Implement customizable weights and presets
5. **Phase 5**: Add comparison views and portfolio analytics

---

*End of Research Document*

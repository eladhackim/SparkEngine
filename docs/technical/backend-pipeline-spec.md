# Idea Forge: Backend Pipeline Specification

**Status**: Implementation-Ready
**Version**: 1.0
**Date**: April 8, 2026
**Author**: Ideation Manager
**Priority**: CRITICAL - This is the core value proposition

---

## Executive Summary

This document specifies the **automated idea generation pipeline** - the core feature of Idea Forge. The system monitors multiple data sources (X/Twitter, Polymarket, Google News), identifies trends and opportunities, and uses AI to generate scored business ideas automatically.

### Key Requirements

1. **Scheduled Generation**: Run automatically on a configurable interval (default: daily)
2. **Manual Trigger**: User can trigger generation on-demand via API or UI button
3. **Multi-Source Analysis**: Aggregate signals from X, Polymarket, Google News, and extensible sources
4. **AI Processing**: Use Grok and/or Gemini to analyze trends and generate structured ideas
5. **Auto-Scoring**: Each generated idea is automatically scored on all parameters
6. **Firestore Integration**: Generated ideas saved directly to user's ideas collection

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        IDEA GENERATION PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TRIGGERS                                                                    │
│  ────────                                                                    │
│  ┌─────────────────┐         ┌─────────────────┐                            │
│  │ Cloud Scheduler │         │  Manual Trigger │                            │
│  │ (Daily @ 6 AM)  │         │  (HTTP Endpoint)│                            │
│  └────────┬────────┘         └────────┬────────┘                            │
│           │                           │                                      │
│           └───────────┬───────────────┘                                      │
│                       ▼                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    generateIdeas (Cloud Function)                    │    │
│  │  Entry point - orchestrates the entire pipeline                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                       │                                                      │
│                       ▼                                                      │
│  STAGE 1: DATA COLLECTION                                                    │
│  ────────────────────────                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   fetchX    │  │fetchPolymarket│ │fetchGoogleNews│ │ fetchOther │        │
│  │  (Grok API) │  │  (REST API)  │  │  (News API)  │  │ (Extensible)│        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                 │                │
│         └────────────────┴────────────────┴─────────────────┘                │
│                                   │                                          │
│                                   ▼                                          │
│  STAGE 2: SIGNAL ANALYSIS                                                    │
│  ────────────────────────                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     analyzeSignals (Gemini/Grok)                     │    │
│  │  - Identify emerging trends                                          │    │
│  │  - Detect pain points and opportunities                              │    │
│  │  - Cross-reference sources for validation                            │    │
│  │  - Filter noise, prioritize high-potential signals                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                   │                                          │
│                                   ▼                                          │
│  STAGE 3: IDEA GENERATION                                                    │
│  ────────────────────────                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     generateFromSignals (Gemini)                     │    │
│  │  - Generate 5-15 business ideas per run                              │    │
│  │  - Diverse categories: games, tools, SaaS, platforms                 │    │
│  │  - Structured output with all required fields                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                   │                                          │
│                                   ▼                                          │
│  STAGE 4: SCORING                                                            │
│  ────────────────────                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        scoreIdeas (Gemini)                           │    │
│  │  - Score each idea on 5 core parameters (1-5)                        │    │
│  │  - Calculate composite score                                         │    │
│  │  - Assign decision tier (HOT/WARM/PARK/DISCARD)                      │    │
│  │  - Generate strengths, risks, business plan, pitch                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                   │                                          │
│                                   ▼                                          │
│  STAGE 5: PERSISTENCE                                                        │
│  ────────────────────                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      saveToFirestore                                 │    │
│  │  - Write ideas to /users/{userId}/ideas                              │    │
│  │  - Set status: "new"                                                 │    │
│  │  - Set source: "ai-generated" or "trend-suggested"                   │    │
│  │  - Log generation run metadata                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cloud Functions Specification

### 2.1 Main Orchestrator: `generateIdeas`

**Trigger Types**:
- HTTP (manual trigger from UI or API)
- Cloud Scheduler (automated daily runs)

**Runtime**: Node.js 20 (or latest LTS)
**Memory**: 1GB (AI processing requires headroom)
**Timeout**: 540 seconds (9 minutes max for Cloud Functions)

```typescript
// functions/src/generateIdeas.ts

import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';

// Secrets
const GROK_API_KEY = defineSecret('GROK_API_KEY');
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
const NEWS_API_KEY = defineSecret('NEWS_API_KEY');

interface GenerationConfig {
  userId: string;
  sources: ('x' | 'polymarket' | 'googlenews')[];
  ideasPerRun: number;  // Default: 10
  categories?: string[];  // Filter to specific categories
}

interface GenerationResult {
  success: boolean;
  ideasGenerated: number;
  ideasSaved: number;
  errors: string[];
  duration: number;
  runId: string;
}

/**
 * HTTP Trigger - Manual generation
 * POST /generateIdeas
 * Body: { userId: string, sources?: string[], ideasPerRun?: number }
 */
export const generateIdeasHttp = onRequest(
  {
    secrets: [GROK_API_KEY, GEMINI_API_KEY, NEWS_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 540,
    cors: true,
  },
  async (req, res) => {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const config: GenerationConfig = {
      userId,
      sources: req.body.sources || ['x', 'polymarket', 'googlenews'],
      ideasPerRun: req.body.ideasPerRun || 10,
      categories: req.body.categories,
    };

    const result = await runGenerationPipeline(config);
    res.json(result);
  }
);

/**
 * Scheduled Trigger - Daily generation
 * Runs at 6:00 AM UTC daily
 */
export const generateIdeasScheduled = onSchedule(
  {
    schedule: '0 6 * * *',  // Daily at 6 AM UTC
    timeZone: 'UTC',
    secrets: [GROK_API_KEY, GEMINI_API_KEY, NEWS_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 540,
  },
  async (event) => {
    // Get all users who have enabled auto-generation
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('autoGenerationEnabled', '==', true)
      .get();

    for (const userDoc of usersSnapshot.docs) {
      const config: GenerationConfig = {
        userId: userDoc.id,
        sources: userDoc.data().generationSources || ['x', 'polymarket', 'googlenews'],
        ideasPerRun: userDoc.data().ideasPerRun || 10,
      };

      try {
        await runGenerationPipeline(config);
      } catch (error) {
        console.error(`Generation failed for user ${userDoc.id}:`, error);
        // Continue with other users
      }
    }
  }
);
```

### 2.2 Pipeline Implementation

```typescript
// functions/src/pipeline/index.ts

import { fetchXTrends } from './sources/x';
import { fetchPolymarketSignals } from './sources/polymarket';
import { fetchGoogleNews } from './sources/googlenews';
import { analyzeSignals } from './ai/analyzeSignals';
import { generateFromSignals } from './ai/generateIdeas';
import { scoreIdeas } from './ai/scoreIdeas';
import { saveIdeas } from './persistence/saveIdeas';

export async function runGenerationPipeline(
  config: GenerationConfig
): Promise<GenerationResult> {
  const startTime = Date.now();
  const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const errors: string[] = [];

  try {
    // STAGE 1: Collect data from sources (parallel)
    console.log(`[${runId}] Stage 1: Fetching data from sources...`);

    const sourcePromises = [];
    if (config.sources.includes('x')) {
      sourcePromises.push(fetchXTrends().catch(e => { errors.push(`X: ${e.message}`); return null; }));
    }
    if (config.sources.includes('polymarket')) {
      sourcePromises.push(fetchPolymarketSignals().catch(e => { errors.push(`Polymarket: ${e.message}`); return null; }));
    }
    if (config.sources.includes('googlenews')) {
      sourcePromises.push(fetchGoogleNews().catch(e => { errors.push(`News: ${e.message}`); return null; }));
    }

    const sourceResults = await Promise.all(sourcePromises);
    const validResults = sourceResults.filter(r => r !== null);

    if (validResults.length === 0) {
      throw new Error('All data sources failed');
    }

    // STAGE 2: Analyze signals
    console.log(`[${runId}] Stage 2: Analyzing signals...`);
    const signals = await analyzeSignals(validResults);

    // STAGE 3: Generate ideas
    console.log(`[${runId}] Stage 3: Generating ideas...`);
    const rawIdeas = await generateFromSignals(signals, {
      count: config.ideasPerRun,
      categories: config.categories,
    });

    // STAGE 4: Score ideas
    console.log(`[${runId}] Stage 4: Scoring ideas...`);
    const scoredIdeas = await scoreIdeas(rawIdeas);

    // STAGE 5: Save to Firestore
    console.log(`[${runId}] Stage 5: Saving to Firestore...`);
    const savedCount = await saveIdeas(config.userId, scoredIdeas, runId);

    const duration = Date.now() - startTime;
    console.log(`[${runId}] Pipeline complete. ${savedCount} ideas saved in ${duration}ms`);

    // Log run metadata
    await logGenerationRun(config.userId, {
      runId,
      timestamp: new Date(),
      ideasGenerated: scoredIdeas.length,
      ideasSaved: savedCount,
      sources: config.sources,
      duration,
      errors,
    });

    return {
      success: true,
      ideasGenerated: scoredIdeas.length,
      ideasSaved: savedCount,
      errors,
      duration,
      runId,
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${runId}] Pipeline failed:`, error);

    return {
      success: false,
      ideasGenerated: 0,
      ideasSaved: 0,
      errors: [...errors, error.message],
      duration,
      runId,
    };
  }
}
```

---

## 3. Data Source Integrations

### 3.1 X/Twitter via Grok API

```typescript
// functions/src/pipeline/sources/x.ts

interface XTrendData {
  source: 'x';
  trends: {
    topic: string;
    volume: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    relatedTopics: string[];
  }[];
  painPoints: {
    description: string;
    frequency: number;
    examples: string[];
  }[];
  emergingDiscussions: {
    topic: string;
    growth: number;  // Percentage growth
    keyPhrases: string[];
  }[];
  fetchedAt: Date;
}

export async function fetchXTrends(): Promise<XTrendData> {
  const grokApiKey = process.env.GROK_API_KEY;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${grokApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-2-latest',
      messages: [
        {
          role: 'system',
          content: `You are a trend analyst with real-time access to X/Twitter data.
            Identify:
            1. Top trending topics relevant to business/tech/apps
            2. Pain points people are complaining about (potential business opportunities)
            3. Emerging discussions that are growing rapidly

            Focus on signals that could translate to app/business ideas.
            Return structured JSON.`
        },
        {
          role: 'user',
          content: 'Analyze current X/Twitter trends for business opportunities. Return JSON with trends, painPoints, and emergingDiscussions arrays.'
        }
      ],
      response_format: { type: 'json_object' },
    }),
  });

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  return {
    source: 'x',
    ...parsed,
    fetchedAt: new Date(),
  };
}
```

### 3.2 Polymarket API

```typescript
// functions/src/pipeline/sources/polymarket.ts

interface PolymarketData {
  source: 'polymarket';
  markets: {
    question: string;
    probability: number;
    volume: number;
    category: string;
    endDate: Date;
  }[];
  highConfidenceSignals: {
    topic: string;
    probability: number;
    implication: string;
  }[];
  emergingMarkets: {
    question: string;
    volumeGrowth: number;
    category: string;
  }[];
  fetchedAt: Date;
}

export async function fetchPolymarketSignals(): Promise<PolymarketData> {
  // Polymarket has a public REST API
  const baseUrl = 'https://clob.polymarket.com';

  // Fetch active markets
  const marketsResponse = await fetch(`${baseUrl}/markets?active=true&limit=100`);
  const markets = await marketsResponse.json();

  // Filter for relevant categories (tech, business, etc.)
  const relevantCategories = ['Technology', 'Business', 'Finance', 'Crypto'];
  const filteredMarkets = markets.filter(m =>
    relevantCategories.some(cat => m.category?.includes(cat))
  );

  // Identify high-confidence signals (probability > 0.8 or < 0.2)
  const highConfidenceSignals = filteredMarkets
    .filter(m => m.outcomePrices && (m.outcomePrices[0] > 0.8 || m.outcomePrices[0] < 0.2))
    .map(m => ({
      topic: m.question,
      probability: m.outcomePrices[0],
      implication: m.outcomePrices[0] > 0.8 ? 'Likely to happen' : 'Unlikely to happen',
    }));

  return {
    source: 'polymarket',
    markets: filteredMarkets.slice(0, 50).map(m => ({
      question: m.question,
      probability: m.outcomePrices?.[0] || 0.5,
      volume: m.volume || 0,
      category: m.category || 'Unknown',
      endDate: new Date(m.endDate),
    })),
    highConfidenceSignals,
    emergingMarkets: [], // Would need historical data to calculate
    fetchedAt: new Date(),
  };
}
```

### 3.3 Google News API

```typescript
// functions/src/pipeline/sources/googlenews.ts

interface GoogleNewsData {
  source: 'googlenews';
  articles: {
    title: string;
    description: string;
    category: string;
    publishedAt: Date;
    source: string;
  }[];
  trendingTopics: string[];
  industrySignals: {
    industry: string;
    headlines: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
  fetchedAt: Date;
}

export async function fetchGoogleNews(): Promise<GoogleNewsData> {
  const newsApiKey = process.env.NEWS_API_KEY;

  // Categories relevant to business ideas
  const categories = ['technology', 'business', 'science'];
  const articles = [];

  for (const category of categories) {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&apiKey=${newsApiKey}`
    );
    const data = await response.json();

    if (data.articles) {
      articles.push(...data.articles.map(a => ({
        title: a.title,
        description: a.description,
        category,
        publishedAt: new Date(a.publishedAt),
        source: a.source?.name || 'Unknown',
      })));
    }
  }

  // Extract trending topics from headlines
  const trendingTopics = extractTopicsFromHeadlines(articles.map(a => a.title));

  return {
    source: 'googlenews',
    articles,
    trendingTopics,
    industrySignals: [], // Would require NLP analysis
    fetchedAt: new Date(),
  };
}

function extractTopicsFromHeadlines(headlines: string[]): string[] {
  // Simple keyword extraction - could be enhanced with NLP
  const words = headlines.join(' ').toLowerCase().split(/\W+/);
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
  const wordCounts = new Map<string, number>();

  for (const word of words) {
    if (word.length > 3 && !stopWords.has(word)) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}
```

---

## 4. AI Processing

### 4.1 Signal Analysis

```typescript
// functions/src/pipeline/ai/analyzeSignals.ts

interface AnalyzedSignals {
  opportunities: {
    signal: string;
    sources: string[];
    confidence: number;
    category: string;
    urgency: 'immediate' | 'short-term' | 'long-term';
  }[];
  painPoints: {
    problem: string;
    audience: string;
    severity: number;  // 1-5
    sources: string[];
  }[];
  trendingThemes: string[];
}

export async function analyzeSignals(
  sourceData: (XTrendData | PolymarketData | GoogleNewsData)[]
): Promise<AnalyzedSignals> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const prompt = `You are a business opportunity analyst.

Analyze the following data from multiple sources and identify:
1. Business opportunities - signals that suggest a market need
2. Pain points - problems people are experiencing that could be solved
3. Trending themes - topics gaining momentum

DATA FROM SOURCES:
${JSON.stringify(sourceData, null, 2)}

Return a JSON object with this structure:
{
  "opportunities": [
    { "signal": "...", "sources": ["x", "polymarket"], "confidence": 0.8, "category": "SaaS", "urgency": "short-term" }
  ],
  "painPoints": [
    { "problem": "...", "audience": "...", "severity": 4, "sources": ["x"] }
  ],
  "trendingThemes": ["AI", "remote work", ...]
}

Focus on opportunities that could translate to viable app/business ideas.
Prioritize signals that appear across multiple sources.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}
```

### 4.2 Idea Generation

```typescript
// functions/src/pipeline/ai/generateIdeas.ts

interface RawIdea {
  name: string;
  brief: string;
  category: string;
  tags: string[];
  sourceSignals: string[];  // Which signals inspired this idea
}

interface GenerationOptions {
  count: number;
  categories?: string[];
}

export async function generateFromSignals(
  signals: AnalyzedSignals,
  options: GenerationOptions
): Promise<RawIdea[]> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const categoryFilter = options.categories?.length
    ? `Focus on these categories: ${options.categories.join(', ')}`
    : 'Include diverse categories: games, tools, SaaS, platforms, mobile apps, content';

  const prompt = `You are a creative business idea generator.

Based on the following market signals and opportunities, generate ${options.count} unique business/app ideas.

MARKET SIGNALS:
${JSON.stringify(signals, null, 2)}

REQUIREMENTS:
- Each idea should address a real opportunity or pain point from the signals
- Ideas should be actionable and buildable by a solo founder or small team
- Include a mix of complexity levels (quick MVPs to larger platforms)
- ${categoryFilter}
- Each idea needs: name (company name), brief (1-2 sentences), category, tags (3-5)

Return a JSON array of ideas:
[
  {
    "name": "AppName",
    "brief": "One or two sentence description of what it does and who it's for",
    "category": "SaaS",
    "tags": ["ai", "productivity", "b2b"],
    "sourceSignals": ["signal that inspired this"]
  }
]

Be creative but practical. Ideas should have clear monetization potential.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.9,  // Higher creativity
        },
      }),
    }
  );

  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}
```

### 4.3 Idea Scoring

```typescript
// functions/src/pipeline/ai/scoreIdeas.ts

interface ScoredIdea extends RawIdea {
  // Core scores (1-5)
  businessPotential: number;
  developmentComplexity: number;
  timeToMarket: number;
  competitionLevel: number;
  riskLevel: number;

  // Computed
  compositeScore: number;
  tier: 'hot' | 'warm' | 'park' | 'discard';

  // AI-generated content
  strengths: string[];
  risks: string[];
  businessPlan: {
    targetMarket: string;
    monetization: string;
    goToMarket: string;
    competitiveAdvantage: string;
  };
  elevatorPitch: string;
}

export async function scoreIdeas(ideas: RawIdea[]): Promise<ScoredIdea[]> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const prompt = `You are a business analyst scoring startup ideas.

For each idea, provide:
1. Scores (1-5 scale, where 5 is best/most favorable):
   - businessPotential: Revenue opportunity, market size
   - developmentComplexity: 5=easy to build, 1=very complex
   - timeToMarket: 5=can launch fast, 1=takes years
   - competitionLevel: 5=low competition, 1=saturated market
   - riskLevel: 5=low risk, 1=very risky

2. Analysis:
   - strengths: Array of 3-5 key advantages
   - risks: Array of 3-5 key challenges
   - businessPlan: { targetMarket, monetization, goToMarket, competitiveAdvantage }
   - elevatorPitch: 2-3 sentence pitch

IDEAS TO SCORE:
${JSON.stringify(ideas, null, 2)}

Return JSON array with all original fields plus scores and analysis.
Be critical and realistic in scoring - not everything is a 4 or 5.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,  // Lower temperature for consistent scoring
        },
      }),
    }
  );

  const data = await response.json();
  const scoredIdeas = JSON.parse(data.candidates[0].content.parts[0].text);

  // Calculate composite score and tier for each idea
  return scoredIdeas.map(idea => ({
    ...idea,
    compositeScore: calculateComposite(idea),
    tier: getTier(calculateComposite(idea)),
  }));
}

function calculateComposite(idea: any): number {
  const weights = {
    businessPotential: 0.25,
    developmentComplexity: 0.20,
    timeToMarket: 0.20,
    competitionLevel: 0.20,
    riskLevel: 0.15,
  };

  const score =
    idea.businessPotential * weights.businessPotential +
    idea.developmentComplexity * weights.developmentComplexity +
    idea.timeToMarket * weights.timeToMarket +
    idea.competitionLevel * weights.competitionLevel +
    idea.riskLevel * weights.riskLevel;

  return Math.round(score * 100) / 100;
}

function getTier(score: number): 'hot' | 'warm' | 'park' | 'discard' {
  if (score >= 4.0) return 'hot';
  if (score >= 3.0) return 'warm';
  if (score >= 2.0) return 'park';
  return 'discard';
}
```

---

## 5. Firestore Persistence

### 5.1 Save Ideas

```typescript
// functions/src/pipeline/persistence/saveIdeas.ts

import * as admin from 'firebase-admin';

export async function saveIdeas(
  userId: string,
  ideas: ScoredIdea[],
  runId: string
): Promise<number> {
  const db = admin.firestore();
  const batch = db.batch();
  let savedCount = 0;

  for (const idea of ideas) {
    const ideaRef = db.collection('users').doc(userId).collection('ideas').doc();

    batch.set(ideaRef, {
      // Basic info
      name: idea.name,
      brief: idea.brief,
      category: idea.category,
      tags: idea.tags,
      status: 'new',
      source: 'ai-generated',

      // Scores
      businessPotential: idea.businessPotential,
      developmentComplexity: idea.developmentComplexity,
      timeToMarket: idea.timeToMarket,
      competitionLevel: idea.competitionLevel,
      riskLevel: idea.riskLevel,
      compositeScore: idea.compositeScore,
      tier: idea.tier,

      // AI content
      strengths: idea.strengths,
      risks: idea.risks,
      businessPlan: idea.businessPlan,
      elevatorPitch: idea.elevatorPitch,

      // Metadata
      sourceSignals: idea.sourceSignals,
      generationRunId: runId,
      scoringMethod: 'ai-auto',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      noteCount: 0,
    });

    savedCount++;
  }

  await batch.commit();
  return savedCount;
}

export async function logGenerationRun(
  userId: string,
  metadata: {
    runId: string;
    timestamp: Date;
    ideasGenerated: number;
    ideasSaved: number;
    sources: string[];
    duration: number;
    errors: string[];
  }
): Promise<void> {
  const db = admin.firestore();

  await db
    .collection('users')
    .doc(userId)
    .collection('generationRuns')
    .doc(metadata.runId)
    .set({
      ...metadata,
      timestamp: admin.firestore.Timestamp.fromDate(metadata.timestamp),
    });
}
```

---

## 6. Scheduler Configuration

### 6.1 Cloud Scheduler Setup

```yaml
# scheduler.yaml (for deployment reference)

schedulers:
  - name: daily-idea-generation
    description: Generate ideas for all enabled users daily
    schedule: "0 6 * * *"  # 6 AM UTC daily
    timeZone: "UTC"
    target:
      type: cloud-function
      function: generateIdeasScheduled
    retryConfig:
      retryCount: 3
      minBackoffDuration: "60s"
      maxBackoffDuration: "600s"
```

### 6.2 User Settings for Automation

Add to user document schema:

```typescript
// Additional fields for /users/{userId} document
interface UserGenerationSettings {
  autoGenerationEnabled: boolean;  // Default: true
  generationSources: ('x' | 'polymarket' | 'googlenews')[];  // Default: all
  ideasPerRun: number;  // Default: 10, max: 25
  preferredCategories?: string[];  // Optional category filter
  generationTime?: string;  // Future: custom schedule time
}
```

---

## 7. API Endpoints

### 7.1 Manual Trigger Endpoint

**Endpoint**: `POST /api/generate`

**Authentication**: Bearer token (Firebase Auth)

**Request Body**:
```typescript
{
  sources?: ('x' | 'polymarket' | 'googlenews')[];  // Default: all
  ideasPerRun?: number;  // Default: 10, max: 25
  categories?: string[];  // Optional filter
}
```

**Response** (Success):
```typescript
{
  success: true,
  data: {
    runId: string;
    ideasGenerated: number;
    ideasSaved: number;
    duration: number;  // milliseconds
  }
}
```

**Response** (Error):
```typescript
{
  success: false,
  error: 'GENERATION_FAILED' | 'RATE_LIMITED' | 'UNAUTHORIZED',
  message: string,
  errors?: string[]
}
```

### 7.2 Generation Status Endpoint

**Endpoint**: `GET /api/generate/status`

**Response**:
```typescript
{
  lastRun: {
    runId: string;
    timestamp: string;
    ideasGenerated: number;
    success: boolean;
  } | null;
  nextScheduledRun: string | null;  // ISO timestamp
  autoGenerationEnabled: boolean;
}
```

### 7.3 Generation History Endpoint

**Endpoint**: `GET /api/generate/history`

**Response**:
```typescript
{
  runs: {
    runId: string;
    timestamp: string;
    ideasGenerated: number;
    ideasSaved: number;
    sources: string[];
    duration: number;
    success: boolean;
  }[];
}
```

---

## 8. Frontend Integration

### 8.1 Manual Trigger Button

Add to dashboard UI:

```typescript
// components/generation/generate-button.tsx

export function GenerateIdeasButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { mutate: generate } = useGenerateIdeas();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generate({
        sources: ['x', 'polymarket', 'googlenews'],
        ideasPerRun: 10,
      });
      toast.success(`Generated ${result.ideasSaved} new ideas!`);
    } catch (error) {
      toast.error('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isGenerating}
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Spinner className="w-4 h-4" />
          Generating Ideas...
        </>
      ) : (
        <>
          <SparklesIcon className="w-4 h-4" />
          Generate New Ideas
        </>
      )}
    </Button>
  );
}
```

### 8.2 Generation Settings Panel

```typescript
// components/settings/generation-settings.tsx

export function GenerationSettings() {
  const { data: settings, mutate: updateSettings } = useUserSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Idea Generation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Auto-generate daily</Label>
          <Switch
            checked={settings?.autoGenerationEnabled}
            onCheckedChange={(checked) => updateSettings({ autoGenerationEnabled: checked })}
          />
        </div>

        <div>
          <Label>Ideas per run</Label>
          <Select
            value={String(settings?.ideasPerRun || 10)}
            onValueChange={(v) => updateSettings({ ideasPerRun: Number(v) })}
          >
            <SelectItem value="5">5 ideas</SelectItem>
            <SelectItem value="10">10 ideas</SelectItem>
            <SelectItem value="15">15 ideas</SelectItem>
            <SelectItem value="25">25 ideas (max)</SelectItem>
          </Select>
        </div>

        <div>
          <Label>Data sources</Label>
          <div className="space-y-2 mt-2">
            <Checkbox
              label="X/Twitter (via Grok)"
              checked={settings?.generationSources?.includes('x')}
            />
            <Checkbox
              label="Polymarket"
              checked={settings?.generationSources?.includes('polymarket')}
            />
            <Checkbox
              label="Google News"
              checked={settings?.generationSources?.includes('googlenews')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 9. Cost Estimation

### 9.1 Per-Run Costs

| Component | Est. Cost per Run |
|-----------|-------------------|
| Grok API (trend fetching) | $0.05 - $0.15 |
| Gemini API (analysis + generation + scoring) | $0.10 - $0.30 |
| News API | Free tier (500 requests/day) |
| Polymarket API | Free |
| Cloud Functions execution | $0.01 - $0.02 |
| **Total per run** | **~$0.20 - $0.50** |

### 9.2 Monthly Costs (Daily Runs)

| Usage | Est. Monthly Cost |
|-------|-------------------|
| 30 runs (daily) | $6 - $15 |
| + 10 manual runs | +$2 - $5 |
| **Total** | **~$8 - $20/month** |

---

## 10. Error Handling & Retry Logic

### 10.1 Source Failure Handling

- Pipeline continues if one source fails (graceful degradation)
- Minimum 1 source must succeed for idea generation
- All errors logged and returned in response

### 10.2 AI Failure Handling

- Retry up to 3 times with exponential backoff
- If AI fails, return partial results if available
- Log failures for monitoring

### 10.3 Rate Limiting

- Cloud Function: Max 1 concurrent execution per user
- Manual trigger: Max 5 runs per hour per user
- Scheduled: 1 run per day per user

---

## 11. Monitoring & Observability

### 11.1 Logging

- Log each pipeline stage start/completion
- Log source fetch results
- Log idea counts at each stage
- Log errors with full context

### 11.2 Metrics to Track

- Generation runs per day (scheduled vs manual)
- Ideas generated per run (average)
- Source success rates
- AI API latency
- Cost per run

### 11.3 Alerts

- Alert if scheduled run fails 3x consecutively
- Alert if API costs exceed threshold
- Alert if idea generation drops to 0

---

## 12. Security Considerations

### 12.1 API Keys

- Store all API keys in Cloud Secret Manager
- Never log or expose keys
- Rotate keys periodically

### 12.2 User Data

- Ideas are user-scoped (isolated)
- Generation runs are user-scoped
- No cross-user data access

### 12.3 Rate Limiting

- Prevent abuse via rate limits
- Block excessive manual triggers
- Monitor for anomalous usage

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Ideation Manager | Initial backend pipeline specification |

---

*This specification enables the core value proposition: automated daily idea generation from multiple market sources.*

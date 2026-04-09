/**
 * AI Solution Generator Module
 * Generates AI-native app ideas from competitor friction analysis
 */

import {
  FrictionPoint,
  AINativeIdea,
  FrictionSource,
  AIApproachDetails,
  USPDetails,
  TechnicalOverview,
  AIApproach,
  DecisionTier,
  NicheProfile,
} from '../types/pipeline.js';

// ============================================
// CONFIGURATION
// ============================================

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

// AI approaches available
const AI_APPROACHES: Record<AIApproach, { name: string; description: string; costRange: string }> = {
  'multimodal-vision': {
    name: 'Multimodal Vision',
    description: 'Image/photo analysis via GPT-4o Vision or Gemini Vision',
    costRange: '$0.50-1.00/user/month',
  },
  'nlp-extraction': {
    name: 'NLP Extraction',
    description: 'LLM parsing of natural language input',
    costRange: '$0.20-0.50/user/month',
  },
  'voice-to-action': {
    name: 'Voice to Action',
    description: 'Whisper + LLM for voice commands',
    costRange: '$0.30-0.60/user/month',
  },
  'predictive-learning': {
    name: 'Predictive Learning',
    description: 'On-device ML learning patterns',
    costRange: '$0.10-0.30/user/month',
  },
  'contextual-inference': {
    name: 'Contextual Inference',
    description: 'Time, location, calendar context',
    costRange: '$0.10-0.20/user/month',
  },
  'continuous-learning': {
    name: 'Continuous Learning',
    description: 'Model improves from user corrections',
    costRange: '$0.20-0.40/user/month',
  },
  'autonomous-agent': {
    name: 'Autonomous Agent',
    description: 'Multi-step task execution',
    costRange: '$0.50-1.50/user/month',
  },
  'proactive-notification': {
    name: 'Proactive Notification',
    description: 'AI initiates based on patterns',
    costRange: '$0.05-0.15/user/month',
  },
};

// ============================================
// TYPES
// ============================================

interface FrictionCluster {
  clusterId: string;
  theme: string;
  frictionPointIds: string[];
  frictionPoints: FrictionPoint[];
  combinedScore: number;
  competitorsAffected: number;
  isIndustryWide: boolean;
}

interface GeneratedSolution {
  name: string;
  brief: string;
  category: string;
  tags: string[];
  heroFeature: {
    name: string;
    description: string;
    automationLevel: 2 | 3;
    demoScenario: string;
  };
  usp: {
    statement: string;
    before: string;
    after: string;
    quantifiedClaim: string;
    primaryCompetitor: string;
  };
  aiApproach: {
    primary: AIApproach;
    secondary: AIApproach[];
    effortReduction: number;
    description: string;
  };
  technical: {
    coreAPIs: string[];
    onDeviceComponents: string[];
    infrastructure: string[];
    mvpComplexity: 'low' | 'medium' | 'high';
    mvpTimeline: string;
    technicalRisks: string[];
  };
  businessPlan: {
    targetMarket: string;
    monetization: string;
    goToMarket: string;
    competitiveAdvantage: string;
  };
  scores: {
    businessPotential: number;
    developmentComplexity: number;
    timeToMarket: number;
    competitionLevel: number;
    riskLevel: number;
  };
}

// ============================================
// FRICTION CLUSTERING
// ============================================

/**
 * Cluster related friction points across competitors
 */
function clusterFrictionPoints(
  frictionPoints: FrictionPoint[],
  runId: string
): FrictionCluster[] {
  console.log(`[SolutionGenerator ${runId}] Clustering ${frictionPoints.length} friction points`);

  // Group by category first
  const categoryGroups = new Map<string, FrictionPoint[]>();
  for (const fp of frictionPoints) {
    const existing = categoryGroups.get(fp.category) || [];
    existing.push(fp);
    categoryGroups.set(fp.category, existing);
  }

  const clusters: FrictionCluster[] = [];
  let clusterNum = 1;

  for (const [category, points] of categoryGroups) {
    // For each category, create clusters based on similar descriptions/keywords
    const used = new Set<string>();

    for (const point of points) {
      if (used.has(point.id)) continue;

      // Find related points in same category
      const related = points.filter(p => {
        if (used.has(p.id)) return false;
        if (p.id === point.id) return true;

        // Check for keyword overlap or similar AI solution types
        const solutionOverlap = point.aiAnalysis.solutionTypes.some(
          s => p.aiAnalysis.solutionTypes.includes(s)
        );
        const highAddressability = p.aiAnalysis.addressability === 'high' &&
          point.aiAnalysis.addressability === 'high';

        return solutionOverlap && highAddressability;
      });

      if (related.length === 0) continue;

      // Mark as used
      for (const r of related) {
        used.add(r.id);
      }

      // Get unique apps affected
      const appsAffected = new Set(related.map(r => r.appName));

      // Calculate combined score (weighted average with bonus for cross-app)
      const avgScore = related.reduce((sum, r) => sum + r.compositeScore, 0) / related.length;
      const crossAppBonus = appsAffected.size > 1 ? 10 : 0;
      const combinedScore = Math.min(avgScore + crossAppBonus, 100);

      // Generate theme name from category and description
      const theme = generateThemeName(category, related[0].description);

      clusters.push({
        clusterId: `CLU-${String(clusterNum++).padStart(3, '0')}`,
        theme,
        frictionPointIds: related.map(r => r.id),
        frictionPoints: related,
        combinedScore,
        competitorsAffected: appsAffected.size,
        isIndustryWide: appsAffected.size >= 2,
      });
    }
  }

  // Sort by combined score descending
  clusters.sort((a, b) => b.combinedScore - a.combinedScore);

  console.log(`[SolutionGenerator ${runId}] Created ${clusters.length} clusters`);

  return clusters;
}

/**
 * Generate a human-readable theme name
 */
function generateThemeName(category: string, description: string): string {
  const categoryNames: Record<string, string> = {
    input: 'Manual Data Entry',
    navigation: 'Navigation Complexity',
    cognitive: 'Learning Curve',
    repetitive: 'Repetitive Tasks',
    waiting: 'Performance Issues',
    decision: 'Decision Fatigue',
    accuracy: 'Data Accuracy',
    paywall: 'Pricing Friction',
    reliability: 'Reliability Issues',
    other: 'Usability Issues',
  };

  return categoryNames[category] || 'User Friction';
}

// ============================================
// SOLUTION GENERATION
// ============================================

/**
 * Generate AI-native app ideas from friction clusters using Gemini
 */
async function generateSolutionsFromClusters(
  clusters: FrictionCluster[],
  niches: NicheProfile[],
  ideasPerNiche: number,
  geminiApiKey: string,
  runId: string
): Promise<GeneratedSolution[]> {
  // Take top clusters (highest combined scores)
  const topClusters = clusters.slice(0, Math.min(clusters.length, 5));

  if (topClusters.length === 0) {
    console.warn(`[SolutionGenerator ${runId}] No clusters available for generation`);
    return [];
  }

  // Build context for Gemini
  const clusterContext = topClusters.map(c => ({
    clusterId: c.clusterId,
    theme: c.theme,
    combinedScore: c.combinedScore,
    isIndustryWide: c.isIndustryWide,
    competitorsAffected: c.competitorsAffected,
    frictionPoints: c.frictionPoints.map(fp => ({
      description: fp.description,
      severity: fp.scores.severity,
      solutionTypes: fp.aiAnalysis.solutionTypes,
      suggestedApproach: fp.aiAnalysis.suggestedApproach,
      userQuotes: fp.evidence.userQuotes.slice(0, 2),
    })),
  }));

  const nicheContext = niches.map(n => ({
    name: n.name,
    category: n.category,
    marketSize: n.marketSize,
    avgRating: n.avgRating,
    topCompetitors: n.topApps.map(a => a.name).slice(0, 3),
  }));

  const aiApproachesContext = Object.entries(AI_APPROACHES).map(([key, val]) => ({
    id: key,
    name: val.name,
    description: val.description,
  }));

  const prompt = `You are an AI product strategist. Generate ${ideasPerNiche} innovative AI-native app ideas that solve the identified friction points.

FRICTION CLUSTERS (prioritized opportunities):
${JSON.stringify(clusterContext, null, 2)}

MARKET CONTEXT:
${JSON.stringify(nicheContext, null, 2)}

AVAILABLE AI APPROACHES:
${JSON.stringify(aiApproachesContext, null, 2)}

REQUIREMENTS:
1. Each idea must target a specific friction cluster
2. Use ONLY Level 2 or Level 3 automation (AI acts by default, user can override or review)
3. Include a "hero feature" that provides 10x improvement over competitors
4. USP must follow format: "[App] achieves [outcome] that [Competitor] requires [X] to accomplish—with [Y] user action."
5. Be realistic with effort reduction claims (70-95% range)
6. Include specific API requirements (GPT-4o Vision, Whisper, etc.)
7. Provide concrete timeline estimates (weeks)

Generate ${ideasPerNiche} ideas as JSON array:
[
  {
    "name": "AppName (brandable)",
    "brief": "One sentence pitch",
    "category": "Health & Fitness",
    "tags": ["ai", "automation", "health"],
    "heroFeature": {
      "name": "Feature Name",
      "description": "What it does",
      "automationLevel": 3,
      "demoScenario": "30-second demo description"
    },
    "usp": {
      "statement": "Full USP statement",
      "before": "Current painful experience",
      "after": "New magical experience",
      "quantifiedClaim": "95% less effort",
      "primaryCompetitor": "MyFitnessPal"
    },
    "aiApproach": {
      "primary": "predictive-learning",
      "secondary": ["multimodal-vision"],
      "effortReduction": 90,
      "description": "How AI is used"
    },
    "technical": {
      "coreAPIs": ["GPT-4o Vision", "Whisper"],
      "onDeviceComponents": ["Core ML model"],
      "infrastructure": ["Firebase Functions", "Firestore"],
      "mvpComplexity": "medium",
      "mvpTimeline": "6-8 weeks",
      "technicalRisks": ["API rate limits"]
    },
    "businessPlan": {
      "targetMarket": "Who we're targeting",
      "monetization": "How we make money",
      "goToMarket": "Launch strategy",
      "competitiveAdvantage": "Why we win"
    },
    "scores": {
      "businessPotential": 4,
      "developmentComplexity": 3,
      "timeToMarket": 3,
      "competitionLevel": 4,
      "riskLevel": 3
    }
  }
]

Be creative with naming but realistic with technical claims.`;

  const response = await fetch(`${GEMINI_API_URL}?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7, // Higher for creative naming
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json() as {
    candidates: Array<{
      content: {
        parts: Array<{ text: string }>;
      };
    }>;
  };

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response');
  }

  try {
    const solutions = JSON.parse(data.candidates[0].content.parts[0].text) as GeneratedSolution[];
    return Array.isArray(solutions) ? solutions : [];
  } catch (parseError) {
    console.error(`[SolutionGenerator ${runId}] JSON parse error:`, parseError);
    return [];
  }
}

// ============================================
// IDEA TRANSFORMATION
// ============================================

/**
 * Transform generated solutions to AI-native idea format
 */
function transformToAINativeIdeas(
  solutions: GeneratedSolution[],
  clusters: FrictionCluster[],
  runId: string
): AINativeIdea[] {
  return solutions.map((solution, index) => {
    // Find matching cluster
    const cluster = clusters[Math.min(index, clusters.length - 1)];

    // Calculate composite score
    const scores = solution.scores;
    const compositeScore =
      scores.businessPotential * 0.25 +
      scores.developmentComplexity * 0.20 +
      scores.timeToMarket * 0.20 +
      scores.competitionLevel * 0.20 +
      scores.riskLevel * 0.15;

    // Apply bonuses for AI-native ideas
    let adjustedScore = compositeScore;
    if (cluster?.isIndustryWide) adjustedScore += 0.3;
    if (solution.heroFeature.automationLevel === 3) adjustedScore += 0.2;
    if (solution.aiApproach.effortReduction >= 90) adjustedScore += 0.2;

    // Determine tier
    let tier: DecisionTier;
    if (adjustedScore >= 4.0) tier = 'hot';
    else if (adjustedScore >= 3.0) tier = 'warm';
    else if (adjustedScore >= 2.0) tier = 'park';
    else tier = 'discard';

    // Build friction source
    const frictionSource: FrictionSource = {
      clusterId: cluster?.clusterId || 'CLU-000',
      clusterTheme: cluster?.theme || 'Unknown',
      frictionPointIds: cluster?.frictionPointIds || [],
      competitorsDisrupted: cluster?.frictionPoints.map(fp => fp.appName) || [],
      combinedFrictionScore: cluster?.combinedScore || 0,
      isIndustryWide: cluster?.isIndustryWide || false,
    };

    // Build AI approach details
    const aiApproach: AIApproachDetails = {
      primary: solution.aiApproach.primary,
      secondary: solution.aiApproach.secondary,
      automationLevel: solution.heroFeature.automationLevel as 2 | 3,
      effortReduction: solution.aiApproach.effortReduction,
      description: solution.aiApproach.description,
    };

    // Build USP details
    const usp: USPDetails = {
      statement: solution.usp.statement,
      transformation: {
        before: solution.usp.before,
        after: solution.usp.after,
      },
      quantifiedClaim: solution.usp.quantifiedClaim,
      primaryCompetitor: solution.usp.primaryCompetitor,
    };

    // Build technical overview
    const technicalOverview: TechnicalOverview = {
      coreAPIs: solution.technical.coreAPIs,
      onDeviceComponents: solution.technical.onDeviceComponents,
      infrastructure: solution.technical.infrastructure,
      estimatedCostPerUser: AI_APPROACHES[solution.aiApproach.primary]?.costRange || '$0.50-1.00/user/month',
      mvpComplexity: solution.technical.mvpComplexity,
      mvpTimeline: solution.technical.mvpTimeline,
      technicalRisks: solution.technical.technicalRisks,
    };

    // Generate strengths and risks
    const strengths = [
      `Addresses ${cluster?.competitorsAffected || 1}+ competitors' shared weakness`,
      `${solution.aiApproach.effortReduction}% effort reduction via AI`,
      `Clear 10x demo: ${solution.heroFeature.demoScenario.substring(0, 50)}...`,
      `Mature APIs available: ${solution.technical.coreAPIs.join(', ')}`,
    ];

    const risks = [
      `API costs scale with usage`,
      ...solution.technical.technicalRisks.slice(0, 2),
      `Competitors may copy approach`,
    ];

    const idea: AINativeIdea = {
      // Standard idea fields
      name: solution.name,
      brief: solution.brief,
      category: solution.category as AINativeIdea['category'],
      tags: solution.tags,
      sourceSignals: cluster?.frictionPointIds || [],

      // Scores
      businessPotential: scores.businessPotential,
      developmentComplexity: scores.developmentComplexity,
      timeToMarket: scores.timeToMarket,
      competitionLevel: scores.competitionLevel,
      riskLevel: scores.riskLevel,
      compositeScore: Math.round(adjustedScore * 100) / 100,
      tier,

      // AI content
      strengths,
      risks,
      businessPlan: solution.businessPlan,
      elevatorPitch: `${solution.name} is ${solution.brief} Unlike ${solution.usp.primaryCompetitor}, we achieve ${solution.usp.quantifiedClaim} through AI-powered ${solution.heroFeature.name.toLowerCase()}.`,

      // AI-native specific fields
      source: 'friction-derived',
      displayLabel: 'App Store Insight',
      labelColor: 'purple',
      labelIcon: 'store',

      // Detailed AI-native data
      frictionSource,
      aiApproach,
      usp,
      technicalOverview,
    };

    return idea;
  });
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

/**
 * Generates AI-native app ideas from friction analysis
 * @param frictionPoints - Detected friction points from frictionDetector
 * @param niches - Niche profiles from appstore source
 * @param ideasPerNiche - Number of ideas to generate
 * @param runId - Pipeline run ID for logging
 * @returns Promise<AINativeIdea[]> - Generated AI-native ideas
 */
export async function generateAISolutions(
  frictionPoints: FrictionPoint[],
  niches: NicheProfile[],
  ideasPerNiche: number,
  runId: string
): Promise<AINativeIdea[]> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  console.log(`[SolutionGenerator ${runId}] Starting AI solution generation`);
  console.log(`[SolutionGenerator ${runId}] Input: ${frictionPoints.length} friction points, ${niches.length} niches`);

  if (frictionPoints.length === 0) {
    console.warn(`[SolutionGenerator ${runId}] No friction points available`);
    return [];
  }

  // Filter to high-priority friction points (P0 and P1)
  const highPriorityFriction = frictionPoints.filter(
    fp => fp.priority === 'P0' || fp.priority === 'P1'
  );

  console.log(`[SolutionGenerator ${runId}] High-priority friction points: ${highPriorityFriction.length}`);

  // Cluster friction points
  const clusters = clusterFrictionPoints(
    highPriorityFriction.length > 0 ? highPriorityFriction : frictionPoints.slice(0, 10),
    runId
  );

  if (clusters.length === 0) {
    console.warn(`[SolutionGenerator ${runId}] No clusters created`);
    return [];
  }

  // Generate solutions
  const solutions = await generateSolutionsFromClusters(
    clusters,
    niches,
    ideasPerNiche,
    geminiApiKey,
    runId
  );

  console.log(`[SolutionGenerator ${runId}] Generated ${solutions.length} solutions`);

  // Transform to AI-native ideas
  const ideas = transformToAINativeIdeas(solutions, clusters, runId);

  console.log(`[SolutionGenerator ${runId}] Transformed to ${ideas.length} AI-native ideas`);

  // Log tier breakdown
  const tierCounts = {
    hot: ideas.filter(i => i.tier === 'hot').length,
    warm: ideas.filter(i => i.tier === 'warm').length,
    park: ideas.filter(i => i.tier === 'park').length,
    discard: ideas.filter(i => i.tier === 'discard').length,
  };
  console.log(`[SolutionGenerator ${runId}] Tier breakdown: hot=${tierCounts.hot}, warm=${tierCounts.warm}, park=${tierCounts.park}`);

  return ideas;
}

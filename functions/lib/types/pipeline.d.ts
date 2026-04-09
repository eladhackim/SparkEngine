/**
 * Idea Forge Pipeline Types
 * Core type definitions for the AI-powered idea generation pipeline
 */
export type IdeaStatus = 'new' | 'reviewing' | 'pursuing' | 'parked' | 'rejected';
export type IdeaCategory = 'games' | 'tools' | 'saas' | 'platforms' | 'mobile' | 'content' | 'services' | 'hardware' | 'other';
export type IdeaSource = 'manual' | 'ai-generated' | 'trend-suggested' | 'imported' | 'friction-derived';
export type DecisionTier = 'hot' | 'warm' | 'park' | 'discard';
export type ScoringMethod = 'manual' | 'ai-auto' | 'ai-assisted';
export type GenerationSource = 'x' | 'polymarket' | 'googlenews' | 'appstore';
export type GenerationTrigger = 'manual' | 'scheduled';
export interface GenerationConfig {
    userId: string;
    sources: GenerationSource[];
    ideasPerRun: number;
    categories?: string[];
}
export interface GenerationResult {
    success: boolean;
    ideasGenerated: number;
    ideasSaved: number;
    errors: string[];
    duration: number;
    runId: string;
}
export interface XTrendData {
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
        growth: number;
        keyPhrases: string[];
    }[];
    fetchedAt: Date;
}
export interface PolymarketData {
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
export interface GoogleNewsData {
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
export type FrictionCategory = 'input' | 'navigation' | 'cognitive' | 'repetitive' | 'waiting' | 'decision' | 'accuracy' | 'paywall' | 'reliability' | 'other';
export type FrictionPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type AISolutionType = 'prediction' | 'recognition' | 'generation' | 'automation' | 'nlp' | 'analysis' | 'coaching' | 'integration';
export type AIApproach = 'multimodal-vision' | 'nlp-extraction' | 'voice-to-action' | 'predictive-learning' | 'contextual-inference' | 'continuous-learning' | 'autonomous-agent' | 'proactive-notification';
export interface CompetitorApp {
    name: string;
    appId: string;
    platform: 'ios' | 'android';
    category: string;
    downloads: string;
    rating: number;
    reviewCount: number;
    negativeReviewRate: number;
}
export interface FrictionPoint {
    id: string;
    appId: string;
    appName: string;
    category: FrictionCategory;
    description: string;
    scores: {
        frequency: number;
        severity: number;
        automationFeasibility: number;
        competitiveDifferentiation: number;
    };
    compositeScore: number;
    priority: FrictionPriority;
    evidence: {
        reviewCount: number;
        userQuotes: string[];
        platforms: ('ios' | 'android')[];
        ratingCorrelation: number;
    };
    aiAnalysis: {
        addressability: 'high' | 'medium' | 'low';
        solutionTypes: AISolutionType[];
        suggestedApproach: string;
    };
    metadata: {
        createdAt: Date;
        analysisVersion: string;
        sourceRunId: string;
    };
}
export interface NicheProfile {
    name: string;
    category: string;
    marketSize: string;
    topApps: CompetitorApp[];
    avgRating: number;
    negativeReviewRate: number;
    aiDisruptionScore: number;
    competitorWeaknesses: string[];
}
export interface FrictionOpportunity {
    title: string;
    description: string;
    category: string;
    currentProblem: string;
    aiSolution: string;
    affectedApps: string[];
    userQuotes: string[];
    marketSize: number;
    frictionSeverity: number;
    aiSolvability: number;
    opportunityScore: number;
}
export interface AppStoreData {
    source: 'appstore';
    niches: NicheProfile[];
    frictionPoints: FrictionPoint[];
    opportunities: FrictionOpportunity[];
    metadata: {
        appsAnalyzed: number;
        reviewsProcessed: number;
        categoriesAnalyzed: string[];
    };
    fetchedAt: Date;
}
export interface FrictionSource {
    clusterId: string;
    clusterTheme: string;
    frictionPointIds: string[];
    competitorsDisrupted: string[];
    combinedFrictionScore: number;
    isIndustryWide: boolean;
}
export interface AIApproachDetails {
    primary: AIApproach;
    secondary: AIApproach[];
    automationLevel: 2 | 3;
    effortReduction: number;
    description: string;
}
export interface USPDetails {
    statement: string;
    transformation: {
        before: string;
        after: string;
    };
    quantifiedClaim: string;
    primaryCompetitor: string;
}
export interface TechnicalOverview {
    coreAPIs: string[];
    onDeviceComponents: string[];
    infrastructure: string[];
    estimatedCostPerUser: string;
    mvpComplexity: 'low' | 'medium' | 'high';
    mvpTimeline: string;
    technicalRisks: string[];
}
export interface AINativeIdea extends ScoredIdea {
    source: 'friction-derived';
    displayLabel: string;
    labelColor: string;
    labelIcon: string;
    frictionSource: FrictionSource;
    aiApproach: AIApproachDetails;
    usp: USPDetails;
    technicalOverview: TechnicalOverview;
}
export interface NicheDiscoveryConfig {
    maxNiches: number;
    ideasPerNiche: number;
    focusCategories?: string[];
    minNegativeReviewRate: number;
    minMarketSize: string;
}
export interface NicheDiscoveryResult {
    success: boolean;
    runId: string;
    nichesAnalyzed: string[];
    ideasGenerated: number;
    ideasSaved: number;
    avgAIDisruptionScore: number;
    duration: number;
    errors: string[];
}
export type SourceData = XTrendData | PolymarketData | GoogleNewsData | AppStoreData;
export interface AnalyzedSignals {
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
        severity: number;
        sources: string[];
    }[];
    trendingThemes: string[];
}
export interface RawIdea {
    name: string;
    brief: string;
    category: IdeaCategory;
    tags: string[];
    sourceSignals: string[];
}
export interface GenerationOptions {
    count: number;
    categories?: string[];
}
export interface BusinessPlan {
    targetMarket: string;
    monetization: string;
    goToMarket: string;
    competitiveAdvantage: string;
}
export interface ScoredIdea extends RawIdea {
    businessPotential: number;
    developmentComplexity: number;
    timeToMarket: number;
    competitionLevel: number;
    riskLevel: number;
    compositeScore: number;
    tier: DecisionTier;
    strengths: string[];
    risks: string[];
    businessPlan: BusinessPlan;
    elevatorPitch: string;
}
export interface IdeaDocument {
    name: string;
    brief: string;
    category: IdeaCategory;
    status: IdeaStatus;
    source: IdeaSource;
    tags: string[];
    businessPotential: number;
    developmentComplexity: number;
    timeToMarket: number;
    competitionLevel: number;
    riskLevel: number;
    compositeScore: number;
    tier: DecisionTier;
    strengths: string[];
    risks: string[];
    businessPlan: BusinessPlan;
    elevatorPitch: string;
    sourceSignals: string[];
    generationRunId: string;
    scoringMethod: ScoringMethod;
    createdAt: FirebaseFirestore.FieldValue;
    updatedAt: FirebaseFirestore.FieldValue;
    noteCount: number;
    viewedAt: FirebaseFirestore.FieldValue | null;
}
export interface GenerationRunDocument {
    runId: string;
    timestamp: FirebaseFirestore.FieldValue;
    ideasGenerated: number;
    ideasSaved: number;
    success: boolean;
    sources: GenerationSource[];
    ideasPerRun: number;
    categories: string[] | null;
    trigger: GenerationTrigger;
    duration: number;
    errors: string[];
    stages?: {
        collecting?: {
            duration: number;
            success: boolean;
        };
        analyzing?: {
            duration: number;
            signalsFound: number;
        };
        generating?: {
            duration: number;
            ideasGenerated: number;
        };
        scoring?: {
            duration: number;
        };
        saving?: {
            duration: number;
            ideasSaved: number;
        };
    };
}
//# sourceMappingURL=pipeline.d.ts.map
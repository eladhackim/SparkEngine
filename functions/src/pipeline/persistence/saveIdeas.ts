/**
 * Firestore Persistence Layer
 * Saves generated ideas and logs generation runs to Firestore
 */

import * as admin from 'firebase-admin';
import { ScoredIdea, GenerationRunDocument, GenerationSource, GenerationTrigger, AINativeIdea } from '../../types/pipeline.js';

/**
 * Saves scored ideas to Firestore in a batch operation
 * @param userId - User ID to save ideas for
 * @param ideas - Array of scored ideas to save
 * @param runId - Generation run ID for linking
 * @returns Promise<number> - Number of ideas saved
 */
export async function saveIdeas(
  userId: string,
  ideas: ScoredIdea[],
  runId: string
): Promise<number> {
  const db = admin.firestore();
  const batch = db.batch();
  let savedCount = 0;

  console.log(`[Persistence] Saving ${ideas.length} ideas for user ${userId}...`);

  for (const idea of ideas) {
    const ideaRef = db.collection('users').doc(userId).collection('ideas').doc();

    batch.set(ideaRef, {
      // Basic info
      name: idea.name,
      brief: idea.brief,
      category: idea.category,
      tags: idea.tags || [],
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

      // Optional scores (null for AI-generated)
      trendAlignment: null,
      founderMarketFit: null,
      growthPotential: null,
      defensibility: null,
      capitalEfficiency: null,

      // AI content
      strengths: idea.strengths || [],
      risks: idea.risks || [],
      businessPlan: idea.businessPlan || null,
      elevatorPitch: idea.elevatorPitch || null,

      // Metadata
      sourceSignals: idea.sourceSignals || [],
      generationRunId: runId,
      scoringMethod: 'ai-auto',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      noteCount: 0,
      viewedAt: null,
      tradeoffFlags: calculateTradeoffFlags(idea),
    });

    savedCount++;
  }

  await batch.commit();
  console.log(`[Persistence] Saved ${savedCount} ideas`);

  return savedCount;
}

/**
 * Saves AI-native ideas from friction analysis to Firestore
 * @param userId - User ID to save ideas for
 * @param ideas - Array of AI-native ideas to save
 * @param runId - Generation run ID for linking
 * @returns Promise<number> - Number of ideas saved
 */
export async function saveAINativeIdeas(
  userId: string,
  ideas: AINativeIdea[],
  runId: string
): Promise<number> {
  const db = admin.firestore();
  const batch = db.batch();
  let savedCount = 0;

  console.log(`[Persistence] Saving ${ideas.length} AI-native ideas for user ${userId}...`);

  for (const idea of ideas) {
    const ideaRef = db.collection('users').doc(userId).collection('ideas').doc();

    batch.set(ideaRef, {
      // Basic info
      name: idea.name,
      brief: idea.brief,
      category: idea.category,
      tags: idea.tags || [],
      status: 'new',
      source: 'friction-derived',

      // Display label for UI ribbon
      displayLabel: idea.displayLabel || 'App Store Insight',
      labelColor: idea.labelColor || 'purple',
      labelIcon: idea.labelIcon || 'store',

      // Scores
      businessPotential: idea.businessPotential,
      developmentComplexity: idea.developmentComplexity,
      timeToMarket: idea.timeToMarket,
      competitionLevel: idea.competitionLevel,
      riskLevel: idea.riskLevel,
      compositeScore: idea.compositeScore,
      tier: idea.tier,

      // Optional scores (null for AI-generated)
      trendAlignment: null,
      founderMarketFit: null,
      growthPotential: null,
      defensibility: null,
      capitalEfficiency: null,

      // AI content
      strengths: idea.strengths || [],
      risks: idea.risks || [],
      businessPlan: idea.businessPlan || null,
      elevatorPitch: idea.elevatorPitch || null,

      // AI-native specific fields
      frictionSource: idea.frictionSource || null,
      aiApproach: idea.aiApproach || null,
      usp: idea.usp || null,
      technicalOverview: idea.technicalOverview || null,

      // Metadata
      sourceSignals: idea.sourceSignals || [],
      generationRunId: runId,
      scoringMethod: 'ai-friction-analysis',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      noteCount: 0,
      viewedAt: null,
      tradeoffFlags: calculateTradeoffFlags(idea),
    });

    savedCount++;
  }

  await batch.commit();
  console.log(`[Persistence] Saved ${savedCount} AI-native ideas`);

  return savedCount;
}

/**
 * Logs a generation run to Firestore
 * @param userId - User ID
 * @param metadata - Run metadata
 */
export async function logGenerationRun(
  userId: string,
  metadata: {
    runId: string;
    timestamp: Date;
    ideasGenerated: number;
    ideasSaved: number;
    sources: GenerationSource[];
    duration: number;
    errors: string[];
    trigger?: GenerationTrigger;
    stages?: GenerationRunDocument['stages'];
    pipelineType?: 'trend-based' | 'niche-discovery';
    appStoreMetrics?: {
      appsAnalyzed: number;
      reviewsProcessed: number;
      frictionPointsFound: number;
      nichesAnalyzed: string[];
    };
  }
): Promise<void> {
  const db = admin.firestore();

  console.log(`[Persistence] Logging generation run ${metadata.runId}...`);

  const runDoc: Omit<GenerationRunDocument, 'timestamp'> & { timestamp: admin.firestore.FieldValue } = {
    runId: metadata.runId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    ideasGenerated: metadata.ideasGenerated,
    ideasSaved: metadata.ideasSaved,
    success: metadata.errors.length === 0 && metadata.ideasSaved > 0,
    sources: metadata.sources,
    ideasPerRun: metadata.ideasGenerated,
    categories: null,
    trigger: metadata.trigger || 'manual',
    duration: metadata.duration,
    errors: metadata.errors,
  };

  if (metadata.stages) {
    runDoc.stages = metadata.stages;
  }

  // Add pipeline type if provided
  if (metadata.pipelineType) {
    (runDoc as Record<string, unknown>).pipelineType = metadata.pipelineType;
  }

  // Add App Store metrics if provided
  if (metadata.appStoreMetrics) {
    (runDoc as Record<string, unknown>).appStoreMetrics = metadata.appStoreMetrics;
  }

  await db
    .collection('users')
    .doc(userId)
    .collection('generationRuns')
    .doc(metadata.runId)
    .set(runDoc);

  // Update user's last generation run timestamp (use set with merge to handle new users)
  await db
    .collection('users')
    .doc(userId)
    .set({
      lastGenerationRun: admin.firestore.FieldValue.serverTimestamp(),
      generationRunCount: admin.firestore.FieldValue.increment(1),
    }, { merge: true });

  console.log(`[Persistence] Generation run logged`);
}

/**
 * Calculates trade-off flags based on score patterns
 * @param idea - Scored idea
 * @returns Array of trade-off flags
 */
function calculateTradeoffFlags(idea: ScoredIdea): string[] {
  const flags: string[] = [];

  // high-risk-high-reward: businessPotential >= 4 AND riskLevel <= 2
  if (idea.businessPotential >= 4 && idea.riskLevel <= 2) {
    flags.push('high-risk-high-reward');
  }

  // hidden-gem: businessPotential >= 4 AND competitionLevel >= 4
  if (idea.businessPotential >= 4 && idea.competitionLevel >= 4) {
    flags.push('hidden-gem');
  }

  // grind-play: businessPotential >= 3 AND developmentComplexity <= 2
  if (idea.businessPotential >= 3 && idea.developmentComplexity <= 2) {
    flags.push('grind-play');
  }

  // quick-win: timeToMarket >= 4 AND competitionLevel >= 4
  if (idea.timeToMarket >= 4 && idea.competitionLevel >= 4) {
    flags.push('quick-win');
  }

  // moonshot: businessPotential = 5 AND (developmentComplexity <= 2 OR riskLevel <= 2)
  if (idea.businessPotential === 5 && (idea.developmentComplexity <= 2 || idea.riskLevel <= 2)) {
    flags.push('moonshot');
  }

  return flags;
}

/**
 * Pipeline Orchestrator
 * Coordinates the entire idea generation pipeline from data collection to persistence
 */

import { fetchXTrends } from './sources/x.js';
import { fetchPolymarketSignals } from './sources/polymarket.js';
import { fetchGoogleNews } from './sources/googlenews.js';
import { fetchAppStoreData } from './sources/appstore.js';
import { analyzeSignals } from './ai/analyzeSignals.js';
import { generateFromSignals } from './ai/generateIdeas.js';
import { scoreIdeas } from './ai/scoreIdeas.js';
import { saveIdeas, logGenerationRun, saveAINativeIdeas } from './persistence/saveIdeas.js';
import { detectFriction } from './frictionDetector.js';
import { generateAISolutions } from './solutionGenerator.js';
import {
  GenerationConfig,
  GenerationResult,
  SourceData,
  GenerationTrigger,
  ProgressCallback,
  CollectingProgressData,
  AnalyzingProgressData,
  GeneratingProgressData,
  SavingProgressData,
} from '../types/pipeline.js';

/**
 * Runs the complete idea generation pipeline
 * @param config - Generation configuration
 * @param trigger - How the run was triggered (manual or scheduled)
 * @param onProgress - Optional callback for SSE progress streaming
 * @returns Promise<GenerationResult> - Results of the pipeline run
 */
export async function runGenerationPipeline(
  config: GenerationConfig,
  trigger: GenerationTrigger = 'manual',
  onProgress?: ProgressCallback
): Promise<GenerationResult> {
  const startTime = Date.now();
  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const errors: string[] = [];
  const stages: {
    collecting?: { duration: number; success: boolean };
    analyzing?: { duration: number; signalsFound: number };
    generating?: { duration: number; ideasGenerated: number };
    scoring?: { duration: number };
    saving?: { duration: number; ideasSaved: number };
  } = {};

  console.log(`[Pipeline ${runId}] Starting generation for user ${config.userId}`);
  console.log(`[Pipeline ${runId}] Config: ${JSON.stringify(config)}`);

  try {
    // STAGE 1: Collect data from sources (parallel)
    console.log(`[Pipeline ${runId}] Stage 1: Fetching data from sources...`);
    const collectingStart = Date.now();

    // Emit collecting progress
    onProgress?.({
      type: 'progress',
      stage: 'collecting',
      progress: 0,
      data: {
        categoriesTotal: config.sources.length,
        categoriesCompleted: 0,
        currentCategory: 'Starting...',
        appsFound: 0,
        reviewsFound: 0,
      } as CollectingProgressData,
      timestamp: new Date().toISOString(),
    });

    const sourcePromises: Promise<SourceData | null>[] = [];

    if (config.sources.includes('x')) {
      sourcePromises.push(
        fetchXTrends().catch(e => {
          errors.push(`X: ${e.message}`);
          console.error(`[Pipeline ${runId}] X fetch error:`, e);
          return null;
        })
      );
    }

    if (config.sources.includes('polymarket')) {
      sourcePromises.push(
        fetchPolymarketSignals().catch(e => {
          errors.push(`Polymarket: ${e.message}`);
          console.error(`[Pipeline ${runId}] Polymarket fetch error:`, e);
          return null;
        })
      );
    }

    if (config.sources.includes('googlenews')) {
      sourcePromises.push(
        fetchGoogleNews().catch(e => {
          errors.push(`News: ${e.message}`);
          console.error(`[Pipeline ${runId}] Google News fetch error:`, e);
          return null;
        })
      );
    }

    // Check if appstore is the ONLY source - use specialized pipeline
    const isAppStoreOnly = config.sources.length === 1 && config.sources.includes('appstore');

    if (isAppStoreOnly) {
      // Run the specialized App Store pipeline
      return runAppStorePipeline(config, trigger, runId, startTime, stages, errors, onProgress);
    }

    // If appstore is included with other sources, fetch it in parallel
    if (config.sources.includes('appstore')) {
      sourcePromises.push(
        fetchAppStoreData().catch(e => {
          errors.push(`AppStore: ${e.message}`);
          console.error(`[Pipeline ${runId}] App Store fetch error:`, e);
          return null;
        })
      );
    }

    const sourceResults = await Promise.all(sourcePromises);
    const validResults = sourceResults.filter((r): r is SourceData => r !== null);

    stages.collecting = {
      duration: Date.now() - collectingStart,
      success: validResults.length > 0,
    };

    console.log(`[Pipeline ${runId}] Stage 1 complete: ${validResults.length}/${sourcePromises.length} sources succeeded in ${stages.collecting.duration}ms`);

    // Emit collecting complete
    onProgress?.({
      type: 'progress',
      stage: 'collecting',
      progress: 20,
      data: {
        categoriesTotal: config.sources.length,
        categoriesCompleted: validResults.length,
        currentCategory: 'Complete',
        appsFound: 0,
        reviewsFound: 0,
      } as CollectingProgressData,
      timestamp: new Date().toISOString(),
    });

    if (validResults.length === 0) {
      throw new Error('All data sources failed');
    }

    // STAGE 2: Analyze signals
    console.log(`[Pipeline ${runId}] Stage 2: Analyzing signals...`);
    const analyzingStart = Date.now();

    // Emit analyzing progress
    onProgress?.({
      type: 'progress',
      stage: 'analyzing',
      progress: 25,
      data: {
        appsTotal: validResults.length,
        appsCompleted: 0,
        currentApp: 'Analyzing signals...',
        frictionPointsFound: 0,
      } as AnalyzingProgressData,
      timestamp: new Date().toISOString(),
    });

    const signals = await analyzeSignals(validResults);

    stages.analyzing = {
      duration: Date.now() - analyzingStart,
      signalsFound: signals.opportunities.length + signals.painPoints.length,
    };

    console.log(`[Pipeline ${runId}] Stage 2 complete: ${stages.analyzing.signalsFound} signals in ${stages.analyzing.duration}ms`);

    // Emit analyzing complete
    onProgress?.({
      type: 'progress',
      stage: 'analyzing',
      progress: 70,
      data: {
        appsTotal: validResults.length,
        appsCompleted: validResults.length,
        currentApp: 'Complete',
        frictionPointsFound: stages.analyzing.signalsFound,
      } as AnalyzingProgressData,
      timestamp: new Date().toISOString(),
    });

    // STAGE 3: Generate ideas
    console.log(`[Pipeline ${runId}] Stage 3: Generating ideas...`);
    const generatingStart = Date.now();

    // Emit generating progress
    onProgress?.({
      type: 'progress',
      stage: 'generating',
      progress: 72,
      data: {
        clustersTotal: stages.analyzing.signalsFound,
        ideasGenerated: 0,
        currentCluster: 'Generating ideas...',
      } as GeneratingProgressData,
      timestamp: new Date().toISOString(),
    });

    const rawIdeas = await generateFromSignals(signals, {
      count: config.ideasPerRun,
      categories: config.categories,
    });

    stages.generating = {
      duration: Date.now() - generatingStart,
      ideasGenerated: rawIdeas.length,
    };

    console.log(`[Pipeline ${runId}] Stage 3 complete: ${rawIdeas.length} ideas in ${stages.generating.duration}ms`);

    // Emit generating complete
    onProgress?.({
      type: 'progress',
      stage: 'generating',
      progress: 85,
      data: {
        clustersTotal: stages.analyzing.signalsFound,
        ideasGenerated: rawIdeas.length,
        currentCluster: 'Complete',
      } as GeneratingProgressData,
      timestamp: new Date().toISOString(),
    });

    // STAGE 4: Score ideas
    console.log(`[Pipeline ${runId}] Stage 4: Scoring ideas...`);
    const scoringStart = Date.now();

    // Emit scoring progress
    onProgress?.({
      type: 'progress',
      stage: 'scoring',
      progress: 87,
      data: {
        ideasTotal: rawIdeas.length,
        ideasScored: 0,
      },
      timestamp: new Date().toISOString(),
    });

    const scoredIdeas = await scoreIdeas(rawIdeas);

    stages.scoring = {
      duration: Date.now() - scoringStart,
    };

    console.log(`[Pipeline ${runId}] Stage 4 complete: ${scoredIdeas.length} ideas scored in ${stages.scoring.duration}ms`);

    // Emit scoring complete
    onProgress?.({
      type: 'progress',
      stage: 'scoring',
      progress: 95,
      data: {
        ideasTotal: scoredIdeas.length,
        ideasScored: scoredIdeas.length,
      },
      timestamp: new Date().toISOString(),
    });

    // STAGE 5: Save to Firestore
    console.log(`[Pipeline ${runId}] Stage 5: Saving to Firestore...`);
    const savingStart = Date.now();

    // Emit saving progress
    onProgress?.({
      type: 'progress',
      stage: 'saving',
      progress: 96,
      data: {
        ideasTotal: scoredIdeas.length,
        ideasSaved: 0,
      } as SavingProgressData,
      timestamp: new Date().toISOString(),
    });

    const savedCount = await saveIdeas(config.userId, scoredIdeas, runId, config.sources);

    stages.saving = {
      duration: Date.now() - savingStart,
      ideasSaved: savedCount,
    };

    console.log(`[Pipeline ${runId}] Stage 5 complete: ${savedCount} ideas saved in ${stages.saving.duration}ms`);

    // Emit saving complete
    onProgress?.({
      type: 'progress',
      stage: 'saving',
      progress: 100,
      data: {
        ideasTotal: scoredIdeas.length,
        ideasSaved: savedCount,
      } as SavingProgressData,
      timestamp: new Date().toISOString(),
    });

    const duration = Date.now() - startTime;
    console.log(`[Pipeline ${runId}] Pipeline complete. ${savedCount} ideas saved in ${duration}ms`);

    // Log run metadata
    await logGenerationRun(config.userId, {
      runId,
      timestamp: new Date(),
      ideasGenerated: scoredIdeas.length,
      ideasSaved: savedCount,
      sources: config.sources,
      duration,
      errors,
      trigger,
      stages,
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Pipeline ${runId}] Pipeline failed:`, error);

    // Log the failed run
    try {
      await logGenerationRun(config.userId, {
        runId,
        timestamp: new Date(),
        ideasGenerated: 0,
        ideasSaved: 0,
        sources: config.sources,
        duration,
        errors: [...errors, errorMessage],
        trigger,
        stages,
      });
    } catch (logError) {
      console.error(`[Pipeline ${runId}] Failed to log run:`, logError);
    }

    return {
      success: false,
      ideasGenerated: 0,
      ideasSaved: 0,
      errors: [...errors, errorMessage],
      duration,
      runId,
    };
  }
}

/**
 * Runs the specialized App Store niche discovery pipeline
 * This is used when appstore is the only source
 */
async function runAppStorePipeline(
  config: GenerationConfig,
  trigger: GenerationTrigger,
  runId: string,
  startTime: number,
  stages: Record<string, unknown>,
  errors: string[],
  onProgress?: ProgressCallback
): Promise<GenerationResult> {
  console.log(`[Pipeline ${runId}] Running App Store specialized pipeline`);

  try {
    // STAGE 1: Fetch App Store data
    console.log(`[Pipeline ${runId}] Stage 1: Fetching App Store data...`);
    const collectingStart = Date.now();

    // Emit collecting start
    onProgress?.({
      type: 'progress',
      stage: 'collecting',
      progress: 0,
      data: {
        categoriesTotal: 3, // Default 3 categories
        categoriesCompleted: 0,
        currentCategory: 'Fetching apps...',
        appsFound: 0,
        reviewsFound: 0,
      } as CollectingProgressData,
      timestamp: new Date().toISOString(),
    });

    const appStoreData = await fetchAppStoreData();

    stages.collecting = {
      duration: Date.now() - collectingStart,
      success: true,
      appsAnalyzed: appStoreData.metadata.appsAnalyzed,
      reviewsProcessed: appStoreData.metadata.reviewsProcessed,
    };

    console.log(`[Pipeline ${runId}] Stage 1 complete: ${appStoreData.metadata.appsAnalyzed} apps, ${appStoreData.metadata.reviewsProcessed} reviews in ${(stages.collecting as { duration: number }).duration}ms`);

    // Emit collecting complete
    onProgress?.({
      type: 'progress',
      stage: 'collecting',
      progress: 20,
      data: {
        categoriesTotal: appStoreData.metadata.categoriesAnalyzed.length,
        categoriesCompleted: appStoreData.metadata.categoriesAnalyzed.length,
        currentCategory: 'Complete',
        appsFound: appStoreData.metadata.appsAnalyzed,
        reviewsFound: appStoreData.metadata.reviewsProcessed,
      } as CollectingProgressData,
      timestamp: new Date().toISOString(),
    });

    // STAGE 2: Detect friction points
    console.log(`[Pipeline ${runId}] Stage 2: Detecting friction...`);
    const frictionStart = Date.now();

    // Emit analyzing start
    onProgress?.({
      type: 'progress',
      stage: 'analyzing',
      progress: 22,
      data: {
        appsTotal: appStoreData.metadata.appsAnalyzed,
        appsCompleted: 0,
        currentApp: 'Analyzing friction points...',
        frictionPointsFound: 0,
      } as AnalyzingProgressData,
      timestamp: new Date().toISOString(),
    });

    const frictionPoints = await detectFriction(runId);

    stages.frictionDetection = {
      duration: Date.now() - frictionStart,
      frictionPointsFound: frictionPoints.length,
      p0Count: frictionPoints.filter(f => f.priority === 'P0').length,
      p1Count: frictionPoints.filter(f => f.priority === 'P1').length,
    };

    console.log(`[Pipeline ${runId}] Stage 2 complete: ${frictionPoints.length} friction points in ${(stages.frictionDetection as { duration: number }).duration}ms`);

    // Emit analyzing complete
    onProgress?.({
      type: 'progress',
      stage: 'analyzing',
      progress: 70,
      data: {
        appsTotal: appStoreData.metadata.appsAnalyzed,
        appsCompleted: appStoreData.metadata.appsAnalyzed,
        currentApp: 'Complete',
        frictionPointsFound: frictionPoints.length,
      } as AnalyzingProgressData,
      timestamp: new Date().toISOString(),
    });

    if (frictionPoints.length === 0) {
      throw new Error('No friction points detected');
    }

    // STAGE 3: Generate AI solutions
    console.log(`[Pipeline ${runId}] Stage 3: Generating AI solutions...`);
    const generatingStart = Date.now();

    // Emit generating start
    onProgress?.({
      type: 'progress',
      stage: 'generating',
      progress: 72,
      data: {
        clustersTotal: frictionPoints.length,
        ideasGenerated: 0,
        currentCluster: 'Generating AI solutions...',
      } as GeneratingProgressData,
      timestamp: new Date().toISOString(),
    });

    const aiIdeas = await generateAISolutions(
      frictionPoints,
      appStoreData.niches,
      config.ideasPerRun,
      runId
    );

    stages.generating = {
      duration: Date.now() - generatingStart,
      ideasGenerated: aiIdeas.length,
    };

    console.log(`[Pipeline ${runId}] Stage 3 complete: ${aiIdeas.length} AI-native ideas in ${(stages.generating as { duration: number }).duration}ms`);

    // Emit generating complete
    onProgress?.({
      type: 'progress',
      stage: 'generating',
      progress: 90,
      data: {
        clustersTotal: frictionPoints.length,
        ideasGenerated: aiIdeas.length,
        currentCluster: 'Complete',
      } as GeneratingProgressData,
      timestamp: new Date().toISOString(),
    });

    // STAGE 4: Save to Firestore
    console.log(`[Pipeline ${runId}] Stage 4: Saving to Firestore...`);
    const savingStart = Date.now();

    // Emit saving start
    onProgress?.({
      type: 'progress',
      stage: 'saving',
      progress: 92,
      data: {
        ideasTotal: aiIdeas.length,
        ideasSaved: 0,
      } as SavingProgressData,
      timestamp: new Date().toISOString(),
    });

    const savedCount = await saveAINativeIdeas(config.userId, aiIdeas, runId);

    stages.saving = {
      duration: Date.now() - savingStart,
      ideasSaved: savedCount,
    };

    console.log(`[Pipeline ${runId}] Stage 4 complete: ${savedCount} ideas saved in ${(stages.saving as { duration: number }).duration}ms`);

    // Emit saving complete
    onProgress?.({
      type: 'progress',
      stage: 'saving',
      progress: 100,
      data: {
        ideasTotal: aiIdeas.length,
        ideasSaved: savedCount,
      } as SavingProgressData,
      timestamp: new Date().toISOString(),
    });

    const duration = Date.now() - startTime;
    console.log(`[Pipeline ${runId}] App Store pipeline complete. ${savedCount} ideas saved in ${duration}ms`);

    // Log run metadata
    await logGenerationRun(config.userId, {
      runId,
      timestamp: new Date(),
      ideasGenerated: aiIdeas.length,
      ideasSaved: savedCount,
      sources: config.sources,
      duration,
      errors,
      trigger,
      stages,
      pipelineType: 'niche-discovery',
      appStoreMetrics: {
        appsAnalyzed: appStoreData.metadata.appsAnalyzed,
        reviewsProcessed: appStoreData.metadata.reviewsProcessed,
        frictionPointsFound: frictionPoints.length,
        nichesAnalyzed: appStoreData.niches.map(n => n.name),
      },
    });

    return {
      success: true,
      ideasGenerated: aiIdeas.length,
      ideasSaved: savedCount,
      errors,
      duration,
      runId,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Pipeline ${runId}] App Store pipeline failed:`, error);

    // Log the failed run
    try {
      await logGenerationRun(config.userId, {
        runId,
        timestamp: new Date(),
        ideasGenerated: 0,
        ideasSaved: 0,
        sources: config.sources,
        duration,
        errors: [...errors, errorMessage],
        trigger,
        stages,
        pipelineType: 'niche-discovery',
      });
    } catch (logError) {
      console.error(`[Pipeline ${runId}] Failed to log run:`, logError);
    }

    return {
      success: false,
      ideasGenerated: 0,
      ideasSaved: 0,
      errors: [...errors, errorMessage],
      duration,
      runId,
    };
  }
}

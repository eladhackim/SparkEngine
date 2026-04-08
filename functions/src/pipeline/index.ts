/**
 * Pipeline Orchestrator
 * Coordinates the entire idea generation pipeline from data collection to persistence
 */

import { fetchXTrends } from './sources/x.js';
import { fetchPolymarketSignals } from './sources/polymarket.js';
import { fetchGoogleNews } from './sources/googlenews.js';
import { analyzeSignals } from './ai/analyzeSignals.js';
import { generateFromSignals } from './ai/generateIdeas.js';
import { scoreIdeas } from './ai/scoreIdeas.js';
import { saveIdeas, logGenerationRun } from './persistence/saveIdeas.js';
import { GenerationConfig, GenerationResult, SourceData, GenerationTrigger } from '../types/pipeline.js';

/**
 * Runs the complete idea generation pipeline
 * @param config - Generation configuration
 * @param trigger - How the run was triggered (manual or scheduled)
 * @returns Promise<GenerationResult> - Results of the pipeline run
 */
export async function runGenerationPipeline(
  config: GenerationConfig,
  trigger: GenerationTrigger = 'manual'
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

    const sourceResults = await Promise.all(sourcePromises);
    const validResults = sourceResults.filter((r): r is SourceData => r !== null);

    stages.collecting = {
      duration: Date.now() - collectingStart,
      success: validResults.length > 0,
    };

    console.log(`[Pipeline ${runId}] Stage 1 complete: ${validResults.length}/${sourcePromises.length} sources succeeded in ${stages.collecting.duration}ms`);

    if (validResults.length === 0) {
      throw new Error('All data sources failed');
    }

    // STAGE 2: Analyze signals
    console.log(`[Pipeline ${runId}] Stage 2: Analyzing signals...`);
    const analyzingStart = Date.now();

    const signals = await analyzeSignals(validResults);

    stages.analyzing = {
      duration: Date.now() - analyzingStart,
      signalsFound: signals.opportunities.length + signals.painPoints.length,
    };

    console.log(`[Pipeline ${runId}] Stage 2 complete: ${stages.analyzing.signalsFound} signals in ${stages.analyzing.duration}ms`);

    // STAGE 3: Generate ideas
    console.log(`[Pipeline ${runId}] Stage 3: Generating ideas...`);
    const generatingStart = Date.now();

    const rawIdeas = await generateFromSignals(signals, {
      count: config.ideasPerRun,
      categories: config.categories,
    });

    stages.generating = {
      duration: Date.now() - generatingStart,
      ideasGenerated: rawIdeas.length,
    };

    console.log(`[Pipeline ${runId}] Stage 3 complete: ${rawIdeas.length} ideas in ${stages.generating.duration}ms`);

    // STAGE 4: Score ideas
    console.log(`[Pipeline ${runId}] Stage 4: Scoring ideas...`);
    const scoringStart = Date.now();

    const scoredIdeas = await scoreIdeas(rawIdeas);

    stages.scoring = {
      duration: Date.now() - scoringStart,
    };

    console.log(`[Pipeline ${runId}] Stage 4 complete: ${scoredIdeas.length} ideas scored in ${stages.scoring.duration}ms`);

    // STAGE 5: Save to Firestore
    console.log(`[Pipeline ${runId}] Stage 5: Saving to Firestore...`);
    const savingStart = Date.now();

    const savedCount = await saveIdeas(config.userId, scoredIdeas, runId);

    stages.saving = {
      duration: Date.now() - savingStart,
      ideasSaved: savedCount,
    };

    console.log(`[Pipeline ${runId}] Stage 5 complete: ${savedCount} ideas saved in ${stages.saving.duration}ms`);

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

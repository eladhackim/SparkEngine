"use strict";
/**
 * Pipeline Orchestrator
 * Coordinates the entire idea generation pipeline from data collection to persistence
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGenerationPipeline = runGenerationPipeline;
const x_js_1 = require("./sources/x.js");
const polymarket_js_1 = require("./sources/polymarket.js");
const googlenews_js_1 = require("./sources/googlenews.js");
const appstore_js_1 = require("./sources/appstore.js");
const analyzeSignals_js_1 = require("./ai/analyzeSignals.js");
const generateIdeas_js_1 = require("./ai/generateIdeas.js");
const scoreIdeas_js_1 = require("./ai/scoreIdeas.js");
const saveIdeas_js_1 = require("./persistence/saveIdeas.js");
const frictionDetector_js_1 = require("./frictionDetector.js");
const solutionGenerator_js_1 = require("./solutionGenerator.js");
/**
 * Runs the complete idea generation pipeline
 * @param config - Generation configuration
 * @param trigger - How the run was triggered (manual or scheduled)
 * @returns Promise<GenerationResult> - Results of the pipeline run
 */
async function runGenerationPipeline(config, trigger = 'manual') {
    const startTime = Date.now();
    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const errors = [];
    const stages = {};
    console.log(`[Pipeline ${runId}] Starting generation for user ${config.userId}`);
    console.log(`[Pipeline ${runId}] Config: ${JSON.stringify(config)}`);
    try {
        // STAGE 1: Collect data from sources (parallel)
        console.log(`[Pipeline ${runId}] Stage 1: Fetching data from sources...`);
        const collectingStart = Date.now();
        const sourcePromises = [];
        if (config.sources.includes('x')) {
            sourcePromises.push((0, x_js_1.fetchXTrends)().catch(e => {
                errors.push(`X: ${e.message}`);
                console.error(`[Pipeline ${runId}] X fetch error:`, e);
                return null;
            }));
        }
        if (config.sources.includes('polymarket')) {
            sourcePromises.push((0, polymarket_js_1.fetchPolymarketSignals)().catch(e => {
                errors.push(`Polymarket: ${e.message}`);
                console.error(`[Pipeline ${runId}] Polymarket fetch error:`, e);
                return null;
            }));
        }
        if (config.sources.includes('googlenews')) {
            sourcePromises.push((0, googlenews_js_1.fetchGoogleNews)().catch(e => {
                errors.push(`News: ${e.message}`);
                console.error(`[Pipeline ${runId}] Google News fetch error:`, e);
                return null;
            }));
        }
        // Check if appstore is the ONLY source - use specialized pipeline
        const isAppStoreOnly = config.sources.length === 1 && config.sources.includes('appstore');
        if (isAppStoreOnly) {
            // Run the specialized App Store pipeline
            return runAppStorePipeline(config, trigger, runId, startTime, stages, errors);
        }
        // If appstore is included with other sources, fetch it in parallel
        if (config.sources.includes('appstore')) {
            sourcePromises.push((0, appstore_js_1.fetchAppStoreData)().catch(e => {
                errors.push(`AppStore: ${e.message}`);
                console.error(`[Pipeline ${runId}] App Store fetch error:`, e);
                return null;
            }));
        }
        const sourceResults = await Promise.all(sourcePromises);
        const validResults = sourceResults.filter((r) => r !== null);
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
        const signals = await (0, analyzeSignals_js_1.analyzeSignals)(validResults);
        stages.analyzing = {
            duration: Date.now() - analyzingStart,
            signalsFound: signals.opportunities.length + signals.painPoints.length,
        };
        console.log(`[Pipeline ${runId}] Stage 2 complete: ${stages.analyzing.signalsFound} signals in ${stages.analyzing.duration}ms`);
        // STAGE 3: Generate ideas
        console.log(`[Pipeline ${runId}] Stage 3: Generating ideas...`);
        const generatingStart = Date.now();
        const rawIdeas = await (0, generateIdeas_js_1.generateFromSignals)(signals, {
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
        const scoredIdeas = await (0, scoreIdeas_js_1.scoreIdeas)(rawIdeas);
        stages.scoring = {
            duration: Date.now() - scoringStart,
        };
        console.log(`[Pipeline ${runId}] Stage 4 complete: ${scoredIdeas.length} ideas scored in ${stages.scoring.duration}ms`);
        // STAGE 5: Save to Firestore
        console.log(`[Pipeline ${runId}] Stage 5: Saving to Firestore...`);
        const savingStart = Date.now();
        const savedCount = await (0, saveIdeas_js_1.saveIdeas)(config.userId, scoredIdeas, runId);
        stages.saving = {
            duration: Date.now() - savingStart,
            ideasSaved: savedCount,
        };
        console.log(`[Pipeline ${runId}] Stage 5 complete: ${savedCount} ideas saved in ${stages.saving.duration}ms`);
        const duration = Date.now() - startTime;
        console.log(`[Pipeline ${runId}] Pipeline complete. ${savedCount} ideas saved in ${duration}ms`);
        // Log run metadata
        await (0, saveIdeas_js_1.logGenerationRun)(config.userId, {
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
    }
    catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Pipeline ${runId}] Pipeline failed:`, error);
        // Log the failed run
        try {
            await (0, saveIdeas_js_1.logGenerationRun)(config.userId, {
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
        }
        catch (logError) {
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
async function runAppStorePipeline(config, trigger, runId, startTime, stages, errors) {
    console.log(`[Pipeline ${runId}] Running App Store specialized pipeline`);
    try {
        // STAGE 1: Fetch App Store data
        console.log(`[Pipeline ${runId}] Stage 1: Fetching App Store data...`);
        const collectingStart = Date.now();
        const appStoreData = await (0, appstore_js_1.fetchAppStoreData)();
        stages.collecting = {
            duration: Date.now() - collectingStart,
            success: true,
            appsAnalyzed: appStoreData.metadata.appsAnalyzed,
            reviewsProcessed: appStoreData.metadata.reviewsProcessed,
        };
        console.log(`[Pipeline ${runId}] Stage 1 complete: ${appStoreData.metadata.appsAnalyzed} apps, ${appStoreData.metadata.reviewsProcessed} reviews in ${stages.collecting.duration}ms`);
        // STAGE 2: Detect friction points
        console.log(`[Pipeline ${runId}] Stage 2: Detecting friction...`);
        const frictionStart = Date.now();
        const frictionPoints = await (0, frictionDetector_js_1.detectFriction)(runId);
        stages.frictionDetection = {
            duration: Date.now() - frictionStart,
            frictionPointsFound: frictionPoints.length,
            p0Count: frictionPoints.filter(f => f.priority === 'P0').length,
            p1Count: frictionPoints.filter(f => f.priority === 'P1').length,
        };
        console.log(`[Pipeline ${runId}] Stage 2 complete: ${frictionPoints.length} friction points in ${stages.frictionDetection.duration}ms`);
        if (frictionPoints.length === 0) {
            throw new Error('No friction points detected');
        }
        // STAGE 3: Generate AI solutions
        console.log(`[Pipeline ${runId}] Stage 3: Generating AI solutions...`);
        const generatingStart = Date.now();
        const aiIdeas = await (0, solutionGenerator_js_1.generateAISolutions)(frictionPoints, appStoreData.niches, config.ideasPerRun, runId);
        stages.generating = {
            duration: Date.now() - generatingStart,
            ideasGenerated: aiIdeas.length,
        };
        console.log(`[Pipeline ${runId}] Stage 3 complete: ${aiIdeas.length} AI-native ideas in ${stages.generating.duration}ms`);
        // STAGE 4: Save to Firestore
        console.log(`[Pipeline ${runId}] Stage 4: Saving to Firestore...`);
        const savingStart = Date.now();
        const savedCount = await (0, saveIdeas_js_1.saveAINativeIdeas)(config.userId, aiIdeas, runId);
        stages.saving = {
            duration: Date.now() - savingStart,
            ideasSaved: savedCount,
        };
        console.log(`[Pipeline ${runId}] Stage 4 complete: ${savedCount} ideas saved in ${stages.saving.duration}ms`);
        const duration = Date.now() - startTime;
        console.log(`[Pipeline ${runId}] App Store pipeline complete. ${savedCount} ideas saved in ${duration}ms`);
        // Log run metadata
        await (0, saveIdeas_js_1.logGenerationRun)(config.userId, {
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
    }
    catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Pipeline ${runId}] App Store pipeline failed:`, error);
        // Log the failed run
        try {
            await (0, saveIdeas_js_1.logGenerationRun)(config.userId, {
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
        }
        catch (logError) {
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
//# sourceMappingURL=index.js.map
/**
 * Pipeline Orchestrator
 * Coordinates the entire idea generation pipeline from data collection to persistence
 */
import { GenerationConfig, GenerationResult, GenerationTrigger } from '../types/pipeline.js';
/**
 * Runs the complete idea generation pipeline
 * @param config - Generation configuration
 * @param trigger - How the run was triggered (manual or scheduled)
 * @returns Promise<GenerationResult> - Results of the pipeline run
 */
export declare function runGenerationPipeline(config: GenerationConfig, trigger?: GenerationTrigger): Promise<GenerationResult>;
//# sourceMappingURL=index.d.ts.map
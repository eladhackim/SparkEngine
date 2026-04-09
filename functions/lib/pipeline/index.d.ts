/**
 * Pipeline Orchestrator
 * Coordinates the entire idea generation pipeline from data collection to persistence
 */
import { GenerationConfig, GenerationResult, GenerationTrigger, ProgressCallback } from '../types/pipeline.js';
/**
 * Runs the complete idea generation pipeline
 * @param config - Generation configuration
 * @param trigger - How the run was triggered (manual or scheduled)
 * @param onProgress - Optional callback for SSE progress streaming
 * @returns Promise<GenerationResult> - Results of the pipeline run
 */
export declare function runGenerationPipeline(config: GenerationConfig, trigger?: GenerationTrigger, onProgress?: ProgressCallback): Promise<GenerationResult>;
//# sourceMappingURL=index.d.ts.map
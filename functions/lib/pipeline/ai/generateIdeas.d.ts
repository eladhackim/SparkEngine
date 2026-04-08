/**
 * Idea Generation using Gemini AI
 * Generates business ideas based on analyzed signals
 */
import { AnalyzedSignals, GenerationOptions, RawIdea } from '../../types/pipeline.js';
/**
 * Generates business ideas from analyzed signals using Gemini AI
 * @param signals - Analyzed signals from the analysis stage
 * @param options - Generation options (count, categories)
 * @returns Promise<RawIdea[]> - Array of generated business ideas
 */
export declare function generateFromSignals(signals: AnalyzedSignals, options: GenerationOptions): Promise<RawIdea[]>;
//# sourceMappingURL=generateIdeas.d.ts.map
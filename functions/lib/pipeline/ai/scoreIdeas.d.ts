/**
 * Idea Scoring using Gemini AI
 * Scores generated ideas on multiple parameters and generates business analysis
 */
import { RawIdea, ScoredIdea } from '../../types/pipeline.js';
/**
 * Scores ideas using Gemini AI
 * @param ideas - Array of raw ideas to score
 * @returns Promise<ScoredIdea[]> - Array of scored ideas with analysis
 */
export declare function scoreIdeas(ideas: RawIdea[]): Promise<ScoredIdea[]>;
//# sourceMappingURL=scoreIdeas.d.ts.map
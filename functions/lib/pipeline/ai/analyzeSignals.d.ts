/**
 * Signal Analysis using Gemini AI
 * Analyzes collected data from multiple sources to identify business opportunities
 */
import { AnalyzedSignals, SourceData } from '../../types/pipeline.js';
/**
 * Analyzes signals from multiple data sources using Gemini AI
 * @param sourceData - Array of data from various sources (X, Polymarket, Google News)
 * @returns Promise<AnalyzedSignals> - Structured analysis of opportunities and pain points
 */
export declare function analyzeSignals(sourceData: SourceData[]): Promise<AnalyzedSignals>;
//# sourceMappingURL=analyzeSignals.d.ts.map
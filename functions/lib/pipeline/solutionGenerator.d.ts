/**
 * AI Solution Generator Module
 * Generates AI-native app ideas from competitor friction analysis
 */
import { FrictionPoint, AINativeIdea, NicheProfile } from '../types/pipeline.js';
/**
 * Generates AI-native app ideas from friction analysis
 * @param frictionPoints - Detected friction points from frictionDetector
 * @param niches - Niche profiles from appstore source
 * @param ideasPerNiche - Number of ideas to generate
 * @param runId - Pipeline run ID for logging
 * @returns Promise<AINativeIdea[]> - Generated AI-native ideas
 */
export declare function generateAISolutions(frictionPoints: FrictionPoint[], niches: NicheProfile[], ideasPerNiche: number, runId: string): Promise<AINativeIdea[]>;
//# sourceMappingURL=solutionGenerator.d.ts.map
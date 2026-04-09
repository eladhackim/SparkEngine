/**
 * Firestore Persistence Layer
 * Saves generated ideas and logs generation runs to Firestore
 */
import { ScoredIdea, GenerationRunDocument, GenerationSource, GenerationTrigger, AINativeIdea } from '../../types/pipeline.js';
/**
 * Saves scored ideas to Firestore in a batch operation
 * @param userId - User ID to save ideas for
 * @param ideas - Array of scored ideas to save
 * @param runId - Generation run ID for linking
 * @returns Promise<number> - Number of ideas saved
 */
export declare function saveIdeas(userId: string, ideas: ScoredIdea[], runId: string): Promise<number>;
/**
 * Saves AI-native ideas from friction analysis to Firestore
 * @param userId - User ID to save ideas for
 * @param ideas - Array of AI-native ideas to save
 * @param runId - Generation run ID for linking
 * @returns Promise<number> - Number of ideas saved
 */
export declare function saveAINativeIdeas(userId: string, ideas: AINativeIdea[], runId: string): Promise<number>;
/**
 * Logs a generation run to Firestore
 * @param userId - User ID
 * @param metadata - Run metadata
 */
export declare function logGenerationRun(userId: string, metadata: {
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
}): Promise<void>;
//# sourceMappingURL=saveIdeas.d.ts.map
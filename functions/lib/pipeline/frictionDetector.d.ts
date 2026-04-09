/**
 * Friction Detection Module
 * Analyzes app store reviews to identify user pain points and friction patterns
 */
import { FrictionPoint } from '../types/pipeline.js';
/**
 * Analyzes app store reviews to detect friction points
 * Uses reviews stored by fetchAppStoreData()
 * @returns Promise<FrictionPoint[]> - Detected and scored friction points
 */
export declare function detectFriction(runId: string): Promise<FrictionPoint[]>;
//# sourceMappingURL=frictionDetector.d.ts.map
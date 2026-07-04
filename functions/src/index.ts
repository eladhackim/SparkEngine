/**
 * Spark Cloud Functions
 * Main entry point - exports all Cloud Functions
 */

// Export idea generation functions
export { generateIdeasHttp, generateIdeasScheduled, generateNicheIdeasScheduled } from './generateIdeas.js';

// Export preferences management functions
export {
  getPreferences,
  savePreferences,
  applyPreset,
  resetPreferences,
  listPresets,
} from './preferences.js';

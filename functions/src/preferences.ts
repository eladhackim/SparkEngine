/**
 * User Preferences Cloud Functions
 * HTTP endpoints for personalization settings management
 */

import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import {
  UserPreferences,
  PartialUserPreferences,
  getDefaultPreferences,
  VALID_GEOGRAPHIC_FOCUS,
  VALID_CUSTOMER_SEGMENTS,
  VALID_INDUSTRY_VERTICALS,
  VALID_USER_PERSONAS,
  VALID_BUSINESS_TYPES,
  VALID_PRICING_MODELS,
  VALID_SALES_MOTIONS,
  VALID_GTM_STRATEGIES,
  VALID_PRESET_IDS,
  MAX_TOPIC_FOCUS_TAGS,
  MAX_TOPIC_AVOIDANCE_TAGS,
  SliderValue,
  PresetId,
  TechnicalPreferences,
  MarketPreferences,
  BusinessPreferences,
  CharacteristicsPreferences,
  PersonalPreferences,
  DEFAULT_TECHNICAL,
  DEFAULT_MARKET,
  DEFAULT_BUSINESS,
  DEFAULT_CHARACTERISTICS,
  DEFAULT_PERSONAL,
} from './types/preferences.js';
import { getPreset, getAllPresetMetadata } from './personalization/presets.js';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ============================================
// CORS CONFIGURATION
// ============================================

const ALLOWED_ORIGINS = [
  'https://sparkengine-3740d.web.app',
  'https://sparkengine.online',
  'http://localhost:3000',
];

function setCorsHeaders(req: any, res: any): void {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Max-Age', '3600');
}

// ============================================
// AUTHENTICATION
// ============================================

async function verifyAuth(req: any): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch {
    return null;
  }
}

// ============================================
// VALIDATION
// ============================================

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isValidSlider(value: unknown): value is SliderValue {
  return typeof value === 'number' && [1, 2, 3, 4, 5].includes(value);
}

function isValidArray<T extends string>(value: unknown, validOptions: readonly T[]): value is T[] {
  if (!Array.isArray(value)) return false;
  return value.every(item => typeof item === 'string' && validOptions.includes(item as T));
}

function validateTechnical(tech: Partial<TechnicalPreferences>): ValidationResult {
  const errors: string[] = [];

  if (tech.frontendComplexity !== undefined && !isValidSlider(tech.frontendComplexity)) {
    errors.push('frontendComplexity must be 1-5');
  }
  if (tech.backendRequirements !== undefined && !isValidSlider(tech.backendRequirements)) {
    errors.push('backendRequirements must be 1-5');
  }
  if (tech.dataMLRequirements !== undefined && !isValidSlider(tech.dataMLRequirements)) {
    errors.push('dataMLRequirements must be 1-5');
  }
  if (tech.integrationComplexity !== undefined && !isValidSlider(tech.integrationComplexity)) {
    errors.push('integrationComplexity must be 1-5');
  }
  if (tech.infrastructureNeeds !== undefined && !isValidSlider(tech.infrastructureNeeds)) {
    errors.push('infrastructureNeeds must be 1-5');
  }
  if (tech.mobileRequirements !== undefined && !['none', 'responsive', 'native'].includes(tech.mobileRequirements)) {
    errors.push('mobileRequirements must be none, responsive, or native');
  }
  if (tech.securityRequirements !== undefined && !['basic', 'standard', 'enterprise'].includes(tech.securityRequirements)) {
    errors.push('securityRequirements must be basic, standard, or enterprise');
  }
  if (tech.realtimeRequired !== undefined && typeof tech.realtimeRequired !== 'boolean') {
    errors.push('realtimeRequired must be boolean');
  }

  return { valid: errors.length === 0, errors };
}

function validateMarket(market: Partial<MarketPreferences>): ValidationResult {
  const errors: string[] = [];

  if (market.geographicFocus !== undefined && !isValidArray(market.geographicFocus, VALID_GEOGRAPHIC_FOCUS)) {
    errors.push(`geographicFocus must contain valid values: ${VALID_GEOGRAPHIC_FOCUS.join(', ')}`);
  }
  if (market.customerSegment !== undefined && !isValidArray(market.customerSegment, VALID_CUSTOMER_SEGMENTS)) {
    errors.push(`customerSegment must contain valid values: ${VALID_CUSTOMER_SEGMENTS.join(', ')}`);
  }
  if (market.industryVerticals !== undefined && !isValidArray(market.industryVerticals, VALID_INDUSTRY_VERTICALS)) {
    errors.push(`industryVerticals must contain valid values: ${VALID_INDUSTRY_VERTICALS.join(', ')}`);
  }
  if (market.userPersonas !== undefined && !isValidArray(market.userPersonas, VALID_USER_PERSONAS)) {
    errors.push(`userPersonas must contain valid values: ${VALID_USER_PERSONAS.join(', ')}`);
  }
  if (market.businessFocus !== undefined && !['b2b', 'both', 'b2c'].includes(market.businessFocus)) {
    errors.push('businessFocus must be b2b, both, or b2c');
  }
  if (market.marketMaturity !== undefined && !isValidSlider(market.marketMaturity)) {
    errors.push('marketMaturity must be 1-5');
  }
  if (market.audienceSize !== undefined && !isValidSlider(market.audienceSize)) {
    errors.push('audienceSize must be 1-5');
  }

  return { valid: errors.length === 0, errors };
}

function validateBusiness(business: Partial<BusinessPreferences>): ValidationResult {
  const errors: string[] = [];

  if (business.businessTypes !== undefined && !isValidArray(business.businessTypes, VALID_BUSINESS_TYPES)) {
    errors.push(`businessTypes must contain valid values: ${VALID_BUSINESS_TYPES.join(', ')}`);
  }
  if (business.pricingModels !== undefined && !isValidArray(business.pricingModels, VALID_PRICING_MODELS)) {
    errors.push(`pricingModels must contain valid values: ${VALID_PRICING_MODELS.join(', ')}`);
  }
  if (business.salesMotion !== undefined && !isValidArray(business.salesMotion, VALID_SALES_MOTIONS)) {
    errors.push(`salesMotion must contain valid values: ${VALID_SALES_MOTIONS.join(', ')}`);
  }
  if (business.goToMarket !== undefined && !isValidArray(business.goToMarket, VALID_GTM_STRATEGIES)) {
    errors.push(`goToMarket must contain valid values: ${VALID_GTM_STRATEGIES.join(', ')}`);
  }
  if (business.competitionLevel !== undefined && !isValidSlider(business.competitionLevel)) {
    errors.push('competitionLevel must be 1-5');
  }
  if (business.defensibility !== undefined && !isValidSlider(business.defensibility)) {
    errors.push('defensibility must be 1-5');
  }
  if (business.revenuePotential !== undefined && !isValidSlider(business.revenuePotential)) {
    errors.push('revenuePotential must be 1-5');
  }

  return { valid: errors.length === 0, errors };
}

function validateCharacteristics(chars: Partial<CharacteristicsPreferences>): ValidationResult {
  const errors: string[] = [];

  if (chars.noveltyLevel !== undefined && !isValidSlider(chars.noveltyLevel)) {
    errors.push('noveltyLevel must be 1-5');
  }
  if (chars.viralityPotential !== undefined && !isValidSlider(chars.viralityPotential)) {
    errors.push('viralityPotential must be 1-5');
  }
  if (chars.networkEffects !== undefined && !isValidSlider(chars.networkEffects)) {
    errors.push('networkEffects must be 1-5');
  }
  if (chars.regulatoryComplexity !== undefined && !['none', 'low', 'moderate', 'heavy'].includes(chars.regulatoryComplexity)) {
    errors.push('regulatoryComplexity must be none, low, moderate, or heavy');
  }
  if (chars.capitalRequirements !== undefined && !isValidSlider(chars.capitalRequirements)) {
    errors.push('capitalRequirements must be 1-5');
  }
  if (chars.timeToRevenue !== undefined && !isValidSlider(chars.timeToRevenue)) {
    errors.push('timeToRevenue must be 1-5');
  }

  return { valid: errors.length === 0, errors };
}

function validatePersonal(personal: Partial<PersonalPreferences>): ValidationResult {
  const errors: string[] = [];

  if (personal.domainExpertise !== undefined && !isValidSlider(personal.domainExpertise)) {
    errors.push('domainExpertise must be 1-5');
  }
  if (personal.timeCommitment !== undefined && !['side-project', 'part-time', 'full-time'].includes(personal.timeCommitment)) {
    errors.push('timeCommitment must be side-project, part-time, or full-time');
  }
  if (personal.runwayTolerance !== undefined && !isValidSlider(personal.runwayTolerance)) {
    errors.push('runwayTolerance must be 1-5');
  }
  if (personal.topicFocus !== undefined) {
    if (!Array.isArray(personal.topicFocus)) {
      errors.push('topicFocus must be an array');
    } else if (personal.topicFocus.length > MAX_TOPIC_FOCUS_TAGS) {
      errors.push(`topicFocus cannot exceed ${MAX_TOPIC_FOCUS_TAGS} tags`);
    } else if (!personal.topicFocus.every(t => typeof t === 'string' && t.length > 0 && t.length <= 50)) {
      errors.push('topicFocus tags must be non-empty strings up to 50 characters');
    }
  }
  if (personal.topicAvoidance !== undefined) {
    if (!Array.isArray(personal.topicAvoidance)) {
      errors.push('topicAvoidance must be an array');
    } else if (personal.topicAvoidance.length > MAX_TOPIC_AVOIDANCE_TAGS) {
      errors.push(`topicAvoidance cannot exceed ${MAX_TOPIC_AVOIDANCE_TAGS} tags`);
    } else if (!personal.topicAvoidance.every(t => typeof t === 'string' && t.length > 0 && t.length <= 50)) {
      errors.push('topicAvoidance tags must be non-empty strings up to 50 characters');
    }
  }

  return { valid: errors.length === 0, errors };
}

function validatePreferences(prefs: PartialUserPreferences): ValidationResult {
  const allErrors: string[] = [];

  if (prefs.technical) {
    const result = validateTechnical(prefs.technical);
    allErrors.push(...result.errors);
  }
  if (prefs.market) {
    const result = validateMarket(prefs.market);
    allErrors.push(...result.errors);
  }
  if (prefs.business) {
    const result = validateBusiness(prefs.business);
    allErrors.push(...result.errors);
  }
  if (prefs.characteristics) {
    const result = validateCharacteristics(prefs.characteristics);
    allErrors.push(...result.errors);
  }
  if (prefs.personal) {
    const result = validatePersonal(prefs.personal);
    allErrors.push(...result.errors);
  }

  return { valid: allErrors.length === 0, errors: allErrors };
}

// ============================================
// PROFILE COMPLETENESS CALCULATOR
// ============================================

/**
 * Calculate profile completeness score (0-100)
 * Based on spec Section 6.1:
 * - Technical Requirements: 20% (at least 5 of 8 controls modified)
 * - Market & Audience: 20% (at least 4 of 7 controls modified)
 * - Business Model: 20% (at least 4 of 7 controls modified)
 * - Idea Characteristics: 20% (at least 3 of 6 controls modified)
 * - Personal Fit: 20% (at least 3 of 5 controls modified + 3 topic tags)
 */
export function calculateProfileCompleteness(prefs: Omit<UserPreferences, 'lastUpdated'>): number {
  let score = 0;

  // Technical Requirements: 20% (5 of 8 controls)
  const techModified = [
    prefs.technical.frontendComplexity !== DEFAULT_TECHNICAL.frontendComplexity,
    prefs.technical.backendRequirements !== DEFAULT_TECHNICAL.backendRequirements,
    prefs.technical.dataMLRequirements !== DEFAULT_TECHNICAL.dataMLRequirements,
    prefs.technical.mobileRequirements !== DEFAULT_TECHNICAL.mobileRequirements,
    prefs.technical.integrationComplexity !== DEFAULT_TECHNICAL.integrationComplexity,
    prefs.technical.infrastructureNeeds !== DEFAULT_TECHNICAL.infrastructureNeeds,
    prefs.technical.securityRequirements !== DEFAULT_TECHNICAL.securityRequirements,
    prefs.technical.realtimeRequired !== DEFAULT_TECHNICAL.realtimeRequired,
  ].filter(Boolean).length;
  score += Math.min(techModified / 5, 1) * 20;

  // Market & Audience: 20% (4 of 7 controls)
  const marketModified = [
    JSON.stringify(prefs.market.geographicFocus.sort()) !== JSON.stringify(DEFAULT_MARKET.geographicFocus.sort()),
    JSON.stringify(prefs.market.customerSegment.sort()) !== JSON.stringify(DEFAULT_MARKET.customerSegment.sort()),
    JSON.stringify(prefs.market.industryVerticals.sort()) !== JSON.stringify(DEFAULT_MARKET.industryVerticals.sort()),
    JSON.stringify(prefs.market.userPersonas.sort()) !== JSON.stringify(DEFAULT_MARKET.userPersonas.sort()),
    prefs.market.businessFocus !== DEFAULT_MARKET.businessFocus,
    prefs.market.marketMaturity !== DEFAULT_MARKET.marketMaturity,
    prefs.market.audienceSize !== DEFAULT_MARKET.audienceSize,
  ].filter(Boolean).length;
  score += Math.min(marketModified / 4, 1) * 20;

  // Business Model: 20% (4 of 7 controls)
  const businessModified = [
    JSON.stringify(prefs.business.businessTypes.sort()) !== JSON.stringify(DEFAULT_BUSINESS.businessTypes.sort()),
    JSON.stringify(prefs.business.pricingModels.sort()) !== JSON.stringify(DEFAULT_BUSINESS.pricingModels.sort()),
    JSON.stringify(prefs.business.salesMotion.sort()) !== JSON.stringify(DEFAULT_BUSINESS.salesMotion.sort()),
    JSON.stringify(prefs.business.goToMarket.sort()) !== JSON.stringify(DEFAULT_BUSINESS.goToMarket.sort()),
    prefs.business.competitionLevel !== DEFAULT_BUSINESS.competitionLevel,
    prefs.business.defensibility !== DEFAULT_BUSINESS.defensibility,
    prefs.business.revenuePotential !== DEFAULT_BUSINESS.revenuePotential,
  ].filter(Boolean).length;
  score += Math.min(businessModified / 4, 1) * 20;

  // Idea Characteristics: 20% (3 of 6 controls)
  const charModified = [
    prefs.characteristics.noveltyLevel !== DEFAULT_CHARACTERISTICS.noveltyLevel,
    prefs.characteristics.viralityPotential !== DEFAULT_CHARACTERISTICS.viralityPotential,
    prefs.characteristics.networkEffects !== DEFAULT_CHARACTERISTICS.networkEffects,
    prefs.characteristics.regulatoryComplexity !== DEFAULT_CHARACTERISTICS.regulatoryComplexity,
    prefs.characteristics.capitalRequirements !== DEFAULT_CHARACTERISTICS.capitalRequirements,
    prefs.characteristics.timeToRevenue !== DEFAULT_CHARACTERISTICS.timeToRevenue,
  ].filter(Boolean).length;
  score += Math.min(charModified / 3, 1) * 20;

  // Personal Fit: 20% (3 of 5 controls + 3 topic tags)
  const personalModified = [
    prefs.personal.domainExpertise !== DEFAULT_PERSONAL.domainExpertise,
    prefs.personal.timeCommitment !== DEFAULT_PERSONAL.timeCommitment,
    prefs.personal.runwayTolerance !== DEFAULT_PERSONAL.runwayTolerance,
    prefs.personal.topicFocus.length >= 3, // At least 3 topic tags
    prefs.personal.topicAvoidance.length > 0,
  ].filter(Boolean).length;
  // Need 3 controls + topic requirement
  const personalScore = Math.min((personalModified - 1) / 3 + (prefs.personal.topicFocus.length >= 3 ? 0.25 : 0), 1);
  score += personalScore * 20;

  return Math.round(score);
}

// ============================================
// FIRESTORE OPERATIONS
// ============================================

async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const userDoc = await db.collection('users').doc(userId).get();

  if (!userDoc.exists) {
    return null;
  }

  const data = userDoc.data();
  return data?.preferences as UserPreferences | null;
}

async function saveUserPreferences(
  userId: string,
  preferences: Omit<UserPreferences, 'lastUpdated'>
): Promise<void> {
  const completeness = calculateProfileCompleteness(preferences);

  await db.collection('users').doc(userId).set(
    {
      preferences: {
        ...preferences,
        profileCompleteness: completeness,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      preferencesUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

function mergePreferences(
  existing: Omit<UserPreferences, 'lastUpdated'>,
  updates: PartialUserPreferences
): Omit<UserPreferences, 'lastUpdated'> {
  return {
    technical: { ...existing.technical, ...updates.technical },
    market: { ...existing.market, ...updates.market },
    business: { ...existing.business, ...updates.business },
    characteristics: { ...existing.characteristics, ...updates.characteristics },
    personal: { ...existing.personal, ...updates.personal },
    activePreset: null, // Clear preset when manually modifying
    presetModified: existing.activePreset !== null,
    profileCompleteness: 0, // Will be recalculated
  };
}

// ============================================
// HTTP ENDPOINTS
// ============================================

/**
 * GET /preferences - Load user preferences
 * Response: { preferences: UserPreferences, completeness: number }
 */
export const getPreferences = onRequest(
  {
    memory: '256MiB',
    timeoutSeconds: 30,
    region: 'us-central1',
    invoker: 'public',
  },
  async (req, res) => {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const userId = await verifyAuth(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const preferences = await getUserPreferences(userId);

      if (!preferences) {
        // Return defaults for new users
        const defaults = getDefaultPreferences();
        res.status(200).json({
          preferences: defaults,
          completeness: 0,
          isDefault: true,
        });
        return;
      }

      res.status(200).json({
        preferences,
        completeness: preferences.profileCompleteness,
        isDefault: false,
      });
    } catch (error) {
      console.error('[getPreferences] Error:', error);
      res.status(500).json({ error: 'Failed to load preferences' });
    }
  }
);

/**
 * POST /preferences - Save user preferences (partial update supported)
 * Body: Partial<UserPreferences>
 * Response: { success: true, completeness: number }
 */
export const savePreferences = onRequest(
  {
    memory: '256MiB',
    timeoutSeconds: 30,
    region: 'us-central1',
    invoker: 'public',
  },
  async (req, res) => {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const userId = await verifyAuth(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const updates: PartialUserPreferences = req.body || {};

      // Validate input
      const validation = validatePreferences(updates);
      if (!validation.valid) {
        res.status(400).json({
          error: 'Validation failed',
          details: validation.errors,
        });
        return;
      }

      // Get existing or default preferences
      const existing = (await getUserPreferences(userId)) || {
        ...getDefaultPreferences(),
        lastUpdated: admin.firestore.Timestamp.now(),
      };

      // Merge updates
      const merged = mergePreferences(existing, updates);

      // Save to Firestore
      await saveUserPreferences(userId, merged);

      const completeness = calculateProfileCompleteness(merged);

      res.status(200).json({
        success: true,
        completeness,
      });
    } catch (error) {
      console.error('[savePreferences] Error:', error);
      res.status(500).json({ error: 'Failed to save preferences' });
    }
  }
);

/**
 * POST /preferences/preset - Apply a preset
 * Body: { presetId: string }
 * Response: { success: true, preferences: UserPreferences }
 */
export const applyPreset = onRequest(
  {
    memory: '256MiB',
    timeoutSeconds: 30,
    region: 'us-central1',
    invoker: 'public',
  },
  async (req, res) => {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const userId = await verifyAuth(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { presetId } = req.body || {};

      if (!presetId || !VALID_PRESET_IDS.includes(presetId)) {
        res.status(400).json({
          error: 'Invalid preset ID',
          validPresets: VALID_PRESET_IDS,
        });
        return;
      }

      const preset = getPreset(presetId as PresetId);
      if (!preset) {
        res.status(404).json({ error: 'Preset not found' });
        return;
      }

      const newPreferences: Omit<UserPreferences, 'lastUpdated'> = {
        ...preset.preferences,
        activePreset: presetId as PresetId,
        presetModified: false,
        profileCompleteness: 0, // Will be recalculated
      };

      // Save to Firestore
      await saveUserPreferences(userId, newPreferences);

      const completeness = calculateProfileCompleteness(newPreferences);

      res.status(200).json({
        success: true,
        preferences: {
          ...newPreferences,
          profileCompleteness: completeness,
        },
        completeness,
        presetName: preset.metadata.name,
      });
    } catch (error) {
      console.error('[applyPreset] Error:', error);
      res.status(500).json({ error: 'Failed to apply preset' });
    }
  }
);

/**
 * POST /preferences/reset - Reset to defaults (optional: section parameter)
 * Body: { section?: 'technical' | 'market' | 'business' | 'characteristics' | 'personal' | 'all' }
 * Response: { success: true, preferences: UserPreferences }
 */
export const resetPreferences = onRequest(
  {
    memory: '256MiB',
    timeoutSeconds: 30,
    region: 'us-central1',
    invoker: 'public',
  },
  async (req, res) => {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const userId = await verifyAuth(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { section = 'all' } = req.body || {};
      const validSections = ['technical', 'market', 'business', 'characteristics', 'personal', 'all'];

      if (!validSections.includes(section)) {
        res.status(400).json({
          error: 'Invalid section',
          validSections,
        });
        return;
      }

      // Get existing preferences or defaults
      const existing = (await getUserPreferences(userId)) || {
        ...getDefaultPreferences(),
        lastUpdated: admin.firestore.Timestamp.now(),
      };

      let newPreferences: Omit<UserPreferences, 'lastUpdated'>;

      if (section === 'all') {
        newPreferences = getDefaultPreferences();
      } else {
        // Reset only the specified section
        const defaults = getDefaultPreferences();
        newPreferences = {
          ...existing,
          [section]: defaults[section as keyof typeof defaults],
          activePreset: null,
          presetModified: false,
          profileCompleteness: 0,
        };
      }

      // Save to Firestore
      await saveUserPreferences(userId, newPreferences);

      const completeness = calculateProfileCompleteness(newPreferences);

      res.status(200).json({
        success: true,
        preferences: {
          ...newPreferences,
          profileCompleteness: completeness,
        },
        completeness,
        resetSection: section,
      });
    } catch (error) {
      console.error('[resetPreferences] Error:', error);
      res.status(500).json({ error: 'Failed to reset preferences' });
    }
  }
);

/**
 * GET /preferences/presets - List all available presets
 * Response: { presets: PresetMetadata[] }
 */
export const listPresets = onRequest(
  {
    memory: '256MiB',
    timeoutSeconds: 30,
    region: 'us-central1',
    invoker: 'public',
  },
  async (req, res) => {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // No auth required for listing presets (public info)
    try {
      const presets = getAllPresetMetadata();
      res.status(200).json({ presets });
    } catch (error) {
      console.error('[listPresets] Error:', error);
      res.status(500).json({ error: 'Failed to list presets' });
    }
  }
);

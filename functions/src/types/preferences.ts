/**
 * User Preferences Types
 * Type definitions for the Personalization Engine
 * Based on product spec v2.0 - 33 controls across 5 sections
 */

// ============================================
// SLIDER VALUES (1-5 discrete steps)
// ============================================
export type SliderValue = 1 | 2 | 3 | 4 | 5;

// ============================================
// TOGGLE OPTIONS
// ============================================
export type MobileRequirement = 'none' | 'responsive' | 'native';
export type SecurityRequirement = 'basic' | 'standard' | 'enterprise';
export type BusinessFocus = 'b2b' | 'both' | 'b2c';
export type RegulatoryComplexity = 'none' | 'low' | 'moderate' | 'heavy';
export type TimeCommitment = 'side-project' | 'part-time' | 'full-time';

// ============================================
// VALID OPTIONS FOR ARRAYS
// ============================================
export const VALID_GEOGRAPHIC_FOCUS = ['global', 'us', 'eu', 'apac', 'latam', 'mena', 'africa'] as const;
export const VALID_CUSTOMER_SEGMENTS = ['startup', 'smb', 'mid-market', 'enterprise', 'consumer'] as const;
export const VALID_INDUSTRY_VERTICALS = ['health', 'finance', 'education', 'retail', 'manufacturing', 'media', 'real-estate', 'legal', 'hr', 'logistics'] as const;
export const VALID_USER_PERSONAS = ['developers', 'designers', 'marketers', 'sales', 'executives', 'operations', 'creators', 'consumers'] as const;
export const VALID_BUSINESS_TYPES = ['saas', 'marketplace', 'service', 'agency', 'physical-product', 'content-media', 'platform'] as const;
export const VALID_PRICING_MODELS = ['free', 'freemium', 'subscription', 'one-time', 'usage-based', 'enterprise'] as const;
export const VALID_SALES_MOTIONS = ['self-serve', 'sales-assisted', 'enterprise-sales', 'channel-partners'] as const;
export const VALID_GTM_STRATEGIES = ['product-led', 'sales-led', 'community-led', 'content-led', 'partnership-led'] as const;

export type GeographicFocus = typeof VALID_GEOGRAPHIC_FOCUS[number];
export type CustomerSegment = typeof VALID_CUSTOMER_SEGMENTS[number];
export type IndustryVertical = typeof VALID_INDUSTRY_VERTICALS[number];
export type UserPersona = typeof VALID_USER_PERSONAS[number];
export type BusinessType = typeof VALID_BUSINESS_TYPES[number];
export type PricingModel = typeof VALID_PRICING_MODELS[number];
export type SalesMotion = typeof VALID_SALES_MOTIONS[number];
export type GTMStrategy = typeof VALID_GTM_STRATEGIES[number];

// ============================================
// PRESET IDS
// ============================================
export const VALID_PRESET_IDS = [
  'saas-b2b',
  'consumer-app',
  'developer-tools',
  'creator-economy',
  'smb-services',
  'marketplace',
  'ai-first',
  'fintech',
  'health-wellness',
  'ecommerce'
] as const;
export type PresetId = typeof VALID_PRESET_IDS[number];

// ============================================
// SECTION TYPES
// ============================================

/**
 * Section 1: Technical Requirements (8 controls)
 */
export interface TechnicalPreferences {
  frontendComplexity: SliderValue;      // No UI → Advanced
  backendRequirements: SliderValue;     // Serverless → Distributed Systems
  dataMLRequirements: SliderValue;      // None → Advanced ML
  mobileRequirements: MobileRequirement;
  integrationComplexity: SliderValue;   // Standalone → Enterprise Integrations
  infrastructureNeeds: SliderValue;     // Managed/Serverless → Multi-region
  securityRequirements: SecurityRequirement;
  realtimeRequired: boolean;
}

/**
 * Section 2: Market & Audience (7 controls)
 */
export interface MarketPreferences {
  geographicFocus: GeographicFocus[];
  customerSegment: CustomerSegment[];
  industryVerticals: IndustryVertical[];
  userPersonas: UserPersona[];
  businessFocus: BusinessFocus;
  marketMaturity: SliderValue;          // Emerging → Declining
  audienceSize: SliderValue;            // Niche (<10K) → Mass Market (100M+)
}

/**
 * Section 3: Business Model (7 controls)
 */
export interface BusinessPreferences {
  businessTypes: BusinessType[];
  pricingModels: PricingModel[];
  salesMotion: SalesMotion[];
  goToMarket: GTMStrategy[];
  competitionLevel: SliderValue;        // Blue Ocean → Red Ocean
  defensibility: SliderValue;           // Low Moat → High Moat
  revenuePotential: SliderValue;        // Lifestyle ($10K/mo) → Massive ($10M+)
}

/**
 * Section 4: Idea Characteristics (6 controls)
 */
export interface CharacteristicsPreferences {
  noveltyLevel: SliderValue;            // Proven Model → First-of-kind
  viralityPotential: SliderValue;       // None → Viral-first
  networkEffects: SliderValue;          // None → Critical
  regulatoryComplexity: RegulatoryComplexity;
  capitalRequirements: SliderValue;     // Bootstrap → Venture-scale
  timeToRevenue: SliderValue;           // Immediate → 1+ year
}

/**
 * Section 5: Personal Fit (5 controls)
 */
export interface PersonalPreferences {
  domainExpertise: SliderValue;         // Generalist → Deep Expert
  timeCommitment: TimeCommitment;
  runwayTolerance: SliderValue;         // Immediate Revenue → Long Runway OK
  topicFocus: string[];                 // max 15 tags
  topicAvoidance: string[];             // max 10 tags
}

// ============================================
// COMPLETE USER PREFERENCES
// ============================================

/**
 * Full UserPreferences object stored in Firestore
 */
export interface UserPreferences {
  technical: TechnicalPreferences;
  market: MarketPreferences;
  business: BusinessPreferences;
  characteristics: CharacteristicsPreferences;
  personal: PersonalPreferences;

  // Metadata
  activePreset: PresetId | null;
  presetModified: boolean;
  profileCompleteness: number;          // 0-100
  lastUpdated: FirebaseFirestore.Timestamp;
}

/**
 * Partial preferences for updates
 */
export type PartialUserPreferences = {
  technical?: Partial<TechnicalPreferences>;
  market?: Partial<MarketPreferences>;
  business?: Partial<BusinessPreferences>;
  characteristics?: Partial<CharacteristicsPreferences>;
  personal?: Partial<PersonalPreferences>;
};

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_TECHNICAL: TechnicalPreferences = {
  frontendComplexity: 3,
  backendRequirements: 3,
  dataMLRequirements: 1,
  mobileRequirements: 'none',
  integrationComplexity: 2,
  infrastructureNeeds: 2,
  securityRequirements: 'standard',
  realtimeRequired: false,
};

export const DEFAULT_MARKET: MarketPreferences = {
  geographicFocus: ['global'],
  customerSegment: ['startup', 'smb', 'mid-market', 'enterprise', 'consumer'],
  industryVerticals: ['health', 'finance', 'education', 'retail', 'manufacturing', 'media', 'real-estate', 'legal', 'hr', 'logistics'],
  userPersonas: ['developers', 'designers', 'marketers', 'sales', 'executives', 'operations', 'creators', 'consumers'],
  businessFocus: 'both',
  marketMaturity: 3,
  audienceSize: 3,
};

export const DEFAULT_BUSINESS: BusinessPreferences = {
  businessTypes: ['saas', 'marketplace', 'service', 'agency', 'physical-product', 'content-media', 'platform'],
  pricingModels: ['free', 'freemium', 'subscription', 'one-time', 'usage-based', 'enterprise'],
  salesMotion: ['self-serve', 'sales-assisted', 'enterprise-sales', 'channel-partners'],
  goToMarket: ['product-led', 'sales-led', 'community-led', 'content-led', 'partnership-led'],
  competitionLevel: 3,
  defensibility: 3,
  revenuePotential: 3,
};

export const DEFAULT_CHARACTERISTICS: CharacteristicsPreferences = {
  noveltyLevel: 3,
  viralityPotential: 2,
  networkEffects: 2,
  regulatoryComplexity: 'low',
  capitalRequirements: 2,
  timeToRevenue: 2,
};

export const DEFAULT_PERSONAL: PersonalPreferences = {
  domainExpertise: 2,
  timeCommitment: 'full-time',
  runwayTolerance: 3,
  topicFocus: [],
  topicAvoidance: [],
};

/**
 * Get default preferences object
 */
export function getDefaultPreferences(): Omit<UserPreferences, 'lastUpdated'> {
  return {
    technical: { ...DEFAULT_TECHNICAL },
    market: { ...DEFAULT_MARKET },
    business: { ...DEFAULT_BUSINESS },
    characteristics: { ...DEFAULT_CHARACTERISTICS },
    personal: { ...DEFAULT_PERSONAL },
    activePreset: null,
    presetModified: false,
    profileCompleteness: 0,
  };
}

// ============================================
// TAG LIMITS
// ============================================
export const MAX_TOPIC_FOCUS_TAGS = 15;
export const MAX_TOPIC_AVOIDANCE_TAGS = 10;

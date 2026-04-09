/**
 * Personalization Engine Types
 *
 * User preferences for tailoring AI idea generation.
 * "Bloomberg Terminal for idea generation" - 33 controls across 5 sections.
 */

// ============================================
// VALUE TYPES
// ============================================

/** Slider value (5 discrete steps) */
export type SliderValue = 1 | 2 | 3 | 4 | 5;

/** Mobile requirements options */
export type MobileRequirement = 'none' | 'responsive' | 'native';

/** Security level options */
export type SecurityLevel = 'basic' | 'standard' | 'enterprise';

/** Business focus (B2B/B2C toggle) */
export type BusinessFocus = 'b2b' | 'both' | 'b2c';

/** Regulatory complexity level */
export type RegulatoryComplexity = 'none' | 'low' | 'moderate' | 'heavy';

/** Time commitment level */
export type TimeCommitment = 'side-project' | 'part-time' | 'full-time';

// ============================================
// OPTION CONSTANTS
// ============================================

/** Geographic regions */
export const GEOGRAPHIC_OPTIONS = [
  'global', 'us', 'eu', 'apac', 'latam', 'mena', 'africa'
] as const;
export type GeographicRegion = typeof GEOGRAPHIC_OPTIONS[number];

/** Customer segments */
export const CUSTOMER_SEGMENT_OPTIONS = [
  'startup', 'smb', 'mid-market', 'enterprise', 'consumer'
] as const;
export type CustomerSegment = typeof CUSTOMER_SEGMENT_OPTIONS[number];

/** Industry verticals */
export const INDUSTRY_VERTICAL_OPTIONS = [
  'health', 'finance', 'education', 'retail', 'manufacturing',
  'media', 'real-estate', 'legal', 'hr', 'logistics'
] as const;
export type IndustryVertical = typeof INDUSTRY_VERTICAL_OPTIONS[number];

/** User personas */
export const USER_PERSONA_OPTIONS = [
  'developers', 'designers', 'marketers', 'sales',
  'executives', 'operations', 'creators', 'consumers'
] as const;
export type UserPersona = typeof USER_PERSONA_OPTIONS[number];

/** Business types */
export const BUSINESS_TYPE_OPTIONS = [
  'saas', 'marketplace', 'service', 'agency',
  'physical-product', 'content-media', 'platform'
] as const;
export type BusinessType = typeof BUSINESS_TYPE_OPTIONS[number];

/** Pricing models */
export const PRICING_MODEL_OPTIONS = [
  'free', 'freemium', 'subscription', 'one-time', 'usage-based', 'enterprise'
] as const;
export type PricingModel = typeof PRICING_MODEL_OPTIONS[number];

/** Sales motion */
export const SALES_MOTION_OPTIONS = [
  'self-serve', 'sales-assisted', 'enterprise-sales', 'channel-partners'
] as const;
export type SalesMotion = typeof SALES_MOTION_OPTIONS[number];

/** Go-to-market strategy */
export const GTM_STRATEGY_OPTIONS = [
  'product-led', 'sales-led', 'community-led', 'content-led', 'partnership-led'
] as const;
export type GTMStrategy = typeof GTM_STRATEGY_OPTIONS[number];

// ============================================
// SECTION INTERFACES
// ============================================

/**
 * Section 1: Technical Requirements (8 controls)
 * Define technical scope and capabilities
 */
export interface TechnicalPreferences {
  /** Frontend Complexity: No UI → Simple → Moderate → Complex SPA → Advanced */
  frontendComplexity: SliderValue;
  /** Backend Requirements: Serverless → Simple API → Standard → Complex → Distributed */
  backendRequirements: SliderValue;
  /** Data/ML Requirements: None → Basic Analytics → Data Pipeline → ML Integration → Advanced ML */
  dataMLRequirements: SliderValue;
  /** Mobile Requirements: None / Responsive Web / Native Apps */
  mobileRequirements: MobileRequirement;
  /** Integration Complexity: Standalone → Few APIs → Moderate → Heavy → Enterprise */
  integrationComplexity: SliderValue;
  /** Infrastructure Needs: Managed/Serverless → Basic VPS → Standard → Complex → Multi-region */
  infrastructureNeeds: SliderValue;
  /** Security Requirements: Basic → Standard → Enterprise-grade */
  securityRequirements: SecurityLevel;
  /** Real-time Requirements: Off / On (WebSocket/real-time features) */
  realtimeRequired: boolean;
}

/**
 * Section 2: Market & Audience (7 controls)
 * Specify target market and customer segments
 */
export interface MarketPreferences {
  /** Geographic Focus: Global, US, EU, APAC, LATAM, MENA, Africa */
  geographicFocus: GeographicRegion[];
  /** Customer Segment: Startup, SMB, Mid-market, Enterprise, Consumer */
  customerSegment: CustomerSegment[];
  /** Industry Verticals: Health, Finance, Education, etc. */
  industryVerticals: IndustryVertical[];
  /** User Personas: Developers, Designers, Marketers, etc. */
  userPersonas: UserPersona[];
  /** B2B / B2C Focus: B2B Only / Both / B2C Only */
  businessFocus: BusinessFocus;
  /** Market Maturity: Emerging → Growing → Mature → Saturated → Declining */
  marketMaturity: SliderValue;
  /** Audience Size: Niche (<10K) → Small → Medium → Large → Mass Market (100M+) */
  audienceSize: SliderValue;
}

/**
 * Section 3: Business Model (7 controls)
 * Configure business structure and monetization
 */
export interface BusinessPreferences {
  /** Business Type: SaaS, Marketplace, Service, Agency, Physical, Content/Media, Platform */
  businessTypes: BusinessType[];
  /** Pricing Model: Free, Freemium, Subscription, One-time, Usage-based, Enterprise */
  pricingModels: PricingModel[];
  /** Sales Motion: Self-serve, Sales-assisted, Enterprise Sales, Channel/Partners */
  salesMotion: SalesMotion[];
  /** Go-to-Market: Product-led, Sales-led, Community-led, Content-led, Partnership-led */
  goToMarket: GTMStrategy[];
  /** Competition Level: Blue Ocean → Low → Moderate → High → Red Ocean */
  competitionLevel: SliderValue;
  /** Defensibility: Low Moat → Some → Moderate → Strong → High Moat */
  defensibility: SliderValue;
  /** Revenue Potential: Lifestyle ($10K/mo) → Small → Medium → Large ($1M+) → Massive ($10M+) */
  revenuePotential: SliderValue;
}

/**
 * Section 4: Idea Characteristics (6 controls)
 * Define qualities of generated ideas
 */
export interface CharacteristicsPreferences {
  /** Novelty Level: Proven Model → Variation → Balanced → Novel → First-of-kind */
  noveltyLevel: SliderValue;
  /** Virality Potential: None → Low → Moderate → High → Viral-first */
  viralityPotential: SliderValue;
  /** Network Effects: None → Weak → Moderate → Strong → Critical */
  networkEffects: SliderValue;
  /** Regulatory Complexity: None → Low → Moderate → Heavily Regulated */
  regulatoryComplexity: RegulatoryComplexity;
  /** Capital Requirements: Bootstrap → Seed-able → Series A → Growth → Venture-scale */
  capitalRequirements: SliderValue;
  /** Time to Revenue: Immediate → 1-3 mo → 3-6 mo → 6-12 mo → 1+ year */
  timeToRevenue: SliderValue;
}

/**
 * Section 5: Personal Fit (5 controls)
 * Match ideas to personal constraints
 */
export interface PersonalPreferences {
  /** Domain Expertise: Generalist → Some → Moderate → Specialist → Deep Expert */
  domainExpertise: SliderValue;
  /** Time Commitment: Side Project / Part-time / Full-time */
  timeCommitment: TimeCommitment;
  /** Runway Tolerance: Immediate Revenue → 3 mo → 6 mo → 12 mo → Long Runway OK */
  runwayTolerance: SliderValue;
  /** Topic Focus: Free-form tags (max 15) */
  topicFocus: string[];
  /** Topic Avoidance: Free-form tags (max 10) */
  topicAvoidance: string[];
}

// ============================================
// MAIN INTERFACE
// ============================================

/**
 * User Preferences Document
 * Path: /users/{userId}
 *
 * Complete personalization profile with all 33 controls.
 */
export interface UserPreferences {
  /** Section 1: Technical Requirements (8 controls) */
  technical: TechnicalPreferences;
  /** Section 2: Market & Audience (7 controls) */
  market: MarketPreferences;
  /** Section 3: Business Model (7 controls) */
  business: BusinessPreferences;
  /** Section 4: Idea Characteristics (6 controls) */
  characteristics: CharacteristicsPreferences;
  /** Section 5: Personal Fit (5 controls) */
  personal: PersonalPreferences;

  // Metadata
  /** Current preset ID or null if custom */
  activePreset: string | null;
  /** Whether the current preset has been modified */
  presetModified: boolean;
  /** Profile completeness score (0-100) */
  profileCompleteness: number;
  /** Last updated timestamp */
  lastUpdated: Date;
}

// ============================================
// DEFAULT VALUES
// ============================================

/** Default values for Technical Requirements */
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

/** Default values for Market & Audience */
export const DEFAULT_MARKET: MarketPreferences = {
  geographicFocus: ['global'],
  customerSegment: ['startup', 'smb', 'mid-market', 'enterprise', 'consumer'],
  industryVerticals: [...INDUSTRY_VERTICAL_OPTIONS],
  userPersonas: [...USER_PERSONA_OPTIONS],
  businessFocus: 'both',
  marketMaturity: 3,
  audienceSize: 3,
};

/** Default values for Business Model */
export const DEFAULT_BUSINESS: BusinessPreferences = {
  businessTypes: [...BUSINESS_TYPE_OPTIONS],
  pricingModels: [...PRICING_MODEL_OPTIONS],
  salesMotion: [...SALES_MOTION_OPTIONS],
  goToMarket: [...GTM_STRATEGY_OPTIONS],
  competitionLevel: 3,
  defensibility: 3,
  revenuePotential: 3,
};

/** Default values for Idea Characteristics */
export const DEFAULT_CHARACTERISTICS: CharacteristicsPreferences = {
  noveltyLevel: 3,
  viralityPotential: 2,
  networkEffects: 2,
  regulatoryComplexity: 'low',
  capitalRequirements: 2,
  timeToRevenue: 2,
};

/** Default values for Personal Fit */
export const DEFAULT_PERSONAL: PersonalPreferences = {
  domainExpertise: 2,
  timeCommitment: 'full-time',
  runwayTolerance: 3,
  topicFocus: [],
  topicAvoidance: [],
};

/** Complete default UserPreferences */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  technical: DEFAULT_TECHNICAL,
  market: DEFAULT_MARKET,
  business: DEFAULT_BUSINESS,
  characteristics: DEFAULT_CHARACTERISTICS,
  personal: DEFAULT_PERSONAL,
  activePreset: null,
  presetModified: false,
  profileCompleteness: 0,
  lastUpdated: new Date(),
};

// ============================================
// SLIDER LABELS
// ============================================

/** Labels for slider values */
export const SLIDER_LABELS = {
  frontendComplexity: ['No UI', 'Simple', 'Moderate', 'Complex SPA', 'Advanced'],
  backendRequirements: ['Serverless', 'Simple API', 'Standard', 'Complex', 'Distributed'],
  dataMLRequirements: ['None', 'Basic Analytics', 'Data Pipeline', 'ML Integration', 'Advanced ML'],
  integrationComplexity: ['Standalone', 'Few APIs', 'Moderate', 'Heavy', 'Enterprise'],
  infrastructureNeeds: ['Managed', 'Basic VPS', 'Standard', 'Complex', 'Multi-region'],
  marketMaturity: ['Emerging', 'Growing', 'Mature', 'Saturated', 'Declining'],
  audienceSize: ['Niche (<10K)', 'Small', 'Medium', 'Large', 'Mass Market (100M+)'],
  competitionLevel: ['Blue Ocean', 'Low', 'Moderate', 'High', 'Red Ocean'],
  defensibility: ['Low Moat', 'Some', 'Moderate', 'Strong', 'High Moat'],
  revenuePotential: ['Lifestyle ($10K)', 'Small ($50K)', 'Medium ($200K)', 'Large ($1M+)', 'Massive ($10M+)'],
  noveltyLevel: ['Proven Model', 'Variation', 'Balanced', 'Novel', 'First-of-kind'],
  viralityPotential: ['None', 'Low', 'Moderate', 'High', 'Viral-first'],
  networkEffects: ['None', 'Weak', 'Moderate', 'Strong', 'Critical'],
  capitalRequirements: ['Bootstrap', 'Seed-able', 'Series A', 'Growth', 'Venture-scale'],
  timeToRevenue: ['Immediate', '1-3 mo', '3-6 mo', '6-12 mo', '1+ year'],
  domainExpertise: ['Generalist', 'Some', 'Moderate', 'Specialist', 'Deep Expert'],
  runwayTolerance: ['Immediate Revenue', '3 mo', '6 mo', '12 mo', 'Long Runway OK'],
} as const;

// ============================================
// PRESET PROFILE TYPE
// ============================================

/**
 * Preset profile definition
 */
export interface PresetProfile {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  preferences: Omit<UserPreferences, 'activePreset' | 'presetModified' | 'profileCompleteness' | 'lastUpdated'>;
}

// ============================================
// UTILITY TYPES
// ============================================

/** Input type for updating preferences */
export type UpdatePreferencesInput = Partial<{
  technical: Partial<TechnicalPreferences>;
  market: Partial<MarketPreferences>;
  business: Partial<BusinessPreferences>;
  characteristics: Partial<CharacteristicsPreferences>;
  personal: Partial<PersonalPreferences>;
}>;

/** Section names */
export type PreferenceSectionName = 'technical' | 'market' | 'business' | 'characteristics' | 'personal';

/** Profile completeness level */
export type CompletenessLevel = 'getting-started' | 'building-profile' | 'well-configured' | 'power-user' | 'fully-personalized';

/**
 * Get completeness level from score
 */
export function getCompletenessLevel(score: number): CompletenessLevel {
  if (score >= 100) return 'fully-personalized';
  if (score >= 76) return 'power-user';
  if (score >= 51) return 'well-configured';
  if (score >= 26) return 'building-profile';
  return 'getting-started';
}

/**
 * Completeness level display info
 */
export const COMPLETENESS_DISPLAY: Record<CompletenessLevel, { label: string; color: string }> = {
  'getting-started': { label: 'Getting Started', color: 'gray' },
  'building-profile': { label: 'Building Profile', color: 'yellow' },
  'well-configured': { label: 'Well Configured', color: 'blue' },
  'power-user': { label: 'Power User', color: 'green' },
  'fully-personalized': { label: 'Fully Personalized', color: 'gold' },
};

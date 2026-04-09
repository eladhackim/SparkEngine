/**
 * Professional Presets for Personalization Engine
 * 10 industry-standard preset profiles based on spec v2.0
 */

import {
  UserPreferences,
  PresetId,
} from '../types/preferences.js';

/**
 * Preset metadata for UI display
 */
export interface PresetMetadata {
  id: PresetId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Full preset with preferences and metadata
 */
export interface Preset {
  metadata: PresetMetadata;
  preferences: Omit<UserPreferences, 'activePreset' | 'presetModified' | 'profileCompleteness' | 'lastUpdated'>;
}

// ============================================
// PRESET DEFINITIONS
// ============================================

const SAAS_B2B: Preset = {
  metadata: {
    id: 'saas-b2b',
    name: 'SaaS B2B',
    description: 'Enterprise software and business tools',
    icon: 'Building',
    color: 'blue',
  },
  preferences: {
    technical: {
      frontendComplexity: 4,       // Complex SPA
      backendRequirements: 4,      // Complex
      dataMLRequirements: 2,       // Basic Analytics
      mobileRequirements: 'responsive',
      integrationComplexity: 4,    // Heavy
      infrastructureNeeds: 3,      // Standard
      securityRequirements: 'enterprise',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['global', 'us', 'eu'],
      customerSegment: ['enterprise', 'mid-market'],
      industryVerticals: ['health', 'finance', 'education', 'retail', 'manufacturing', 'media', 'real-estate', 'legal', 'hr', 'logistics'],
      userPersonas: ['executives', 'operations', 'sales'],
      businessFocus: 'b2b',
      marketMaturity: 3,
      audienceSize: 3,
    },
    business: {
      businessTypes: ['saas'],
      pricingModels: ['subscription', 'enterprise'],
      salesMotion: ['sales-assisted', 'enterprise-sales'],
      goToMarket: ['sales-led', 'content-led'],
      competitionLevel: 3,
      defensibility: 4,            // Strong
      revenuePotential: 4,         // Large ($1M+)
    },
    characteristics: {
      noveltyLevel: 3,
      viralityPotential: 2,
      networkEffects: 4,           // Strong
      regulatoryComplexity: 'low',
      capitalRequirements: 4,      // Series A
      timeToRevenue: 4,            // 6-12 months
    },
    personal: {
      domainExpertise: 3,          // Moderate
      timeCommitment: 'full-time',
      runwayTolerance: 4,          // 12 months
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

const CONSUMER_APP: Preset = {
  metadata: {
    id: 'consumer-app',
    name: 'Consumer App (B2C)',
    description: 'Mass-market mobile and web applications',
    icon: 'Smartphone',
    color: 'purple',
  },
  preferences: {
    technical: {
      frontendComplexity: 4,       // Complex SPA
      backendRequirements: 3,      // Standard
      dataMLRequirements: 2,       // Basic Analytics
      mobileRequirements: 'native',
      integrationComplexity: 2,
      infrastructureNeeds: 3,
      securityRequirements: 'standard',
      realtimeRequired: true,
    },
    market: {
      geographicFocus: ['global'],
      customerSegment: ['consumer'],
      industryVerticals: ['media', 'retail', 'education'],
      userPersonas: ['consumers', 'creators'],
      businessFocus: 'b2c',
      marketMaturity: 2,           // Growing
      audienceSize: 5,             // Mass Market
    },
    business: {
      businessTypes: ['platform'],
      pricingModels: ['freemium', 'free'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led'],
      competitionLevel: 4,         // High
      defensibility: 3,
      revenuePotential: 5,         // Massive
    },
    characteristics: {
      noveltyLevel: 3,
      viralityPotential: 5,        // Viral-first
      networkEffects: 4,           // Strong
      regulatoryComplexity: 'none',
      capitalRequirements: 5,      // Venture-scale
      timeToRevenue: 5,            // 1+ year
    },
    personal: {
      domainExpertise: 2,          // Generalist OK
      timeCommitment: 'full-time',
      runwayTolerance: 5,          // Long runway
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

const DEVELOPER_TOOLS: Preset = {
  metadata: {
    id: 'developer-tools',
    name: 'Developer Tools',
    description: 'APIs, SDKs, CLIs, and developer infrastructure',
    icon: 'Code',
    color: 'green',
  },
  preferences: {
    technical: {
      frontendComplexity: 2,       // Simple
      backendRequirements: 5,      // Distributed Systems
      dataMLRequirements: 1,       // None
      mobileRequirements: 'none',
      integrationComplexity: 4,    // Heavy
      infrastructureNeeds: 4,      // Complex
      securityRequirements: 'standard',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['global'],
      customerSegment: ['startup', 'smb'],
      industryVerticals: ['media', 'finance', 'retail'],
      userPersonas: ['developers'],
      businessFocus: 'b2b',
      marketMaturity: 2,
      audienceSize: 3,
    },
    business: {
      businessTypes: ['saas', 'platform'],
      pricingModels: ['usage-based', 'freemium'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led', 'community-led'],
      competitionLevel: 3,
      defensibility: 4,            // Strong
      revenuePotential: 3,
    },
    characteristics: {
      noveltyLevel: 3,
      viralityPotential: 3,
      networkEffects: 3,
      regulatoryComplexity: 'none',
      capitalRequirements: 2,      // Seed-able
      timeToRevenue: 3,            // 3-6 months
    },
    personal: {
      domainExpertise: 4,          // Specialist (engineering)
      timeCommitment: 'full-time',
      runwayTolerance: 3,          // 6 months
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

const CREATOR_ECONOMY: Preset = {
  metadata: {
    id: 'creator-economy',
    name: 'Creator Economy',
    description: 'Tools for creators, influencers, and content producers',
    icon: 'Star',
    color: 'pink',
  },
  preferences: {
    technical: {
      frontendComplexity: 4,       // Complex
      backendRequirements: 3,      // Standard
      dataMLRequirements: 2,       // Basic Analytics
      mobileRequirements: 'responsive',
      integrationComplexity: 3,
      infrastructureNeeds: 3,
      securityRequirements: 'standard',
      realtimeRequired: true,
    },
    market: {
      geographicFocus: ['global'],
      customerSegment: ['consumer', 'smb'],
      industryVerticals: ['media'],
      userPersonas: ['creators'],
      businessFocus: 'both',
      marketMaturity: 2,           // Growing
      audienceSize: 3,             // Medium
    },
    business: {
      businessTypes: ['platform', 'saas'],
      pricingModels: ['freemium', 'subscription'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led', 'content-led'],
      competitionLevel: 3,
      defensibility: 3,
      revenuePotential: 3,
    },
    characteristics: {
      noveltyLevel: 3,
      viralityPotential: 4,        // High
      networkEffects: 4,           // Strong
      regulatoryComplexity: 'none',
      capitalRequirements: 3,      // Seed-able
      timeToRevenue: 2,            // 1-3 months
    },
    personal: {
      domainExpertise: 2,          // Generalist
      timeCommitment: 'full-time',
      runwayTolerance: 2,          // 3 months
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

const SMB_SERVICES: Preset = {
  metadata: {
    id: 'smb-services',
    name: 'SMB Services',
    description: 'Software and services for small businesses',
    icon: 'Store',
    color: 'orange',
  },
  preferences: {
    technical: {
      frontendComplexity: 3,       // Moderate
      backendRequirements: 3,      // Standard
      dataMLRequirements: 1,       // None
      mobileRequirements: 'responsive',
      integrationComplexity: 3,    // Moderate
      infrastructureNeeds: 2,      // Basic VPS
      securityRequirements: 'standard',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['us', 'eu'],
      customerSegment: ['smb'],
      industryVerticals: ['retail', 'hr', 'logistics'],
      userPersonas: ['operations', 'executives'],
      businessFocus: 'b2b',
      marketMaturity: 3,
      audienceSize: 2,             // Small-Medium
    },
    business: {
      businessTypes: ['saas', 'service'],
      pricingModels: ['subscription'],
      salesMotion: ['self-serve', 'sales-assisted'],
      goToMarket: ['product-led', 'content-led'],
      competitionLevel: 3,
      defensibility: 2,            // Low-moderate
      revenuePotential: 2,         // Small ($50K)
    },
    characteristics: {
      noveltyLevel: 2,             // Variation
      viralityPotential: 2,
      networkEffects: 2,
      regulatoryComplexity: 'none',
      capitalRequirements: 1,      // Bootstrap
      timeToRevenue: 2,            // 1-3 months
    },
    personal: {
      domainExpertise: 3,          // Some expertise
      timeCommitment: 'full-time',
      runwayTolerance: 2,          // 3 months
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

const MARKETPLACE: Preset = {
  metadata: {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Two-sided platforms connecting buyers and sellers',
    icon: 'Repeat',
    color: 'teal',
  },
  preferences: {
    technical: {
      frontendComplexity: 4,       // Complex
      backendRequirements: 4,      // Complex
      dataMLRequirements: 2,       // Basic Analytics
      mobileRequirements: 'responsive',
      integrationComplexity: 3,
      infrastructureNeeds: 3,
      securityRequirements: 'standard',
      realtimeRequired: true,
    },
    market: {
      geographicFocus: ['us', 'eu'],
      customerSegment: ['consumer', 'smb'],
      industryVerticals: ['retail', 'logistics'],
      userPersonas: ['consumers', 'operations'],
      businessFocus: 'both',
      marketMaturity: 2,           // Growing
      audienceSize: 4,             // Large
    },
    business: {
      businessTypes: ['marketplace'],
      pricingModels: ['usage-based', 'freemium'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led'],
      competitionLevel: 2,         // Blue ocean preferred
      defensibility: 4,            // Strong (network effects)
      revenuePotential: 4,
    },
    characteristics: {
      noveltyLevel: 3,
      viralityPotential: 4,
      networkEffects: 5,           // Critical
      regulatoryComplexity: 'low',
      capitalRequirements: 4,      // Growth capital
      timeToRevenue: 4,            // 6-12 months
    },
    personal: {
      domainExpertise: 3,          // Moderate domain
      timeCommitment: 'full-time',
      runwayTolerance: 5,          // Long runway OK
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

const AI_FIRST: Preset = {
  metadata: {
    id: 'ai-first',
    name: 'AI-First',
    description: 'Products powered by artificial intelligence and ML',
    icon: 'Brain',
    color: 'indigo',
  },
  preferences: {
    technical: {
      frontendComplexity: 3,       // Moderate
      backendRequirements: 5,      // Distributed Systems
      dataMLRequirements: 5,       // Advanced ML
      mobileRequirements: 'none',
      integrationComplexity: 3,
      infrastructureNeeds: 4,      // Complex
      securityRequirements: 'standard',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['global'],
      customerSegment: ['enterprise', 'mid-market'],
      industryVerticals: ['health', 'finance', 'media', 'legal'],
      userPersonas: ['executives', 'operations', 'developers'],
      businessFocus: 'b2b',
      marketMaturity: 1,           // Emerging
      audienceSize: 3,
    },
    business: {
      businessTypes: ['saas', 'platform'],
      pricingModels: ['usage-based', 'enterprise'],
      salesMotion: ['self-serve', 'sales-assisted'],
      goToMarket: ['product-led', 'sales-led'],
      competitionLevel: 2,         // Blue ocean
      defensibility: 5,            // High moat
      revenuePotential: 5,         // Massive
    },
    characteristics: {
      noveltyLevel: 5,             // First-of-kind
      viralityPotential: 3,
      networkEffects: 3,
      regulatoryComplexity: 'low',
      capitalRequirements: 5,      // Venture-scale
      timeToRevenue: 4,            // 6-12 months
    },
    personal: {
      domainExpertise: 5,          // Deep expert (ML)
      timeCommitment: 'full-time',
      runwayTolerance: 5,          // Long runway
      topicFocus: ['AI', 'machine-learning', 'automation'],
      topicAvoidance: [],
    },
  },
};

const FINTECH: Preset = {
  metadata: {
    id: 'fintech',
    name: 'Fintech',
    description: 'Financial services, payments, and banking technology',
    icon: 'DollarSign',
    color: 'emerald',
  },
  preferences: {
    technical: {
      frontendComplexity: 4,       // Complex
      backendRequirements: 4,      // Complex
      dataMLRequirements: 3,       // Data Pipeline
      mobileRequirements: 'native',
      integrationComplexity: 5,    // Enterprise Integrations
      infrastructureNeeds: 4,      // Complex
      securityRequirements: 'enterprise',
      realtimeRequired: true,
    },
    market: {
      geographicFocus: ['us', 'eu'],
      customerSegment: ['consumer', 'smb', 'enterprise'],
      industryVerticals: ['finance'],
      userPersonas: ['consumers', 'executives', 'operations'],
      businessFocus: 'both',
      marketMaturity: 3,
      audienceSize: 4,
    },
    business: {
      businessTypes: ['platform', 'saas'],
      pricingModels: ['usage-based', 'subscription'],
      salesMotion: ['sales-assisted', 'enterprise-sales'],
      goToMarket: ['sales-led', 'partnership-led'],
      competitionLevel: 4,         // High
      defensibility: 4,            // Strong
      revenuePotential: 5,         // Massive
    },
    characteristics: {
      noveltyLevel: 3,
      viralityPotential: 2,
      networkEffects: 3,
      regulatoryComplexity: 'heavy',
      capitalRequirements: 5,      // Growth capital
      timeToRevenue: 5,            // 1+ year
    },
    personal: {
      domainExpertise: 5,          // Deep expert (finance)
      timeCommitment: 'full-time',
      runwayTolerance: 5,          // Long runway
      topicFocus: ['finance', 'payments', 'banking'],
      topicAvoidance: [],
    },
  },
};

const HEALTH_WELLNESS: Preset = {
  metadata: {
    id: 'health-wellness',
    name: 'Health & Wellness',
    description: 'Healthcare, fitness, and mental health products',
    icon: 'Heart',
    color: 'red',
  },
  preferences: {
    technical: {
      frontendComplexity: 3,       // Moderate
      backendRequirements: 3,      // Standard
      dataMLRequirements: 3,       // Data Pipeline
      mobileRequirements: 'native',
      integrationComplexity: 3,
      infrastructureNeeds: 3,
      securityRequirements: 'enterprise',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['global'],
      customerSegment: ['consumer'],
      industryVerticals: ['health'],
      userPersonas: ['consumers'],
      businessFocus: 'b2c',
      marketMaturity: 2,           // Growing
      audienceSize: 4,             // Large
    },
    business: {
      businessTypes: ['saas', 'platform'],
      pricingModels: ['subscription', 'freemium'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led', 'content-led'],
      competitionLevel: 4,         // High
      defensibility: 3,
      revenuePotential: 3,
    },
    characteristics: {
      noveltyLevel: 3,
      viralityPotential: 3,
      networkEffects: 2,
      regulatoryComplexity: 'moderate',
      capitalRequirements: 3,      // Seed-able
      timeToRevenue: 3,            // 3-6 months
    },
    personal: {
      domainExpertise: 3,          // Some expertise
      timeCommitment: 'full-time',
      runwayTolerance: 3,          // 6 months
      topicFocus: ['health', 'wellness', 'fitness'],
      topicAvoidance: [],
    },
  },
};

const ECOMMERCE: Preset = {
  metadata: {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Online retail, D2C brands, and shopping technology',
    icon: 'ShoppingCart',
    color: 'amber',
  },
  preferences: {
    technical: {
      frontendComplexity: 4,       // Complex
      backendRequirements: 3,      // Standard
      dataMLRequirements: 2,       // Basic Analytics
      mobileRequirements: 'responsive',
      integrationComplexity: 4,    // Heavy
      infrastructureNeeds: 3,
      securityRequirements: 'standard',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['us', 'eu'],
      customerSegment: ['consumer'],
      industryVerticals: ['retail'],
      userPersonas: ['consumers'],
      businessFocus: 'b2c',
      marketMaturity: 4,           // Saturated
      audienceSize: 5,             // Mass Market
    },
    business: {
      businessTypes: ['platform', 'physical-product'],
      pricingModels: ['one-time', 'subscription'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led', 'content-led'],
      competitionLevel: 5,         // Red Ocean
      defensibility: 2,            // Low-moderate
      revenuePotential: 3,
    },
    characteristics: {
      noveltyLevel: 2,             // Variation
      viralityPotential: 3,
      networkEffects: 2,
      regulatoryComplexity: 'none',
      capitalRequirements: 2,      // Bootstrap to Seed
      timeToRevenue: 1,            // Immediate
    },
    personal: {
      domainExpertise: 2,          // Generalist
      timeCommitment: 'full-time',
      runwayTolerance: 1,          // Immediate to 3 months
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// PRESET MAP
// ============================================

export const PRESETS: Record<PresetId, Preset> = {
  'saas-b2b': SAAS_B2B,
  'consumer-app': CONSUMER_APP,
  'developer-tools': DEVELOPER_TOOLS,
  'creator-economy': CREATOR_ECONOMY,
  'smb-services': SMB_SERVICES,
  'marketplace': MARKETPLACE,
  'ai-first': AI_FIRST,
  'fintech': FINTECH,
  'health-wellness': HEALTH_WELLNESS,
  'ecommerce': ECOMMERCE,
};

/**
 * Get a preset by ID
 */
export function getPreset(presetId: PresetId): Preset | undefined {
  return PRESETS[presetId];
}

/**
 * Get all preset metadata for listing
 */
export function getAllPresetMetadata(): PresetMetadata[] {
  return Object.values(PRESETS).map(p => p.metadata);
}

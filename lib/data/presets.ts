/**
 * Preset Profiles for Personalization Engine
 *
 * 10 professional presets organized by business category.
 * Each preset configures all 33 controls to sensible defaults.
 */

import type { PresetProfile } from '@/lib/types/preferences';

// ============================================
// PRESET 1: SAAS B2B
// ============================================

const SAAS_B2B: PresetProfile = {
  id: 'saas-b2b',
  name: 'SaaS B2B',
  icon: 'Building',
  color: 'blue',
  description: 'Enterprise software and business tools',
  preferences: {
    technical: {
      frontendComplexity: 4, // Complex SPA
      backendRequirements: 4, // Complex
      dataMLRequirements: 2, // Basic Analytics
      mobileRequirements: 'responsive',
      integrationComplexity: 4, // Heavy
      infrastructureNeeds: 3, // Standard
      securityRequirements: 'enterprise',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['global', 'us', 'eu'],
      customerSegment: ['enterprise', 'mid-market'],
      industryVerticals: ['finance', 'retail', 'manufacturing', 'hr', 'logistics'],
      userPersonas: ['executives', 'operations', 'developers'],
      businessFocus: 'b2b',
      marketMaturity: 3, // Mature
      audienceSize: 3, // Medium
    },
    business: {
      businessTypes: ['saas'],
      pricingModels: ['subscription', 'enterprise'],
      salesMotion: ['sales-assisted', 'enterprise-sales'],
      goToMarket: ['sales-led', 'product-led'],
      competitionLevel: 3, // Moderate
      defensibility: 4, // Strong
      revenuePotential: 4, // Large ($1M+)
    },
    characteristics: {
      noveltyLevel: 2, // Variation
      viralityPotential: 2, // Low
      networkEffects: 4, // Strong
      regulatoryComplexity: 'low',
      capitalRequirements: 3, // Series A
      timeToRevenue: 4, // 6-12 mo
    },
    personal: {
      domainExpertise: 3, // Moderate
      timeCommitment: 'full-time',
      runwayTolerance: 4, // 12 mo
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// PRESET 2: CONSUMER APP (B2C)
// ============================================

const CONSUMER_APP: PresetProfile = {
  id: 'consumer-app',
  name: 'Consumer App (B2C)',
  icon: 'Smartphone',
  color: 'purple',
  description: 'Mass-market mobile and web applications',
  preferences: {
    technical: {
      frontendComplexity: 4, // Complex SPA
      backendRequirements: 3, // Standard
      dataMLRequirements: 2, // Basic Analytics
      mobileRequirements: 'native',
      integrationComplexity: 2, // Few APIs
      infrastructureNeeds: 3, // Standard
      securityRequirements: 'standard',
      realtimeRequired: true,
    },
    market: {
      geographicFocus: ['global'],
      customerSegment: ['consumer'],
      industryVerticals: ['media', 'retail', 'education'],
      userPersonas: ['consumers', 'creators'],
      businessFocus: 'b2c',
      marketMaturity: 2, // Growing
      audienceSize: 5, // Mass Market
    },
    business: {
      businessTypes: ['platform'],
      pricingModels: ['freemium', 'subscription'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led', 'content-led'],
      competitionLevel: 4, // High
      defensibility: 3, // Moderate
      revenuePotential: 5, // Massive ($10M+)
    },
    characteristics: {
      noveltyLevel: 3, // Balanced
      viralityPotential: 5, // Viral-first
      networkEffects: 4, // Strong
      regulatoryComplexity: 'none',
      capitalRequirements: 5, // Venture-scale
      timeToRevenue: 5, // 1+ year
    },
    personal: {
      domainExpertise: 1, // Generalist
      timeCommitment: 'full-time',
      runwayTolerance: 5, // Long Runway OK
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// PRESET 3: DEVELOPER TOOLS
// ============================================

const DEVELOPER_TOOLS: PresetProfile = {
  id: 'developer-tools',
  name: 'Developer Tools',
  icon: 'Code',
  color: 'green',
  description: 'APIs, SDKs, CLIs, and developer infrastructure',
  preferences: {
    technical: {
      frontendComplexity: 2, // Simple
      backendRequirements: 5, // Distributed
      dataMLRequirements: 1, // None
      mobileRequirements: 'none',
      integrationComplexity: 4, // Heavy
      infrastructureNeeds: 4, // Complex
      securityRequirements: 'standard',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['global'],
      customerSegment: ['startup', 'smb'],
      industryVerticals: ['media', 'finance', 'retail'],
      userPersonas: ['developers'],
      businessFocus: 'b2b',
      marketMaturity: 2, // Growing
      audienceSize: 3, // Medium
    },
    business: {
      businessTypes: ['saas', 'platform'],
      pricingModels: ['freemium', 'usage-based'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led', 'community-led'],
      competitionLevel: 3, // Moderate
      defensibility: 4, // Strong
      revenuePotential: 3, // Medium
    },
    characteristics: {
      noveltyLevel: 3, // Balanced
      viralityPotential: 3, // Moderate
      networkEffects: 3, // Moderate
      regulatoryComplexity: 'none',
      capitalRequirements: 2, // Seed-able
      timeToRevenue: 3, // 3-6 mo
    },
    personal: {
      domainExpertise: 4, // Specialist
      timeCommitment: 'full-time',
      runwayTolerance: 3, // 6 mo
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// PRESET 4: CREATOR ECONOMY
// ============================================

const CREATOR_ECONOMY: PresetProfile = {
  id: 'creator-economy',
  name: 'Creator Economy',
  icon: 'Star',
  color: 'pink',
  description: 'Tools for creators, influencers, and content producers',
  preferences: {
    technical: {
      frontendComplexity: 4, // Complex SPA
      backendRequirements: 3, // Standard
      dataMLRequirements: 2, // Basic Analytics
      mobileRequirements: 'responsive',
      integrationComplexity: 3, // Moderate
      infrastructureNeeds: 2, // Basic VPS
      securityRequirements: 'standard',
      realtimeRequired: true,
    },
    market: {
      geographicFocus: ['global'],
      customerSegment: ['consumer', 'smb'],
      industryVerticals: ['media', 'education'],
      userPersonas: ['creators', 'marketers'],
      businessFocus: 'both',
      marketMaturity: 2, // Growing
      audienceSize: 3, // Medium
    },
    business: {
      businessTypes: ['platform', 'saas'],
      pricingModels: ['freemium', 'subscription'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led', 'content-led'],
      competitionLevel: 3, // Moderate
      defensibility: 3, // Moderate
      revenuePotential: 3, // Medium
    },
    characteristics: {
      noveltyLevel: 3, // Balanced
      viralityPotential: 4, // High
      networkEffects: 4, // Strong
      regulatoryComplexity: 'none',
      capitalRequirements: 2, // Seed-able
      timeToRevenue: 2, // 1-3 mo
    },
    personal: {
      domainExpertise: 2, // Some
      timeCommitment: 'full-time',
      runwayTolerance: 2, // 3 mo
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// PRESET 5: SMB SERVICES
// ============================================

const SMB_SERVICES: PresetProfile = {
  id: 'smb-services',
  name: 'SMB Services',
  icon: 'Store',
  color: 'orange',
  description: 'Software and services for small businesses',
  preferences: {
    technical: {
      frontendComplexity: 3, // Moderate
      backendRequirements: 3, // Standard
      dataMLRequirements: 1, // None
      mobileRequirements: 'responsive',
      integrationComplexity: 3, // Moderate
      infrastructureNeeds: 2, // Basic VPS
      securityRequirements: 'standard',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['us', 'eu'],
      customerSegment: ['smb'],
      industryVerticals: ['retail', 'real-estate', 'legal', 'hr'],
      userPersonas: ['executives', 'operations'],
      businessFocus: 'b2b',
      marketMaturity: 3, // Mature
      audienceSize: 2, // Small
    },
    business: {
      businessTypes: ['saas', 'service'],
      pricingModels: ['subscription'],
      salesMotion: ['self-serve', 'sales-assisted'],
      goToMarket: ['product-led', 'sales-led'],
      competitionLevel: 3, // Moderate
      defensibility: 2, // Some
      revenuePotential: 2, // Small
    },
    characteristics: {
      noveltyLevel: 2, // Variation
      viralityPotential: 2, // Low
      networkEffects: 2, // Weak
      regulatoryComplexity: 'low',
      capitalRequirements: 1, // Bootstrap
      timeToRevenue: 2, // 1-3 mo
    },
    personal: {
      domainExpertise: 2, // Some
      timeCommitment: 'part-time',
      runwayTolerance: 2, // 3 mo
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// PRESET 6: MARKETPLACE
// ============================================

const MARKETPLACE: PresetProfile = {
  id: 'marketplace',
  name: 'Marketplace',
  icon: 'Repeat',
  color: 'teal',
  description: 'Two-sided platforms connecting buyers and sellers',
  preferences: {
    technical: {
      frontendComplexity: 4, // Complex SPA
      backendRequirements: 4, // Complex
      dataMLRequirements: 2, // Basic Analytics
      mobileRequirements: 'responsive',
      integrationComplexity: 3, // Moderate
      infrastructureNeeds: 3, // Standard
      securityRequirements: 'standard',
      realtimeRequired: true,
    },
    market: {
      geographicFocus: ['us', 'eu'],
      customerSegment: ['consumer', 'smb'],
      industryVerticals: ['retail', 'real-estate', 'logistics'],
      userPersonas: ['consumers', 'operations'],
      businessFocus: 'both',
      marketMaturity: 2, // Growing
      audienceSize: 4, // Large
    },
    business: {
      businessTypes: ['marketplace'],
      pricingModels: ['freemium', 'usage-based'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led'],
      competitionLevel: 1, // Blue Ocean
      defensibility: 4, // Strong
      revenuePotential: 5, // Massive
    },
    characteristics: {
      noveltyLevel: 3, // Balanced
      viralityPotential: 4, // High
      networkEffects: 5, // Critical
      regulatoryComplexity: 'low',
      capitalRequirements: 4, // Growth
      timeToRevenue: 4, // 6-12 mo
    },
    personal: {
      domainExpertise: 3, // Moderate
      timeCommitment: 'full-time',
      runwayTolerance: 5, // Long Runway OK
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// PRESET 7: AI-FIRST
// ============================================

const AI_FIRST: PresetProfile = {
  id: 'ai-first',
  name: 'AI-First',
  icon: 'Brain',
  color: 'indigo',
  description: 'Products powered by artificial intelligence and ML',
  preferences: {
    technical: {
      frontendComplexity: 3, // Moderate
      backendRequirements: 5, // Distributed
      dataMLRequirements: 5, // Advanced ML
      mobileRequirements: 'responsive',
      integrationComplexity: 3, // Moderate
      infrastructureNeeds: 4, // Complex
      securityRequirements: 'standard',
      realtimeRequired: true,
    },
    market: {
      geographicFocus: ['global'],
      customerSegment: ['enterprise', 'mid-market'],
      industryVerticals: ['finance', 'health', 'media', 'legal'],
      userPersonas: ['developers', 'executives', 'operations'],
      businessFocus: 'b2b',
      marketMaturity: 1, // Emerging
      audienceSize: 3, // Medium
    },
    business: {
      businessTypes: ['saas', 'platform'],
      pricingModels: ['usage-based', 'enterprise'],
      salesMotion: ['self-serve', 'sales-assisted'],
      goToMarket: ['product-led', 'sales-led'],
      competitionLevel: 2, // Low
      defensibility: 5, // High Moat
      revenuePotential: 5, // Massive
    },
    characteristics: {
      noveltyLevel: 4, // Novel
      viralityPotential: 3, // Moderate
      networkEffects: 3, // Moderate
      regulatoryComplexity: 'low',
      capitalRequirements: 5, // Venture-scale
      timeToRevenue: 4, // 6-12 mo
    },
    personal: {
      domainExpertise: 4, // Specialist (ML)
      timeCommitment: 'full-time',
      runwayTolerance: 5, // Long Runway
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// PRESET 8: FINTECH
// ============================================

const FINTECH: PresetProfile = {
  id: 'fintech',
  name: 'Fintech',
  icon: 'DollarSign',
  color: 'emerald',
  description: 'Financial services, payments, and banking technology',
  preferences: {
    technical: {
      frontendComplexity: 4, // Complex SPA
      backendRequirements: 4, // Complex
      dataMLRequirements: 3, // Data Pipeline
      mobileRequirements: 'native',
      integrationComplexity: 5, // Enterprise
      infrastructureNeeds: 4, // Complex
      securityRequirements: 'enterprise',
      realtimeRequired: true,
    },
    market: {
      geographicFocus: ['us', 'eu'],
      customerSegment: ['consumer', 'smb', 'enterprise'],
      industryVerticals: ['finance'],
      userPersonas: ['consumers', 'executives', 'operations'],
      businessFocus: 'both',
      marketMaturity: 3, // Mature
      audienceSize: 4, // Large
    },
    business: {
      businessTypes: ['platform', 'saas'],
      pricingModels: ['usage-based', 'subscription'],
      salesMotion: ['sales-assisted', 'self-serve'],
      goToMarket: ['product-led', 'sales-led'],
      competitionLevel: 4, // High
      defensibility: 5, // High Moat
      revenuePotential: 5, // Massive
    },
    characteristics: {
      noveltyLevel: 2, // Variation
      viralityPotential: 2, // Low
      networkEffects: 3, // Moderate
      regulatoryComplexity: 'heavy',
      capitalRequirements: 4, // Growth
      timeToRevenue: 4, // 6-12 mo
    },
    personal: {
      domainExpertise: 5, // Deep Expert (finance)
      timeCommitment: 'full-time',
      runwayTolerance: 5, // Long Runway
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// PRESET 9: HEALTH & WELLNESS
// ============================================

const HEALTH_WELLNESS: PresetProfile = {
  id: 'health-wellness',
  name: 'Health & Wellness',
  icon: 'Heart',
  color: 'red',
  description: 'Healthcare, fitness, and mental health products',
  preferences: {
    technical: {
      frontendComplexity: 3, // Moderate
      backendRequirements: 3, // Standard
      dataMLRequirements: 3, // Data Pipeline
      mobileRequirements: 'native',
      integrationComplexity: 3, // Moderate
      infrastructureNeeds: 2, // Basic VPS
      securityRequirements: 'enterprise',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['global'],
      customerSegment: ['consumer'],
      industryVerticals: ['health'],
      userPersonas: ['consumers'],
      businessFocus: 'b2c',
      marketMaturity: 2, // Growing
      audienceSize: 4, // Large
    },
    business: {
      businessTypes: ['saas', 'platform'],
      pricingModels: ['freemium', 'subscription'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led', 'content-led'],
      competitionLevel: 3, // Moderate
      defensibility: 3, // Moderate
      revenuePotential: 3, // Medium
    },
    characteristics: {
      noveltyLevel: 3, // Balanced
      viralityPotential: 3, // Moderate
      networkEffects: 2, // Weak
      regulatoryComplexity: 'moderate',
      capitalRequirements: 2, // Seed-able
      timeToRevenue: 3, // 3-6 mo
    },
    personal: {
      domainExpertise: 2, // Some
      timeCommitment: 'full-time',
      runwayTolerance: 3, // 6 mo
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// PRESET 10: E-COMMERCE
// ============================================

const ECOMMERCE: PresetProfile = {
  id: 'ecommerce',
  name: 'E-commerce',
  icon: 'ShoppingCart',
  color: 'amber',
  description: 'Online retail, D2C brands, and shopping technology',
  preferences: {
    technical: {
      frontendComplexity: 4, // Complex SPA
      backendRequirements: 3, // Standard
      dataMLRequirements: 2, // Basic Analytics
      mobileRequirements: 'responsive',
      integrationComplexity: 4, // Heavy
      infrastructureNeeds: 3, // Standard
      securityRequirements: 'standard',
      realtimeRequired: false,
    },
    market: {
      geographicFocus: ['us', 'eu'],
      customerSegment: ['consumer'],
      industryVerticals: ['retail'],
      userPersonas: ['consumers'],
      businessFocus: 'b2c',
      marketMaturity: 4, // Saturated
      audienceSize: 5, // Mass Market
    },
    business: {
      businessTypes: ['platform', 'physical-product'],
      pricingModels: ['one-time', 'usage-based'],
      salesMotion: ['self-serve'],
      goToMarket: ['product-led', 'content-led'],
      competitionLevel: 5, // Red Ocean
      defensibility: 3, // Moderate
      revenuePotential: 3, // Medium
    },
    characteristics: {
      noveltyLevel: 2, // Variation
      viralityPotential: 3, // Moderate
      networkEffects: 2, // Weak
      regulatoryComplexity: 'low',
      capitalRequirements: 2, // Seed-able
      timeToRevenue: 1, // Immediate
    },
    personal: {
      domainExpertise: 1, // Generalist
      timeCommitment: 'full-time',
      runwayTolerance: 1, // Immediate Revenue
      topicFocus: [],
      topicAvoidance: [],
    },
  },
};

// ============================================
// EXPORTS
// ============================================

/** All preset profiles */
export const PRESET_PROFILES: PresetProfile[] = [
  SAAS_B2B,
  CONSUMER_APP,
  DEVELOPER_TOOLS,
  CREATOR_ECONOMY,
  SMB_SERVICES,
  MARKETPLACE,
  AI_FIRST,
  FINTECH,
  HEALTH_WELLNESS,
  ECOMMERCE,
];

/** Get preset by ID */
export function getPresetById(id: string): PresetProfile | undefined {
  return PRESET_PROFILES.find(preset => preset.id === id);
}

/** Preset IDs for validation */
export const PRESET_IDS = PRESET_PROFILES.map(p => p.id);
export type PresetId = typeof PRESET_IDS[number];

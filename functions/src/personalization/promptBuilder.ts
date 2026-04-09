/**
 * Prompt Builder for Personalization Engine
 * Converts user preferences into AI prompt constraints
 * Based on product spec v2.0 - Section 7.2
 */

import { UserPreferences } from '../types/preferences.js';

// ============================================
// LABEL MAPPINGS
// ============================================

const TECH_LEVELS = ['minimal', 'basic', 'moderate', 'complex', 'advanced'];
const MARKET_MATURITY_LABELS = ['emerging', 'growing', 'mature', 'saturated', 'declining'];
const AUDIENCE_SIZE_LABELS = ['niche (<10K)', 'small', 'medium', 'large', 'mass market (100M+)'];
const COMPETITION_LABELS = ['blue ocean', 'low competition', 'moderate competition', 'high competition', 'red ocean'];
const DEFENSIBILITY_LABELS = ['low moat', 'some moat', 'moderate moat', 'strong moat', 'high moat'];
const REVENUE_LABELS = ['lifestyle ($10K/mo)', 'small ($50K)', 'medium ($200K)', 'large ($1M+)', 'massive ($10M+)'];
const NOVELTY_LABELS = ['proven model', 'variation', 'balanced', 'novel', 'first-of-kind'];
const VIRALITY_LABELS = ['none', 'low', 'moderate', 'high', 'viral-first'];
const NETWORK_EFFECTS_LABELS = ['none', 'weak', 'moderate', 'strong', 'critical'];
const CAPITAL_LABELS = ['bootstrap', 'seed-able', 'series A', 'growth', 'venture-scale'];
const TIME_TO_REVENUE_LABELS = ['immediate', '1-3 months', '3-6 months', '6-12 months', '1+ year'];
const DOMAIN_EXPERTISE_LABELS = ['generalist', 'some expertise', 'moderate', 'specialist', 'deep expert'];
const RUNWAY_LABELS = ['immediate revenue needed', '3 month runway', '6 month runway', '12 month runway', 'long runway OK'];

const MOBILE_REQUIREMENT_LABELS: Record<string, string> = {
  'none': 'no mobile requirement',
  'responsive': 'responsive web required',
  'native': 'native mobile apps required',
};

const BUSINESS_FOCUS_LABELS: Record<string, string> = {
  'b2b': 'B2B only',
  'both': 'both B2B and B2C',
  'b2c': 'B2C only',
};

const REGULATORY_LABELS: Record<string, string> = {
  'none': 'no regulatory constraints',
  'low': 'minimal regulation OK',
  'moderate': 'moderate regulation acceptable',
  'heavy': 'heavily regulated industries OK',
};

const TIME_COMMITMENT_LABELS: Record<string, string> = {
  'side-project': 'side project appropriate',
  'part-time': 'part-time commitment',
  'full-time': 'full-time commitment',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getLabel(value: number, labels: string[]): string {
  return labels[value - 1] || labels[2]; // Default to middle if out of range
}

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Build constraint string from user preferences for AI prompt injection
 * Based on spec Section 7.2
 */
export function buildConstraintsFromPreferences(prefs: UserPreferences): string {
  const constraints: string[] = [];

  // -------------------------
  // Technical constraints
  // -------------------------
  constraints.push(
    `Technical scope: Frontend ${getLabel(prefs.technical.frontendComplexity, TECH_LEVELS)}, ` +
    `Backend ${getLabel(prefs.technical.backendRequirements, TECH_LEVELS)}`
  );

  if (prefs.technical.mobileRequirements !== 'none') {
    constraints.push(`Mobile: ${MOBILE_REQUIREMENT_LABELS[prefs.technical.mobileRequirements]}`);
  }

  if (prefs.technical.dataMLRequirements > 2) {
    constraints.push(`ML/Data: ${getLabel(prefs.technical.dataMLRequirements, TECH_LEVELS)} level`);
  }

  if (prefs.technical.realtimeRequired) {
    constraints.push('Real-time features required');
  }

  if (prefs.technical.securityRequirements === 'enterprise') {
    constraints.push('Enterprise-grade security required');
  }

  // -------------------------
  // Market constraints
  // -------------------------
  if (prefs.market.businessFocus !== 'both') {
    constraints.push(`Focus: ${BUSINESS_FOCUS_LABELS[prefs.market.businessFocus]}`);
  }

  if (prefs.market.customerSegment.length < 5) {
    constraints.push(`Target customers: ${prefs.market.customerSegment.join(', ')}`);
  }

  if (prefs.market.industryVerticals.length < 10) {
    constraints.push(`Industries: ${prefs.market.industryVerticals.join(', ')}`);
  }

  if (prefs.market.userPersonas.length < 8) {
    constraints.push(`Target personas: ${prefs.market.userPersonas.join(', ')}`);
  }

  if (!prefs.market.geographicFocus.includes('global') && prefs.market.geographicFocus.length > 0) {
    constraints.push(`Geographic focus: ${prefs.market.geographicFocus.map(g => g.toUpperCase()).join(', ')}`);
  }

  if (prefs.market.marketMaturity !== 3) {
    constraints.push(`Market maturity preference: ${getLabel(prefs.market.marketMaturity, MARKET_MATURITY_LABELS)}`);
  }

  if (prefs.market.audienceSize !== 3) {
    constraints.push(`Audience size target: ${getLabel(prefs.market.audienceSize, AUDIENCE_SIZE_LABELS)}`);
  }

  // -------------------------
  // Business constraints
  // -------------------------
  if (prefs.business.businessTypes.length < 7) {
    constraints.push(`Business models: ${prefs.business.businessTypes.join(', ')}`);
  }

  if (prefs.business.pricingModels.length < 6) {
    constraints.push(`Pricing models: ${prefs.business.pricingModels.join(', ')}`);
  }

  if (prefs.business.salesMotion.length < 4) {
    constraints.push(`Sales motion: ${prefs.business.salesMotion.join(', ')}`);
  }

  if (prefs.business.goToMarket.length < 5) {
    constraints.push(`Go-to-market: ${prefs.business.goToMarket.join(', ')}`);
  }

  if (prefs.business.competitionLevel !== 3) {
    constraints.push(`Competition preference: ${getLabel(prefs.business.competitionLevel, COMPETITION_LABELS)}`);
  }

  if (prefs.business.defensibility !== 3) {
    constraints.push(`Defensibility target: ${getLabel(prefs.business.defensibility, DEFENSIBILITY_LABELS)}`);
  }

  if (prefs.business.revenuePotential !== 3) {
    constraints.push(`Revenue target: ${getLabel(prefs.business.revenuePotential, REVENUE_LABELS)}`);
  }

  // -------------------------
  // Characteristics constraints
  // -------------------------
  if (prefs.characteristics.noveltyLevel !== 3) {
    constraints.push(`Novelty preference: ${getLabel(prefs.characteristics.noveltyLevel, NOVELTY_LABELS)}`);
  }

  if (prefs.characteristics.viralityPotential > 2) {
    constraints.push(`Virality target: ${getLabel(prefs.characteristics.viralityPotential, VIRALITY_LABELS)}`);
  }

  if (prefs.characteristics.networkEffects > 2) {
    constraints.push(`Network effects: ${getLabel(prefs.characteristics.networkEffects, NETWORK_EFFECTS_LABELS)}`);
  }

  if (prefs.characteristics.regulatoryComplexity !== 'low') {
    constraints.push(`Regulatory tolerance: ${REGULATORY_LABELS[prefs.characteristics.regulatoryComplexity]}`);
  }

  if (prefs.characteristics.capitalRequirements !== 2) {
    constraints.push(`Capital requirements: ${getLabel(prefs.characteristics.capitalRequirements, CAPITAL_LABELS)}`);
  }

  if (prefs.characteristics.timeToRevenue !== 2) {
    constraints.push(`Time to revenue: ${getLabel(prefs.characteristics.timeToRevenue, TIME_TO_REVENUE_LABELS)}`);
  }

  // -------------------------
  // Personal constraints
  // -------------------------
  if (prefs.personal.domainExpertise !== 2) {
    constraints.push(`Domain expertise: ${getLabel(prefs.personal.domainExpertise, DOMAIN_EXPERTISE_LABELS)}`);
  }

  if (prefs.personal.timeCommitment !== 'full-time') {
    constraints.push(`Time commitment: ${TIME_COMMITMENT_LABELS[prefs.personal.timeCommitment]}`);
  }

  if (prefs.personal.runwayTolerance !== 3) {
    constraints.push(`Runway: ${getLabel(prefs.personal.runwayTolerance, RUNWAY_LABELS)}`);
  }

  // Topic constraints (always include if present)
  if (prefs.personal.topicFocus.length > 0) {
    constraints.push(`INCLUDE topics: ${prefs.personal.topicFocus.join(', ')}`);
  }

  if (prefs.personal.topicAvoidance.length > 0) {
    constraints.push(`EXCLUDE topics: ${prefs.personal.topicAvoidance.join(', ')}`);
  }

  return constraints.join('\n');
}

/**
 * Get AI temperature based on novelty level
 * Based on spec Section 7.2
 *
 * @param noveltyLevel - 1-5 slider value
 * @returns Temperature value for AI (0.3 - 1.0)
 */
export function getTemperature(noveltyLevel: number): number {
  const temps = [0.3, 0.5, 0.7, 0.85, 1.0];
  // Clamp to valid range
  const index = Math.max(0, Math.min(4, noveltyLevel - 1));
  return temps[index];
}

/**
 * Format preferences as a readable summary for AI context
 */
export function formatPreferenceSummary(prefs: UserPreferences): string {
  const sections: string[] = [];

  // Technical summary
  const techSummary = [
    `Frontend: ${getLabel(prefs.technical.frontendComplexity, TECH_LEVELS)}`,
    `Backend: ${getLabel(prefs.technical.backendRequirements, TECH_LEVELS)}`,
    prefs.technical.mobileRequirements !== 'none' ? `Mobile: ${prefs.technical.mobileRequirements}` : null,
    prefs.technical.dataMLRequirements > 2 ? `ML: ${getLabel(prefs.technical.dataMLRequirements, TECH_LEVELS)}` : null,
  ].filter(Boolean).join(', ');
  sections.push(`Technical: ${techSummary}`);

  // Market summary
  const marketSummary = [
    `${BUSINESS_FOCUS_LABELS[prefs.market.businessFocus]}`,
    prefs.market.customerSegment.length < 5 ? prefs.market.customerSegment.join('/') : 'all segments',
  ].join(', ');
  sections.push(`Market: ${marketSummary}`);

  // Business summary
  const businessSummary = [
    prefs.business.businessTypes.length < 7 ? prefs.business.businessTypes.join('/') : 'all types',
    `${getLabel(prefs.business.defensibility, DEFENSIBILITY_LABELS)}`,
  ].join(', ');
  sections.push(`Business: ${businessSummary}`);

  // Characteristics summary
  const charSummary = [
    `${getLabel(prefs.characteristics.noveltyLevel, NOVELTY_LABELS)} novelty`,
    prefs.characteristics.viralityPotential > 2 ? `${getLabel(prefs.characteristics.viralityPotential, VIRALITY_LABELS)} virality` : null,
  ].filter(Boolean).join(', ');
  sections.push(`Style: ${charSummary}`);

  return sections.join(' | ');
}

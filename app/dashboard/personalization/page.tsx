"use client"

import * as React from "react"
import { ArrowLeftIcon, SlidersHorizontalIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import {
  CollapsibleSection,
  PreferenceSlider,
  MultiToggle,
  MultiChips,
  TagInput,
  PresetCard,
  type SliderValue,
} from "@/components/personalization"
import {
  type UserPreferences,
  type TechnicalPreferences,
  type MarketPreferences,
  type BusinessPreferences,
  type CharacteristicsPreferences,
  type PersonalPreferences,
  type MobileRequirement,
  type SecurityLevel,
  type BusinessFocus,
  type RegulatoryComplexity,
  type TimeCommitment,
  DEFAULT_USER_PREFERENCES,
  DEFAULT_TECHNICAL,
  DEFAULT_MARKET,
  DEFAULT_BUSINESS,
  DEFAULT_CHARACTERISTICS,
  DEFAULT_PERSONAL,
  SLIDER_LABELS,
  GEOGRAPHIC_OPTIONS,
  CUSTOMER_SEGMENT_OPTIONS,
  INDUSTRY_VERTICAL_OPTIONS,
  USER_PERSONA_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  PRICING_MODEL_OPTIONS,
  SALES_MOTION_OPTIONS,
  GTM_STRATEGY_OPTIONS,
  getCompletenessLevel,
  COMPLETENESS_DISPLAY,
} from "@/lib/types/preferences"
import { PRESET_PROFILES } from "@/lib/data/presets"

// ============================================
// CONSTANTS
// ============================================

const SAVE_DEBOUNCE_MS = 500
const FUNCTIONS_BASE_URL = process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL ||
  'https://us-central1-sparkengine-3740d.cloudfunctions.net'

// Label mappings for display
const LABEL_MAPS = {
  geographic: {
    global: "Global",
    us: "US",
    eu: "EU",
    apac: "APAC",
    latam: "LATAM",
    mena: "MENA",
    africa: "Africa",
  },
  customerSegment: {
    startup: "Startup",
    smb: "SMB",
    "mid-market": "Mid-market",
    enterprise: "Enterprise",
    consumer: "Consumer",
  },
  industryVertical: {
    health: "Health",
    finance: "Finance",
    education: "Education",
    retail: "Retail",
    manufacturing: "Manufacturing",
    media: "Media",
    "real-estate": "Real Estate",
    legal: "Legal",
    hr: "HR",
    logistics: "Logistics",
  },
  userPersona: {
    developers: "Developers",
    designers: "Designers",
    marketers: "Marketers",
    sales: "Sales",
    executives: "Executives",
    operations: "Operations",
    creators: "Creators",
    consumers: "Consumers",
  },
  businessType: {
    saas: "SaaS",
    marketplace: "Marketplace",
    service: "Service",
    agency: "Agency",
    "physical-product": "Physical Product",
    "content-media": "Content/Media",
    platform: "Platform",
  },
  pricingModel: {
    free: "Free",
    freemium: "Freemium",
    subscription: "Subscription",
    "one-time": "One-time",
    "usage-based": "Usage-based",
    enterprise: "Enterprise",
  },
  salesMotion: {
    "self-serve": "Self-serve",
    "sales-assisted": "Sales-assisted",
    "enterprise-sales": "Enterprise Sales",
    "channel-partners": "Channel/Partners",
  },
  gtmStrategy: {
    "product-led": "Product-led",
    "sales-led": "Sales-led",
    "community-led": "Community-led",
    "content-led": "Content-led",
    "partnership-led": "Partnership-led",
  },
} as const

// Topic suggestions
const TOPIC_SUGGESTIONS = [
  "AI", "Machine Learning", "SaaS", "E-commerce", "Fintech",
  "Healthcare", "Education", "Productivity", "Developer Tools",
  "Marketing", "Sales", "Analytics", "Automation", "B2B",
  "B2C", "Mobile", "Web3", "Crypto", "Gaming", "Social",
  "Marketplace", "API", "Infrastructure", "Security", "Data",
]

// ============================================
// HELPER FUNCTIONS
// ============================================

function calculateCompleteness(prefs: UserPreferences): number {
  let score = 0
  const tech = prefs.technical
  const market = prefs.market
  const biz = prefs.business
  const chars = prefs.characteristics
  const personal = prefs.personal

  // Technical (20%): 5 of 8 modified
  let techModified = 0
  if (tech.frontendComplexity !== 3) techModified++
  if (tech.backendRequirements !== 3) techModified++
  if (tech.dataMLRequirements !== 1) techModified++
  if (tech.mobileRequirements !== "none") techModified++
  if (tech.integrationComplexity !== 2) techModified++
  if (tech.infrastructureNeeds !== 2) techModified++
  if (tech.securityRequirements !== "standard") techModified++
  if (tech.realtimeRequired !== false) techModified++
  score += Math.min(20, (techModified / 5) * 20)

  // Market (20%): 4 of 7 modified
  let marketModified = 0
  if (market.geographicFocus.length !== 1 || market.geographicFocus[0] !== "global") marketModified++
  if (market.customerSegment.length !== 5) marketModified++
  if (market.industryVerticals.length !== 10) marketModified++
  if (market.userPersonas.length !== 8) marketModified++
  if (market.businessFocus !== "both") marketModified++
  if (market.marketMaturity !== 3) marketModified++
  if (market.audienceSize !== 3) marketModified++
  score += Math.min(20, (marketModified / 4) * 20)

  // Business (20%): 4 of 7 modified
  let bizModified = 0
  if (biz.businessTypes.length !== 7) bizModified++
  if (biz.pricingModels.length !== 6) bizModified++
  if (biz.salesMotion.length !== 4) bizModified++
  if (biz.goToMarket.length !== 5) bizModified++
  if (biz.competitionLevel !== 3) bizModified++
  if (biz.defensibility !== 3) bizModified++
  if (biz.revenuePotential !== 3) bizModified++
  score += Math.min(20, (bizModified / 4) * 20)

  // Characteristics (20%): 3 of 6 modified
  let charsModified = 0
  if (chars.noveltyLevel !== 3) charsModified++
  if (chars.viralityPotential !== 2) charsModified++
  if (chars.networkEffects !== 2) charsModified++
  if (chars.regulatoryComplexity !== "low") charsModified++
  if (chars.capitalRequirements !== 2) charsModified++
  if (chars.timeToRevenue !== 2) charsModified++
  score += Math.min(20, (charsModified / 3) * 20)

  // Personal (20%): 3 of 5 + 3 topic tags
  let personalModified = 0
  if (personal.domainExpertise !== 2) personalModified++
  if (personal.timeCommitment !== "full-time") personalModified++
  if (personal.runwayTolerance !== 3) personalModified++
  if (personal.topicFocus.length >= 3) personalModified++
  if (personal.topicAvoidance.length >= 1) personalModified++
  score += Math.min(20, (personalModified / 3) * 20)

  return Math.round(score)
}

function generateSectionSummary(
  section: "technical" | "market" | "business" | "characteristics" | "personal",
  prefs: UserPreferences
): string {
  switch (section) {
    case "technical": {
      const t = prefs.technical
      const parts: string[] = []
      parts.push(`Backend: ${SLIDER_LABELS.backendRequirements[t.backendRequirements - 1]}`)
      if (t.mobileRequirements !== "none") {
        parts.push(`Mobile: ${t.mobileRequirements === "native" ? "Native" : "Responsive"}`)
      }
      if (t.dataMLRequirements > 1) {
        parts.push(`ML: ${SLIDER_LABELS.dataMLRequirements[t.dataMLRequirements - 1]}`)
      }
      return parts.slice(0, 3).join(" • ")
    }
    case "market": {
      const m = prefs.market
      const parts: string[] = []
      parts.push(m.businessFocus === "b2b" ? "B2B" : m.businessFocus === "b2c" ? "B2C" : "B2B + B2C")
      if (m.customerSegment.length < 5) {
        parts.push(m.customerSegment.slice(0, 2).map(s => LABEL_MAPS.customerSegment[s]).join(", "))
      }
      parts.push(m.geographicFocus.slice(0, 2).map(g => LABEL_MAPS.geographic[g]).join("/"))
      return parts.slice(0, 3).join(" • ")
    }
    case "business": {
      const b = prefs.business
      const parts: string[] = []
      if (b.businessTypes.length < 7) {
        parts.push(b.businessTypes.slice(0, 2).map(t => LABEL_MAPS.businessType[t]).join(", "))
      }
      if (b.pricingModels.length < 6) {
        parts.push(b.pricingModels.slice(0, 1).map(p => LABEL_MAPS.pricingModel[p]).join(", "))
      }
      if (b.goToMarket.length < 5) {
        parts.push(b.goToMarket.slice(0, 1).map(g => LABEL_MAPS.gtmStrategy[g]).join(", "))
      }
      return parts.slice(0, 3).join(" • ") || "All options"
    }
    case "characteristics": {
      const c = prefs.characteristics
      return [
        `Novelty: ${SLIDER_LABELS.noveltyLevel[c.noveltyLevel - 1]}`,
        `Capital: ${SLIDER_LABELS.capitalRequirements[c.capitalRequirements - 1]}`,
      ].join(" • ")
    }
    case "personal": {
      const p = prefs.personal
      const parts: string[] = []
      parts.push(p.timeCommitment === "full-time" ? "Full-time" : p.timeCommitment === "part-time" ? "Part-time" : "Side Project")
      parts.push(SLIDER_LABELS.domainExpertise[p.domainExpertise - 1])
      if (p.topicFocus.length > 0) {
        parts.push(`${p.topicFocus.length} focus topics`)
      }
      return parts.slice(0, 3).join(" • ")
    }
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function PersonalizationPage() {
  const { user } = useAuth()
  const [preferences, setPreferences] = React.useState<UserPreferences>(DEFAULT_USER_PREFERENCES)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const pendingUpdatesRef = React.useRef<Partial<UserPreferences> | null>(null)

  // Load preferences from Cloud Functions on mount
  React.useEffect(() => {
    async function loadPreferences() {
      if (!user) {
        setIsLoaded(true)
        return
      }

      try {
        const token = await user.getIdToken()
        const response = await fetch(`${FUNCTIONS_BASE_URL}/getPreferences`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const { preferences: prefs, completeness } = await response.json()
          if (prefs) {
            // Merge with defaults to handle any missing fields
            setPreferences({
              ...DEFAULT_USER_PREFERENCES,
              ...prefs,
              technical: { ...DEFAULT_TECHNICAL, ...prefs.technical },
              market: { ...DEFAULT_MARKET, ...prefs.market },
              business: { ...DEFAULT_BUSINESS, ...prefs.business },
              characteristics: { ...DEFAULT_CHARACTERISTICS, ...prefs.characteristics },
              personal: { ...DEFAULT_PERSONAL, ...prefs.personal },
              profileCompleteness: completeness ?? 0,
            })
          }
        }
      } catch (e) {
        console.error("Failed to load preferences:", e)
        toast.error("Failed to load preferences")
      }
      setIsLoaded(true)
    }

    loadPreferences()
  }, [user])

  // Auto-save with debounce
  const savePreferencesToServer = React.useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user) return

    // Accumulate updates
    pendingUpdatesRef.current = {
      ...pendingUpdatesRef.current,
      ...updates,
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const pendingUpdates = pendingUpdatesRef.current
      if (!pendingUpdates) return

      pendingUpdatesRef.current = null
      setIsSaving(true)

      try {
        const token = await user.getIdToken()
        const response = await fetch(`${FUNCTIONS_BASE_URL}/savePreferences`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pendingUpdates),
        })

        if (response.ok) {
          const { completeness } = await response.json()
          setPreferences(prev => ({
            ...prev,
            profileCompleteness: completeness,
          }))
        } else {
          console.error('Failed to save preferences')
        }
      } catch (e) {
        console.error('Error saving preferences:', e)
      } finally {
        setIsSaving(false)
      }
    }, SAVE_DEBOUNCE_MS)
  }, [user])

  // Update preferences helper
  const updatePreferences = React.useCallback(
    <K extends "technical" | "market" | "business" | "characteristics" | "personal">(
      section: K,
      updates: Partial<UserPreferences[K]>
    ) => {
      setPreferences((prev) => {
        const currentSection = prev[section] as object
        const newSection = { ...currentSection, ...updates }
        const newPrefs = {
          ...prev,
          [section]: newSection,
          presetModified: prev.activePreset !== null,
        }
        // Save only the changed section
        savePreferencesToServer({ [section]: newSection } as Partial<UserPreferences>)
        return newPrefs
      })
    },
    [savePreferencesToServer]
  )

  // Apply preset
  const handleApplyPreset = React.useCallback(
    async (presetId: string) => {
      if (!user) return

      const preset = PRESET_PROFILES.find((p) => p.id === presetId)
      if (!preset) return

      // If already active and not modified, do nothing
      if (preferences.activePreset === presetId && !preferences.presetModified) {
        return
      }

      // If has custom settings, confirm
      if (preferences.activePreset !== presetId && preferences.profileCompleteness > 0) {
        const confirmed = window.confirm(
          "Applying this preset will overwrite your current settings. Continue?"
        )
        if (!confirmed) return
      }

      try {
        const token = await user.getIdToken()
        const response = await fetch(`${FUNCTIONS_BASE_URL}/applyPreset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ presetId }),
        })

        if (response.ok) {
          const { preferences: newPrefs, completeness } = await response.json()
          setPreferences({
            ...DEFAULT_USER_PREFERENCES,
            ...newPrefs,
            profileCompleteness: completeness,
          })
          toast.success(`Applied "${preset.name}" preset`)
        } else {
          toast.error("Failed to apply preset")
        }
      } catch (e) {
        console.error('Error applying preset:', e)
        toast.error("Failed to apply preset")
      }
    },
    [user, preferences]
  )

  // Reset section
  const handleResetSection = React.useCallback(
    async (section: "technical" | "market" | "business" | "characteristics" | "personal") => {
      if (!user) return

      const confirmed = window.confirm(`Reset ${section} section to defaults?`)
      if (!confirmed) return

      try {
        const token = await user.getIdToken()
        const response = await fetch(`${FUNCTIONS_BASE_URL}/resetPreferences`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ section }),
        })

        if (response.ok) {
          const { preferences: newPrefs, completeness } = await response.json()
          setPreferences({
            ...DEFAULT_USER_PREFERENCES,
            ...newPrefs,
            profileCompleteness: completeness,
          })
          toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} section reset`)
        } else {
          toast.error("Failed to reset section")
        }
      } catch (e) {
        console.error('Error resetting section:', e)
        toast.error("Failed to reset section")
      }
    },
    [user]
  )

  const completeness = calculateCompleteness(preferences)
  const completenessLevel = getCompletenessLevel(completeness)
  const completenessDisplay = COMPLETENESS_DISPLAY[completenessLevel]

  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-lg" />
        <div className="h-32 bg-muted rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeftIcon className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <SlidersHorizontalIcon className="size-6 text-primary" />
              Personalization Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure how AI generates ideas for you
            </p>
          </div>
        </div>

        {/* Profile completeness */}
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Profile</div>
          <div
            className={cn(
              "text-lg font-semibold",
              completenessLevel === "fully-personalized" && "text-amber-500",
              completenessLevel === "power-user" && "text-green-500",
              completenessLevel === "well-configured" && "text-blue-500",
              completenessLevel === "building-profile" && "text-yellow-500"
            )}
          >
            {completeness}%
          </div>
          <div className="text-xs text-muted-foreground">{completenessDisplay.label}</div>
        </div>
      </div>

      {/* Presets Section */}
      <section>
        <h2 className="text-lg font-medium mb-4">Quick Start Presets</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:grid md:grid-cols-5 md:overflow-visible md:mx-0 md:px-0">
          {PRESET_PROFILES.map((preset) => (
            <div key={preset.id} className="min-w-[200px] md:min-w-0">
              <PresetCard
                preset={{
                  id: preset.id,
                  name: preset.name,
                  icon: preset.icon,
                  color: preset.color,
                  description: preset.description,
                  characteristics: [
                    preset.preferences.market.businessFocus === "b2b"
                      ? "B2B"
                      : preset.preferences.market.businessFocus === "b2c"
                        ? "B2C"
                        : "B2B + B2C",
                    SLIDER_LABELS.capitalRequirements[preset.preferences.characteristics.capitalRequirements - 1],
                    preset.preferences.technical.mobileRequirements !== "none"
                      ? "Mobile"
                      : "Web",
                  ],
                }}
                isActive={preferences.activePreset === preset.id}
                isModified={preferences.activePreset === preset.id && preferences.presetModified}
                onApply={() => handleApplyPreset(preset.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Sections */}
      <section className="space-y-4">
        {/* Section 1: Technical Requirements */}
        <CollapsibleSection
          title="Technical Requirements"
          summary={generateSectionSummary("technical", preferences)}
          defaultExpanded={true}
          onReset={() => handleResetSection("technical")}
        >
          <div className="space-y-6">
            <PreferenceSlider
              label="Frontend Complexity"
              value={preferences.technical.frontendComplexity}
              onChange={(v) => updatePreferences("technical", { frontendComplexity: v })}
              labels={SLIDER_LABELS.frontendComplexity as [string, string, string, string, string]}
              description="How complex should the user interface be?"
            />

            <PreferenceSlider
              label="Backend Requirements"
              value={preferences.technical.backendRequirements}
              onChange={(v) => updatePreferences("technical", { backendRequirements: v })}
              labels={SLIDER_LABELS.backendRequirements as [string, string, string, string, string]}
              description="Server-side complexity level"
            />

            <PreferenceSlider
              label="Data/ML Requirements"
              value={preferences.technical.dataMLRequirements}
              onChange={(v) => updatePreferences("technical", { dataMLRequirements: v })}
              labels={SLIDER_LABELS.dataMLRequirements as [string, string, string, string, string]}
              description="Machine learning and data processing needs"
            />

            <MultiToggle
              label="Mobile Requirements"
              options={[
                { value: "none", label: "None" },
                { value: "responsive", label: "Responsive Web" },
                { value: "native", label: "Native Apps" },
              ]}
              selected={[preferences.technical.mobileRequirements]}
              onChange={(selected) =>
                updatePreferences("technical", {
                  mobileRequirements: (selected[selected.length - 1] || "none") as MobileRequirement,
                })
              }
            />

            <PreferenceSlider
              label="Integration Complexity"
              value={preferences.technical.integrationComplexity}
              onChange={(v) => updatePreferences("technical", { integrationComplexity: v })}
              labels={SLIDER_LABELS.integrationComplexity as [string, string, string, string, string]}
              description="Third-party API and service integrations"
            />

            <PreferenceSlider
              label="Infrastructure Needs"
              value={preferences.technical.infrastructureNeeds}
              onChange={(v) => updatePreferences("technical", { infrastructureNeeds: v })}
              labels={SLIDER_LABELS.infrastructureNeeds as [string, string, string, string, string]}
              description="Hosting and infrastructure requirements"
            />

            <MultiToggle
              label="Security Requirements"
              options={[
                { value: "basic", label: "Basic" },
                { value: "standard", label: "Standard" },
                { value: "enterprise", label: "Enterprise" },
              ]}
              selected={[preferences.technical.securityRequirements]}
              onChange={(selected) =>
                updatePreferences("technical", {
                  securityRequirements: (selected[selected.length - 1] || "standard") as SecurityLevel,
                })
              }
            />

            <MultiToggle
              label="Real-time Requirements"
              options={[
                { value: "off", label: "Off" },
                { value: "on", label: "On (WebSocket)" },
              ]}
              selected={[preferences.technical.realtimeRequired ? "on" : "off"]}
              onChange={(selected) =>
                updatePreferences("technical", {
                  realtimeRequired: selected.includes("on"),
                })
              }
            />
          </div>
        </CollapsibleSection>

        {/* Section 2: Market & Audience */}
        <CollapsibleSection
          title="Market & Audience"
          summary={generateSectionSummary("market", preferences)}
          onReset={() => handleResetSection("market")}
        >
          <div className="space-y-6">
            <MultiChips
              label="Geographic Focus"
              options={GEOGRAPHIC_OPTIONS.map((v) => ({
                value: v,
                label: LABEL_MAPS.geographic[v],
              }))}
              selected={preferences.market.geographicFocus}
              onChange={(selected) =>
                updatePreferences("market", { geographicFocus: selected as typeof preferences.market.geographicFocus })
              }
            />

            <MultiChips
              label="Customer Segment"
              options={CUSTOMER_SEGMENT_OPTIONS.map((v) => ({
                value: v,
                label: LABEL_MAPS.customerSegment[v],
              }))}
              selected={preferences.market.customerSegment}
              onChange={(selected) =>
                updatePreferences("market", { customerSegment: selected as typeof preferences.market.customerSegment })
              }
            />

            <MultiChips
              label="Industry Verticals"
              options={INDUSTRY_VERTICAL_OPTIONS.map((v) => ({
                value: v,
                label: LABEL_MAPS.industryVertical[v],
              }))}
              selected={preferences.market.industryVerticals}
              onChange={(selected) =>
                updatePreferences("market", { industryVerticals: selected as typeof preferences.market.industryVerticals })
              }
            />

            <MultiChips
              label="User Personas"
              options={USER_PERSONA_OPTIONS.map((v) => ({
                value: v,
                label: LABEL_MAPS.userPersona[v],
              }))}
              selected={preferences.market.userPersonas}
              onChange={(selected) =>
                updatePreferences("market", { userPersonas: selected as typeof preferences.market.userPersonas })
              }
            />

            <MultiToggle
              label="B2B / B2C Focus"
              options={[
                { value: "b2b", label: "B2B Only" },
                { value: "both", label: "Both" },
                { value: "b2c", label: "B2C Only" },
              ]}
              selected={[preferences.market.businessFocus]}
              onChange={(selected) =>
                updatePreferences("market", {
                  businessFocus: (selected[selected.length - 1] || "both") as BusinessFocus,
                })
              }
            />

            <PreferenceSlider
              label="Market Maturity"
              value={preferences.market.marketMaturity}
              onChange={(v) => updatePreferences("market", { marketMaturity: v })}
              labels={SLIDER_LABELS.marketMaturity as [string, string, string, string, string]}
              description="Preferred market lifecycle stage"
            />

            <PreferenceSlider
              label="Audience Size"
              value={preferences.market.audienceSize}
              onChange={(v) => updatePreferences("market", { audienceSize: v })}
              labels={SLIDER_LABELS.audienceSize as [string, string, string, string, string]}
              description="Target audience scale"
            />
          </div>
        </CollapsibleSection>

        {/* Section 3: Business Model */}
        <CollapsibleSection
          title="Business Model"
          summary={generateSectionSummary("business", preferences)}
          onReset={() => handleResetSection("business")}
        >
          <div className="space-y-6">
            <MultiToggle
              label="Business Type"
              options={BUSINESS_TYPE_OPTIONS.map((v) => ({
                value: v,
                label: LABEL_MAPS.businessType[v],
              }))}
              selected={preferences.business.businessTypes}
              onChange={(selected) =>
                updatePreferences("business", { businessTypes: selected as typeof preferences.business.businessTypes })
              }
            />

            <MultiChips
              label="Pricing Model"
              options={PRICING_MODEL_OPTIONS.map((v) => ({
                value: v,
                label: LABEL_MAPS.pricingModel[v],
              }))}
              selected={preferences.business.pricingModels}
              onChange={(selected) =>
                updatePreferences("business", { pricingModels: selected as typeof preferences.business.pricingModels })
              }
            />

            <MultiChips
              label="Sales Motion"
              options={SALES_MOTION_OPTIONS.map((v) => ({
                value: v,
                label: LABEL_MAPS.salesMotion[v],
              }))}
              selected={preferences.business.salesMotion}
              onChange={(selected) =>
                updatePreferences("business", { salesMotion: selected as typeof preferences.business.salesMotion })
              }
            />

            <MultiChips
              label="Go-to-Market Strategy"
              options={GTM_STRATEGY_OPTIONS.map((v) => ({
                value: v,
                label: LABEL_MAPS.gtmStrategy[v],
              }))}
              selected={preferences.business.goToMarket}
              onChange={(selected) =>
                updatePreferences("business", { goToMarket: selected as typeof preferences.business.goToMarket })
              }
            />

            <PreferenceSlider
              label="Competition Level"
              value={preferences.business.competitionLevel}
              onChange={(v) => updatePreferences("business", { competitionLevel: v })}
              labels={SLIDER_LABELS.competitionLevel as [string, string, string, string, string]}
              description="Preferred market competition intensity"
            />

            <PreferenceSlider
              label="Defensibility"
              value={preferences.business.defensibility}
              onChange={(v) => updatePreferences("business", { defensibility: v })}
              labels={SLIDER_LABELS.defensibility as [string, string, string, string, string]}
              description="Competitive moat strength"
            />

            <PreferenceSlider
              label="Revenue Potential"
              value={preferences.business.revenuePotential}
              onChange={(v) => updatePreferences("business", { revenuePotential: v })}
              labels={SLIDER_LABELS.revenuePotential as [string, string, string, string, string]}
              description="Target revenue scale"
            />
          </div>
        </CollapsibleSection>

        {/* Section 4: Idea Characteristics */}
        <CollapsibleSection
          title="Idea Characteristics"
          summary={generateSectionSummary("characteristics", preferences)}
          onReset={() => handleResetSection("characteristics")}
        >
          <div className="space-y-6">
            <PreferenceSlider
              label="Novelty Level"
              value={preferences.characteristics.noveltyLevel}
              onChange={(v) => updatePreferences("characteristics", { noveltyLevel: v })}
              labels={SLIDER_LABELS.noveltyLevel as [string, string, string, string, string]}
              description="How innovative should ideas be?"
            />

            <PreferenceSlider
              label="Virality Potential"
              value={preferences.characteristics.viralityPotential}
              onChange={(v) => updatePreferences("characteristics", { viralityPotential: v })}
              labels={SLIDER_LABELS.viralityPotential as [string, string, string, string, string]}
              description="Built-in viral growth potential"
            />

            <PreferenceSlider
              label="Network Effects"
              value={preferences.characteristics.networkEffects}
              onChange={(v) => updatePreferences("characteristics", { networkEffects: v })}
              labels={SLIDER_LABELS.networkEffects as [string, string, string, string, string]}
              description="Value increase with user growth"
            />

            <MultiToggle
              label="Regulatory Complexity"
              options={[
                { value: "none", label: "None" },
                { value: "low", label: "Low" },
                { value: "moderate", label: "Moderate" },
                { value: "heavy", label: "Heavily Regulated" },
              ]}
              selected={[preferences.characteristics.regulatoryComplexity]}
              onChange={(selected) =>
                updatePreferences("characteristics", {
                  regulatoryComplexity: (selected[selected.length - 1] || "low") as RegulatoryComplexity,
                })
              }
            />

            <PreferenceSlider
              label="Capital Requirements"
              value={preferences.characteristics.capitalRequirements}
              onChange={(v) => updatePreferences("characteristics", { capitalRequirements: v })}
              labels={SLIDER_LABELS.capitalRequirements as [string, string, string, string, string]}
              description="Funding needed to build"
            />

            <PreferenceSlider
              label="Time to Revenue"
              value={preferences.characteristics.timeToRevenue}
              onChange={(v) => updatePreferences("characteristics", { timeToRevenue: v })}
              labels={SLIDER_LABELS.timeToRevenue as [string, string, string, string, string]}
              description="Expected timeline to first revenue"
            />
          </div>
        </CollapsibleSection>

        {/* Section 5: Personal Fit */}
        <CollapsibleSection
          title="Personal Fit"
          summary={generateSectionSummary("personal", preferences)}
          onReset={() => handleResetSection("personal")}
        >
          <div className="space-y-6">
            <PreferenceSlider
              label="Domain Expertise"
              value={preferences.personal.domainExpertise}
              onChange={(v) => updatePreferences("personal", { domainExpertise: v })}
              labels={SLIDER_LABELS.domainExpertise as [string, string, string, string, string]}
              description="Your level of industry expertise"
            />

            <MultiToggle
              label="Time Commitment"
              options={[
                { value: "side-project", label: "Side Project" },
                { value: "part-time", label: "Part-time" },
                { value: "full-time", label: "Full-time" },
              ]}
              selected={[preferences.personal.timeCommitment]}
              onChange={(selected) =>
                updatePreferences("personal", {
                  timeCommitment: (selected[selected.length - 1] || "full-time") as TimeCommitment,
                })
              }
            />

            <PreferenceSlider
              label="Runway Tolerance"
              value={preferences.personal.runwayTolerance}
              onChange={(v) => updatePreferences("personal", { runwayTolerance: v })}
              labels={SLIDER_LABELS.runwayTolerance as [string, string, string, string, string]}
              description="How long until you need revenue?"
            />

            <TagInput
              label="Topic Focus"
              tags={preferences.personal.topicFocus}
              onChange={(tags) => updatePreferences("personal", { topicFocus: tags })}
              maxTags={15}
              suggestions={TOPIC_SUGGESTIONS}
              placeholder="Add topics to focus on..."
            />

            <TagInput
              label="Topic Avoidance"
              tags={preferences.personal.topicAvoidance}
              onChange={(tags) => updatePreferences("personal", { topicAvoidance: tags })}
              maxTags={10}
              suggestions={TOPIC_SUGGESTIONS}
              placeholder="Add topics to avoid..."
            />
          </div>
        </CollapsibleSection>
      </section>
    </div>
  )
}

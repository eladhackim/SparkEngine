"use client"

import * as React from "react"
import {
  CheckIcon,
  BuildingIcon,
  SmartphoneIcon,
  CodeIcon,
  StarIcon,
  StoreIcon,
  RepeatIcon,
  BrainIcon,
  DollarSignIcon,
  HeartIcon,
  ShoppingCartIcon,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PresetConfig {
  id: string
  name: string
  icon: string
  color: string
  description: string
  characteristics: string[]
}

interface PresetCardProps {
  preset: PresetConfig
  isActive: boolean
  isModified: boolean
  onApply: () => void
}

// Icon mapping for preset icons
const iconMap: Record<string, LucideIcon> = {
  Building: BuildingIcon,
  Smartphone: SmartphoneIcon,
  Code: CodeIcon,
  Star: StarIcon,
  Store: StoreIcon,
  Repeat: RepeatIcon,
  Brain: BrainIcon,
  DollarSign: DollarSignIcon,
  Heart: HeartIcon,
  ShoppingCart: ShoppingCartIcon,
}

// Color mapping for preset colors
const colorClasses: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    ring: "ring-blue-500/30",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    ring: "ring-purple-500/30",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-500/30",
    ring: "ring-green-500/30",
  },
  pink: {
    bg: "bg-pink-500/10",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/30",
    ring: "ring-pink-500/30",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/30",
    ring: "ring-orange-500/30",
  },
  teal: {
    bg: "bg-teal-500/10",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/30",
    ring: "ring-teal-500/30",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/30",
    ring: "ring-indigo-500/30",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    ring: "ring-emerald-500/30",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    ring: "ring-red-500/30",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    ring: "ring-amber-500/30",
  },
}

function PresetCard({ preset, isActive, isModified, onApply }: PresetCardProps) {
  const Icon = iconMap[preset.icon] || BuildingIcon
  const colors = colorClasses[preset.color.toLowerCase()] || colorClasses.blue

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onApply()
    }
  }

  return (
    <button
      type="button"
      onClick={onApply}
      onKeyDown={handleKeyDown}
      aria-pressed={isActive}
      data-slot="preset-card"
      className={cn(
        "group relative flex flex-col items-start gap-3",
        "w-full p-4 rounded-xl text-left",
        "border-2 transition-all duration-200",
        "outline-none cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Default state
        !isActive && [
          "bg-card border-border",
          "hover:border-muted-foreground/30 hover:shadow-md",
        ],
        // Active state
        isActive && [
          colors.bg,
          colors.border,
          `ring-2 ${colors.ring}`,
        ]
      )}
    >
      {/* Active checkmark */}
      {isActive && (
        <div
          className={cn(
            "absolute top-3 right-3",
            "size-5 rounded-full flex items-center justify-center",
            colors.bg,
            colors.text,
            "animate-in zoom-in-50 duration-150"
          )}
        >
          <CheckIcon className="size-3" />
        </div>
      )}

      {/* Customized badge */}
      {isActive && isModified && (
        <div
          className={cn(
            "absolute top-3 right-10",
            "px-2 py-0.5 rounded-full",
            "text-[10px] font-medium",
            "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            "animate-in fade-in slide-in-from-right-2 duration-150"
          )}
        >
          Customized
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          "size-10 rounded-lg flex items-center justify-center",
          colors.bg,
          colors.text
        )}
      >
        <Icon className="size-5" />
      </div>

      {/* Name and description */}
      <div className="space-y-1">
        <h3 className="font-medium text-sm text-foreground">{preset.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {preset.description}
        </p>
      </div>

      {/* Key characteristics */}
      <div className="flex flex-wrap gap-1">
        {preset.characteristics.slice(0, 3).map((char, idx) => (
          <span
            key={idx}
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px]",
              "bg-muted text-muted-foreground"
            )}
          >
            {char}
          </span>
        ))}
        {preset.characteristics.length > 3 && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px]",
              "bg-muted text-muted-foreground"
            )}
          >
            +{preset.characteristics.length - 3}
          </span>
        )}
      </div>

      {/* Click to apply indicator */}
      {!isActive && (
        <span
          className={cn(
            "text-[10px] text-muted-foreground",
            "opacity-0 group-hover:opacity-100 transition-opacity"
          )}
        >
          Click to apply
        </span>
      )}
    </button>
  )
}

export { PresetCard, type PresetCardProps, type PresetConfig }

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MultiToggleOption {
  value: string
  label: string
}

interface MultiToggleProps {
  label: string
  options: MultiToggleOption[]
  selected: string[]
  onChange: (selected: string[]) => void
}

function MultiToggle({ label, options, selected, onChange }: MultiToggleProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, value: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleToggle(value)
    }
  }

  return (
    <div data-slot="multi-toggle" className="space-y-2">
      {/* Label */}
      <label className="text-sm font-medium text-foreground">{label}</label>

      {/* Toggle group */}
      <div
        role="group"
        aria-label={label}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const isSelected = selected.includes(option.value)

          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => handleToggle(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              className={cn(
                "inline-flex items-center justify-center",
                "px-3 py-1.5 text-sm font-medium rounded-lg",
                "border-2 transition-all duration-150 ease-in-out",
                "outline-none select-none cursor-pointer",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                // Active = filled
                isSelected && [
                  "bg-primary text-primary-foreground border-primary",
                  "hover:bg-primary/90",
                ],
                // Inactive = outline
                !isSelected && [
                  "bg-transparent text-foreground border-border",
                  "hover:bg-muted hover:border-muted-foreground/50",
                ]
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { MultiToggle, type MultiToggleProps, type MultiToggleOption }

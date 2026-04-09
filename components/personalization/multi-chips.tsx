"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiChipsOption {
  value: string
  label: string
}

interface MultiChipsProps {
  label: string
  options: MultiChipsOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  maxSelections?: number
}

function MultiChips({
  label,
  options,
  selected,
  onChange,
  maxSelections,
}: MultiChipsProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      // Always allow deselection
      onChange(selected.filter((v) => v !== value))
    } else {
      // Check max selections limit
      if (maxSelections && selected.length >= maxSelections) {
        return
      }
      onChange([...selected, value])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, value: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleToggle(value)
    }
  }

  const isAtLimit = maxSelections ? selected.length >= maxSelections : false

  return (
    <div data-slot="multi-chips" className="space-y-2">
      {/* Label with selection count */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {maxSelections && (
          <span
            className={cn(
              "text-xs text-muted-foreground",
              isAtLimit && "text-amber-600 dark:text-amber-400"
            )}
          >
            {selected.length}/{maxSelections}
          </span>
        )}
      </div>

      {/* Chips */}
      <div
        role="group"
        aria-label={label}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          const isDisabled = !isSelected && isAtLimit

          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              onClick={() => !isDisabled && handleToggle(option.value)}
              onKeyDown={(e) => !isDisabled && handleKeyDown(e, option.value)}
              className={cn(
                "inline-flex items-center gap-1.5",
                "px-3 py-1.5 text-sm font-medium rounded-full",
                "border transition-all outline-none select-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                // Spring animation with scale pop
                "duration-100",
                isSelected && "scale-[1.05]",
                // Selected state
                isSelected && [
                  "bg-primary/10 text-primary border-primary/30",
                  "hover:bg-primary/20",
                ],
                // Unselected state
                !isSelected &&
                  !isDisabled && [
                    "bg-muted/50 text-muted-foreground border-transparent",
                    "hover:bg-muted hover:text-foreground cursor-pointer",
                  ],
                // Disabled state (at max limit)
                isDisabled && [
                  "bg-muted/30 text-muted-foreground/50 border-transparent",
                  "cursor-not-allowed",
                ]
              )}
            >
              {/* Checkmark for selected */}
              {isSelected && (
                <CheckIcon
                  className={cn(
                    "size-3.5 shrink-0",
                    "animate-in zoom-in-50 duration-100"
                  )}
                />
              )}
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { MultiChips, type MultiChipsProps, type MultiChipsOption }

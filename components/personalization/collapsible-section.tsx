"use client"

import * as React from "react"
import { ChevronRightIcon, RotateCcwIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CollapsibleSectionProps {
  title: string
  summary: string
  defaultExpanded?: boolean
  onReset?: () => void
  children: React.ReactNode
}

function CollapsibleSection({
  title,
  summary,
  defaultExpanded = false,
  onReset,
  children,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState<number | undefined>(
    undefined
  )

  // Measure content height for smooth animation
  React.useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContentHeight(entry.contentRect.height)
        }
      })
      resizeObserver.observe(contentRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [])

  const handleToggle = () => {
    setIsExpanded((prev) => !prev)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleToggle()
    }
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    onReset?.()
  }

  return (
    <div
      data-slot="collapsible-section"
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground ring-1 ring-foreground/5",
        "transition-shadow duration-200",
        isExpanded && "ring-2 ring-ring/20"
      )}
    >
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex cursor-pointer items-center gap-3 px-4 py-3",
          "select-none outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "rounded-xl transition-colors hover:bg-muted/50"
        )}
      >
        {/* Chevron indicator - rotates 90deg on expand */}
        <ChevronRightIcon
          className={cn(
            "size-5 shrink-0 text-muted-foreground",
            "transition-transform duration-300 ease-in-out",
            isExpanded && "rotate-90"
          )}
        />

        {/* Title and summary */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground">{title}</h3>
          {/* Summary shown when collapsed */}
          <p
            className={cn(
              "text-xs text-muted-foreground truncate",
              "transition-opacity duration-200",
              isExpanded ? "opacity-0 h-0 mt-0" : "opacity-100 mt-0.5"
            )}
          >
            {summary}
          </p>
        </div>

        {/* Reset button */}
        {onReset && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleReset}
            aria-label={`Reset ${title} to defaults`}
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
          >
            <RotateCcwIcon className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Content - animated expand/collapse */}
      <div
        style={{
          height: isExpanded ? contentHeight : 0,
        }}
        className={cn(
          "overflow-hidden",
          "transition-[height,opacity] duration-300 ease-in-out",
          isExpanded ? "opacity-100" : "opacity-0"
        )}
      >
        <div ref={contentRef} className="px-4 pb-4 pt-1">
          <div className="border-t border-border/50 pt-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export { CollapsibleSection, type CollapsibleSectionProps }

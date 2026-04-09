"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SliderValue = 1 | 2 | 3 | 4 | 5

interface PreferenceSliderProps {
  label: string
  value: SliderValue
  onChange: (value: SliderValue) => void
  labels: [string, string, string, string, string]
  description?: string
}

function PreferenceSlider({
  label,
  value,
  onChange,
  labels,
  description,
}: PreferenceSliderProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [hoveredStep, setHoveredStep] = React.useState<number | null>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)

  // Calculate position from value (0-100%)
  const getPositionFromValue = (val: SliderValue): number => {
    return ((val - 1) / 4) * 100
  }

  // Calculate value from position
  const getValueFromPosition = (clientX: number): SliderValue => {
    if (!trackRef.current) return value
    const rect = trackRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    // Snap to nearest step
    const step = Math.round(percentage * 4) + 1
    return Math.max(1, Math.min(5, step)) as SliderValue
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const newValue = getValueFromPosition(e.clientX)
    if (newValue !== value) {
      onChange(newValue)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    const touch = e.touches[0]
    const newValue = getValueFromPosition(touch.clientX)
    if (newValue !== value) {
      onChange(newValue)
    }
  }

  React.useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX)
      if (newValue !== value) {
        onChange(newValue)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const newValue = getValueFromPosition(touch.clientX)
      if (newValue !== value) {
        onChange(newValue)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleEnd)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleEnd)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleEnd)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, value, onChange])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newValue: SliderValue = value

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault()
        newValue = Math.max(1, value - 1) as SliderValue
        break
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault()
        newValue = Math.min(5, value + 1) as SliderValue
        break
      case "Home":
        e.preventDefault()
        newValue = 1
        break
      case "End":
        e.preventDefault()
        newValue = 5
        break
    }

    if (newValue !== value) {
      onChange(newValue)
    }
  }

  const handleStepClick = (step: SliderValue) => {
    onChange(step)
  }

  const thumbPosition = getPositionFromValue(value)
  const displayLabel = hoveredStep !== null ? labels[hoveredStep - 1] : labels[value - 1]

  return (
    <div data-slot="preference-slider" className="space-y-3">
      {/* Label and description */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">{label}</label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {/* Current value label */}
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            "bg-primary/10 text-primary",
            "transition-all duration-200 ease-out"
          )}
        >
          {displayLabel}
        </span>
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={value}
        aria-valuetext={labels[value - 1]}
        aria-label={label}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative h-10 md:h-8 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "rounded-lg touch-none"
        )}
      >
        {/* Track background */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-muted">
          {/* Filled portion */}
          <div
            style={{ width: `${thumbPosition}%` }}
            className={cn(
              "h-full rounded-full bg-primary",
              "transition-[width] duration-200 ease-out"
            )}
          />
        </div>

        {/* Step indicators */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1">
          {[1, 2, 3, 4, 5].map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => handleStepClick(step as SliderValue)}
              onMouseEnter={() => setHoveredStep(step)}
              onMouseLeave={() => setHoveredStep(null)}
              className={cn(
                "size-3 rounded-full border-2 transition-all duration-150",
                step <= value
                  ? "bg-primary border-primary"
                  : "bg-background border-muted-foreground/30 hover:border-muted-foreground/50"
              )}
              aria-label={labels[step - 1]}
            />
          ))}
        </div>

        {/* Thumb */}
        <div
          style={{ left: `${thumbPosition}%` }}
          className={cn(
            "absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
            // 56px height on mobile for touch-friendly
            "size-6 md:size-5 rounded-full",
            "bg-primary border-2 border-background shadow-md",
            "transition-[left,transform] duration-200 ease-out",
            isDragging && "scale-110"
          )}
        />
      </div>

      {/* Step labels below */}
      <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
        {labels.map((stepLabel, idx) => (
          <span
            key={idx}
            className={cn(
              "max-w-[60px] text-center truncate transition-colors duration-150",
              idx + 1 === value && "text-foreground font-medium"
            )}
          >
            {stepLabel}
          </span>
        ))}
      </div>
    </div>
  )
}

export { PreferenceSlider, type PreferenceSliderProps, type SliderValue }

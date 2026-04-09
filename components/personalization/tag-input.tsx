"use client"

import * as React from "react"
import { XIcon, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
  maxTags: number
  suggestions?: string[]
  placeholder?: string
}

function TagInput({
  label,
  tags,
  onChange,
  maxTags,
  suggestions = [],
  placeholder = "Add a tag...",
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const isAtLimit = tags.length >= maxTags

  // Filter suggestions based on input
  const filteredSuggestions = React.useMemo(() => {
    if (!inputValue.trim()) return suggestions.slice(0, 8)
    const query = inputValue.toLowerCase()
    return suggestions
      .filter(
        (s) =>
          s.toLowerCase().includes(query) &&
          !tags.map((t) => t.toLowerCase()).includes(s.toLowerCase())
      )
      .slice(0, 8)
  }, [inputValue, suggestions, tags])

  // Add a tag
  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed) return
    if (isAtLimit) return
    if (tags.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) return

    onChange([...tags, trimmed])
    setInputValue("")
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  // Remove a tag
  const removeTag = (index: number) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    onChange(newTags)
    inputRef.current?.focus()
  }

  // Handle input keydown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
          addTag(filteredSuggestions[highlightedIndex])
        } else if (inputValue.trim()) {
          addTag(inputValue)
        }
        break

      case "Backspace":
        if (!inputValue && tags.length > 0) {
          removeTag(tags.length - 1)
        }
        break

      case "ArrowDown":
        e.preventDefault()
        if (showSuggestions && filteredSuggestions.length > 0) {
          setHighlightedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          )
        }
        break

      case "ArrowUp":
        e.preventDefault()
        if (showSuggestions && filteredSuggestions.length > 0) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          )
        }
        break

      case "Escape":
        setShowSuggestions(false)
        setHighlightedIndex(-1)
        break

      case ",":
        e.preventDefault()
        if (inputValue.trim()) {
          addTag(inputValue)
        }
        break
    }
  }

  // Handle click outside to close suggestions
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} data-slot="tag-input" className="space-y-2">
      {/* Label with count */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span
          className={cn(
            "text-xs text-muted-foreground",
            isAtLimit && "text-amber-600 dark:text-amber-400"
          )}
        >
          {tags.length}/{maxTags}
        </span>
      </div>

      {/* Input container */}
      <div className="relative">
        <div
          onClick={() => inputRef.current?.focus()}
          className={cn(
            "flex flex-wrap items-center gap-1.5 p-2",
            "min-h-[42px] rounded-lg border bg-background",
            "transition-all duration-150",
            "cursor-text",
            isFocused
              ? "border-ring ring-2 ring-ring/20"
              : "border-input hover:border-ring/50"
          )}
        >
          {/* Tags */}
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5",
                "text-sm bg-primary/10 text-primary rounded-md",
                "animate-in slide-in-from-left-1 duration-150"
              )}
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(index)
                }}
                className={cn(
                  "size-4 rounded-full inline-flex items-center justify-center",
                  "hover:bg-primary/20 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
                aria-label={`Remove ${tag}`}
              >
                <XIcon className="size-3" />
              </button>
            </span>
          ))}

          {/* Input field */}
          {!isAtLimit && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setShowSuggestions(true)
                setHighlightedIndex(-1)
              }}
              onFocus={() => {
                setIsFocused(true)
                setShowSuggestions(true)
              }}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={tags.length === 0 ? placeholder : ""}
              aria-label={label}
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              className={cn(
                "flex-1 min-w-[80px] bg-transparent text-sm",
                "outline-none placeholder:text-muted-foreground"
              )}
            />
          )}
        </div>

        {/* Suggestions dropdown (or bottom sheet on mobile) */}
        {showSuggestions && filteredSuggestions.length > 0 && !isAtLimit && (
          <>
            {/* Desktop: dropdown */}
            <div
              role="listbox"
              className={cn(
                "absolute top-full left-0 right-0 mt-1 z-50",
                "rounded-lg border bg-popover shadow-lg",
                "max-h-[200px] overflow-auto",
                "hidden md:block"
              )}
            >
              {filteredSuggestions.map((suggestion, idx) => (
                <button
                  key={suggestion}
                  type="button"
                  role="option"
                  aria-selected={idx === highlightedIndex}
                  onClick={() => addTag(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left",
                    "flex items-center gap-2",
                    "transition-colors",
                    idx === highlightedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <PlusIcon className="size-3.5 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Mobile: bottom sheet style */}
            <div
              className={cn(
                "fixed inset-x-0 bottom-0 z-50",
                "rounded-t-xl border-t bg-popover shadow-lg",
                "max-h-[50vh] overflow-auto",
                "p-4 pb-safe",
                "md:hidden"
              )}
            >
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-3" />
              <p className="text-xs text-muted-foreground mb-2">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTag(suggestion)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-2",
                      "text-sm bg-muted rounded-lg",
                      "active:scale-95 transition-transform"
                    )}
                  >
                    <PlusIcon className="size-3.5" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Helper text when at limit */}
      {isAtLimit && (
        <p className="text-xs text-muted-foreground">
          Maximum of {maxTags} tags reached. Remove a tag to add more.
        </p>
      )}
    </div>
  )
}

export { TagInput, type TagInputProps }

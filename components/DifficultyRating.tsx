"use client"

import { useEffect, useState } from "react"
import { DIFFICULTY_LEVELS, clearRating, getRating, saveRating } from "@/lib/ratings"

export default function DifficultyRating({ questionId }: { questionId: string }) {
  const [rating, setRating] = useState<number | null>(null)

  useEffect(() => {
    setRating(getRating(questionId))
  }, [questionId])

  function handleRate(value: number) {
    if (rating === value) {
      clearRating(questionId)
      setRating(null)
    } else {
      saveRating(questionId, value)
      setRating(value)
    }
  }

  return (
    <div className="animate-fade-in-up rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/5">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        How difficult was this exercise?
      </h2>

      <div className="flex items-start gap-2">
        {DIFFICULTY_LEVELS.map((level) => {
          const isSelected = rating === level.value

          return (
            <div key={level.value} className="group relative flex-1">
              <button
                type="button"
                onClick={() => handleRate(level.value)}
                aria-label={level.label}
                aria-pressed={isSelected}
                style={{ backgroundColor: level.color }}
                className={`h-9 w-full rounded-md transition-all duration-150 hover:scale-[1.04] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                  isSelected
                    ? "opacity-100 ring-2 ring-foreground ring-offset-2 ring-offset-surface"
                    : "opacity-50 hover:opacity-80"
                }`}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-foreground opacity-0 shadow-md transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100 sm:static sm:mt-1.5 sm:block sm:translate-x-0 sm:whitespace-normal sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-center sm:text-[11px] sm:text-muted sm:opacity-100 sm:shadow-none"
              >
                {level.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

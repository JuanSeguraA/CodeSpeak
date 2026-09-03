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

      <div className="flex items-center gap-2">
        {DIFFICULTY_LEVELS.map((level) => {
          const isSelected = rating === level.value

          return (
            <button
              key={level.value}
              onClick={() => handleRate(level.value)}
              aria-label={level.label}
              aria-pressed={isSelected}
              title={level.label}
              style={{ backgroundColor: level.color }}
              className={`h-9 flex-1 rounded-md transition-all duration-150 hover:scale-[1.04] active:scale-95 ${
                isSelected
                  ? "opacity-100 ring-2 ring-foreground ring-offset-2 ring-offset-surface"
                  : "opacity-50 hover:opacity-80"
              }`}
            />
          )
        })}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>Very Easy</span>
        <span>Very Difficult</span>
      </div>
    </div>
  )
}

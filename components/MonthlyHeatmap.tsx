"use client"

import { useEffect, useState } from "react"
import { getCompletedDates, toDateKey } from "@/lib/completions"

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export default function MonthlyHeatmap() {
  const [today] = useState(() => new Date())
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCompleted(getCompletedDates())
  }, [])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function goToPrevMonth() {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  function goToNextMonth() {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  return (
    <div className="animate-fade-in-up rounded-2xl border border-border bg-surface p-4 shadow-lg shadow-black/5">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          aria-label="Previous month"
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M12.5 5L7.5 10L12.5 15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span className="text-sm font-semibold text-foreground">
          {MONTH_LABELS[month]} {year}
        </span>

        <button
          onClick={goToNextMonth}
          disabled={isCurrentMonth}
          aria-label="Next month"
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M7.5 5L12.5 10L7.5 15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} className="text-center text-[10px] font-medium uppercase text-muted">
            {label}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`pad-${i}`} />

          const key = toDateKey(new Date(year, month, day))
          const isCompleted = completed.has(key)
          const isToday = isCurrentMonth && day === today.getDate()

          return (
            <div
              key={key}
              title={key}
              className={`flex aspect-square items-center justify-center rounded-md text-[11px] transition-colors duration-150 ${
                isCompleted ? "bg-accent font-semibold text-white" : "bg-border/50 text-muted"
              } ${isToday ? "ring-2 ring-accent ring-offset-1 ring-offset-surface" : ""}`}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

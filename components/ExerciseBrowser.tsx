"use client"

import { useState } from "react"
import Link from "next/link"
import { DIFFICULTY_META, QUESTION_CATEGORIES } from "@/data/questions"

export default function ExerciseBrowser() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggle(categoryId: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {QUESTION_CATEGORIES.map((category, index) => {
        const isOpen = expanded.has(category.id)
        const total = category.questions.length

        return (
          <div
            key={category.id}
            className="animate-fade-in-up overflow-hidden rounded-2xl border border-border bg-surface shadow-lg shadow-black/5"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <button
              onClick={() => toggle(category.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-surface-hover"
            >
              <span className="flex items-center gap-3">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`h-4 w-4 shrink-0 text-muted transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
                >
                  <path d="M7.5 5L12.5 10L7.5 15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-semibold text-foreground">{category.label}</span>
              </span>

              <span className="flex items-center gap-3">
                <span className="text-xs font-medium tabular-nums text-muted">0/{total}</span>
                <span className="h-1.5 w-20 overflow-hidden rounded-full bg-border sm:w-28">
                  <span className="block h-full w-0 rounded-full bg-accent" />
                </span>
              </span>
            </button>

            {isOpen && (
              <ul className="border-t border-border">
                {category.questions.map((question) => (
                  <li key={question.id}>
                    <Link
                      href={`/practice/${question.id}`}
                      className="flex items-center justify-between gap-3 py-3 pl-11 pr-5 text-sm text-foreground/90 transition-colors duration-150 hover:bg-surface-hover hover:text-accent"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          title={question.difficulty}
                          style={{ backgroundColor: DIFFICULTY_META[question.difficulty].color }}
                        />
                        <span className="truncate" title={question.title}>{question.title}</span>
                      </span>

                      <span className="flex shrink-0 items-center gap-3">
                        {question.companies.length > 0 && (
                          <span className="hidden text-xs text-muted sm:inline">
                            {question.companies.join(", ")}
                          </span>
                        )}
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-3.5 w-3.5 shrink-0"
                        >
                          <path d="M7.5 5L12.5 10L7.5 15" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

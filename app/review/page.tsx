"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import HeaderControls from "@/components/HeaderControls"
import Logo from "@/components/Logo"
import { findQuestionById } from "@/data/questions"
import { DIFFICULTY_LEVELS, getAllRatings } from "@/lib/ratings"

type RatedQuestion = {
  questionId: string
  title: string
}

export default function ReviewPage() {
  const [groups, setGroups] = useState<Map<number, RatedQuestion[]>>(new Map())
  const [totalRated, setTotalRated] = useState(0)

  useEffect(() => {
    const byLevel = new Map<number, RatedQuestion[]>()

    for (const { questionId, value } of getAllRatings()) {
      const question = findQuestionById(questionId)
      if (!question) continue

      const existing = byLevel.get(value) ?? []
      existing.push({ questionId, title: question.title })
      byLevel.set(value, existing)
    }

    setGroups(byLevel)
    setTotalRated([...byLevel.values()].reduce((sum, list) => sum + list.length, 0))
  }, [])

  const orderedLevels = [...DIFFICULTY_LEVELS].reverse()

  return (
    <main className="flex min-h-screen flex-col">
      <header className="animate-fade-in-up px-6 pt-6 sm:px-10 sm:pt-10">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-6 py-4 shadow-lg shadow-black/5 sm:px-8 sm:py-5">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Logo className="h-11 w-11 text-code-accent sm:h-16 sm:w-16" />
            <h1 className="bg-gradient-to-r from-accent to-code-accent bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-3xl">
              CodeSpeak
            </h1>
          </div>
          <HeaderControls />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6 sm:p-10">
        <div className="animate-fade-in-up" style={{ animationDelay: "20ms" }}>
          <Link
            href="/"
            className="mb-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-150 hover:text-foreground"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path d="M12.5 5L7.5 10L12.5 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to exercises
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Code Review</h2>
          <p className="mt-1 text-muted">
            Exercises you've rated, grouped by difficulty — start with the hardest ones.
          </p>
        </div>

        {totalRated === 0 ? (
          <div
            className="animate-fade-in-up rounded-2xl border border-border bg-surface p-8 text-center shadow-lg shadow-black/5"
            style={{ animationDelay: "60ms" }}
          >
            <p className="text-foreground/90">You haven't rated any exercises yet.</p>
            <p className="mt-1 text-sm text-muted">
              Rate an exercise's difficulty at the bottom of its practice page to see it here.
            </p>
          </div>
        ) : (
          orderedLevels.map((level, i) => {
            const questions = groups.get(level.value) ?? []

            return (
              <div
                key={level.value}
                className="animate-fade-in-up rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/5"
                style={{ animationDelay: `${60 + i * 40}ms` }}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                  <h3 className="font-semibold text-foreground">{level.label}</h3>
                  <span className="text-xs text-muted">({questions.length})</span>
                </div>

                {questions.length === 0 ? (
                  <p className="text-sm text-muted">No exercises rated at this level yet.</p>
                ) : (
                  <div className="flex flex-col divide-y divide-border">
                    {questions.map((question) => (
                      <Link
                        key={question.questionId}
                        href={`/practice/${question.questionId}`}
                        className="flex items-center justify-between gap-3 py-2.5 text-sm text-foreground/90 transition-colors duration-150 first:pt-0 last:pb-0 hover:text-accent"
                      >
                        {question.title}
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-3.5 w-3.5 shrink-0"
                        >
                          <path d="M7.5 5L12.5 10L7.5 15" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}

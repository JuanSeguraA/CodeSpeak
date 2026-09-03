"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import CodeEditor from "@/components/CodeEditor"
import RecordButton from "@/components/RecordButton"
import HeaderControls from "@/components/HeaderControls"
import Logo from "@/components/Logo"
import NotesButton from "@/components/NotesButton"
import DifficultyRating from "@/components/DifficultyRating"
import {
  DIFFICULTY_META,
  QUESTION_CATEGORIES,
  findQuestionById,
  findCategoryByQuestionId,
  type Question,
  type QuestionCategory,
} from "@/data/questions"
import { markDateCompleted } from "@/lib/completions"

type TimelineEntry = {
  time: number
  type: "code" | "speech"
  content: string
}

function formatTimelineForGrading(entries: TimelineEntry[]): string {
  const sorted = [...entries].sort((a, b) => a.time - b.time)

  return sorted
    .map((entry) => {
      const seconds = (entry.time / 1000).toFixed(1)
      const label = entry.type === "code" ? "CODE" : "SPOKEN EXPLANATION"
      return `[${seconds}s] ${label}: ${entry.content}`
    })
    .join("\n")
}

async function getFeedback(transcript: string): Promise<string> {
  const response = await fetch("/api/grade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  })

  const data = await response.json()
  return data.feedback
}

export default function PracticePage() {
  const params = useParams<{ id: string }>()
  const question = findQuestionById(params.id) ?? QUESTION_CATEGORIES[0].questions[0]

  return <PracticeContent key={question.id} question={question} />
}

function PracticeContent({ question }: { question: Question }) {
  const router = useRouter()
  const category: QuestionCategory = findCategoryByQuestionId(question.id) ?? QUESTION_CATEGORIES[0]
  const indexInCategory = category.questions.findIndex((q) => q.id === question.id)
  const prevQuestion = indexInCategory > 0 ? category.questions[indexInCategory - 1] : null
  const nextQuestion =
    indexInCategory >= 0 && indexInCategory < category.questions.length - 1
      ? category.questions[indexInCategory + 1]
      : null

  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [startTime] = useState(Date.now())
  const [isGrading, setIsGrading] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [sessionId, setSessionId] = useState(0)

  function addEntry(type: "code" | "speech", content: string) {
    setTimeline((prev) => [
      ...prev,
      { time: Date.now() - startTime, type, content },
    ])
  }

  async function handleGetFeedback() {
    setIsGrading(true)
    const formatted = formatTimelineForGrading(timeline)
    const result = await getFeedback(formatted)
    setFeedback(result)
    markDateCompleted()
    setIsGrading(false)
  }

  function handleReset() {
    setTimeline([])
    setFeedback("")
    setSessionId((prev) => prev + 1)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-10">
      <div className="flex w-full max-w-4xl flex-col gap-6">
        <header className="animate-fade-in-up relative z-20 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-1.5 text-sm text-muted">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-medium transition-colors duration-150 hover:text-foreground"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path d="M12.5 5L7.5 10L12.5 15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Exercises
              </Link>
              <span className="text-border">/</span>
              <Link
                href={`/?category=${category.id}`}
                className="font-medium transition-colors duration-150 hover:text-foreground"
              >
                {category.label}
              </Link>
              <span className="text-border">/</span>
              <span
                className="max-w-[10rem] truncate font-medium text-foreground sm:max-w-xs"
                title={question.title}
              >
                {question.title}
              </span>
            </nav>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Logo className="h-10 w-10 text-code-accent sm:h-14 sm:w-14" />
              <h1 className="bg-gradient-to-r from-accent to-code-accent bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-4xl">
                CodeSpeak
              </h1>
            </div>
            <p className="text-muted">
              Practice explaining your code out loud, like a real interview.
            </p>
          </div>
          <HeaderControls />
        </header>

        <nav
          aria-label="Exercise navigation"
          className="animate-fade-in-up flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm shadow-lg shadow-black/5"
          style={{ animationDelay: "20ms" }}
        >
          {prevQuestion ? (
            <Link
              href={`/practice/${prevQuestion.id}`}
              className="flex min-w-0 items-center gap-1.5 font-medium text-foreground transition-colors duration-150 hover:text-accent"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0">
                <path d="M12.5 5L7.5 10L12.5 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="truncate">{prevQuestion.title}</span>
            </Link>
          ) : (
            <span className="flex min-w-0 items-center gap-1.5 text-muted opacity-40">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0">
                <path d="M12.5 5L7.5 10L12.5 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Previous
            </span>
          )}

          <span className="shrink-0 text-xs font-medium tabular-nums text-muted">
            {indexInCategory + 1} / {category.questions.length} in {category.label}
          </span>

          {nextQuestion ? (
            <Link
              href={`/practice/${nextQuestion.id}`}
              className="flex min-w-0 items-center justify-end gap-1.5 font-medium text-foreground transition-colors duration-150 hover:text-accent"
            >
              <span className="truncate">{nextQuestion.title}</span>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0">
                <path d="M7.5 5L12.5 10L7.5 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <span className="flex min-w-0 items-center justify-end gap-1.5 text-muted opacity-40">
              Next
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0">
                <path d="M7.5 5L12.5 10L7.5 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </nav>

        <section
          className="animate-fade-in-up rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/5"
          style={{ animationDelay: "40ms" }}
        >
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">
            Challenge
          </label>
          <div className="relative">
            <select
              value={question.id}
              onChange={(e) => router.push(`/practice/${e.target.value}`)}
              className="w-full appearance-none rounded-lg border border-border bg-background py-2.5 pl-3 pr-9 text-foreground transition-colors duration-150 hover:border-accent focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {QUESTION_CATEGORIES.map((cat) => (
                <optgroup key={cat.id} label={cat.label}>
                  {cat.questions.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="mt-4 leading-relaxed text-foreground/90">{question.prompt}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: DIFFICULTY_META[question.difficulty].color }}
              />
              {question.difficulty}
            </span>
            {question.companies.map((company) => (
              <span
                key={company}
                className="rounded-full bg-background px-2.5 py-1 text-xs text-muted"
              >
                {company}
              </span>
            ))}
          </div>
        </section>

        <div
          className="animate-fade-in-up rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/5"
          style={{ animationDelay: "80ms" }}
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Explain Your Thinking
          </h2>
          <RecordButton key={`record-${sessionId}`} onTranscriptUpdate={(text) => addEntry("speech", text)} />
        </div>

        <div
          className="animate-fade-in-up rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/5"
          style={{ animationDelay: "120ms" }}
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Write Your Solution
          </h2>
          <CodeEditor key={`code-${sessionId}`} onCodeChange={(code) => addEntry("code", code)} />
        </div>

        <div
          className="animate-fade-in-up flex gap-3"
          style={{ animationDelay: "160ms" }}
        >
          <button
            onClick={handleGetFeedback}
            disabled={isGrading}
            className="inline-flex items-center gap-2 rounded-lg bg-success px-5 py-2.5 font-medium text-white shadow-sm shadow-success/20 transition-all duration-150 hover:scale-[1.02] hover:bg-success-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isGrading && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isGrading ? "Grading..." : "Get Feedback"}
          </button>

          <button
            onClick={handleReset}
            className="rounded-lg border border-border px-5 py-2.5 font-medium text-foreground transition-all duration-150 hover:scale-[1.02] hover:bg-surface-hover active:scale-[0.98]"
          >
            Reset
          </button>

          <NotesButton questionId={question.id} questionTitle={question.title} />
        </div>

        {feedback && (
          <div className="animate-fade-in-up rounded-2xl border border-accent/30 bg-surface p-5 shadow-lg shadow-black/5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
              Feedback
            </h2>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{feedback}</p>
          </div>
        )}

        <DifficultyRating questionId={question.id} />
      </div>
    </main>
  )
}

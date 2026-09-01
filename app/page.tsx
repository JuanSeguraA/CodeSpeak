"use client"

import { useState } from "react"
import CodeEditor from "@/components/CodeEditor"
import RecordButton from "@/components/RecordButton"
import ThemeToggle from "@/components/ThemeToggle"
import NotificationButton from "@/components/NotificationButton"
import LoginButton from "@/components/LoginButton"
import { QUESTION_CATEGORIES, findQuestionById } from "@/data/questions"

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

export default function Home() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [startTime] = useState(Date.now())
  const [isGrading, setIsGrading] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [selectedQuestion, setSelectedQuestion] = useState(QUESTION_CATEGORIES[0].questions[0])
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
            <h1 className="bg-gradient-to-r from-accent to-code-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              CodeAloud
            </h1>
            <p className="text-muted">
              Practice explaining your code out loud, like a real interview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LoginButton />
            <NotificationButton />
            <ThemeToggle />
          </div>
        </header>

        <section
          className="animate-fade-in-up rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/5"
          style={{ animationDelay: "40ms" }}
        >
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">
            Challenge
          </label>
          <div className="relative">
            <select
              value={selectedQuestion.id}
              onChange={(e) => {
                const found = findQuestionById(e.target.value)
                if (found) setSelectedQuestion(found)
              }}
              className="w-full appearance-none rounded-lg border border-border bg-background py-2.5 pl-3 pr-9 text-foreground transition-colors duration-150 hover:border-accent focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {QUESTION_CATEGORIES.map((category) => (
                <optgroup key={category.id} label={category.label}>
                  {category.questions.map((q) => (
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

          <p className="mt-4 leading-relaxed text-foreground/90">{selectedQuestion.prompt}</p>
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
        </div>

        {feedback && (
          <div className="animate-fade-in-up rounded-2xl border border-accent/30 bg-surface p-5 shadow-lg shadow-black/5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
              Feedback
            </h2>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{feedback}</p>
          </div>
        )}
      </div>
    </main>
  )
}
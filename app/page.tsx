"use client"

import { useState } from "react"
import CodeEditor from "@/components/CodeEditor"
import RecordButton from "@/components/RecordButton"

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

  return (
    <main className="flex min-h-screen flex-col p-8 gap-4">
      <RecordButton onTranscriptUpdate={(text) => addEntry("speech", text)} />
      <CodeEditor onCodeChange={(code) => addEntry("code", code)} />

      <button
        onClick={handleGetFeedback}
        disabled={isGrading}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {isGrading ? "Grading..." : "Get Feedback"}
      </button>

      {feedback && (
        <div className="p-4 bg-gray-800 text-white rounded">
          {feedback}
        </div>
      )}
    </main>
  )
}
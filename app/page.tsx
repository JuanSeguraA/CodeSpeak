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

export default function Home() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [startTime] = useState(Date.now())

  function addEntry(type: "code" | "speech", content: string) {
    setTimeline((prev) => [
      ...prev,
      { time: Date.now() - startTime, type, content },
    ])
  }

  return (
    <main className="flex min-h-screen flex-col p-8">
      <RecordButton onTranscriptUpdate={(text) => addEntry("speech", text)} />
      <CodeEditor onCodeChange={(code) => addEntry("code", code)} />

      <div className="mt-8 p-4 bg-gray-900 text-green-400 font-mono text-xs overflow-auto max-h-64">
        <p>Timeline entries: {timeline.length}</p>
        {[...timeline].sort((a, b) => a.time - b.time).map((entry, i) => (
          <div key={i}>
            [{entry.time}ms] {entry.type}: {entry.content.slice(0, 60)}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-900 text-green-400 font-mono text-xs overflow-auto max-h-64">
        <pre>{formatTimelineForGrading(timeline)}</pre>
      </div>
    </main>
  )
}
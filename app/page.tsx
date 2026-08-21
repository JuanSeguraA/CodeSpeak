"use client"

import { useState } from "react"
import CodeEditor from "@/components/CodeEditor"
import RecordButton from "@/components/RecordButton"

type TimelineEntry = {
  time: number
  type: "code" | "speech"
  content: string
}

type Question = {
  id: string
  title: string
  prompt: string
}

const QUESTIONS: Question[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    prompt: "Given an array of integers and a target, return the indices of the two numbers that add up to the target.",
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    prompt: "Write a function that reverses a string in place.",
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    prompt: "Print numbers 1 to 100. For multiples of 3, print 'Fizz'; for multiples of 5, print 'Buzz'; for multiples of both, print 'FizzBuzz'.",
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    prompt: "Given a string, determine if it's a palindrome, considering only alphanumeric characters and ignoring case.",
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray",
    prompt: "Given an integer array, find the contiguous subarray with the largest sum and return that sum.",
  },
]

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
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(QUESTIONS[0])

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
      <select
        value={selectedQuestion.id}
        onChange={(e) => {
          const found = QUESTIONS.find((q) => q.id === e.target.value)
          if (found) setSelectedQuestion(found)
        }}
        className="p-2 bg-gray-800 text-white rounded"
      >
        {QUESTIONS.map((q) => (
          <option key={q.id} value={q.id}>
            {q.title}
          </option>
        ))}
      </select>

      <div className="p-4 bg-gray-800 text-white rounded">
        {selectedQuestion.prompt}
      </div>
      
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
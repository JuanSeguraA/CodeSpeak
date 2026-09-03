"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { findQuestionById } from "@/data/questions"
import { getAllNotes } from "@/lib/notes"

type NoteEntry = {
  questionId: string
  title: string
  text: string
}

const PREVIEW_COUNT = 2

export default function NotesBoard() {
  const [notes, setNotes] = useState<NoteEntry[]>([])

  useEffect(() => {
    const entries = getAllNotes()
      .map(({ questionId, text }) => {
        const question = findQuestionById(questionId)
        return question ? { questionId, title: question.title, text } : null
      })
      .filter((entry): entry is NoteEntry => entry !== null)

    setNotes(entries)
  }, [])

  const preview = notes.slice(0, PREVIEW_COUNT)
  const remaining = notes.length - preview.length

  return (
    <Link
      href="/notes"
      className="animate-fade-in-up block rounded-2xl border border-border bg-surface p-4 shadow-lg shadow-black/5 transition-colors duration-150 hover:bg-surface-hover"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">My Notes</h2>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-muted">
          <path d="M7.5 5L12.5 10L7.5 15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-muted">Notes you leave on an exercise will show up here.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {preview.map((note) => (
            <div key={note.questionId} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
              <span className="text-sm font-semibold text-foreground">Title: {note.title}</span>
              <span className="line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                {note.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <p className="mt-2 border-t border-border pt-2 text-xs font-medium text-accent">
          +{remaining} more {remaining === 1 ? "note" : "notes"}
        </p>
      )}
    </Link>
  )
}

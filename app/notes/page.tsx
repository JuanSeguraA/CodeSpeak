"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import HeaderControls from "@/components/HeaderControls"
import Logo from "@/components/Logo"
import NoteEditorModal from "@/components/NoteEditorModal"
import { findQuestionById } from "@/data/questions"
import { getAllNotes, saveNote } from "@/lib/notes"

type NoteEntry = {
  questionId: string
  title: string
  text: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteEntry[]>([])
  const [editing, setEditing] = useState<NoteEntry | null>(null)

  function refresh() {
    const entries = getAllNotes()
      .map(({ questionId, text }) => {
        const question = findQuestionById(questionId)
        return question ? { questionId, title: question.title, text } : null
      })
      .filter((entry): entry is NoteEntry => entry !== null)

    setNotes(entries)
  }

  useEffect(() => {
    refresh()
  }, [])

  function handleSave(text: string) {
    if (!editing) return
    saveNote(editing.questionId, text)
    setEditing(null)
    refresh()
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="animate-fade-in-up px-6 pt-6 sm:px-10 sm:pt-10">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-6 py-4 shadow-lg shadow-black/5 sm:px-8 sm:py-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo className="h-7 w-7 text-code-accent sm:h-9 sm:w-9" />
            <h1 className="bg-gradient-to-r from-accent to-code-accent bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-3xl">
              CodeAloud
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">My Notes</h2>
          <p className="mt-1 text-muted">Everything you've written down about each exercise, newest first.</p>
        </div>

        {notes.length === 0 ? (
          <div
            className="animate-fade-in-up rounded-2xl border border-border bg-surface p-8 text-center shadow-lg shadow-black/5"
            style={{ animationDelay: "60ms" }}
          >
            <p className="text-foreground/90">You haven&apos;t written any notes yet.</p>
            <p className="mt-1 text-sm text-muted">
              Press the Notes button on an exercise page to jot down how it went.
            </p>
          </div>
        ) : (
          <div
            className="animate-fade-in-up rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/5"
            style={{ animationDelay: "60ms" }}
          >
            <div className="flex flex-col divide-y divide-border">
              {notes.map((note) => (
                <button
                  key={note.questionId}
                  onClick={() => setEditing(note)}
                  className="flex flex-col gap-1 py-4 text-left transition-colors duration-150 first:pt-0 last:pb-0 hover:bg-surface-hover"
                >
                  <span className="text-sm font-semibold text-foreground">Title: {note.title}</span>
                  <span className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                    {note.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {editing && (
        <NoteEditorModal
          title={`Notes — ${editing.title}`}
          initialText={editing.text}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </main>
  )
}

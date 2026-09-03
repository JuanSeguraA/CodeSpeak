"use client"

import { useState } from "react"
import NoteEditorModal from "@/components/NoteEditorModal"
import { getNote, saveNote } from "@/lib/notes"

export default function NotesButton({
  questionId,
  questionTitle,
}: {
  questionId: string
  questionTitle: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialText, setInitialText] = useState("")

  function openModal() {
    setInitialText(getNote(questionId))
    setIsOpen(true)
  }

  function handleSave(text: string) {
    saveNote(questionId, text)
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium text-foreground transition-all duration-150 hover:scale-[1.02] hover:bg-surface-hover active:scale-[0.98]"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="M5 4h8l3 3v9a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" strokeLinejoin="round" />
          <path d="M7.5 10h5M7.5 13h5" strokeLinecap="round" />
        </svg>
        Notes
      </button>

      {isOpen && (
        <NoteEditorModal
          title={`Notes — ${questionTitle}`}
          initialText={initialText}
          onSave={handleSave}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

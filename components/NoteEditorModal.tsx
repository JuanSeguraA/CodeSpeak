"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function NoteEditorModal({
  title,
  initialText,
  onSave,
  onClose,
}: {
  title: string
  initialText: string
  onSave: (text: string) => void
  onClose: () => void
}) {
  const [text, setText] = useState(initialText)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      className="animate-fade-in-up fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M5 5L15 15M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="What went well? What did you find difficult?"
          className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-all duration-150 hover:scale-[1.02] hover:bg-surface-hover active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(text)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:scale-[1.02] hover:bg-accent-hover active:scale-[0.98]"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

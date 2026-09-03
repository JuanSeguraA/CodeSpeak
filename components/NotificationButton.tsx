"use client"

import { useCallback, useRef, useState } from "react"
import { useClickOutside } from "@/lib/useClickOutside"

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, isOpen, useCallback(() => setIsOpen(false), []))

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="View notifications"
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-all duration-150 hover:scale-105 hover:bg-surface-hover active:scale-95"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-[22px] w-[22px]">
          <path d="M10 2a6 6 0 00-6 6v2.586l-1.707 1.707A1 1 0 003 14h14a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zM8.5 16a1.5 1.5 0 003 0h-3z" />
        </svg>
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
      </button>

      {isOpen && (
        <div className="animate-fade-in-up absolute right-0 top-12 z-10 w-56 rounded-xl border border-border bg-surface p-3 text-sm shadow-lg shadow-black/10">
          <p className="font-medium text-foreground">Notifications</p>
          <p className="mt-1 text-muted">You&apos;re all caught up.</p>
        </div>
      )}
    </div>
  )
}

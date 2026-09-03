"use client"

import { useEffect, useState } from "react"

type Theme = "light" | "dark"

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    setTheme(stored === "light" || stored === "dark" ? stored : getSystemTheme())
  }, [])

  useEffect(() => {
    if (!theme) return
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  function toggle() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-all duration-150 hover:scale-105 hover:bg-surface-hover active:scale-95"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 20 20" fill="none" className="h-[22px] w-[22px]">
          <circle cx="10" cy="10" r="4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M10 1.5V3.25" />
            <path d="M10 16.75V18.5" />
            <path d="M18.5 10H16.75" />
            <path d="M3.25 10H1.5" />
            <path d="M15.89 4.11L14.66 5.34" />
            <path d="M5.34 14.66L4.11 15.89" />
            <path d="M15.89 15.89L14.66 14.66" />
            <path d="M5.34 5.34L4.11 4.11" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-[22px] w-[22px]">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )
}

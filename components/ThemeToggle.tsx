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
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-[22px] w-[22px]">
          <path d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm0 12a4 4 0 100-8 4 4 0 000 8zm7-5a1 1 0 110 2h-1a1 1 0 110-2h1zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm11.657-5.657a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.464 13.536a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zm9.193 1.414a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414zM5.757 6.464a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-[22px] w-[22px]">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )
}

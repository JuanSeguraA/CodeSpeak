"use client"

import { useEffect, useState, type FormEvent } from "react"
import { createPortal } from "react-dom"
import { useAuth } from "@/components/AuthProvider"

type Mode = "login" | "signup"

export default function AuthModal({
  initialMode = "login",
  onClose,
}: {
  initialMode?: Mode
  onClose: () => void
}) {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const result = mode === "login" ? await login(email, password) : await signup(name, email, password)

    setIsSubmitting(false)

    if (result.ok) {
      onClose()
    } else {
      setError(result.error)
    }
  }

  function switchMode() {
    setMode((prev) => (prev === "login" ? "signup" : "login"))
    setError("")
  }

  return createPortal(
    <div
      className="animate-fade-in-up fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            {mode === "login" ? "Log in" : "Create an account"}
          </h2>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-foreground">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                autoComplete="name"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </label>
          )}

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="rounded-lg border border-border bg-background px-3 py-2 text-foreground transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-foreground transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:scale-[1.02] hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={switchMode} className="font-medium text-accent hover:underline">
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>,
    document.body
  )
}

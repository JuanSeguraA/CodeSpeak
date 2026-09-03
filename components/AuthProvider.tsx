"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

export type AuthUser = { id: string; name: string; email: string }

type AuthResult = { ok: true } | { ok: false; error: string }

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  signup: (name: string, email: string, password: string) => Promise<AuthResult>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function submitAuthRequest(url: string, body: unknown): Promise<AuthResult & { user?: AuthUser }> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    return { ok: false, error: data.error ?? "Something went wrong. Please try again." }
  }
  return { ok: true, user: data.user }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const result = await submitAuthRequest("/api/auth/login", { email, password })
    if (result.ok && result.user) setUser(result.user)
    return result
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    const result = await submitAuthRequest("/api/auth/signup", { name, email, password })
    if (result.ok && result.user) setUser(result.user)
    return result
  }, [])

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

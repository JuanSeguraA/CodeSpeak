"use client"

import { useCallback, useRef, useState } from "react"
import { useAuth } from "@/components/AuthProvider"
import AuthModal from "@/components/AuthModal"
import { useClickOutside } from "@/lib/useClickOutside"

export default function LoginButton() {
  const { user, logout } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside(menuRef, isMenuOpen, useCallback(() => setIsMenuOpen(false), []))

  if (user) {
    const initial = user.name.trim().charAt(0).toUpperCase() || "?"

    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Account menu"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-surface pl-1.5 pr-1.5 text-sm font-medium text-foreground transition-all duration-150 hover:scale-105 hover:bg-surface-hover active:scale-95 sm:pr-4"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
            {initial}
          </span>
          <span className="hidden sm:inline">{user.name}</span>
        </button>

        {isMenuOpen && (
          <div className="animate-fade-in-up absolute right-0 top-12 z-10 w-48 rounded-xl border border-border bg-surface p-1.5 text-sm shadow-lg shadow-black/10">
            <p className="truncate px-3 py-2 text-xs text-muted">{user.email}</p>
            <button
              onClick={() => {
                setIsMenuOpen(false)
                logout()
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-foreground transition-colors duration-150 hover:bg-surface-hover"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <button
        aria-label="Log in"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-surface text-sm font-medium text-foreground transition-all duration-150 hover:scale-105 hover:bg-surface-hover active:scale-95 sm:w-auto sm:justify-start sm:px-5"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px] shrink-0">
          <path
            fillRule="evenodd"
            d="M10 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm-6 8a6 6 0 1112 0 1 1 0 01-1 1H5a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="hidden sm:inline">Log In</span>
      </button>

      {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

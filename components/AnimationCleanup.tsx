"use client"

import { useEffect } from "react"

export default function AnimationCleanup() {
  useEffect(() => {
    function handleAnimationEnd(event: AnimationEvent) {
      if (event.animationName === "fade-in-up" && event.target instanceof HTMLElement) {
        event.target.style.animation = "none"
      }
    }

    document.addEventListener("animationend", handleAnimationEnd)
    return () => document.removeEventListener("animationend", handleAnimationEnd)
  }, [])

  return null
}

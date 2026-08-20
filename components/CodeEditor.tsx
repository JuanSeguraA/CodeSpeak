"use client"

import dynamic from "next/dynamic"
import { useRef } from "react"

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

export default function CodeEditor({
  onCodeChange,
}: {
  onCodeChange: (code: string) => void
}) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(value: string | undefined) {
    const code = value ?? ""

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      onCodeChange(code)
    }, 2000)
  }

  return (
    <Editor
      height="500px"
      defaultLanguage="javascript"
      defaultValue="// Write your solution here"
      theme="vs-dark"
      onChange={handleChange}
    />
  )
}
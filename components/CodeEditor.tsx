"use client"

import dynamic from "next/dynamic"

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

export default function CodeEditor() {
  return (
    <Editor
      height="500px"
      defaultLanguage="javascript"
      defaultValue="// Write your solution here"
      theme="vs-dark"
    />
  )
}
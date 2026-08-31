"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

const PYODIDE_VERSION = "314.0.6"
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VERSION}/`

type OutputLine = {
  type: "log" | "error"
  text: string
}

const SANDBOX_HTML = `<!DOCTYPE html>
<html><body>
<script src="${PYODIDE_INDEX_URL}pyodide.js"><\/script>
<script>
const pyodideReady = loadPyodide({ indexURL: "${PYODIDE_INDEX_URL}" }).then((pyodide) => {
  pyodide.setStdout({ batched: (text) => parent.postMessage({ type: "log", text }, "*") })
  pyodide.setStderr({ batched: (text) => parent.postMessage({ type: "error", text }, "*") })
  parent.postMessage({ type: "ready" }, "*")
  return pyodide
}).catch((err) => {
  parent.postMessage({ type: "error", text: "Failed to load Python runtime: " + err }, "*")
})

window.addEventListener("message", async function (event) {
  if (!event.data || !event.data.code) return
  try {
    const pyodide = await pyodideReady
    await pyodide.runPythonAsync(event.data.code)
  } catch (err) {
    parent.postMessage({ type: "error", text: err instanceof Error ? err.message : String(err) }, "*")
  } finally {
    parent.postMessage({ type: "done" }, "*")
  }
})
<\/script>
</body></html>`

export default function CodeEditor({
  onCodeChange,
}: {
  onCodeChange: (code: string) => void
}) {
  const codeRef = useRef("")
  const lastSentRef = useRef("")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [output, setOutput] = useState<OutputLine[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (codeRef.current !== lastSentRef.current) {
        onCodeChange(codeRef.current)
        lastSentRef.current = codeRef.current
      }
    }, 2000)

    return () => {
      clearInterval(interval)
      if (codeRef.current !== lastSentRef.current) {
        onCodeChange(codeRef.current)
        lastSentRef.current = codeRef.current
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = SANDBOX_HTML
    }
  }, [])

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return
      const { type, text } = event.data ?? {}
      if (type === "ready") {
        setIsReady(true)
        return
      }
      if (type === "done") {
        setIsRunning(false)
        return
      }
      if (type !== "log" && type !== "error") return
      setOutput((prev) => [...prev, { type, text }])
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  function handleChange(value: string | undefined) {
    codeRef.current = value ?? ""
  }

  function runCode() {
    if (!isReady) return
    setOutput([])
    setIsRunning(true)
    iframeRef.current?.contentWindow?.postMessage({ code: codeRef.current }, "*")
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400">
        Python only — Run Code executes this via Pyodide (Python compiled to WebAssembly), sandboxed in an iframe.
      </p>
      <Editor
        height="500px"
        defaultLanguage="python"
        defaultValue="# Write your Python solution here"
        theme="vs-dark"
        onChange={handleChange}
        options={{
          autoClosingBrackets: "never",
          autoSurround: "never",
          autoIndent: "none",
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: "off",
          tabCompletion: "off",
          wordBasedSuggestions: "off",
        }}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={runCode}
          disabled={isRunning || !isReady}
          className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
        >
          {!isReady ? "Loading Python runtime..." : isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      <div className="p-3 bg-black text-sm font-mono rounded h-32 overflow-y-auto">
        {output.length === 0 ? (
          <span className="text-gray-500">Output will appear here</span>
        ) : (
          output.map((line, i) => (
            <div key={i} className={line.type === "error" ? "text-red-400" : "text-green-400"}>
              {line.text}
            </div>
          ))
        )}
      </div>

      <iframe ref={iframeRef} sandbox="allow-scripts" className="hidden" title="code-runner" />
    </div>
  )
}

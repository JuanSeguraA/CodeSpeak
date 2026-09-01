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
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted">
        Python only — Run Code executes this via Pyodide (Python compiled to WebAssembly), sandboxed in an iframe.
      </p>

      <div className="overflow-hidden rounded-lg border border-border">
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
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={runCode}
          disabled={isRunning || !isReady}
          className="inline-flex items-center gap-2 rounded-lg bg-code-accent px-4 py-2 font-medium text-white transition-all duration-150 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {(isRunning || !isReady) && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {!isReady ? "Loading Python runtime..." : isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      <div>
        <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Output</h3>
        <div className="h-32 overflow-y-auto rounded-lg border border-border bg-black/90 p-3 font-mono text-sm">
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
      </div>

      <iframe ref={iframeRef} sandbox="allow-scripts" className="hidden" title="code-runner" />
    </div>
  )
}

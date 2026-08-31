"use client"

import { useState, useRef } from "react"

export default function RecordButton({
  onTranscriptUpdate,
}: {
  onTranscriptUpdate: (text: string) => void
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState("")
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef("")
  const lastSentRef = useRef("")
  const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function flushTranscript() {
    const current = transcriptRef.current
    if (current !== lastSentRef.current) {
      onTranscriptUpdate(current.slice(lastSentRef.current.length))
      lastSentRef.current = current
    }
  }

  function startRecording() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError("Speech recognition isn't supported in this browser. Try Chrome or Edge.")
      return
    }

    setError("")

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      let fullTranscript = ""
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript
      }
      setTranscript(fullTranscript)
      transcriptRef.current = fullTranscript
    }

    recognition.onerror = (event: any) => {
      const messages: Record<string, string> = {
        "not-allowed": "Microphone access was denied. Allow it in your browser settings to record.",
        "no-speech": "No speech was detected.",
        "audio-capture": "No microphone was found.",
      }
      setError(messages[event.error] ?? `Recording error: ${event.error}`)
      setIsRecording(false)
      if (flushIntervalRef.current) clearInterval(flushIntervalRef.current)
    }

    recognition.onend = () => {
      setIsRecording(false)
      if (flushIntervalRef.current) clearInterval(flushIntervalRef.current)
      flushTranscript()
    }

    recognition.start()
    recognitionRef.current = recognition
    transcriptRef.current = ""
    lastSentRef.current = ""
    flushIntervalRef.current = setInterval(flushTranscript, 2000)
    setIsRecording(true)
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    if (flushIntervalRef.current) clearInterval(flushIntervalRef.current)
    flushTranscript()
    setIsRecording(false)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {error && <p className="text-red-400">{error}</p>}
      <p>{transcript}</p>
    </div>
  )
}
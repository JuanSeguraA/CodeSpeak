import CodeEditor from "@/components/CodeEditor"
import RecordButton from "@/components/RecordButton"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-8">
      <RecordButton />
      <CodeEditor />
    </main>
  )
}
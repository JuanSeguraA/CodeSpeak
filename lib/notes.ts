const STORAGE_KEY = "codealoud:notes"

type NoteRecord = { text: string; updatedAt: number }
type NotesMap = Record<string, NoteRecord>

function readAll(): NotesMap {
  if (typeof window === "undefined") return {}

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as NotesMap) : {}
  } catch {
    return {}
  }
}

function writeAll(notes: NotesMap): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function getNote(questionId: string): string {
  return readAll()[questionId]?.text ?? ""
}

export function saveNote(questionId: string, text: string): void {
  const notes = readAll()

  if (text.trim()) {
    notes[questionId] = { text, updatedAt: Date.now() }
  } else {
    delete notes[questionId]
  }

  writeAll(notes)
}

export function getAllNotes(): { questionId: string; text: string; updatedAt: number }[] {
  return Object.entries(readAll())
    .map(([questionId, record]) => ({ questionId, text: record.text, updatedAt: record.updatedAt }))
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

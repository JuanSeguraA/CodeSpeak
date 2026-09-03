const STORAGE_KEY = "codespeak:exercise-completions"

type CompletionsMap = Record<string, boolean>

function readAll(): CompletionsMap {
  if (typeof window === "undefined") return {}

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CompletionsMap) : {}
  } catch {
    return {}
  }
}

function writeAll(completions: CompletionsMap): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completions))
}

export function isCompleted(questionId: string): boolean {
  return readAll()[questionId] === true
}

export function setCompleted(questionId: string, value: boolean): void {
  const completions = readAll()
  if (value) {
    completions[questionId] = true
  } else {
    delete completions[questionId]
  }
  writeAll(completions)
}

export function getAllCompletedIds(): Set<string> {
  const completions = readAll()
  return new Set(Object.keys(completions).filter((id) => completions[id] === true))
}

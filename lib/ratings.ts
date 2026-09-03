const STORAGE_KEY = "codespeak:ratings"

export type DifficultyLevel = {
  value: number
  label: string
  color: string
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { value: 1, label: "Very Easy", color: "#22c55e" },
  { value: 2, label: "Easy", color: "#84cc16" },
  { value: 3, label: "Medium", color: "#eab308" },
  { value: 4, label: "Hard", color: "#f97316" },
  { value: 5, label: "Very Difficult", color: "#ef4444" },
]

type RatingsMap = Record<string, number>

function readAll(): RatingsMap {
  if (typeof window === "undefined") return {}

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as RatingsMap) : {}
  } catch {
    return {}
  }
}

function writeAll(ratings: RatingsMap): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings))
}

export function getRating(questionId: string): number | null {
  const rating = readAll()[questionId]
  return typeof rating === "number" ? rating : null
}

export function saveRating(questionId: string, value: number): void {
  const ratings = readAll()
  ratings[questionId] = value
  writeAll(ratings)
}

export function clearRating(questionId: string): void {
  const ratings = readAll()
  delete ratings[questionId]
  writeAll(ratings)
}

export function getAllRatings(): { questionId: string; value: number }[] {
  return Object.entries(readAll()).map(([questionId, value]) => ({ questionId, value }))
}

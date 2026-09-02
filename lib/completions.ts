const STORAGE_KEY = "codealoud:completed-dates"

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function getCompletedDates(): Set<string> {
  if (typeof window === "undefined") return new Set()

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

export function markDateCompleted(date: Date = new Date()): void {
  if (typeof window === "undefined") return

  const dates = getCompletedDates()
  dates.add(toDateKey(date))
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...dates]))
}

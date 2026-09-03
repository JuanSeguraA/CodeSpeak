"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { DIFFICULTY_META, QUESTION_CATEGORIES, getAllCompanies, type Difficulty } from "@/data/questions"
import { getAllCompletedIds, setCompleted } from "@/lib/exerciseCompletions"
import { useClickOutside } from "@/lib/useClickOutside"

const ALL_DIFFICULTIES = Object.keys(DIFFICULTY_META) as Difficulty[]
const SESSION_STORAGE_KEY = "codespeak:exercise-browser-state"

type PersistedBrowserState = {
  search: string
  difficulty: Difficulty[]
  companies: string[]
  notCompletedOnly: boolean
  expanded: string[]
}

function loadPersistedState(): PersistedBrowserState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PersistedBrowserState) : null
  } catch {
    return null
  }
}

function savePersistedState(state: PersistedBrowserState): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state))
}

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }
  return next
}

function MultiSelectDropdown<T extends string>({
  label,
  options,
  selected,
  onToggle,
  renderOption,
}: {
  label: string
  options: T[]
  selected: Set<T>
  onToggle: (value: T) => void
  renderOption?: (value: T) => ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, isOpen, useCallback(() => setIsOpen(false), []))

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
          selected.size > 0
            ? "border-accent bg-accent/10 text-accent"
            : "border-border text-muted hover:border-accent hover:text-accent"
        }`}
      >
        {label}
        {selected.size > 0 && <span className="tabular-nums">({selected.size})</span>}
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-3 w-3 shrink-0 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="animate-fade-in-up absolute left-0 top-full z-10 mt-1.5 max-h-64 w-48 overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-lg shadow-black/10">
          {options.map((option) => {
            const active = selected.has(option)
            return (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground/90 hover:bg-surface-hover"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => onToggle(option)}
                  className="h-3.5 w-3.5 shrink-0 rounded border-border accent-accent"
                />
                {renderOption ? renderOption(option) : option}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ExerciseBrowser({ initialCategoryId }: { initialCategoryId?: string }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set(loadPersistedState()?.expanded ?? [])
    if (initialCategoryId) initial.add(initialCategoryId)
    return initial
  })
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState(() => loadPersistedState()?.search ?? "")
  const [difficultyFilter, setDifficultyFilter] = useState<Set<Difficulty>>(
    () => new Set(loadPersistedState()?.difficulty ?? [])
  )
  const [companyFilter, setCompanyFilter] = useState<Set<string>>(() => new Set(loadPersistedState()?.companies ?? []))
  const [notCompletedOnly, setNotCompletedOnly] = useState(() => loadPersistedState()?.notCompletedOnly ?? false)
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    setCompletedIds(getAllCompletedIds())
  }, [])

  useEffect(() => {
    if (!initialCategoryId) return
    categoryRefs.current[initialCategoryId]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [initialCategoryId])

  useEffect(() => {
    savePersistedState({
      search,
      difficulty: Array.from(difficultyFilter),
      companies: Array.from(companyFilter),
      notCompletedOnly,
      expanded: Array.from(expanded),
    })
  }, [search, difficultyFilter, companyFilter, notCompletedOnly, expanded])

  const companies = getAllCompanies()
  const query = search.trim().toLowerCase()
  const filtersActive =
    query !== "" || difficultyFilter.size > 0 || companyFilter.size > 0 || notCompletedOnly

  function matchesFilters(question: (typeof QUESTION_CATEGORIES)[number]["questions"][number]): boolean {
    if (query !== "" && !question.title.toLowerCase().includes(query)) return false
    if (difficultyFilter.size > 0 && !difficultyFilter.has(question.difficulty)) return false
    if (companyFilter.size > 0 && !question.companies.some((company) => companyFilter.has(company))) return false
    if (notCompletedOnly && completedIds.has(question.id)) return false
    return true
  }

  function toggle(categoryId: string) {
    setExpanded((prev) => toggleInSet(prev, categoryId))
  }

  function toggleCompleted(questionId: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      const nowCompleted = !next.has(questionId)
      if (nowCompleted) {
        next.add(questionId)
      } else {
        next.delete(questionId)
      }
      setCompleted(questionId, nowCompleted)
      return next
    })
  }

  function clearFilters() {
    setSearch("")
    setDifficultyFilter(new Set())
    setCompanyFilter(new Set())
    setNotCompletedOnly(false)
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-lg shadow-black/5">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search exercises by title..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-2">
          <MultiSelectDropdown
            label="Difficulty"
            options={ALL_DIFFICULTIES}
            selected={difficultyFilter}
            onToggle={(level) => setDifficultyFilter((prev) => toggleInSet(prev, level))}
            renderOption={(level) => (
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: DIFFICULTY_META[level].color }} />
                {level}
              </span>
            )}
          />

          {companies.length > 0 && (
            <MultiSelectDropdown
              label="Company"
              options={companies}
              selected={companyFilter}
              onToggle={(company) => setCompanyFilter((prev) => toggleInSet(prev, company))}
            />
          )}

          <button
            type="button"
            onClick={() => setNotCompletedOnly((prev) => !prev)}
            aria-pressed={notCompletedOnly}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
              notCompletedOnly
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            Not yet completed
          </button>

          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-xs font-medium text-muted underline-offset-2 hover:text-accent hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {QUESTION_CATEGORIES.map((category, index) => {
        const visibleQuestions = filtersActive ? category.questions.filter(matchesFilters) : category.questions
        if (filtersActive && visibleQuestions.length === 0) return null

        const isOpen = expanded.has(category.id) || (filtersActive && visibleQuestions.length > 0)
        const total = category.questions.length
        const completedCount = category.questions.filter((question) => completedIds.has(question.id)).length
        const progressPercent = total === 0 ? 0 : Math.round((completedCount / total) * 100)

        return (
          <div
            key={category.id}
            ref={(el) => {
              categoryRefs.current[category.id] = el
            }}
            className="animate-fade-in-up overflow-hidden rounded-2xl border border-border bg-surface shadow-lg shadow-black/5"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <button
              onClick={() => toggle(category.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-surface-hover"
            >
              <span className="flex items-center gap-3">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`h-4 w-4 shrink-0 text-muted transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
                >
                  <path d="M7.5 5L12.5 10L7.5 15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-semibold text-foreground">{category.label}</span>
              </span>

              <span className="flex items-center gap-3">
                {filtersActive && (
                  <span className="text-xs font-medium tabular-nums text-muted">
                    {visibleQuestions.length} match{visibleQuestions.length === 1 ? "" : "es"}
                  </span>
                )}
                <span className="text-xs font-medium tabular-nums text-muted">
                  {completedCount}/{total}
                </span>
                <span className="h-1.5 w-20 overflow-hidden rounded-full bg-border sm:w-28">
                  <span
                    className="block h-full rounded-full bg-accent transition-[width] duration-150"
                    style={{ width: `${progressPercent}%` }}
                  />
                </span>
              </span>
            </button>

            {isOpen && (
              <ul className="border-t border-border">
                {visibleQuestions.map((question) => {
                  const done = completedIds.has(question.id)

                  return (
                    <li key={question.id} className="flex items-center gap-2 pl-5">
                      <button
                        type="button"
                        onClick={() => toggleCompleted(question.id)}
                        aria-pressed={done}
                        aria-label={
                          done ? `Mark ${question.title} as not completed` : `Mark ${question.title} as completed`
                        }
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
                          done
                            ? "border-accent bg-accent text-white"
                            : "border-border bg-transparent text-transparent hover:border-accent"
                        }`}
                      >
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="h-2.5 w-2.5">
                          <path d="M2 6L4.5 8.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <Link
                        href={`/practice/${question.id}`}
                        className="group flex min-w-0 flex-1 items-center justify-between gap-3 py-3 pl-1 pr-5 text-sm text-foreground/90 transition-colors duration-150 hover:bg-surface-hover hover:text-accent"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="relative flex shrink-0 items-center">
                            <span
                              aria-hidden="true"
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: DIFFICULTY_META[question.difficulty].color }}
                            />
                            <span className="sr-only">{question.difficulty}</span>
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-foreground opacity-0 shadow-md transition-opacity duration-100 group-hover:opacity-100 group-focus:opacity-100"
                            >
                              {question.difficulty}
                            </span>
                          </span>
                          <span className={`truncate ${done ? "text-muted line-through" : ""}`} title={question.title}>
                            {question.title}
                          </span>
                        </span>

                        <span className="flex shrink-0 items-center gap-3">
                          {question.companies.length > 0 && (
                            <span className="hidden text-xs text-muted sm:inline">
                              {question.companies.join(", ")}
                            </span>
                          )}
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-3.5 w-3.5 shrink-0"
                          >
                            <path d="M7.5 5L12.5 10L7.5 15" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

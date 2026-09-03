import Link from "next/link"

export default function CodeReviewCard() {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-border bg-surface p-4 shadow-lg shadow-black/5">
      <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Code Review</h2>
      <p className="mb-3 text-sm leading-relaxed text-foreground/80">
        See your rated exercises grouped by difficulty to spot what needs more practice.
      </p>
      <Link
        href="/review"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:scale-[1.02] hover:bg-accent-hover active:scale-[0.98]"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="M4 5h12M4 10h12M4 15h7" strokeLinecap="round" />
        </svg>
        Code Review
      </Link>
    </div>
  )
}

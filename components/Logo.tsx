export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M34 4C22 4 12 12 11 24C10 32 10 42 12 47C13 49 15 50 18 50L34 50C37 50 39 48 40 45L44 40L50 36L43 33L50 30L44 26C45 23 47 20 50 18L54 15C50 12 46 9 42 8C40 6 37 5 34 4Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        d="M52 20L60 13M54 30L63 30M52 40L60 47"
      />
    </svg>
  )
}

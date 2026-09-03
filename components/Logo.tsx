export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 100" fill="none" className={className} aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M35.5 23.6L19.6 47.9L35.5 71.5"
      />
      <path
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M94.2 23.6L110.2 47.9L94.2 71.5"
      />
      <g stroke="currentColor" strokeWidth="6.5" strokeLinecap="round">
        <path d="M50.1 41.9V54.7" />
        <path d="M57.4 36.4V59.3" />
        <path d="M65.1 31V65.1" />
        <path d="M72.8 36.4V59.3" />
        <path d="M80.1 41.9V54.7" />
      </g>
    </svg>
  )
}

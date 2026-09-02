export default function LoginButton() {
  return (
    <button
      aria-label="Log in"
      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-foreground transition-all duration-150 hover:scale-105 hover:bg-surface-hover active:scale-95"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
        <path
          fillRule="evenodd"
          d="M10 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm-6 8a6 6 0 1112 0 1 1 0 01-1 1H5a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
      Log In
    </button>
  )
}

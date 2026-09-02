import HeaderControls from "@/components/HeaderControls"
import ExerciseBrowser from "@/components/ExerciseBrowser"
import MonthlyHeatmap from "@/components/MonthlyHeatmap"
import Logo from "@/components/Logo"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-6 sm:gap-8">
      <header className="animate-fade-in-up px-6 pt-6 sm:px-10 sm:pt-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-6 py-4 shadow-lg shadow-black/5 sm:px-8 sm:py-5">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9 text-code-accent" />
            <h1 className="bg-gradient-to-r from-accent to-code-accent bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              CodeAloud
            </h1>
          </div>
          <HeaderControls />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 pb-6 sm:px-10 sm:pb-10 lg:flex-row lg:items-start lg:gap-10">
        <p
          className="animate-fade-in-up shrink-0 text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground [hyphens:auto] lg:max-w-[9ch] lg:text-5xl"
          style={{ animationDelay: "40ms" }}
        >
          Practice <span className="text-5xl [hyphens:manual] lg:text-6xl">explaining</span> your code{" "}
          <span className="text-5xl lg:text-6xl">out loud</span>, like a real interview
          <span className="text-accent">!</span>
        </p>

        <div className="min-w-0 flex-1" style={{ animationDelay: "80ms" }}>
          <ExerciseBrowser />
        </div>

        <div className="shrink-0 lg:w-72" style={{ animationDelay: "100ms" }}>
          <MonthlyHeatmap />
        </div>
      </div>
    </main>
  )
}

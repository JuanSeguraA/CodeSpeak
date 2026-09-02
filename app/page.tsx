import HeaderControls from "@/components/HeaderControls"
import ExerciseBrowser from "@/components/ExerciseBrowser"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="animate-fade-in-up flex items-center justify-between gap-4 border-b border-border px-6 py-4 sm:px-10">
        <h1 className="bg-gradient-to-r from-accent to-code-accent bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          CodeAloud
        </h1>
        <HeaderControls />
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 p-6 sm:p-10 md:flex-row md:items-start md:gap-14">
        <p
          className="animate-fade-in-up shrink-0 text-5xl font-extrabold leading-[1.15] tracking-tight text-foreground [hyphens:auto] md:max-w-[9ch] md:text-6xl"
          style={{ animationDelay: "40ms" }}
        >
          Practice explaining your code out loud, like a real interview
          <span className="text-accent">!</span>
        </p>

        <div className="min-w-0 flex-1" style={{ animationDelay: "80ms" }}>
          <ExerciseBrowser />
        </div>
      </div>
    </main>
  )
}

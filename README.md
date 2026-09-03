# CodeSpeak

**Practice explaining your code out loud, like a real interview.**

[![Watch the CodeSpeak demo](https://img.youtube.com/vi/w5bmd404M3c/maxresdefault.jpg)](https://youtu.be/w5bmd404M3c)

▶️ [Watch the demo on YouTube](https://youtu.be/w5bmd404M3c)

Most interview prep trains the wrong skill. You can grind two hundred problems in silence and still freeze the moment someone's watching you think because a technical interview isn't a coding test, it's a coding *conversation*. CodeSpeak is built around that gap: you talk through your approach while you write it, get graded on both, and build the muscle of thinking out loud under a little pressure, before it costs you an offer.

## What it does

**150 problems, organized the way interviews actually go.** Eighteen patterns — arrays & hashing, two pointers, sliding window, trees, graphs, dynamic programming, and more. Each tagged with a difficulty and the companies known to ask it. Search by title, filter by difficulty or company, and track completion per category as you work through them.

**Speak your reasoning, not just your code.** Hit record and explain your approach out loud while you write the solution in a full Monaco-powered editor, the same editor that runs VS Code. Your speech is transcribed live, timestamped alongside every keystroke, so what you *said* and what you *typed* are captured together.

**Feedback that grades the interview, not just the code.** Submit a session and Claude reviews the transcript for how clearly you explained your thinking, whether your explanation matched what you actually wrote, and whether you talked before you typed or after, the thing that trips people up most. You get a score and a few sentences of specific, actionable feedback, not a pass/fail.

**A memory for your practice.** A monthly heatmap tracks the days you showed up. Every exercise gets a completion checkbox, a personal difficulty rating, and a spot for your own notes, the "I blanked on this edge case" reminders future-you will actually thank you for. Rated exercises roll up into a Review view grouped hardest-first, so your weak spots surface on their own instead of hiding in a list of 150.

## Tech stack

- **[Next.js](https://nextjs.org)** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** for the in-browser code editor
- **Web Speech API** for live speech-to-text transcription
- **[Claude](https://www.anthropic.com/claude)** (via the Anthropic SDK) for grading practice sessions
- Lightweight file-based auth (bcrypt-hashed passwords, signed sessions) — no external database

## Getting started

```bash
npm install
```

Create a `.env.local` file with:

```bash
ANTHROPIC_API_KEY=your-anthropic-api-key   # powers the "Get Feedback" grading
AUTH_SECRET=any-long-random-string          # signs login sessions
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start practicing.

> **Note:** live transcription relies on the Web Speech API, which currently only ships in Chrome and Edge. Other browsers will let you code and take notes, but won't record your explanation.

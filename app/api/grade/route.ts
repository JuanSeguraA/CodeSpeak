import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { transcript } = body

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `You are grading a mock coding interview. Below is a timestamped log of a candidate's code changes and spoken explanation, interleaved by time.

Grade the candidate on:
1. How clearly they explained their thought process
2. Whether their explanation matched what they actually coded
3. Whether they explained before or after writing code (ideally before)

Give a short score (1-10) and 2-3 sentences of specific, actionable feedback.

TRANSCRIPT:
${transcript}`,
      },
    ],
  })

  const feedback = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")

  return NextResponse.json({ feedback })
}
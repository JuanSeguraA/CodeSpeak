import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { createUser, getUserByEmail, toPublicUser } from "@/lib/auth/users-store"
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const password = typeof body?.password === "string" ? body.password : ""

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 })
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
  }

  const existing = await getUserByEmail(email)
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await createUser({ name, email, passwordHash })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createSessionToken(user.id), sessionCookieOptions)

  return NextResponse.json({ user: toPublicUser(user) }, { status: 201 })
}

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { getUserByEmail, toPublicUser } from "@/lib/auth/users-store"
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const password = typeof body?.password === "string" ? body.password : ""

  if (!email || !password) {
    return NextResponse.json({ error: "Please enter your email and password." }, { status: 400 })
  }

  const user = await getUserByEmail(email)
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false

  if (!user || !valid) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createSessionToken(user.id), sessionCookieOptions)

  return NextResponse.json({ user: toPublicUser(user) })
}

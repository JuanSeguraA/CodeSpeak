import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserById, toPublicUser } from "@/lib/auth/users-store"
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const session = token ? verifySessionToken(token) : null

  if (!session) {
    return NextResponse.json({ user: null })
  }

  const user = await getUserById(session.userId)
  return NextResponse.json({ user: user ? toPublicUser(user) : null })
}

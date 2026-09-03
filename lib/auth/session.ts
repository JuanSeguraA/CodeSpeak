import crypto from "crypto"

export const SESSION_COOKIE = "codespeak_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET environment variable is not set")
  return secret
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf-8").toString("base64url")
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf-8")
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex")
}

export function createSessionToken(userId: string): string {
  const payload = base64UrlEncode(JSON.stringify({ sub: userId, exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 }))
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string): { userId: string } | null {
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return null

  const expectedSignature = sign(payload)
  const actual = Buffer.from(signature, "hex")
  const expected = Buffer.from(expectedSignature, "hex")
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    return null
  }

  try {
    const { sub, exp } = JSON.parse(base64UrlDecode(payload)) as { sub: string; exp: number }
    if (typeof sub !== "string" || typeof exp !== "number" || exp < Date.now()) return null
    return { userId: sub }
  } catch {
    return null
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
}

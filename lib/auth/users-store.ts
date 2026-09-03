import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"

const USERS_FILE = path.join(process.cwd(), "data", "users.json")

export type StoredUser = {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8")
    return JSON.parse(raw) as StoredUser[]
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return []
    throw err
  }
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true })
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8")
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const users = await readUsers()
  const normalized = normalizeEmail(email)
  return users.find((u) => u.email === normalized) ?? null
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const users = await readUsers()
  return users.find((u) => u.id === id) ?? null
}

export async function createUser(input: {
  name: string
  email: string
  passwordHash: string
}): Promise<StoredUser> {
  const users = await readUsers()
  const email = normalizeEmail(input.email)

  if (users.some((u) => u.email === email)) {
    throw new Error("EMAIL_TAKEN")
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  await writeUsers(users)
  return user
}

export function toPublicUser(user: StoredUser) {
  return { id: user.id, name: user.name, email: user.email }
}

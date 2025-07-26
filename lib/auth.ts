import 'server-only'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('admin_auth')
  
  if (!authCookie) return false
  
  try {
    // Simple validation - in production you'd want to verify a JWT or similar
    return authCookie.value === 'authenticated'
  } catch {
    return false
  }
}

export function setAuthCookie(value: string) {
  const cookieStore = cookies()
  cookieStore.set('admin_auth', value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function serverApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies()
  const access = cookieStore.get('access_token')?.value
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
  }
  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers, cache: 'no-store' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

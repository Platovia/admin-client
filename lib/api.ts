import { API_BASE_URL } from '@/lib/config'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax`
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const accessToken = getCookie('access_token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers, credentials: 'include' })

  if (res.status === 401) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      const retryHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
        Authorization: `Bearer ${getCookie('access_token')}`,
      }
      const retry = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: retryHeaders, credentials: 'include' })
      if (!retry.ok) throw new Error(await safeText(retry))
      return retry.json()
    }
  }

  if (!res.ok) throw new Error(await safeText(res))
  return res.json()
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getCookie('refresh_token')
  if (!refreshToken) return false
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
    credentials: 'include',
  })
  if (!res.ok) return false
  const data = await res.json()
  if (data?.access_token) {
    setCookie('access_token', data.access_token)
    return true
  }
  return false
}

async function safeText(res: Response) {
  try { return await res.text() } catch { return 'Request failed' }
}

export async function login(email: string, password: string) {
  // Call internal Next route to avoid CORS
  const res = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await safeText(res))
  const data = await res.json()
  const tokens = data?.tokens || data
  if (tokens?.access_token) setCookie('access_token', tokens.access_token)
  if (tokens?.refresh_token) setCookie('refresh_token', tokens.refresh_token)
  return data
}

export function logout() {
  setCookie('access_token', '', -1)
  setCookie('refresh_token', '', -1)
}

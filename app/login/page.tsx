"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { login } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      const redirect = sp.get('redirect') || '/'
      window.location.href = redirect
    } catch (err: any) {
      const msg = err?.message || 'Login failed'
      try {
        const parsed = JSON.parse(msg)
        setError(parsed.detail || msg)
      } catch {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-sm border rounded-lg p-6 bg-card">
        <h1 className="text-lg font-semibold mb-1">Admin Login</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to access the admin dashboard.</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background" placeholder="••••••••" />
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <button disabled={loading} className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

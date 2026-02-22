import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  const body = await req.text()

  // Step 1: Authenticate with backend
  const res = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
    })
  }

  const data = await res.json()
  const token = data?.tokens?.access_token || data?.access_token

  if (!token) {
    return NextResponse.json({ detail: 'Login failed: no token received' }, { status: 500 })
  }

  // Step 2: Verify the user has system_admin role by hitting an admin endpoint
  const adminCheck = await fetch(`${apiBase}/admin/health`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (adminCheck.status === 403) {
    return NextResponse.json(
      { detail: 'Access denied. Admin privileges required.' },
      { status: 403 }
    )
  }

  if (!adminCheck.ok) {
    return NextResponse.json(
      { detail: 'Unable to verify admin access.' },
      { status: 403 }
    )
  }

  // Step 3: User is a verified admin — return the login data
  return NextResponse.json(data)
}

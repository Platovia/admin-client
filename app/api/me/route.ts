import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  const access = req.cookies.get('access_token')?.value
  const res = await fetch(`${apiBase}/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    cache: 'no-store',
  })
  const text = await res.text()
  return new NextResponse(text, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' } })
}

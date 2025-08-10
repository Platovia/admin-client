import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { resource, id, action } = (await req.json()) as {
      resource: 'users' | 'companies' | 'restaurants'
      id: string
      action: 'deactivate' | 'reactivate'
    }

    if (!resource || !id || !action) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    const cookieStore = await cookies()
    const access = cookieStore.get('access_token')?.value
    // Fallback to fetching current user from API when user_id cookie is not present
    let currentUserId = cookieStore.get('user_id')?.value || ''
    if (!currentUserId && access) {
      try {
        const meRes = await fetch(`${apiBase}/auth/me`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` },
          cache: 'no-store',
        })
        if (meRes.ok) {
          const me = await meRes.json()
          currentUserId = me?.id || ''
        }
      } catch {
        // ignore
      }
    }

    // Prevent self-deactivation at the edge
    if (resource === 'users' && action === 'deactivate' && currentUserId && currentUserId === id) {
      return NextResponse.json({ error: 'You cannot deactivate your own account.' }, { status: 400 })
    }

    const res = await fetch(`${apiBase}/admin/${resource}/${id}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
      },
      cache: 'no-store',
    })

    const text = await res.text()
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Request failed' }, { status: 500 })
  }
}



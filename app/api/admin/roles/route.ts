import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value
  const body = await request.json()

  const res = await fetch(`${API_BASE_URL}/admin/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

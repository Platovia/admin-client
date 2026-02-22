import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  // Forward query params
  const searchParams = request.nextUrl.searchParams.toString()
  const queryStr = searchParams ? `?${searchParams}` : ""

  const res = await fetch(`${API_BASE_URL}/admin/analytics/${endpoint}${queryStr}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

const RESOURCE_PATHS: Record<string, string> = {
  restaurants: "restaurants",
  menus: "menus",
  companies: "companies",
}

async function getHeaders() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params
  const path = RESOURCE_PATHS[resource] || resource
  const searchParams = request.nextUrl.searchParams.toString()
  const qs = searchParams ? `?${searchParams}` : ""
  const apiUrl = `${API_BASE_URL}/admin/${path}/${id}/analytics${qs}`

  try {
    const res = await fetch(apiUrl, {
      headers: await getHeaders(),
      cache: "no-store",
    })

    const text = await res.text()
    try {
      const data = JSON.parse(text)
      return NextResponse.json(data, { status: res.status })
    } catch {
      return NextResponse.json({ error: text || "Backend error" }, { status: res.status })
    }
  } catch {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 })
  }
}

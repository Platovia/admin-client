import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

// Map resource names to backend URL paths
const RESOURCE_PATHS: Record<string, string> = {
  users: "users",
  companies: "companies",
  restaurants: "restaurants",
  menus: "menus",
  roles: "roles",
  "ocr-jobs": "ocr/jobs",
  "menu-items": "menu-items",
  "chat-sessions": "chat/sessions",
  "qr-tokens": "qr-tokens",
  sources: "sources",
  subscriptions: "subscriptions",
  "menu-versions": "menu-versions",
  embeddings: "embeddings",
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
  const url = request.nextUrl

  // Support sub-paths like /analytics
  const suffix = url.searchParams.get("_suffix") || ""
  const apiUrl = `${API_BASE_URL}/admin/${path}/${id}${suffix ? `/${suffix}` : ""}`

  const res = await fetch(apiUrl, {
    headers: await getHeaders(),
    cache: "no-store",
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params
  const path = RESOURCE_PATHS[resource] || resource
  const body = await request.json()

  const res = await fetch(`${API_BASE_URL}/admin/${path}/${id}`, {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params
  const path = RESOURCE_PATHS[resource] || resource

  const res = await fetch(`${API_BASE_URL}/admin/${path}/${id}`, {
    method: "DELETE",
    headers: await getHeaders(),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

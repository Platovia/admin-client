"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

type ResourceType = "users" | "companies" | "restaurants"

interface ToggleActiveButtonProps {
  resource: ResourceType
  id: string
  isActive: boolean
  currentUserId?: string
}

export function ToggleActiveButton({ resource, id, isActive, currentUserId }: ToggleActiveButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [submitting, setSubmitting] = useState(false)

  const onToggle = async () => {
    const action = isActive ? "deactivate" : "reactivate"
    setSubmitting(true)
    try {
      // Call internal Next.js route to avoid CORS
      await fetch(`/api/admin/toggle-active`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource, id, action }),
      })
      startTransition(() => router.refresh())
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const isSelfUser = resource === "users" && currentUserId && currentUserId === id
  const disabled = pending || submitting || !!isSelfUser

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium border transition-colors ${
        isActive
          ? "border-red-600 text-red-700 hover:bg-red-50 disabled:opacity-50"
          : "border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50"
      }`}
      aria-busy={disabled}
    >
      {isSelfUser
        ? "Deactivate"
        : isActive
          ? submitting
            ? "Deactivating..."
            : "Deactivate"
          : submitting
            ? "Reactivating..."
            : "Reactivate"}
    </button>
  )
}



"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface EditFormProps {
  resourceType: string
  resourceId: string
  children: React.ReactNode
  onSave: (formData: FormData) => Promise<Record<string, any>>
  className?: string
}

export function EditForm({ resourceType, resourceId, children, onSave, className }: EditFormProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const formData = new FormData(e.currentTarget)
      await onSave(formData)
      setEditing(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <fieldset disabled={saving} className="space-y-4">
        {children}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? <><Spinner size={14} /> Saving...</> : "Save"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </fieldset>
    </form>
  )
}

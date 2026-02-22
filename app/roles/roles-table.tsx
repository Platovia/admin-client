"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface Role {
  id: string
  name: string
  description: string | null
  user_count: number
}

interface RolesTableProps {
  roles: Role[]
}

export function RolesTable({ roles }: RolesTableProps) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      })
      setName("")
      setDescription("")
      setCreating(false)
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const columns: Column<Role>[] = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "user_count", label: "Users" },
  ]

  return (
    <div className="space-y-4">
      {creating ? (
        <div className="flex items-end gap-2 p-3 border rounded-md">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Role name" />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          </div>
          <Button size="sm" onClick={handleCreate} disabled={submitting || !name.trim()}>
            {submitting ? "Creating..." : "Create"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setCreating(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Role
        </Button>
      )}
      <DataTable
        columns={columns}
        data={roles}
        rowHref={(row) => `/roles/${row.id}`}
      />
    </div>
  )
}

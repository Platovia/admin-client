"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ResourceAnalytics } from "@/components/admin/resource-analytics"
import { Pencil, Trash2 } from "lucide-react"

interface CompanyDetailClientProps {
  company: any
}

export function CompanyDetailClient({ company }: CompanyDetailClientProps) {
  const router = useRouter()
  const [tab, setTab] = useState("info")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: company.name || "",
    description: company.description || "",
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/admin/companies/${company.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setEditing(false)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    await fetch(`/api/admin/companies/${company.id}`, { method: "DELETE" })
    router.push("/companies")
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{company.name}</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>

      {editing && (
        <div className="p-4 border rounded-md space-y-3 max-w-md">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="info">{/* Info is rendered below by server component */}</TabsContent>
        <TabsContent value="analytics">
          <ResourceAnalytics resourceType="companies" resourceId={company.id} />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Company"
        description={`Are you sure you want to permanently delete "${company.name}"? This will cascade to all associated data.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  )
}

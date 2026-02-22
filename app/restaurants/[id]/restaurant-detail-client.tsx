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

export function RestaurantDetailClient({ restaurant }: { restaurant: any }) {
  const router = useRouter()
  const [tab, setTab] = useState("info")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: restaurant.name || "",
    description: restaurant.description || "",
    currency_code: restaurant.currency_code || "",
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/admin/restaurants/${restaurant.id}`, {
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
    await fetch(`/api/admin/restaurants/${restaurant.id}`, { method: "DELETE" })
    router.push("/restaurants")
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{restaurant.name}</h2>
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
          <div className="space-y-1">
            <Label>Currency Code</Label>
            <Input value={form.currency_code} onChange={(e) => setForm({ ...form, currency_code: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="info" />
        <TabsContent value="analytics">
          <ResourceAnalytics resourceType="restaurants" resourceId={restaurant.id} />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Restaurant"
        description={`Are you sure you want to permanently delete "${restaurant.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  )
}

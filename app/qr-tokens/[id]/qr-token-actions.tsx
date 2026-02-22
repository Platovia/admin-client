"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Trash2, Ban } from "lucide-react"

export function QrTokenActions({ token }: { token: any }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDeactivate = async () => {
    await fetch(`/api/admin/qr-tokens/${token.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: false }),
    })
    router.refresh()
  }

  const handleDelete = async () => {
    await fetch(`/api/admin/qr-tokens/${token.id}`, { method: "DELETE" })
    router.push("/qr-tokens")
  }

  return (
    <div className="flex gap-2">
      {token.is_active && (
        <Button size="sm" variant="outline" onClick={handleDeactivate}>
          <Ban className="h-4 w-4 mr-1" /> Deactivate
        </Button>
      )}
      <Button size="sm" variant="destructive" onClick={() => setDeleteOpen(true)}>
        <Trash2 className="h-4 w-4 mr-1" /> Delete
      </Button>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete QR Token"
        description="Permanently delete this QR token?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}

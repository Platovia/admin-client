"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Trash2 } from "lucide-react"

export function ChatSessionActions({ sessionId }: { sessionId: string }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDelete = async () => {
    await fetch(`/api/admin/chat-sessions/${sessionId}`, { method: "DELETE" })
    router.push("/chat-sessions")
  }

  return (
    <>
      <Button size="sm" variant="destructive" onClick={() => setDeleteOpen(true)}>
        <Trash2 className="h-4 w-4 mr-1" /> Delete
      </Button>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Chat Session"
        description="Delete this chat session and all its messages? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  )
}

import { serverApi } from '@/lib/server-api'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { DetailField, DetailGrid } from '@/components/admin/detail-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime, truncateId } from '@/lib/utils'
import { ChatSessionActions } from './chat-session-actions'

async function getSession(id: string) {
  return serverApi(`/admin/chat/sessions/${id}`)
}

export default async function ChatSessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = (await getSession(id)) as any

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Chat Sessions", href: "/chat-sessions" }, { label: truncateId(session.id) }]} />

      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold">Chat Session</h2>
        <ChatSessionActions sessionId={session.id} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailField label="Session ID" value={<code className="text-xs">{session.id}</code>} />
            <DetailField label="Menu" value={
              session.menu_name ? (
                <a href={`/menus/${session.menu_id}`} className="text-primary hover:underline">{session.menu_name}</a>
              ) : session.menu_id
            } />
            <DetailField label="Messages" value={session.messages?.length || 0} />
            <DetailField label="Last Activity" value={formatDateTime(session.last_activity)} />
            <DetailField label="Started" value={formatDateTime(session.created_at)} />
          </DetailGrid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Messages ({session.messages?.length || 0})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {(session.messages || []).map((msg: any) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg text-sm ${
                  msg.message_type === "USER"
                    ? "bg-primary/10 ml-8"
                    : "bg-muted mr-8"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {msg.message_type === "USER" ? "User" : "Bot"}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(msg.created_at)}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.message_type === "USER" ? msg.message : msg.response}</p>
              </div>
            ))}
            {(!session.messages || session.messages.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No messages in this session.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

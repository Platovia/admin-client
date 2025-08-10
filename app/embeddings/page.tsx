export default function EmbeddingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Embeddings</h2>
        <p className="text-sm text-muted-foreground">View status and re-embed scopes as needed. Never delete `data_menu_embeddings`.</p>
      </div>
      <div className="border rounded-lg p-4">
        <div className="text-sm text-muted-foreground">Queue length: 0 • Last refresh: 2h ago</div>
      </div>
    </div>
  )
}

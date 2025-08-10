async function getOverview() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  const res = await fetch(`${apiBase}/admin/embeddings/overview`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load embeddings overview')
  return res.json()
}

export default async function EmbeddingsPage() {
  const data = await getOverview()
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Embeddings</h2>
        <p className="text-sm text-muted-foreground">Overview and maintenance.</p>
      </div>
      <div className="border rounded-lg p-4">
        <div className="text-sm text-muted-foreground">
          Total menus: {data?.total_menus ?? '—'} • Menus needing refresh: {data?.menus_needing_refresh ?? '—'}
        </div>
      </div>
    </div>
  )
}

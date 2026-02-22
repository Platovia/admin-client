import { serverApi } from '@/lib/server-api'

interface EmbeddingsOverview {
  total_menus: number
  menus_needing_refresh: number
}

async function getOverview(): Promise<EmbeddingsOverview | null> {
  try {
    return await serverApi('/admin/embeddings/overview') as EmbeddingsOverview
  } catch {
    return null
  }
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

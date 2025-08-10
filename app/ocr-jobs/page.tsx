async function getJobs() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  const res = await fetch(`${apiBase}/admin/ocr/jobs`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load OCR jobs')
  return res.json()
}

export default async function OcrJobsPage() {
  const data = await getJobs()
  const jobs = data?.jobs || []
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">OCR Jobs</h2>
        <p className="text-sm text-muted-foreground">Monitor and manage OCR processing jobs.</p>
      </div>
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Job ID</th>
              <th className="text-left p-3 font-medium">Menu</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Progress</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j: any) => (
              <tr key={j.id} className="border-t">
                <td className="p-3">{j.id}</td>
                <td className="p-3">{j.menu_id}</td>
                <td className="p-3 capitalize">{j.status}</td>
                <td className="p-3">{j.progress ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function OcrJobsPage() {
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
              <th className="text-left p-3 font-medium">Restaurant</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: '#101', rest: 'Resto 2', s: 'completed', d: '42s' },
              { id: '#102', rest: 'Resto 5', s: 'running', d: '—' },
              { id: '#103', rest: 'Resto 1', s: 'failed', d: '18s' },
            ].map((j, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{j.id}</td>
                <td className="p-3">{j.rest}</td>
                <td className="p-3 capitalize">{j.s}</td>
                <td className="p-3">{j.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

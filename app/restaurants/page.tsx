export default function RestaurantsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Restaurants</h2>
        <p className="text-sm text-muted-foreground">Browse and manage restaurants.</p>
      </div>
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Locale</th>
              <th className="text-left p-3 font-medium">Currency</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: 'Resto 1', l: 'en-US', c: 'USD', s: 'active' },
              { n: 'Resto 2', l: 'fr-FR', c: 'EUR', s: 'pending' },
              { n: 'Resto 3', l: 'es-ES', c: 'EUR', s: 'inactive' },
            ].map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{r.n}</td>
                <td className="p-3">{r.l}</td>
                <td className="p-3">{r.c}</td>
                <td className="p-3 capitalize">{r.s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

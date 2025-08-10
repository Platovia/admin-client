export default function MenusPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Menus</h2>
        <p className="text-sm text-muted-foreground">Moderate menus and items.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="font-medium">Menu #{i}</div>
            <div className="text-sm text-muted-foreground">42 items • 3 images</div>
          </div>
        ))}
      </div>
    </div>
  )
}

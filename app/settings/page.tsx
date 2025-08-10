export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Feature flags and configuration.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-4">
          <div className="font-medium">Theme</div>
          <div className="text-sm text-muted-foreground">Light / Dark</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="font-medium">Image Sources</div>
          <div className="text-sm text-muted-foreground">Manage API keys (hidden)</div>
        </div>
      </div>
    </div>
  )
}

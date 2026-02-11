import { useState } from 'react'

const INTERVAL_OPTIONS = [
  { value: 60 * 60 * 1000, label: 'Every hour' },
  { value: 6 * 60 * 60 * 1000, label: 'Every 6 hours' },
  { value: 24 * 60 * 60 * 1000, label: 'Every 24 hours' },
  { value: 0, label: 'Manual only' },
]

export default function SyncSettings({
  autoSyncEnabled,
  syncInterval,
  onToggleAutoSync,
  onChangeInterval,
}) {
  const [showStorageInfo, setShowStorageInfo] = useState(false)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border p-4 bg-background">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-foreground">Auto Backup</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSyncEnabled}
              onChange={(e) => onToggleAutoSync(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-background-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background-elevated after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background-elevated after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>
        
        <p className="text-sm text-foreground-muted mb-3">
          Automatically back up your data to the cloud on a schedule.
        </p>

        {autoSyncEnabled && (
          <div className="mt-3">
            <label className="block text-sm text-foreground-muted mb-2">Backup interval:</label>
            <select
              value={syncInterval}
              onChange={(e) => onChangeInterval(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {INTERVAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border p-4 bg-background">
        <h3 className="font-medium text-foreground mb-2">Storage Usage</h3>
        <button
          onClick={() => setShowStorageInfo(!showStorageInfo)}
          className="text-sm text-primary hover:underline"
        >
          {showStorageInfo ? 'Hide storage info' : 'Show storage info'}
        </button>
        
        {showStorageInfo && (
          <div className="mt-3 text-sm text-foreground-muted space-y-2">
            <p>Free tier includes 500MB storage per user.</p>
            <p>Old data is automatically cleaned up:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Audit logs: 90 days retention</li>
              <li>Restore points: Last 10 manual + 30 days auto</li>
              <li>Conflicts: Resolved conflicts deleted immediately</li>
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border p-4 bg-background">
        <h3 className="font-medium text-foreground mb-2">Backup Behavior</h3>
        <ul className="text-sm text-foreground-muted space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Stores the latest device snapshot in the cloud</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Manual or scheduled backups (when enabled)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>No automatic merge across devices</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Data encrypted in transit and at rest</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

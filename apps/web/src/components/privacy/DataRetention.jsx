import { useState } from 'react'

const RETENTION_OPTIONS = [
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
  { value: 180, label: '6 months' },
  { value: 365, label: '1 year' },
]

export default function DataRetention({
  retentionDays,
  autoBackup,
  onUpdate,
}) {
  const [days, setDays] = useState(retentionDays)
  const [auto, setAuto] = useState(autoBackup)

  const handleDaysChange = (e) => {
    const newDays = parseInt(e.target.value, 10)
    setDays(newDays)
    onUpdate?.({ dataRetentionDays: newDays, autoBackup: auto })
  }

  const handleAutoChange = (e) => {
    const newAuto = e.target.checked
    setAuto(newAuto)
    onUpdate?.({ dataRetentionDays: days, autoBackup: newAuto })
  }

  return (
    <div className="rounded-lg border border-border p-4 bg-background">
      <h3 className="font-medium text-foreground mb-3">Data Retention</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-foreground-muted mb-2">
            Keep audit logs and history for:
          </label>
          <select
            value={days}
            onChange={handleDaysChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {RETENTION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-foreground-subtle mt-1">
            Older audit logs and restore points will be automatically deleted.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="autoBackup"
            checked={auto}
            onChange={handleAutoChange}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <label htmlFor="autoBackup" className="text-sm text-foreground cursor-pointer">
            Enable automatic daily backup
          </label>
        </div>
      </div>
    </div>
  )
}

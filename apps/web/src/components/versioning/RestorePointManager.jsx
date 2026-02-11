import { useCallback, useMemo, useState } from 'react'
import { RestorePointsSkeleton } from '../skeletons/index.js'

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getTypeIcon = (type) => {
  switch (type) {
    case 'manual':
      return '👤'
    case 'auto':
      return '⚡'
    case 'scheduled':
      return '📅'
    default:
      return '💾'
  }
}

const getTypeLabel = (type) => {
  const labels = {
    manual: 'Manual',
    auto: 'Auto (before operation)',
    scheduled: 'Scheduled',
  }
  return labels[type] || type
}

export default function RestorePointManager({
  restorePoints,
  isLoading,
  onCreate,
  onRestore,
  onDelete,
}) {
  const [showCreate, setShowCreate] = useState(false)
  const [newPointName, setNewPointName] = useState('')
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const sortedPoints = useMemo(() => {
    if (!restorePoints) return []
    return [...restorePoints].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [restorePoints])

  const handleCreate = useCallback(async () => {
    if (!newPointName.trim()) return
    await onCreate(newPointName.trim())
    setNewPointName('')
    setShowCreate(false)
  }, [newPointName, onCreate])

  const handleRestore = useCallback(async () => {
    if (!selectedPoint) return
    const confirmed = window.confirm(
      `Are you sure you want to restore to "${selectedPoint.name}"?\n\n` +
      `This will replace your current data with the snapshot from ${formatDate(selectedPoint.created_at)}.\n\n` +
      'This action cannot be undone.'
    )
    if (!confirmed) return

    setIsRestoring(true)
    await onRestore(selectedPoint)
    setIsRestoring(false)
    setSelectedPoint(null)
  }, [selectedPoint, onRestore])

  const handleDelete = useCallback(async (point) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${point.name}"?\n\n` +
      'This snapshot will be permanently removed.'
    )
    if (!confirmed) return

    await onDelete(point.id)
    if (selectedPoint?.id === point.id) {
      setSelectedPoint(null)
    }
  }, [selectedPoint, onDelete])

  if (isLoading) {
    return <RestorePointsSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          {sortedPoints.length} snapshot{sortedPoints.length !== 1 ? 's' : ''} available
        </p>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-hover transition-colors"
        >
          Save Snapshot
        </button>
      </div>

      {showCreate && (
        <div className="rounded-lg border border-border p-3 bg-background-elevated space-y-3">
          <input
            type="text"
            value={newPointName}
            onChange={(e) => setNewPointName(e.target.value)}
            placeholder="Snapshot name (e.g., Before bulk import)"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={!newPointName.trim()}
              className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreate(false)
                setNewPointName('')
              }}
              className="flex-1 px-3 py-2 border border-border text-foreground text-sm rounded-lg hover:bg-background-muted/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedPoint && (
        <div id={`restore-point-panel-${selectedPoint.id}`} className="rounded-lg border border-primary/30 p-3 bg-primary/10 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">{selectedPoint.name}</p>
            <button
              type="button"
              onClick={() => setSelectedPoint(null)}
              className="text-foreground-muted hover:text-foreground"
              aria-label="Close restore point details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-foreground-muted space-y-1">
            <p>Created: {formatDate(selectedPoint.created_at)}</p>
            <p>Type: {getTypeLabel(selectedPoint.snapshot_type)}</p>
            <p>Size: {formatBytes(selectedPoint.size_bytes || 0)}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRestore}
              disabled={isRestoring}
              className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {isRestoring ? 'Restoring...' : 'Restore to This Point'}
            </button>
            <button
              type="button"
              onClick={() => handleDelete(selectedPoint)}
              disabled={isRestoring}
              className="px-3 py-2 border border-error text-error text-sm rounded-lg hover:bg-error-background transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sortedPoints.length === 0 ? (
          <p className="text-sm text-foreground-muted italic">No snapshots yet. Create one to get started.</p>
        ) : (
          sortedPoints.map((point) => (
            <button
              type="button"
              key={point.id}
              onClick={() => setSelectedPoint(selectedPoint?.id === point.id ? null : point)}
              className={`w-full text-left p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                selectedPoint?.id === point.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background-elevated hover:bg-background-muted/40'
              }`}
              aria-expanded={selectedPoint?.id === point.id}
              aria-controls={`restore-point-panel-${point.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{getTypeIcon(point.snapshot_type)}</span>
                  <span className="font-medium text-foreground text-sm">{point.name}</span>
                </div>
                <span className="text-xs text-foreground-subtle">{formatBytes(point.size_bytes || 0)}</span>
              </div>
              <p className="text-xs text-foreground-subtle mt-1">{formatDate(point.created_at)}</p>
            </button>
          ))
        )}
      </div>

      <div className="text-xs text-foreground-subtle">
        <p>Retention: Last 10 manual + 30 days of auto snapshots</p>
      </div>
    </div>
  )
}

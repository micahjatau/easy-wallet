import { useState } from 'react'

const CONFLICT_KINDS = {
  REMOTE: 'remote_conflict',
  LOCAL_VERSION: 'local_version_conflict',
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ConflictResolver({ conflicts, onResolve, isResolving }) {
  const [selectedConflict, setSelectedConflict] = useState(null)
  const [resolution, setResolution] = useState(null)

  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="rounded-lg border border-border p-4 bg-background">
        <p className="text-sm text-foreground-muted">No conflicts to resolve.</p>
      </div>
    )
  }

  const handleResolve = async () => {
    if (!selectedConflict || !resolution) return
    await onResolve(selectedConflict.id, resolution)
    setSelectedConflict(null)
    setResolution(null)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-error/30 p-4 bg-error-background">
        <h3 className="font-medium text-error mb-2">
          {conflicts.length} Conflict{conflicts.length !== 1 ? 's' : ''} Detected
        </h3>
        <p className="text-sm text-foreground-muted">
          Data conflicts were found between your local device and the cloud. 
          Please review and choose which version to keep.
        </p>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {conflicts.map((conflict) => {
          const isRemote = conflict.kind === CONFLICT_KINDS.REMOTE
          const title = isRemote && conflict.entity_type && conflict.entity_id
            ? `${conflict.entity_type}: ${conflict.entity_id}`
            : isRemote
              ? 'Remote Conflict'
              : 'Version Mismatch'

          return (
            <button
              type="button"
              key={conflict.id}
              onClick={() => {
                setSelectedConflict(selectedConflict?.id === conflict.id ? null : conflict)
                setResolution(null)
              }}
              className={`w-full text-left p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-error/30 ${
                selectedConflict?.id === conflict.id
                  ? 'border-error bg-error-background'
                  : 'border-border bg-background-elevated hover:bg-background-muted/40'
              }`}
              aria-expanded={selectedConflict?.id === conflict.id}
              aria-controls={`conflict-panel-${conflict.id}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {title}
                  </p>
                  <p className="text-xs text-foreground-subtle">
                    Detected: {formatDate(conflict.detected_at || conflict.detectedAt)}
                  </p>
                  {!isRemote && (
                    <p className="text-xs text-warning">
                      Local v{conflict.local_version ?? conflict.localVersion ?? '?'} vs Remote v{conflict.remote_version ?? conflict.remoteVersion ?? '?'}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  isRemote
                    ? 'bg-error/20 text-error'
                    : 'bg-warning/20 text-warning'
                }`}>
                  {isRemote ? 'Remote Conflict' : 'Version Mismatch'}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {selectedConflict && (
        <div id={`conflict-panel-${selectedConflict.id}`} className="rounded-lg border border-error/30 p-4 bg-error-background space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Review Conflict</h4>
            <button
              type="button"
              onClick={() => {
                setSelectedConflict(null)
                setResolution(null)
              }}
              className="text-foreground-muted hover:text-foreground"
              aria-label="Close conflict details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-3 bg-background-elevated">
              <p className="text-xs font-medium text-foreground-muted mb-2">Local (This Device)</p>
              <p className="text-xs text-foreground-subtle mb-2">
                Modified: {formatDate(selectedConflict.local_updated_at || selectedConflict.localUpdatedAt)}
              </p>
              {selectedConflict.local_data || selectedConflict.localData ? (
                <pre className="text-xs text-foreground bg-background-muted/40 p-2 rounded overflow-x-auto max-h-32">
                  {JSON.stringify(selectedConflict.local_data || selectedConflict.localData, null, 2)}
                </pre>
              ) : (
                <p className="text-xs text-foreground-muted italic">
                  Local data unavailable
                </p>
              )}
            </div>

            <div className="rounded-lg border border-primary/30 p-3 bg-primary/10">
              <p className="text-xs font-medium text-primary mb-2">Remote (Cloud)</p>
              <p className="text-xs text-foreground-subtle mb-2">
                Modified: {formatDate(selectedConflict.remote_updated_at || selectedConflict.remoteUpdatedAt)}
              </p>
              {selectedConflict.remote_data || selectedConflict.remoteData ? (
                <pre className="text-xs text-foreground bg-primary/15 p-2 rounded overflow-x-auto max-h-32">
                  {JSON.stringify(selectedConflict.remote_data || selectedConflict.remoteData, null, 2)}
                </pre>
              ) : (
                <p className="text-xs text-foreground-muted italic">
                  Remote data unavailable
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Choose which version to keep:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setResolution('local')}
                className={`p-3 rounded-lg border text-sm transition-colors ${
                  resolution === 'local'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background-elevated hover:bg-background-muted/40'
                }`}
              >
                <p className="font-medium">Keep Local</p>
                <p className="text-xs opacity-80 mt-1">Use this device&apos;s version</p>
              </button>
              
              <button
                type="button"
                onClick={() => setResolution('remote')}
                className={`p-3 rounded-lg border text-sm transition-colors ${
                  resolution === 'remote'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background-elevated hover:bg-background-muted/40'
                }`}
              >
                <p className="font-medium">Keep Remote</p>
                <p className="text-xs opacity-80 mt-1">Use the cloud version</p>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResolve}
            disabled={!resolution || isResolving}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {isResolving ? 'Resolving...' : 'Resolve Conflict'}
          </button>
        </div>
      )}
    </div>
  )
}

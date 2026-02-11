import { useState } from 'react'

const formatDate = (timestamp) => {
  if (!timestamp) return 'Never'
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SyncStatus({
  syncState,
  lastSyncAt,
  pendingChanges,
  conflicts,
  hasConflicts,
  isOnline,
  onManualSync,
  isSyncing,
}) {
  const [showDetails, setShowDetails] = useState(false)

  const getStatusIcon = () => {
    if (isSyncing || syncState === 'syncing') {
      return (
        <svg className="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )
    }
    if (hasConflicts) {
      return (
        <svg className="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
    if (!isOnline) {
      return (
        <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-6.364 2.829a9 9 0 010-12.728m0 0l2.829 2.829M3 3l18 18" />
        </svg>
      )
    }
    if (pendingChanges > 0) {
      return (
        <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return (
      <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }

  const getStatusText = () => {
    if (isSyncing || syncState === 'syncing') return 'Backing up...'
    if (hasConflicts) return `${conflicts.length} conflict${conflicts.length !== 1 ? 's' : ''}`
    if (!isOnline) return 'Offline'
    if (pendingChanges > 0) return `${pendingChanges} pending`
    return 'Backed up'
  }

  const getStatusColor = () => {
    if (hasConflicts) return 'bg-error-background text-error border-error/30'
    if (!isOnline) return 'bg-background-muted/60 text-foreground-muted border-border'
    if (pendingChanges > 0) return 'bg-warning-background text-warning border-warning/30'
    return 'bg-success-background text-success border-success/30'
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${getStatusColor()}`}
        aria-expanded={showDetails}
        aria-controls="backup-status-panel"
      >
        {getStatusIcon()}
        <span className="hidden sm:inline">{getStatusText()}</span>
        {hasConflicts && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-error text-primary-foreground text-xs font-bold">
            {conflicts.length}
          </span>
        )}
      </button>

      {showDetails && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDetails(false)} />
          <div id="backup-status-panel" className="absolute right-0 mt-2 w-64 rounded-xl bg-background-elevated shadow-lg border border-border z-50 p-4">
            <h4 className="font-medium text-foreground mb-3">Backup Status</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-subtle">Status:</span>
                <span className={hasConflicts ? 'text-error' : pendingChanges > 0 ? 'text-warning' : 'text-success'}>
                  {getStatusText()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-foreground-subtle">Last backup:</span>
                <span className="text-foreground">{formatDate(lastSyncAt)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-foreground-subtle">Connection:</span>
                <span className={isOnline ? 'text-success' : 'text-foreground-muted'}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {pendingChanges > 0 && (
                <div className="flex justify-between">
                  <span className="text-foreground-subtle">Pending:</span>
                  <span className="text-warning">{pendingChanges} changes</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                onManualSync()
                setShowDetails(false)
              }}
              disabled={isSyncing || !isOnline}
              className="w-full mt-4 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {isSyncing ? 'Backing up...' : 'Back Up Now'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

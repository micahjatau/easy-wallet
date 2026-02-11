import { useState } from 'react'
import { AuditSkeleton } from '../skeletons/index.js'

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

export default function VersionHistory({
  transaction,
  auditLogs,
  isLoading,
  onRestoreVersion,
}) {
  const [selectedVersion, setSelectedVersion] = useState(null)

  if (!transaction) {
    return (
      <div className="rounded-lg border border-border p-4 bg-background">
        <p className="text-sm text-foreground-muted">Select a transaction to view its history.</p>
      </div>
    )
  }

  if (isLoading) {
    return <AuditSkeleton />
  }

  const relevantLogs = auditLogs?.filter(
    (log) => log.transaction_id === transaction.id
  ) || []

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border p-3 bg-background">
        <h4 className="font-medium text-foreground mb-2">Current Transaction</h4>
        <div className="text-sm space-y-1">
          <p><span className="text-foreground-muted">Name:</span> {transaction.name}</p>
          <p><span className="text-foreground-muted">Amount:</span> {transaction.amount} {transaction.currency}</p>
          <p><span className="text-foreground-muted">Category:</span> {transaction.category}</p>
          <p><span className="text-foreground-muted">Date:</span> {transaction.date}</p>
          <p><span className="text-foreground-muted">Type:</span> {transaction.type}</p>
        </div>
      </div>

      {relevantLogs.length === 0 ? (
        <p className="text-sm text-foreground-muted italic">No history available for this transaction.</p>
      ) : (
        <div className="space-y-2">
          <h4 className="font-medium text-foreground text-sm">Version History</h4>
          {relevantLogs.map((log, index) => (
            <div
              key={log.id}
              className="rounded-lg border border-border p-3 bg-background-elevated cursor-pointer hover:bg-background-muted/40 transition-colors"
              onClick={() => setSelectedVersion(selectedVersion === log.id ? null : log.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-background-muted/60 text-foreground">
                    Version {relevantLogs.length - index}
                  </span>
                  <span className="text-xs text-foreground-subtle">{formatDate(log.changed_at)}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-foreground-muted transition-transform ${
                    selectedVersion === log.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {selectedVersion === log.id && (
                <div className="mt-3 pt-3 border-t border-border space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      log.action === 'create' ? 'bg-success-background text-success' :
                      log.action === 'update' ? 'bg-primary/15 text-primary' :
                      log.action === 'delete' ? 'bg-error-background text-error' :
                      'bg-warning-background text-warning'
                    }`}>
                      {log.action.toUpperCase()}
                    </span>
                    {log.changed_by && (
                      <span className="text-xs text-foreground-subtle">by {log.changed_by}</span>
                    )}
                  </div>

                  {log.previous_state && (
                    <div>
                      <p className="text-xs font-medium text-foreground-muted mb-1">Previous:</p>
                      <pre className="text-xs text-foreground bg-background-muted/40 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.previous_state, null, 2)}
                      </pre>
                    </div>
                  )}

                  {log.new_state && (
                    <div>
                      <p className="text-xs font-medium text-foreground-muted mb-1">After:</p>
                      <pre className="text-xs text-foreground bg-primary/10 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.new_state, null, 2)}
                      </pre>
                    </div>
                  )}

                  {log.previous_state && log.action !== 'delete' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRestoreVersion?.(log.previous_state)
                      }}
                      className="w-full px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      Restore to This Version
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

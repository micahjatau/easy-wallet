import { useMemo, useState } from 'react'
import { AuditSkeleton } from '../skeletons/index.js'

const FILTER_OPTIONS = [
  { value: 'none', label: 'Select filter' },
  { value: 'delete', label: 'Delete' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'restore', label: 'Restore' },
  { value: 'all', label: 'All' },
]

const INITIAL_VISIBLE_COUNT = 15
const VISIBLE_INCREMENT = 15

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

const getActionLabel = (action) => {
  const labels = {
    create: 'Created',
    update: 'Updated',
    delete: 'Deleted',
    restore: 'Restored',
  }
  return labels[action] || action
}

const getActionColor = (action) => {
  const colors = {
    create: 'text-success',
    update: 'text-primary',
    delete: 'text-error',
    restore: 'text-warning',
  }
  return colors[action] || 'text-foreground'
}

export default function AuditLog({ logs, isLoading }) {
  const [selectedLog, setSelectedLog] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  if (isLoading) {
    return <AuditSkeleton />
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-lg border border-border p-4 bg-background">
        <p className="text-sm text-foreground-muted">No audit history available.</p>
      </div>
    )
  }

  const filteredLogs = useMemo(() => {
    if (selectedFilter === 'none') return []
    if (selectedFilter === 'all') return logs
    return logs.filter((log) => log.action === selectedFilter)
  }, [logs, selectedFilter])

  const visibleLogs = filteredLogs.slice(0, visibleCount)
  const hasMoreLogs = filteredLogs.length > visibleCount

  const handleFilterChange = (nextFilter) => {
    setSelectedFilter(nextFilter)
    setSelectedLog(null)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleFilterChange(option.value)}
            aria-pressed={selectedFilter === option.value}
            className={`px-2.5 py-1 text-xs rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              selectedFilter === option.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-foreground-muted hover:bg-background-muted/40'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {selectedFilter === 'none' ? (
        <div className="rounded-lg border border-dashed border-border p-4 bg-background-muted/20">
          <p className="text-sm text-foreground-muted">Select a filter to view audit logs.</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="rounded-lg border border-border p-4 bg-background">
          <p className="text-sm text-foreground-muted">No {getActionLabel(selectedFilter).toLowerCase()} entries available.</p>
        </div>
      ) : (
        <>
          {visibleLogs.map((log, index) => {
            const rowId = log.id || `${log.transaction_id || 'txn'}-${log.changed_at || index}-${index}`
            return (
              <div
                key={rowId}
                className="rounded-lg border border-border p-3 bg-background-elevated transition-colors"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-left hover:bg-background-muted/40 rounded-md p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onClick={() => setSelectedLog(selectedLog === rowId ? null : rowId)}
                  aria-expanded={selectedLog === rowId}
                  aria-controls={`audit-log-panel-${rowId}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                    <span className="text-xs text-foreground-subtle">
                      {formatDate(log.changed_at)}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-foreground-muted transition-transform ${
                      selectedLog === rowId ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {selectedLog === rowId && (
                  <div id={`audit-log-panel-${rowId}`} className="mt-3 pt-3 border-t border-border space-y-3">
                    <div>
                      <p className="text-xs font-medium text-foreground-muted mb-1">Transaction ID:</p>
                      <p className="text-xs text-foreground font-mono">{log.transaction_id}</p>
                    </div>

                    {log.previous_state && (
                      <div>
                        <p className="text-xs font-medium text-foreground-muted mb-1">Previous State:</p>
                        <pre className="text-xs text-foreground bg-background-muted/40 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.previous_state, null, 2)}
                        </pre>
                      </div>
                    )}

                    {log.new_state && (
                      <div>
                        <p className="text-xs font-medium text-foreground-muted mb-1">New State:</p>
                        <pre className="text-xs text-foreground bg-primary/10 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.new_state, null, 2)}
                        </pre>
                      </div>
                    )}

                    {log.changed_by && (
                      <div>
                        <p className="text-xs font-medium text-foreground-muted mb-1">Changed By:</p>
                        <p className="text-xs text-foreground">{log.changed_by}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {(hasMoreLogs || visibleCount > INITIAL_VISIBLE_COUNT) && (
            <div className="flex items-center gap-2">
              {hasMoreLogs && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + VISIBLE_INCREMENT)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-border text-foreground hover:bg-background-muted/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Show more
                </button>
              )}
              {visibleCount > INITIAL_VISIBLE_COUNT && (
                <button
                  type="button"
                  onClick={() => setVisibleCount(INITIAL_VISIBLE_COUNT)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-border text-foreground hover:bg-background-muted/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

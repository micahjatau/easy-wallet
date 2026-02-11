import { useMemo } from 'react'
import DataExport from './DataExport.jsx'
import DataRetention from './DataRetention.jsx'

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export default function PrivacySettings({
  state,
  onExport,
  onUpdateRetention,
  onClearData,
  onClearOldData,
}) {
  const storageUsage = useMemo(() => {
    const localData = JSON.stringify({
      transactions: state.transactions,
      accounts: state.accounts,
      settings: state.settings,
    })
    return {
      localBytes: new Blob([localData]).size,
      totalTransactions: state.transactions?.length || 0,
    }
  }, [state.transactions, state.accounts, state.settings])

  const handleClearData = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all data? This will remove all transactions, accounts, and settings.\n\n' +
      'Tip: Export your data first if you want to keep a backup.',
    )
    if (confirmed) {
      onClearData()
    }
  }

  const handleClearOldData = async () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const oldCount = state.transactions?.filter(t => new Date(t.date) < thirtyDaysAgo && !t.isDeleted).length || 0

    if (oldCount === 0) {
      window.alert('No transactions older than 30 days to clear.')
      return
    }

    const confirmed = window.confirm(
      `This will permanently delete ${oldCount} transaction${oldCount !== 1 ? 's' : ''} older than 30 days.\n\n` +
      'Recent transactions and all accounts will be kept.\n\n' +
      'Tip: Export your data first if you want to keep a backup.',
    )
    if (confirmed && onClearOldData) {
      onClearOldData(30)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border p-4 bg-background">
        <h3 className="font-medium text-foreground mb-3">Storage Usage</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-foreground-muted">Local Storage:</span>
            <span className="ml-2 font-medium text-primary">
              {formatBytes(storageUsage.localBytes)}
            </span>
          </div>
          <div>
            <span className="text-foreground-muted">Transactions:</span>
            <span className="ml-2 font-medium text-primary">
              {storageUsage.totalTransactions}
            </span>
          </div>
        </div>
      </div>

      <DataExport
        state={state}
        lastExportAt={state.settings?.privacy?.lastExportAt}
        onExport={onExport}
      />

      <DataRetention
        retentionDays={state.settings?.privacy?.dataRetentionDays || 90}
        autoBackup={state.settings?.privacy?.autoBackup !== false}
        onUpdate={onUpdateRetention}
      />

      <div className="rounded-lg border border-warning/30 p-4 bg-warning-background">
        <h3 className="font-medium text-warning mb-2">Clear Old Data</h3>
        <p className="text-sm text-foreground-muted mb-3">
          Remove transactions older than 30 days to free up storage space. Recent data will be kept.
        </p>
        <button
          onClick={handleClearOldData}
          className="w-full px-4 py-2 bg-warning text-primary-foreground rounded-lg hover:bg-warning/90 transition-colors text-sm"
        >
          Clear Old Transactions
        </button>
      </div>

      <div className="rounded-lg border border-error/30 p-4 bg-error-background">
        <h3 className="font-medium text-error mb-2">Danger Zone</h3>
        <p className="text-sm text-foreground-muted mb-3">
          Clear all data from this device. This action cannot be undone.
        </p>
        <button
          onClick={handleClearData}
          className="w-full px-4 py-2 bg-error text-primary-foreground rounded-lg hover:bg-error/90 transition-colors text-sm"
        >
          Clear All Data
        </button>
      </div>
    </div>
  )
}

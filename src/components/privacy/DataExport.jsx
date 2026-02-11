import { useState } from 'react'
import { formatLocalYmd } from '../../lib/appUtils.js'

export default function DataExport({ state, lastExportAt, onExport }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          appVersion: '2.1.0',
          schemaVersion: '2.0',
          exportFormat: 'json',
        },
        state: {
          transactions: state.transactions,
          accounts: state.accounts,
          settings: state.settings,
        },
        data: {
          transactions: state.transactions,
          accounts: state.accounts,
          settings: state.settings,
        },
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `easy-wallet-export-${formatLocalYmd(new Date())}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      onExport?.(Date.now())
    } catch {
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never'
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="rounded-lg border border-border p-4 bg-background">
      <h3 className="font-medium text-foreground mb-2">Data Export</h3>
      <p className="text-sm text-foreground-muted mb-3">
        Download all your data in JSON format. This includes transactions, accounts, and settings.
      </p>

      {lastExportAt && (
        <p className="text-xs text-foreground-subtle mb-3">
          Last export: {formatDate(lastExportAt)}
        </p>
      )}

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors text-sm disabled:opacity-50"
        >
        {isExporting ? 'Exporting...' : 'Export All Data (JSON)'}
      </button>
    </div>
  )
}

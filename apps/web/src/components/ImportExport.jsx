import { formatTimestamp } from '../lib/formatters.js'

const ImportExport = ({
  includeDeletedExport,
  onToggleIncludeDeleted,
  onExportJson,
  onExportCsv,
  onImportJson,
  importPreview,
  onApplyImport,
  onCancelImport,
  importError,
  variant = 'desktop',
  className = '',
}) => (
  <div
    className={`rounded-3xl border border-border bg-background-elevated/90 p-6 shadow-soft dark:shadow-black/40 ${
      variant === 'desktop' ? 'md:p-7' : ''
    } ${className}`.trim()}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
          Data tools
        </p>
        <h3 className="mt-2 font-display text-xl text-foreground">Export & Import</h3>
      </div>
    </div>

    <div className="mt-5 grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onExportJson}
          className="rounded-full border border-border bg-background px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted transition hover:text-foreground"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={onExportCsv}
          className="rounded-full border border-border bg-background px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted transition hover:text-foreground"
        >
          Export CSV
        </button>
      </div>
      <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
        <input
          type="checkbox"
          checked={includeDeletedExport}
          onChange={(event) => onToggleIncludeDeleted(event.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
        />
        Include deleted in CSV
      </label>
      <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
        Import JSON (replaces current data)
        <input
          type="file"
          accept="application/json"
          onChange={onImportJson}
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs text-foreground-muted"
        />
      </label>
      {importPreview ? (
        <div className="rounded-2xl border border-border bg-background-muted/40 p-4 text-xs text-foreground-muted">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
            Import preview
          </p>
          <div className="mt-3 space-y-1">
            <p>
              {importPreview.summary.transactionsCount} transactions ·{' '}
              {importPreview.summary.accountsCount} accounts
            </p>
            <p>Base currency: {importPreview.summary.baseCurrency}</p>
            {importPreview.exportedAt ? (
              <p>Exported: {formatTimestamp(importPreview.exportedAt)}</p>
            ) : null}
            {importPreview.appName ? (
              <p>
                Source: {importPreview.appName}
                {importPreview.appSlug ? ` (${importPreview.appSlug})` : ''}
              </p>
            ) : null}
            <p>Schema version: {importPreview.schemaVersion}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onApplyImport}
              className="rounded-full bg-primary px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Apply import
            </button>
            <button
              type="button"
              onClick={onCancelImport}
              className="rounded-full border border-border bg-background px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {importError ? <p className="text-xs text-error">{importError}</p> : null}
    </div>
  </div>
)

export default ImportExport

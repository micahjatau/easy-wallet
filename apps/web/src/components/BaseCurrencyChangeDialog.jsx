import { useRef, useState } from 'react'
import { useDialogA11y } from '../hooks/useDialogA11y.js'

export default function BaseCurrencyChangeDialog({
  isOpen,
  currentCurrency,
  newCurrency,
  onConfirm,
  onCancel,
  affectedTransactionsCount,
}) {
  const [keepHistorical, setKeepHistorical] = useState(true)
  const confirmButtonRef = useRef(null)

  useDialogA11y({
    isOpen,
    onEscape: onCancel,
    initialFocusRef: confirmButtonRef,
  })

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="base-currency-dialog-title"
        className="w-full max-w-md rounded-2xl border border-border bg-background-elevated p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="base-currency-dialog-title" className="font-display text-xl text-foreground">
          Change Base Currency?
        </h3>
        
        <div className="mt-4 space-y-4">
          <p className="text-sm text-foreground-muted">
            You&apos;re changing the base currency from <strong>{currentCurrency}</strong> to{' '}
            <strong>{newCurrency}</strong>.
          </p>

          {affectedTransactionsCount > 0 && (
            <div className="rounded-lg border border-warning/30 bg-warning-background p-3">
              <p className="text-sm text-warning">
                {affectedTransactionsCount} transaction{affectedTransactionsCount !== 1 ? 's' : ''} will be affected.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="rateHandling"
                checked={keepHistorical}
                onChange={() => setKeepHistorical(true)}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Keep historical rates
                </p>
                <p className="text-xs text-foreground-muted">
                  Transactions keep their original exchange rates as of when they were recorded
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="rateHandling"
                checked={!keepHistorical}
                onChange={() => setKeepHistorical(false)}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Use current rates
                </p>
                <p className="text-xs text-foreground-muted">
                  Recalculate all transactions using current exchange rates
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-border bg-background-elevated px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground-muted transition hover:bg-background-muted/40"
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={() => onConfirm(keepHistorical)}
            className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary-hover"
          >
            Confirm Change
          </button>
        </div>
      </div>
    </div>
  )
}

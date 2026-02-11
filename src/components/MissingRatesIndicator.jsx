import { useMemo } from 'react'

export default function MissingRatesIndicator({ 
  transactions, 
  settings, 
  onHighlightMissing,
  className = '' 
}) {
  const missingRatesInfo = useMemo(() => {
    if (!transactions || transactions.length === 0) return null
    
    const missing = []
    const currencies = new Set()
    
    transactions.forEach(transaction => {
      if (transaction.currency !== settings.baseCurrency) {
        const rate = settings.rates?.[transaction.currency]
        if (!rate) {
          missing.push(transaction)
          currencies.add(transaction.currency)
        }
      }
    })
    
    return {
      count: missing.length,
      currencies: Array.from(currencies),
      transactions: missing,
    }
  }, [transactions, settings.baseCurrency, settings.rates])

  if (!missingRatesInfo || missingRatesInfo.count === 0) return null

  return (
    <div className={`rounded-lg border border-warning/30 bg-warning-background p-3 ${className}`}>
      <div className="flex items-start gap-3">
        <svg className="mt-0.5 h-5 w-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-warning">
            {missingRatesInfo.count} transaction{missingRatesInfo.count !== 1 ? 's' : ''} missing exchange rates
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            Currencies: {missingRatesInfo.currencies.join(', ')}
          </p>
          {onHighlightMissing && (
            <button
              onClick={() => onHighlightMissing(missingRatesInfo.transactions)}
              className="mt-2 text-xs font-medium text-warning hover:text-warning/80 underline"
            >
              Show affected transactions
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

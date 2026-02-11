const RatesTable = ({
  variant = 'desktop',
  settings,
  onRateChange,
  onRemoveCurrency,
  className = '',
}) => {
  const isMobile = variant === 'mobile'

  const baseClassName = 'mt-5 grid gap-3'
  const mergedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName

  return (
    <div className={mergedClassName}>
      {settings.currencies.map((currency) => (
        <div
          key={currency}
          className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background-muted/50 px-4 py-3 ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{currency}</span>
            {currency === settings.baseCurrency ? (
              <span
                className={`rounded-full bg-primary/15 px-2 py-1 font-semibold uppercase tracking-wide text-primary ${
                  isMobile ? 'text-[9px]' : 'text-[10px]'
                }`}
              >
                Base
              </span>
            ) : null}
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-foreground-muted`}>
              1 {settings.baseCurrency} =
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              step="0.0001"
              min="0"
              disabled={currency === settings.baseCurrency}
              value={settings.rates[currency] ?? ''}
              onChange={(event) => onRateChange(currency, event)}
              className={`w-24 rounded-2xl border border-border bg-background px-3 py-2 shadow-sm ${
                isMobile
                  ? 'text-[11px] text-foreground'
                  : 'text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-background-muted/40'
              }`}
            />
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-foreground-muted`}>
              {currency}
            </span>
            {!isMobile && currency !== settings.baseCurrency ? (
              <button
                type="button"
                onClick={() => onRemoveCurrency(currency)}
                className="text-xs font-semibold text-foreground-muted transition hover:text-error"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RatesTable

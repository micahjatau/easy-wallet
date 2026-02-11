const CurrencyManager = ({
  variant = 'desktop',
  settings,
  currencyInput,
  currencyError,
  onBaseChange,
  onAddCurrency,
  setCurrencyInput,
  rateStatusLabel,
  inputClass,
  className = '',
}) => {
  const isMobile = variant === 'mobile'

  const baseClassName = `rounded-3xl border border-border bg-background-elevated/90 p-6 shadow-soft dark:shadow-black/40 ${
    isMobile ? '' : 'md:p-7'
  }`
  const mergedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName

  return (
    <div className={mergedClassName}>
        <div
        className={`flex items-${isMobile ? 'center' : 'start'} justify-between gap-3`}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
            Currency studio
          </p>
          {!isMobile ? (
            <h2 className="mt-2 font-display text-xl text-foreground">Display base</h2>
          ) : null}
        </div>
        {!isMobile ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-subtle">
            {rateStatusLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4">
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
          {isMobile ? 'Display base' : 'Base currency'}
          <select
            value={settings.baseCurrency}
            onChange={onBaseChange}
            className={inputClass}
          >
            {settings.currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
          Add new tracker
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              type="text"
              value={currencyInput}
              onChange={(event) => setCurrencyInput(event.target.value)}
              placeholder={isMobile ? 'ISO Code' : 'USD'}
              className={
                isMobile
                  ? 'flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm'
                  : 'w-full flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
              }
            />
            <button
              type="button"
              onClick={onAddCurrency}
              className="rounded-2xl bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
            >
              Add
            </button>
          </div>
        </label>
        {currencyError ? <p className="text-xs text-error">{currencyError}</p> : null}
      </div>
    </div>
  )
}

export default CurrencyManager

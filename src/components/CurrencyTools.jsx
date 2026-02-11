import CurrencyManager from './CurrencyManager.jsx'
import RatesTable from './RatesTable.jsx'

const CurrencyTools = ({
  variant = 'desktop',
  cardClassName = '',
  settings,
  currencyInput,
  currencyError,
  rateStatus,
  rateStatusLabel,
  ratesAsOfLabel,
  benchmarkBaseLabel,
  inputClass,
  onBaseChange,
  onAddCurrency,
  setCurrencyInput,
  onRefreshRates,
  onRateChange,
  onRemoveCurrency,
}) => {
  return (
    <div className="space-y-4">
      <CurrencyManager
        variant={variant}
        settings={settings}
        currencyInput={currencyInput}
        currencyError={currencyError}
        onBaseChange={onBaseChange}
        onAddCurrency={onAddCurrency}
        setCurrencyInput={setCurrencyInput}
        rateStatusLabel={rateStatusLabel}
        inputClass={inputClass}
        className={cardClassName}
      />
      <div className="rounded-2xl border border-border bg-background-elevated/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
              Exchange rates
            </p>
            <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-subtle">
              {benchmarkBaseLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={onRefreshRates}
            disabled={rateStatus?.loading}
            className="rounded-full border border-border bg-background px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-muted"
          >
            {rateStatus?.loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <RatesTable
          variant={variant}
          settings={settings}
          onRateChange={onRateChange}
          onRemoveCurrency={onRemoveCurrency}
          className="mt-3"
        />

        {rateStatus?.error ? (
          <p className="mt-3 text-xs text-error">{rateStatus.error}</p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-subtle">
          <span>{rateStatusLabel}</span>
          <span>Rates as of {ratesAsOfLabel}</span>
        </div>
      </div>
    </div>
  )
}

export default CurrencyTools

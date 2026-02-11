import CurrencyManager from './CurrencyManager.jsx'
import RatesHeader from './RatesHeader.jsx'
import RatesTable from './RatesTable.jsx'

const Rates = ({
  variant = 'desktop',
  settings,
  currencyInput,
  currencyError,
  onBaseChange,
  onAddCurrency,
  setCurrencyInput,
  rateStatusLabel,
  rateStatus,
  onRateChange,
  onRemoveCurrency,
  onRefreshRates,
  ratesAsOfLabel,
  benchmarkBaseLabel,
  syncStatusLabel,
  inputClass,
  showCurrencyManager = true,
}) => {
  if (variant === 'mobile') {
    return (
      <div className="space-y-6">
        <RatesHeader onRefresh={onRefreshRates} />

        <CurrencyManager
          variant="mobile"
          settings={settings}
          currencyInput={currencyInput}
          currencyError={currencyError}
          onBaseChange={onBaseChange}
          onAddCurrency={onAddCurrency}
          setCurrencyInput={setCurrencyInput}
          rateStatusLabel={rateStatusLabel}
          inputClass={inputClass}
        />

        <div className="rounded-3xl border border-border bg-background-elevated/90 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-subtle">
                Live benchmarks
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h3 className="font-display text-xl text-foreground">Exchange rates</h3>
                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-subtle">
                  {benchmarkBaseLabel}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-subtle">
              {rateStatusLabel}
            </span>
          </div>

          <RatesTable
            variant="mobile"
            settings={settings}
            onRateChange={onRateChange}
            onRemoveCurrency={onRemoveCurrency}
          />

          {rateStatus.error ? (
            <p className="mt-4 text-xs text-error">{rateStatus.error}</p>
          ) : null}
        </div>

        <div className="rounded-3xl border border-border bg-background-muted/50 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                Market rates
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {syncStatusLabel}
              </p>
              <p className="mt-1 text-xs text-foreground-muted">
                Rates as of {ratesAsOfLabel}.
              </p>
            </div>
            <button
              type="button"
              onClick={onRefreshRates}
              disabled={rateStatus.loading}
              className="rounded-full border border-border bg-background px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-muted"
            >
              {rateStatus.loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {showCurrencyManager ? (
        <CurrencyManager
          variant="desktop"
          settings={settings}
          currencyInput={currencyInput}
          currencyError={currencyError}
          onBaseChange={onBaseChange}
          onAddCurrency={onAddCurrency}
          setCurrencyInput={setCurrencyInput}
          rateStatusLabel={rateStatusLabel}
          inputClass={inputClass}
        />
      ) : null}

      <div className="rounded-3xl border border-border bg-background-elevated/90 p-6 shadow-soft md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-subtle">
              Live benchmarks
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="font-display text-xl text-foreground">Exchange rates</h2>
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-subtle">
                {benchmarkBaseLabel}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onRefreshRates}
            disabled={rateStatus.loading}
            className="rounded-full border border-border bg-background px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-foreground-muted transition hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
          >
            {rateStatus.loading ? 'Refreshing...' : 'Refresh rates'}
          </button>
        </div>

        <RatesTable
          variant="desktop"
          settings={settings}
          onRateChange={onRateChange}
          onRemoveCurrency={onRemoveCurrency}
        />

        {rateStatus.error ? (
          <p className="mt-4 text-xs text-error">{rateStatus.error}</p>
        ) : null}

        <div className="mt-5 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-subtle">
          <span>Source: currency-api</span>
          <span>Rates as of {ratesAsOfLabel}</span>
        </div>
      </div>
    </>
  )
}

export default Rates

import IconRates from './icons/IconRates.jsx'

const RatesHeader = ({ onRefresh }) => (
  <header className="sticky top-0 z-30 -mx-4 bg-background/90 px-4 py-4 backdrop-blur">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
          Global markets
        </p>
        <h2 className="mt-1 font-display text-2xl text-foreground">Currencies</h2>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background-elevated text-foreground-muted"
      >
        <IconRates className="h-4 w-4" />
      </button>
    </div>
  </header>
)

export default RatesHeader

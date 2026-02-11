import { formatMoney } from '../lib/formatters.js'

const SnapshotCard = ({
  title = 'Monthly Snapshot (MTD)',
  rangeLabel = 'This month',
  balance,
  totals,
  baseCurrency,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-background via-background-elevated to-background-muted/50 p-8 text-foreground shadow-2xl shadow-primary/10 dark:shadow-black/40">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
           backgroundImage: `linear-gradient(to right, rgba(27, 67, 50, 0.5) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(27, 67, 50, 0.5) 1px, transparent 1px)`,
           backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
            <span>{title}</span>
            <span className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <span className="rounded-full bg-primary/10 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-primary">
            {rangeLabel}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-foreground-muted">Total portfolio balance</p>
          <p className="font-display text-5xl leading-[0.95] tracking-tight text-primary md:text-6xl">
            {formatMoney(balance, baseCurrency)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted">
          <span>This month MTD</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border/50 bg-background-elevated/60 px-4 py-3 backdrop-blur-sm">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground-subtle">
              Income
            </p>
            <p className="mt-2 text-lg font-semibold text-primary">
              {formatMoney(totals.income, baseCurrency)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-background-elevated/60 px-4 py-3 backdrop-blur-sm">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground-subtle">
              Expenses
            </p>
            <p className="mt-2 text-lg font-semibold text-primary">
              {formatMoney(totals.expense, baseCurrency)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-background-elevated/60 px-4 py-3 backdrop-blur-sm">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground-subtle">
              Net
            </p>
            <p className="mt-2 text-lg font-semibold text-primary">
              {formatMoney(totals.balance, baseCurrency)}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SnapshotCard

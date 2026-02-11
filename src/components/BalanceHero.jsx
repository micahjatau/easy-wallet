import { formatMoney } from '../lib/formatters.js'
import QuickStats from './QuickStats.jsx'

const BalanceHero = ({
  variant = 'desktop',
  balance,
  baseCurrency,
  assetsCount,
  incomeLabel,
  expenseLabel,
  income,
  expense,
}) => {
  if (variant === 'mobile') {
    return (
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-pine via-sage to-ink p-6 text-white shadow-2xl shadow-sage/30">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sand/70">
            Total portfolio balance
          </p>
          <p className="font-display text-4xl tracking-tight text-white">
            {formatMoney(balance, baseCurrency)}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-sand/70">
            <span className="rounded-full bg-white/10 px-3 py-2">
              Base {baseCurrency}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-2">
              {assetsCount} assets
            </span>
          </div>
        </div>
        <QuickStats
          variant="mobile"
          incomeLabel={incomeLabel}
          expenseLabel={expenseLabel}
          income={income}
          expense={expense}
          baseCurrency={baseCurrency}
        />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-pine via-sage to-ink p-8 text-white shadow-2xl shadow-sage/30 md:p-12">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-amber/20 blur-2xl" />
      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-6">
        <div className="space-y-4 md:flex-1">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-sand/70">
            <span>Total portfolio balance</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div className="font-display text-5xl leading-[0.95] tracking-tight text-white md:pr-6 md:text-7xl lg:text-8xl md:whitespace-nowrap">
            {formatMoney(balance, baseCurrency)}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-sand/70">
            <span>Consolidated value in {baseCurrency}</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
              {assetsCount} assets
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 md:ml-auto md:w-auto md:flex-row md:flex-nowrap">
          <QuickStats
            variant="desktop"
            incomeLabel={incomeLabel}
            expenseLabel={expenseLabel}
            income={income}
            expense={expense}
            baseCurrency={baseCurrency}
          />
        </div>
      </div>
    </div>
  )
}

export default BalanceHero

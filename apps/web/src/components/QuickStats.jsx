import { formatMoney } from '../lib/formatters.js'

const QuickStats = ({
  incomeLabel,
  expenseLabel,
  income,
  expense,
  baseCurrency,
  variant = 'desktop',
}) => {
  if (variant === 'mobile') {
    return (
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/10 px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/60">
            {incomeLabel}
          </p>
          <p className="mt-2 text-sm font-semibold">
            {formatMoney(income, baseCurrency)}
          </p>
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/60">
            {expenseLabel}
          </p>
          <p className="mt-2 text-sm font-semibold">
            {formatMoney(expense, baseCurrency)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur md:min-w-[180px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
          {incomeLabel}
        </p>
        <p className="mt-2 font-display text-2xl text-white">
          {formatMoney(income, baseCurrency)}
        </p>
      </div>
      <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur md:min-w-[180px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
          {expenseLabel}
        </p>
        <p className="mt-2 font-display text-2xl text-white">
          {formatMoney(expense, baseCurrency)}
        </p>
      </div>
    </>
  )
}

export default QuickStats

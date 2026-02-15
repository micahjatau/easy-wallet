import { memo, useMemo } from 'react'
import { computeTotals, filterTransactions, toBaseAmount } from '@easy-ledger/core'
import Activity from '../components/Activity.jsx'
import { parseDateLocal } from '../lib/dateValidation.js'
import { formatMoney } from '../lib/formatters.js'

const MetricCard = memo(function MetricCard({ label, value, currency, trend }) {
  const hasTrend = Number.isFinite(trend)

  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
          {label}
        </p>
        {hasTrend ? (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            trend > 0
              ? 'bg-success-background text-success'
              : trend < 0
                ? 'bg-error-background text-error'
                : 'bg-background-muted text-foreground-muted'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-xl font-semibold text-foreground">
        {formatMoney(value, currency)}
      </p>
    </div>
  )
})

const TransactionsView = memo(function TransactionsView({
  variant = 'desktop',
  transactions,
  filteredTransactions,
  accounts,
  categories,
  inputClass,
  settings,
  filters,
  hasFilters,
  onClearFilters,
  onDateRangeModeChange,
  setFilters,
  accountNameById,
  getCategoryAccent,
  onEdit,
  onDelete,
  onRestore,
  activeRange,
  dateRangeMode,
  rangeShortLabel,
  rangeLabel,
  rateStatusLabel,
}) {
  const selectedTotals = useMemo(() => {
    const result = computeTotals(filteredTransactions || [], settings)
    return {
      income: result.incomeBase,
      expense: result.expenseBase,
      net: result.balanceBase,
      count: Array.isArray(filteredTransactions) ? filteredTransactions.length : 0,
    }
  }, [filteredTransactions, settings])

  const selectedTrends = useMemo(() => {
    if (!activeRange?.start || dateRangeMode === 'all_time') {
      return { income: null, expense: null, net: null }
    }

    const rangeStart = activeRange.start
    const rangeEnd = activeRange.end || new Date()
    const durationMs = Math.max(rangeEnd.getTime() - rangeStart.getTime(), 24 * 60 * 60 * 1000)
    const previousRange = {
      start: new Date(rangeStart.getTime() - durationMs),
      end: rangeStart,
    }

    const previousTransactions = filterTransactions(transactions || [], {
      range: previousRange,
      includeDeleted: false,
    })

    const current = (filteredTransactions || []).reduce(
      (accumulator, transaction) => {
        const baseAmount = toBaseAmount(
          Number(transaction.amount),
          transaction.currency,
          settings?.baseCurrency,
          settings?.rates || {},
        )
        if (!Number.isFinite(baseAmount)) return accumulator
        if (transaction.type === 'income') {
          accumulator.income += baseAmount
        } else {
          accumulator.expense += baseAmount
        }
        return accumulator
      },
      { income: 0, expense: 0 },
    )

    const previous = previousTransactions.reduce(
      (accumulator, transaction) => {
        const txDate = parseDateLocal(transaction.date)
        if (!txDate) return accumulator

        const baseAmount = toBaseAmount(
          Number(transaction.amount),
          transaction.currency,
          settings?.baseCurrency,
          settings?.rates || {},
        )
        if (!Number.isFinite(baseAmount)) return accumulator
        if (transaction.type === 'income') {
          accumulator.income += baseAmount
        } else {
          accumulator.expense += baseAmount
        }
        return accumulator
      },
      { income: 0, expense: 0 },
    )

    const currentNet = current.income - current.expense
    const previousNet = previous.income - previous.expense

    const getTrend = (currentValue, previousValue) => {
      if (!Number.isFinite(previousValue) || previousValue === 0) {
        if (!Number.isFinite(currentValue) || currentValue === 0) return 0
        return null
      }
      return Math.round(((currentValue - previousValue) / Math.abs(previousValue)) * 100)
    }

    return {
      income: getTrend(current.income, previous.income),
      expense: getTrend(current.expense, previous.expense),
      net: getTrend(currentNet, previousNet),
    }
  }, [activeRange, dateRangeMode, filteredTransactions, settings, transactions])

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-foreground">History</h1>
        <p className="text-foreground-muted mt-1">
          View and manage all your financial activity
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-background-elevated p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground-muted">
            {rangeShortLabel || 'Selected range'}
          </p>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground-muted">
            {selectedTotals.count} txn{selectedTotals.count === 1 ? '' : 's'}
          </span>
        </div>
        <p className="mt-2 text-sm text-foreground-muted">{rangeLabel}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <MetricCard
            label="Income"
            value={selectedTotals.income}
            currency={settings?.baseCurrency}
            trend={selectedTrends.income}
          />
          <MetricCard
            label="Expenses"
            value={selectedTotals.expense}
            currency={settings?.baseCurrency}
            trend={selectedTrends.expense}
          />
          <MetricCard
            label="Net"
            value={selectedTotals.net}
            currency={settings?.baseCurrency}
            trend={selectedTrends.net}
          />
        </div>
      </div>

      <Activity
        variant={variant}
        transactions={transactions}
        filteredTransactions={filteredTransactions}
        accounts={accounts}
        categories={categories}
        inputClass={inputClass}
        settings={settings}
        filters={filters}
        hasFilters={hasFilters}
        onClearFilters={onClearFilters}
        onDateRangeModeChange={onDateRangeModeChange}
        setFilters={setFilters}
        accountNameById={accountNameById}
        getCategoryAccent={getCategoryAccent}
        onEdit={onEdit}
        onDelete={onDelete}
        onRestore={onRestore}
        rangeLabel={rangeLabel}
        rateStatusLabel={rateStatusLabel}
      />
    </div>
  )
})

export default TransactionsView

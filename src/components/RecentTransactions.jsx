import { toBaseAmount } from '../lib/currency.js'
import { formatDate, formatMoney } from '../lib/formatters.js'
import EmptyState from './EmptyState.jsx'

const RecentTransactions = ({
  transactions,
  settings,
  accountNameById,
  getCategoryAccent,
  onEdit,
  onDelete,
  onViewAll,
}) => (
  <div className="rounded-3xl border border-border bg-background-elevated/90 p-6 shadow-soft">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
          Activity log
        </p>
        <h2 className="mt-2 font-display text-xl text-foreground">Recent history</h2>
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted"
      >
        View all
      </button>
    </div>

    <div className="mt-4 grid gap-3">
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          body="Add your first entry to see spending history here."
        />
      ) : (
        transactions.map((transaction) => {
          const baseAmount = toBaseAmount(
            Number(transaction.amount),
            transaction.currency,
            settings.baseCurrency,
            settings.rates,
          )
          const isIncome = transaction.type === 'income'
          const { color, initials } = getCategoryAccent(transaction.category)
          const accountName =
            accountNameById[transaction.accountId] || 'Unknown'
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background-elevated px-4 py-3 text-xs shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-semibold text-white"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {transaction.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-wide ${
                        isIncome ? 'bg-success-background text-success' : 'bg-warning-background text-warning'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-foreground-muted">
                    {formatDate(transaction.date)} • {accountName} •{' '}
                    {transaction.currency}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs font-semibold ${
                    isIncome ? 'text-success' : 'text-foreground'
                  }`}
                >
                  {formatMoney(
                    Number(transaction.amount),
                    transaction.currency,
                  )}
                </p>
                {transaction.currency !== settings.baseCurrency &&
                baseAmount !== null ? (
                  <p className="text-[10px] text-foreground-muted">
                    ~ {formatMoney(baseAmount, settings.baseCurrency)}
                  </p>
                ) : null}
                <div className="mt-2 flex items-center justify-end gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                  <button
                    type="button"
                    onClick={() => onEdit(transaction)}
                    className="text-foreground-muted transition hover:text-foreground"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(transaction.id)}
                    className="text-foreground-muted transition hover:text-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  </div>
)

export default RecentTransactions

import { toBaseAmount } from '@easy-ledger/core'
import { formatDate, formatMoney } from '../lib/formatters.js'

const TransactionRow = ({
  transaction,
  settings,
  accountName,
  getCategoryAccent,
  onEdit,
  onDelete,
  onRestore,
  variant = 'desktop',
  index = 0,
}) => {
  const baseAmount = toBaseAmount(
    Number(transaction.amount),
    transaction.currency,
    settings.baseCurrency,
    settings.rates,
  )
  const isIncome = transaction.type === 'income'
  const { color, initials } = getCategoryAccent(transaction.category)

  if (variant === 'mobile') {
    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background-elevated px-4 py-4 text-xs shadow-sm dark:shadow-black/20 ${
          transaction.isDeleted ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{transaction.name}</span>
            <span
              className={`rounded-full px-2 py-1 text-[7px] font-semibold uppercase tracking-wide ${
isIncome ? 'bg-success-background text-success' : 'bg-warning-background text-warning'
              }`}
            >
                {transaction.type}
              </span>
              {transaction.isDeleted ? (
              <span className="rounded-full bg-foreground/15 px-2 py-1 text-[7px] font-semibold uppercase tracking-wide text-foreground-muted">
                Deleted
              </span>
              ) : null}
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
            {formatMoney(Number(transaction.amount), transaction.currency)}
          </p>
          {transaction.currency !== settings.baseCurrency && baseAmount !== null ? (
            <p className="text-[10px] text-foreground-muted">
              ~ {formatMoney(baseAmount, settings.baseCurrency)}
            </p>
          ) : null}
          <div className="mt-2 flex items-center justify-end gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
            {!transaction.isDeleted ? (
              <>
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
              </>
            ) : (
                <button
                  type="button"
                  onClick={() => onRestore(transaction.id)}
                  className="text-foreground-muted transition hover:text-foreground"
                >
                  Restore
                </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background-elevated px-5 py-4 text-sm shadow-sm dark:shadow-black/20 ${
        transaction.isDeleted ? 'opacity-60' : ''
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{transaction.name}</span>
            <span
              className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${
                isIncome ? 'bg-success-background text-success' : 'bg-warning-background text-warning'
              }`}
            >
              {transaction.type}
            </span>
            {transaction.isDeleted ? (
              <span className="rounded-full bg-foreground/15 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-foreground-muted">
                Deleted
              </span>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
            <span>{formatDate(transaction.date)}</span>
            <span className="text-foreground-subtle/60">|</span>
            <span>{transaction.category}</span>
            <span className="text-foreground-subtle/60">|</span>
            <span>{accountName}</span>
            <span className="text-foreground-subtle/60">|</span>
            <span>{transaction.currency}</span>
            {baseAmount === null ? (
              <span className="text-error">Missing rate</span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
            <p
              className={`font-semibold ${
                isIncome ? 'text-success' : 'text-foreground'
              }`}
            >
            {formatMoney(Number(transaction.amount), transaction.currency)}
          </p>
          {transaction.currency !== settings.baseCurrency && baseAmount !== null ? (
            <p className="text-xs text-foreground-muted">
              ~ {formatMoney(baseAmount, settings.baseCurrency)}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {!transaction.isDeleted ? (
            <>
                <button
                  type="button"
                  onClick={() => onEdit(transaction)}
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground-muted transition hover:text-foreground"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(transaction.id)}
                  className="rounded-full border border-transparent bg-background-muted/40 px-3 py-2 text-xs font-semibold text-foreground-muted transition hover:text-error"
                >
                  Delete
                </button>
            </>
          ) : (
                <button
                  type="button"
                  onClick={() => onRestore(transaction.id)}
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground-muted transition hover:text-foreground"
                >
              Restore
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionRow

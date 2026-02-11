import { memo } from 'react'
import EmptyState from './EmptyState.jsx'
import TransactionRow from './TransactionRow.jsx'

const TransactionsList = ({
  transactions,
  settings,
  accountNameById,
  getCategoryAccent,
  onEdit,
  onDelete,
  onRestore,
  variant = 'desktop',
  emptyTitle,
  emptyBody,
  className = '',
}) => {
  if (transactions.length === 0) {
    return <EmptyState title={emptyTitle} body={emptyBody} />
  }

  const baseClassName = variant === 'desktop' ? 'grid gap-3' : 'space-y-3'
  const mergedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName

  return (
    <div className={mergedClassName}>
      {transactions.map((transaction, index) => {
        const accountName = accountNameById[transaction.accountId] || 'Unknown'
        return (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            settings={settings}
            accountName={accountName}
            getCategoryAccent={getCategoryAccent}
            onEdit={onEdit}
            onDelete={onDelete}
            onRestore={onRestore}
            variant={variant}
            index={index}
          />
        )
      })}
    </div>
  )
}

// Memoize to prevent unnecessary re-renders when parent updates but props haven't changed
export default memo(TransactionsList)

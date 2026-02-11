import TransactionsList from './TransactionsList.jsx'
import VirtualizedTransactionsList from './VirtualizedTransactionsList.jsx'

const TRANSACTION_THRESHOLD = 50

const SmartTransactionsList = ({
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
  const shouldVirtualize = transactions.length > TRANSACTION_THRESHOLD

  if (shouldVirtualize) {
    return (
      <VirtualizedTransactionsList
        transactions={transactions}
        settings={settings}
        accountNameById={accountNameById}
        getCategoryAccent={getCategoryAccent}
        onEdit={onEdit}
        onDelete={onDelete}
        onRestore={onRestore}
        variant={variant}
        emptyTitle={emptyTitle}
        emptyBody={emptyBody}
        className={className}
      />
    )
  }

  return (
    <TransactionsList
      transactions={transactions}
      settings={settings}
      accountNameById={accountNameById}
      getCategoryAccent={getCategoryAccent}
      onEdit={onEdit}
      onDelete={onDelete}
      onRestore={onRestore}
      variant={variant}
      emptyTitle={emptyTitle}
      emptyBody={emptyBody}
      className={className}
    />
  )
}

export default SmartTransactionsList

import { useCallback, useRef } from 'react'
import * as ReactWindow from 'react-window'
import EmptyState from './EmptyState.jsx'
import TransactionRow from './TransactionRow.jsx'

const { FixedSizeList: List } = ReactWindow

const ITEM_HEIGHT_DESKTOP = 80
const ITEM_HEIGHT_MOBILE = 100
const MAX_HEIGHT = 600

const VirtualizedTransactionsList = ({
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
  const listRef = useRef(null)
  
  const itemHeight = variant === 'desktop' ? ITEM_HEIGHT_DESKTOP : ITEM_HEIGHT_MOBILE
  const listHeight = Math.min(transactions.length * itemHeight, MAX_HEIGHT)

  const Row = useCallback(({ index, style }) => {
    const transaction = transactions[index]
    const accountName = accountNameById[transaction.accountId] || 'Unknown'
    
    return (
      <div style={style} className="px-1">
        <TransactionRow
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
      </div>
    )
  }, [transactions, settings, accountNameById, getCategoryAccent, onEdit, onDelete, onRestore, variant])

  if (transactions.length === 0) {
    return <EmptyState title={emptyTitle} body={emptyBody} />
  }

  return (
    <div className={className} style={{ height: listHeight }}>
      <List
        ref={listRef}
        height={listHeight}
        itemCount={transactions.length}
        itemSize={itemHeight}
        width="100%"
        overscanCount={5}
      >
        {Row}
      </List>
    </div>
  )
}

export default VirtualizedTransactionsList

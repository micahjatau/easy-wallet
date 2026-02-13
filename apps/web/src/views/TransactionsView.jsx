import { memo } from 'react'
import Activity from '../components/Activity.jsx'

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
  rangeLabel,
  rateStatusLabel,
}) {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-foreground">Transactions</h1>
        <p className="text-foreground-muted mt-1">
          View and manage all your financial activity
        </p>
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

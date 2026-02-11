import Activity from '../components/Activity.jsx'

const ActivitySectionView = ({
  filters,
  accounts,
  allCategories,
  inputClass,
  filteredTransactions,
  transactions,
  rateStatusLabel,
  hasFilters,
  rangeLabel,
  handleClearFilters,
  handleDateRangeModeChange,
  setFilters,
  settings,
  accountNameById,
  getCategoryAccent,
  handleEdit,
  handleDelete,
  handleRestore,
}) => {
  return (
    <section className="hidden lg:block mt-6 space-y-4">
      <Activity
        variant="desktop"
        filters={filters}
        accounts={accounts}
        categories={allCategories}
        inputClass={inputClass}
        filteredTransactions={filteredTransactions}
        totalTransactions={transactions.length}
        rateStatusLabel={rateStatusLabel}
        hasFilters={hasFilters}
        rangeLabel={rangeLabel}
        onClearFilters={handleClearFilters}
        onDateRangeModeChange={handleDateRangeModeChange}
        setFilters={setFilters}
        settings={settings}
        accountNameById={accountNameById}
        getCategoryAccent={getCategoryAccent}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />
    </section>
  )
}

export default ActivitySectionView

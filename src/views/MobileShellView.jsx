import Activity from '../components/Activity.jsx'
import SnapshotCard from '../components/SnapshotCard.jsx'
import ToolsAccordion from '../components/ToolsAccordion.jsx'
import TransactionForm from '../components/TransactionForm.jsx'

const MobileShellView = ({
  showActivity,
  showNew,
  showSnapshot,
  showTools,
  filters,
  accounts,
  allCategories,
  inputClass,
  filteredTransactions,
  transactions,
  rateStatusLabel,
  hasFilters,
  rangeLabel,
  rangeShortLabel,
  handleClearFilters,
  handleDateRangeModeChange,
  setFilters,
  settings,
  accountNameById,
  getCategoryAccent,
  handleEdit,
  handleDelete,
  handleRestore,
  formState,
  formErrors,
  isEditing,
  rateMissingForForm,
  handleSubmit,
  handleCancelEdit,
  setFormState,
  balance,
  totals,
  mobileToolsSections,
}) => {
  return (
    <section className="space-y-6 lg:hidden">
      {showActivity ? (
        <Activity
          variant="mobile"
          filters={filters}
          accounts={accounts}
          categories={allCategories}
          inputClass={inputClass}
          filteredTransactions={filteredTransactions}
          totalTransactions={transactions.length}
          rateStatusLabel={rateStatusLabel}
          hasFilters={hasFilters}
          rangeLabel={rangeLabel}
          rangeShortLabel={rangeShortLabel}
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
      ) : null}
      {showNew ? (
        <TransactionForm
          variant="mobile"
          formState={formState}
          formErrors={formErrors}
          isEditing={isEditing}
          accounts={accounts}
          settings={settings}
          rateMissingForForm={rateMissingForForm}
          inputClass={inputClass}
          onSubmit={handleSubmit}
          onCancelEdit={handleCancelEdit}
          setFormState={setFormState}
        />
      ) : null}
      {showSnapshot ? (
        <SnapshotCard
          balance={balance}
          totals={totals}
          baseCurrency={settings.baseCurrency}
          rangeLabel={rangeShortLabel}
        />
      ) : null}
      {showTools ? <ToolsAccordion sections={mobileToolsSections} /> : null}
    </section>
  )
}

export default MobileShellView

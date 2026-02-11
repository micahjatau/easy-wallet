import CategoryBreakdown from '../components/CategoryBreakdown.jsx'
import MissingRatesIndicator from '../components/MissingRatesIndicator.jsx'
import SnapshotCard from '../components/SnapshotCard.jsx'
import TransactionForm from '../components/TransactionForm.jsx'

const DesktopDashboardView = ({
  balance,
  totals,
  settings,
  rangeShortLabel,
  formState,
  formErrors,
  isEditing,
  accounts,
  rateMissingForForm,
  inputClass,
  handleSubmit,
  handleCancelEdit,
  setFormState,
  categoryData,
  categoryTotal,
  topCategory,
  topCategoryPercent,
  transactions,
  info,
}) => {
  return (
    <>
      <section className="hidden lg:block">
        <SnapshotCard
          balance={balance}
          totals={totals}
          baseCurrency={settings.baseCurrency}
          rangeLabel={rangeShortLabel}
        />
      </section>

      <section className="hidden lg:grid lg:grid-cols-2 items-start gap-6">
        <TransactionForm
          variant="desktop"
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

        <CategoryBreakdown
          variant="desktop"
          categoryData={categoryData}
          categoryTotal={categoryTotal}
          topCategory={topCategory}
          topCategoryPercent={topCategoryPercent}
          totalExpense={totals.expense}
          baseCurrency={settings.baseCurrency}
        />
      </section>

      <section className="hidden lg:block mt-6 space-y-4">
        <MissingRatesIndicator
          transactions={transactions}
          settings={settings}
          onHighlightMissing={(missingTransactions) => {
            info(`${missingTransactions.length} transactions missing rates - check Currency Studio`)
          }}
        />
      </section>
    </>
  )
}

export default DesktopDashboardView

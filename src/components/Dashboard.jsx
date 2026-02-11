import { formatRate } from '../lib/formatters.js'
import AccountsManager from './AccountsManager.jsx'
import Activity from './Activity.jsx'
import BalanceHero from './BalanceHero.jsx'
import CategoryBreakdown from './CategoryBreakdown.jsx'
import CurrencyManager from './CurrencyManager.jsx'
import Header from './Header.jsx'
import ImportExport from './ImportExport.jsx'
import Rates from './Rates.jsx'
import RecentTransactions from './RecentTransactions.jsx'
import TransactionForm from './TransactionForm.jsx'

const Dashboard = ({
  showDashboard,
  appName,
  mobileTagline,
  todayLabel,
  rangeLabel,
  incomeCardLabel,
  expenseCardLabel,
  totals,
  balance,
  settings,
  formState,
  formErrors,
  isEditing,
  accounts,
  rateMissingForForm,
  inputClass,
  onSubmit,
  onCancelEdit,
  setFormState,
  filters,
  categories,
  filteredTransactions,
  recentTransactions,
  transactions,
  rateStatusLabel,
  hasFilters,
  onClearFilters,
  onDateRangeModeChange,
  setFilters,
  accountNameById,
  getCategoryAccent,
  onEdit,
  onDelete,
  onRestore,
  accountDrafts,
  setAccountDrafts,
  accountUsage,
  accountError,
  setAccountError,
  accountInput,
  setAccountInput,
  onRenameAccount,
  onRemoveAccount,
  onAddAccount,
  includeDeletedExport,
  onToggleIncludeDeleted,
  onExportJson,
  onExportCsv,
  onImportJson,
  importPreview,
  onApplyImport,
  onCancelImport,
  importError,
  rateStatus,
  onRefreshRates,
  onRateChange,
  onRemoveCurrency,
  onBaseChange,
  onAddCurrency,
  setCurrencyInput,
  currencyInput,
  currencyError,
  ratesAsOfLabel,
  benchmarkBaseLabel,
  topCategory,
  topCategoryPercent,
  categoryTotal,
  categoryData,
  marketRates,
  onViewAllActivity,
}) => (
  <>
    <section className="hidden md:block">
      <BalanceHero
        variant="desktop"
        balance={balance}
        baseCurrency={settings.baseCurrency}
        assetsCount={settings.currencies.length}
        incomeLabel={incomeCardLabel}
        expenseLabel={expenseCardLabel}
        income={totals.income}
        expense={totals.expense}
      />
    </section>

    <section className="hidden gap-6 md:grid md:items-stretch lg:grid-cols-[1.35fr_0.65fr]">
      <div className="flex h-full min-h-0 flex-col gap-6">
        <TransactionForm
          variant="desktop"
          formState={formState}
          formErrors={formErrors}
          isEditing={isEditing}
          accounts={accounts}
          settings={settings}
          rateMissingForForm={rateMissingForForm}
          inputClass={inputClass}
          onSubmit={onSubmit}
          onCancelEdit={onCancelEdit}
          setFormState={setFormState}
        />

        <Activity
          variant="desktop"
          className="flex-1"
          filters={filters}
          accounts={accounts}
          categories={categories}
          inputClass={inputClass}
          filteredTransactions={filteredTransactions}
          totalTransactions={transactions.length}
          rateStatusLabel={rateStatusLabel}
          hasFilters={hasFilters}
          rangeLabel={rangeLabel}
          onClearFilters={onClearFilters}
          onDateRangeModeChange={onDateRangeModeChange}
          setFilters={setFilters}
          settings={settings}
          accountNameById={accountNameById}
          getCategoryAccent={getCategoryAccent}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestore={onRestore}
        />
      </div>

      <div className="flex flex-col gap-6">
        <CurrencyManager
          variant="desktop"
          settings={settings}
          currencyInput={currencyInput}
          currencyError={currencyError}
          onBaseChange={onBaseChange}
          onAddCurrency={onAddCurrency}
          setCurrencyInput={setCurrencyInput}
          rateStatusLabel={rateStatusLabel}
          inputClass={inputClass}
        />

        <AccountsManager
          variant="desktop"
          accounts={accounts}
          accountDrafts={accountDrafts}
          setAccountDrafts={setAccountDrafts}
          accountUsage={accountUsage}
          accountError={accountError}
          setAccountError={setAccountError}
          accountInput={accountInput}
          setAccountInput={setAccountInput}
          onRenameAccount={onRenameAccount}
          onRemoveAccount={onRemoveAccount}
          onAddAccount={onAddAccount}
        />

        <ImportExport
          variant="desktop"
          includeDeletedExport={includeDeletedExport}
          onToggleIncludeDeleted={onToggleIncludeDeleted}
          onExportJson={onExportJson}
          onExportCsv={onExportCsv}
          onImportJson={onImportJson}
          importPreview={importPreview}
          onApplyImport={onApplyImport}
          onCancelImport={onCancelImport}
          importError={importError}
        />

        <Rates
          variant="desktop"
          showCurrencyManager={false}
          settings={settings}
          currencyInput={currencyInput}
          currencyError={currencyError}
          onBaseChange={onBaseChange}
          onAddCurrency={onAddCurrency}
          setCurrencyInput={setCurrencyInput}
          rateStatusLabel={rateStatusLabel}
          rateStatus={rateStatus}
          onRateChange={onRateChange}
          onRemoveCurrency={onRemoveCurrency}
          onRefreshRates={onRefreshRates}
          ratesAsOfLabel={ratesAsOfLabel}
          benchmarkBaseLabel={benchmarkBaseLabel}
          inputClass={inputClass}
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
      </div>
    </section>

    <section className="space-y-6 md:hidden">
      {showDashboard ? (
        <div className="space-y-6">
          <Header
            variant="mobile"
            appName={appName}
            tagline={mobileTagline}
            todayLabel={todayLabel}
          />

          <BalanceHero
            variant="mobile"
            balance={balance}
            baseCurrency={settings.baseCurrency}
            assetsCount={settings.currencies.length}
            incomeLabel="Income"
            expenseLabel="Expenses"
            income={totals.income}
            expense={totals.expense}
          />

          <TransactionForm
            variant="mobile"
            formState={formState}
            formErrors={formErrors}
            isEditing={isEditing}
            accounts={accounts}
            settings={settings}
            rateMissingForForm={rateMissingForForm}
            inputClass={inputClass}
            onSubmit={onSubmit}
            onCancelEdit={onCancelEdit}
            setFormState={setFormState}
          />

          <AccountsManager
            variant="mobile"
            accounts={accounts}
            accountDrafts={accountDrafts}
            setAccountDrafts={setAccountDrafts}
            accountUsage={accountUsage}
            accountError={accountError}
            setAccountError={setAccountError}
            accountInput={accountInput}
            setAccountInput={setAccountInput}
            onRenameAccount={onRenameAccount}
            onRemoveAccount={onRemoveAccount}
            onAddAccount={onAddAccount}
          />

          <ImportExport
            variant="mobile"
            includeDeletedExport={includeDeletedExport}
            onToggleIncludeDeleted={onToggleIncludeDeleted}
            onExportJson={onExportJson}
            onExportCsv={onExportCsv}
            onImportJson={onImportJson}
            importPreview={importPreview}
            onApplyImport={onApplyImport}
            onCancelImport={onCancelImport}
            importError={importError}
          />

          <RecentTransactions
            transactions={recentTransactions}
            settings={settings}
            accountNameById={accountNameById}
            getCategoryAccent={getCategoryAccent}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewAll={onViewAllActivity}
          />

          <CategoryBreakdown
            variant="mobile"
            categoryData={categoryData}
            categoryTotal={categoryTotal}
            topCategory={topCategory}
            topCategoryPercent={topCategoryPercent}
            totalExpense={totals.expense}
            baseCurrency={settings.baseCurrency}
          />

          <div className="rounded-3xl border border-border bg-background-muted/40 p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                  Market brief
                </span>
              </div>
              <span className="text-[9px] text-foreground-subtle">
                Rates as of {ratesAsOfLabel}
              </span>
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {marketRates.length === 0 ? (
                <span className="text-xs text-foreground-muted">
                  No market rates yet. Refresh to load the latest.
                </span>
              ) : (
                marketRates.map((rate) => (
                  <div
                    key={rate.currency}
                    className="min-w-[110px] rounded-2xl border border-border bg-background-elevated px-4 py-3 text-xs"
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground-subtle">
                      {rate.pair}
                    </span>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {formatRate(rate.rate)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  </>
)

export default Dashboard

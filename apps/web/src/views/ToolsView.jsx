import { memo } from 'react'
import AccountsManager from '../components/AccountsManager.jsx'
import CategoryManager from '../components/CategoryManager.jsx'
import CurrencyTools from '../components/CurrencyTools.jsx'
import ImportExport from '../components/ImportExport.jsx'

const ToolsView = memo(function ToolsView({
  accounts,
  accountDrafts,
  setAccountDrafts,
  accountUsage,
  accountError,
  setAccountError,
  accountInput,
  setAccountInput,
  onAddAccount,
  onRenameAccount,
  onRemoveAccount,
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  transactions,
  settings,
  currencyInput,
  currencyError,
  rateStatus,
  rateStatusLabel,
  ratesAsOfLabel,
  benchmarkBaseLabel,
  inputClass,
  onBaseChange,
  onAddCurrency,
  setCurrencyInput,
  onRefreshRates,
  onRateChange,
  onRemoveCurrency,
  includeDeletedExport,
  setIncludeDeletedExport,
  onExportJson,
  onExportCsv,
  onImportJson,
  importPreview,
  onApplyImport,
  onCancelImport,
  importError,
}) {
  const compactCardClass = 'bg-background-elevated shadow-none border-border p-4 md:p-4'

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-foreground">Tools</h1>
        <p className="text-foreground-muted mt-1">
          Manage accounts, categories, currency rates, and data
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Accounts Section */}
        <section className="rounded-2xl border border-border bg-background-elevated/50 p-1">
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              Accounts
            </h2>
            <p className="text-sm text-foreground-muted mt-1">
              Manage your wallets and payment methods
            </p>
          </div>
          <div className="p-4 pt-2">
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
              className={compactCardClass}
            />
          </div>
        </section>

        {/* Categories Section */}
        <section className="rounded-2xl border border-border bg-background-elevated/50 p-1">
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder</span>
              Categories
            </h2>
            <p className="text-sm text-foreground-muted mt-1">
              Organize your transactions with custom categories
            </p>
          </div>
          <div className="p-4 pt-2">
            <CategoryManager
              categories={categories}
              onAddCategory={onAddCategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              transactions={transactions}
            />
          </div>
        </section>

        {/* Currency Section */}
        <section className="rounded-2xl border border-border bg-background-elevated/50 p-1">
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">currency_exchange</span>
              Currency Studio
            </h2>
            <p className="text-sm text-foreground-muted mt-1">
              Manage exchange rates and currency preferences
            </p>
          </div>
          <div className="p-4 pt-2">
            <CurrencyTools
              variant="desktop"
              cardClassName={compactCardClass}
              settings={settings}
              currencyInput={currencyInput}
              currencyError={currencyError}
              rateStatus={rateStatus}
              rateStatusLabel={rateStatusLabel}
              ratesAsOfLabel={ratesAsOfLabel}
              benchmarkBaseLabel={benchmarkBaseLabel}
              inputClass={inputClass}
              onBaseChange={onBaseChange}
              onAddCurrency={onAddCurrency}
              setCurrencyInput={setCurrencyInput}
              onRefreshRates={onRefreshRates}
              onRateChange={onRateChange}
              onRemoveCurrency={onRemoveCurrency}
            />
          </div>
        </section>

        {/* Import/Export Section */}
        <section className="rounded-2xl border border-border bg-background-elevated/50 p-1">
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">import_export</span>
              Export & Import
            </h2>
            <p className="text-sm text-foreground-muted mt-1">
              Backup and restore your data
            </p>
          </div>
          <div className="p-4 pt-2">
            <ImportExport
              variant="desktop"
              includeDeletedExport={includeDeletedExport}
              onToggleIncludeDeleted={setIncludeDeletedExport}
              onExportJson={onExportJson}
              onExportCsv={onExportCsv}
              onImportJson={onImportJson}
              importPreview={importPreview}
              onApplyImport={onApplyImport}
              onCancelImport={onCancelImport}
              importError={importError}
              className={compactCardClass}
            />
          </div>
        </section>
      </div>
    </div>
  )
})

export default ToolsView

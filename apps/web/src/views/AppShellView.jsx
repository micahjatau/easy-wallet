import { useMemo, useCallback, useState, memo } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import BaseCurrencyChangeDialog from '../components/BaseCurrencyChangeDialog.jsx'
import DeleteBanner from '../components/DeleteBanner.jsx'
import Layout from '../components/Layout.jsx'
import OfflineBanner from '../components/OfflineBanner.jsx'
import TransactionForm from '../components/TransactionForm.jsx'
import MobileShellView from './MobileShellView.jsx'

// View components
import DashboardView from './DashboardView.jsx'
import TransactionsView from './TransactionsView.jsx'
import ToolsView from './ToolsView.jsx'
import SettingsView from './SettingsView.jsx'
import SupportView from './SupportView.jsx'

// Page transition wrapper component
const PageTransition = memo(function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
})

// Memoized view components to prevent unnecessary re-renders
const DashboardPage = memo(function DashboardPage({ dashboard, activity, dialog }) {
  return (
    <PageTransition>
      <DashboardView
        balance={dashboard?.balance}
        totals={dashboard?.totals}
        baseCurrency={dialog?.settings?.baseCurrency}
        filteredTransactions={activity?.filteredTransactions}
        settings={dialog?.settings}
        accounts={dialog?.accounts}
        onEdit={activity?.handleEdit}
        onDelete={activity?.handleDelete}
        onRestore={activity?.handleRestore}
      />
    </PageTransition>
  )
})

const TransactionsPage = memo(function TransactionsPage({ activity, dialog }) {
  return (
    <PageTransition>
      <TransactionsView
        variant="desktop"
        transactions={activity?.transactions}
        filteredTransactions={activity?.filteredTransactions}
        accounts={dialog?.accounts}
        settings={dialog?.settings}
        filters={activity?.filters}
        categories={activity?.allCategories}
        inputClass={activity?.inputClass}
        hasFilters={activity?.hasFilters}
        onClearFilters={activity?.handleClearFilters}
        onDateRangeModeChange={activity?.handleDateRangeModeChange}
        setFilters={activity?.setFilters}
        accountNameById={activity?.accountNameById}
        getCategoryAccent={activity?.getCategoryAccent}
        onEdit={activity?.handleEdit}
        onDelete={activity?.handleDelete}
        onRestore={activity?.handleRestore}
        rangeLabel={activity?.rangeLabel}
        rateStatusLabel={activity?.rateStatusLabel}
      />
    </PageTransition>
  )
})

const ToolsPage = memo(function ToolsPage({ toolsPayload }) {
  const {
    accountsPayload,
    categoriesPayload,
    importPayload,
    currencyPayload,
  } = toolsPayload

  return (
    <PageTransition>
      <ToolsView
        accounts={accountsPayload?.accounts}
        accountDrafts={accountsPayload?.accountDrafts}
        setAccountDrafts={accountsPayload?.setAccountDrafts}
        accountUsage={accountsPayload?.accountUsage}
        accountError={accountsPayload?.accountError}
        setAccountError={accountsPayload?.setAccountError}
        accountInput={accountsPayload?.accountInput}
        setAccountInput={accountsPayload?.setAccountInput}
        onAddAccount={accountsPayload?.handleAddAccount}
        onRenameAccount={accountsPayload?.handleRenameAccount}
        onRemoveAccount={accountsPayload?.handleRemoveAccount}
        categories={categoriesPayload?.allCategories}
        onAddCategory={categoriesPayload?.handleAddCategory}
        onEditCategory={categoriesPayload?.handleEditCategory}
        onDeleteCategory={categoriesPayload?.handleDeleteCategory}
        transactions={categoriesPayload?.transactions}
        settings={currencyPayload?.settings}
        currencyInput={currencyPayload?.currencyInput}
        currencyError={currencyPayload?.currencyError}
        rateStatus={currencyPayload?.rateStatus}
        rateStatusLabel={currencyPayload?.rateStatusLabel}
        ratesAsOfLabel={currencyPayload?.ratesAsOfLabel}
        benchmarkBaseLabel={currencyPayload?.benchmarkBaseLabel}
        inputClass={currencyPayload?.inputClass}
        onBaseChange={currencyPayload?.handleBaseChange}
        onAddCurrency={currencyPayload?.handleAddCurrency}
        setCurrencyInput={currencyPayload?.setCurrencyInput}
        onRefreshRates={currencyPayload?.refreshRates}
        onRateChange={currencyPayload?.handleRateChange}
        onRemoveCurrency={currencyPayload?.handleRemoveCurrency}
        includeDeletedExport={importPayload?.includeDeletedExport}
        setIncludeDeletedExport={importPayload?.setIncludeDeletedExport}
        onExportJson={importPayload?.handleExportJson}
        onExportCsv={importPayload?.handleExportCsv}
        onImportJson={importPayload?.handleImportJson}
        importPreview={importPayload?.importPreview}
        onApplyImport={importPayload?.handleApplyImport}
        onCancelImport={importPayload?.handleCancelImport}
        importError={importPayload?.importError}
      />
    </PageTransition>
  )
})

const SettingsPage = memo(function SettingsPage({ layout, header, dialog, toolsPayload }) {
  const {
    privacyPayload,
    importPayload,
    versioningPayload,
    syncPayload,
  } = toolsPayload

  return (
    <PageTransition>
      <SettingsView
        settings={dialog?.settings}
        _onUpdateSettings={dialog?.setSettings}
        isDarkMode={layout?.isDarkMode}
        onToggleDarkMode={layout?.toggleDarkMode}
        onExportData={privacyPayload?.handlePrivacyExport}
        onImportData={importPayload?.handleImportJson}
        onClearData={privacyPayload?.handleClearAllData}
        onClearOldData={privacyPayload?.handleClearOldData}
        onUpdatePrivacyRetention={privacyPayload?.handleUpdatePrivacyRetention}
        user={header?.profile}
        onLogout={header?.onLogout}
        transactions={privacyPayload?.transactions}
        accounts={privacyPayload?.accounts}
        includeDeletedExport={importPayload?.includeDeletedExport}
        setIncludeDeletedExport={importPayload?.setIncludeDeletedExport}
        onExportJson={importPayload?.handleExportJson}
        onExportCsv={importPayload?.handleExportCsv}
        onImportJson={importPayload?.handleImportJson}
        importPreview={importPayload?.importPreview}
        onApplyImport={importPayload?.handleApplyImport}
        onCancelImport={importPayload?.handleCancelImport}
        importError={importPayload?.importError}
        restorePoints={versioningPayload?.restorePoints}
        isLoadingRestorePoints={versioningPayload?.isLoadingRestorePoints}
        onCreateRestorePoint={versioningPayload?.handleCreateRestorePoint}
        onRestoreFromPoint={versioningPayload?.handleRestoreFromPoint}
        onDeleteRestorePoint={versioningPayload?.handleDeleteRestorePoint}
        auditLogs={versioningPayload?.auditLogs}
        isLoadingAudit={versioningPayload?.isLoadingAudit}
        autoSyncEnabled={syncPayload?.autoSyncEnabled}
        syncInterval={syncPayload?.syncInterval}
        onToggleAutoSync={syncPayload?.setAutoSyncEnabled}
        onChangeInterval={syncPayload?.setSyncInterval}
        hasConflicts={syncPayload?.hasConflicts}
        conflicts={syncPayload?.conflicts}
        onResolve={syncPayload?.handleResolveConflict}
        isResolving={syncPayload?.isResolvingConflict}
      />
    </PageTransition>
  )
})

const SupportPage = memo(function SupportPage() {
  return (
    <PageTransition>
      <SupportView />
    </PageTransition>
  )
})

const AppShellView = ({
  layout,
  header,
  deleteBanner,
  dashboard,
  activity,
  tools,
  mobile,
  connectivity,
  dialog,
  onAddTransaction,
}) => {
  const location = useLocation()
  const [showQuickAddModal, setShowQuickAddModal] = useState(false)

  // Prepare sidebar props
  const sidebarProps = {
    user: header?.profile,
    isDarkMode: layout?.isDarkMode,
    onToggleDarkMode: layout?.toggleDarkMode,
  }

  // Compute affected transactions for currency change dialog
  const affectedTransactionsCount = useMemo(() => {
    if (!dialog?.showBaseCurrencyDialog || !dialog?.pendingBaseCurrency) return 0
    return dialog?.transactions?.filter(
      (transaction) =>
        transaction.currency !== dialog.pendingBaseCurrency &&
        transaction.currency !== dialog.settings.baseCurrency,
    ).length
  }, [
    dialog?.showBaseCurrencyDialog,
    dialog?.pendingBaseCurrency,
    dialog?.transactions,
    dialog?.settings?.baseCurrency,
  ])

  // Handle quick add button
  const handleQuickAdd = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setShowQuickAddModal(true)
      return
    }

    if (onAddTransaction) {
      onAddTransaction()
    }
  }, [onAddTransaction])

  return (
    <Layout
      isDarkMode={layout?.isDarkMode}
      sidebarProps={sidebarProps}
      showQuickAdd={true}
      onQuickAdd={handleQuickAdd}
    >
      {/* Mobile view */}
      <div className="lg:hidden">
        <MobileShellView {...mobile} />
      </div>

      {/* Desktop view with sidebar navigation and routing */}
      <div className="hidden lg:block">
        <DeleteBanner
          deleteBanner={deleteBanner?.deleteBanner}
          onUndo={deleteBanner?.handleUndoDelete}
          onDismiss={deleteBanner?.handleDismissDeleteBanner}
        />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={<DashboardPage dashboard={dashboard} activity={activity} dialog={dialog} />} 
            />
            <Route 
              path="/transactions" 
              element={<TransactionsPage activity={activity} dialog={dialog} />} 
            />
            <Route 
              path="/tools" 
              element={<ToolsPage toolsPayload={tools} />} 
            />
            <Route 
              path="/settings" 
              element={<SettingsPage layout={layout} header={header} dialog={dialog} toolsPayload={tools} />} 
            />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
        </AnimatePresence>

        <OfflineBanner isOnline={connectivity?.isOnline} />
      </div>

      {/* Dialogs */}
      {showQuickAddModal ? (
        <div
          className="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 p-4 lg:flex"
          onClick={() => setShowQuickAddModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-add-title"
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="quick-add-title" className="font-display text-xl text-foreground">
                Add transaction
              </h2>
              <button
                type="button"
                onClick={() => setShowQuickAddModal(false)}
                className="rounded-lg p-2 text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground"
                aria-label="Close quick add"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <TransactionForm
              variant="desktop"
              formState={dashboard?.formState}
              formErrors={dashboard?.formErrors}
              isEditing={dashboard?.isEditing}
              accounts={dashboard?.accounts}
              settings={dashboard?.settings}
              rateMissingForForm={dashboard?.rateMissingForForm}
              inputClass={dashboard?.inputClass}
              onSubmit={dashboard?.handleSubmit}
              onCancelEdit={() => {
                dashboard?.handleCancelEdit?.()
                setShowQuickAddModal(false)
              }}
              setFormState={dashboard?.setFormState}
            />
          </div>
        </div>
      ) : null}

      <BaseCurrencyChangeDialog
        isOpen={dialog?.showBaseCurrencyDialog}
        currentCurrency={dialog?.settings?.baseCurrency}
        newCurrency={dialog?.pendingBaseCurrency}
        affectedTransactionsCount={affectedTransactionsCount}
        onConfirm={dialog?.confirmBaseCurrencyChange}
        onCancel={() => {
          dialog?.setShowBaseCurrencyDialog(false)
          dialog?.setPendingBaseCurrency(null)
        }}
      />
    </Layout>
  )
}

export default AppShellView

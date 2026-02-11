import { useMemo } from 'react'
import AccountsManager from '../components/AccountsManager.jsx'
import CategoryManager from '../components/CategoryManager.jsx'
import CurrencyTools from '../components/CurrencyTools.jsx'
import ImportExport from '../components/ImportExport.jsx'
import PrivacySettings from '../components/privacy/PrivacySettings.jsx'
import SyncTools from '../components/tools/SyncTools.jsx'
import VersioningTools from '../components/tools/VersioningTools.jsx'

export const useToolsSections = ({
  accountsPayload,
  categoriesPayload,
  importPayload,
  currencyPayload,
  privacyPayload,
  versioningPayload,
  syncPayload,
}) => {
  const {
    accounts,
    accountDrafts,
    setAccountDrafts,
    accountUsage,
    accountError,
    setAccountError,
    accountInput,
    setAccountInput,
    handleRenameAccount,
    handleRemoveAccount,
    handleAddAccount,
  } = accountsPayload
  const {
    allCategories,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    transactions,
  } = categoriesPayload
  const {
    includeDeletedExport,
    setIncludeDeletedExport,
    handleExportJson,
    handleExportCsv,
    handleImportJson,
    importPreview,
    handleApplyImport,
    handleCancelImport,
    importError,
  } = importPayload
  const {
    settings,
    currencyInput,
    currencyError,
    rateStatus,
    rateStatusLabel,
    ratesAsOfLabel,
    benchmarkBaseLabel,
    inputClass,
    handleBaseChange,
    handleAddCurrency,
    setCurrencyInput,
    refreshRates,
    handleRateChange,
    handleRemoveCurrency,
  } = currencyPayload
  const {
    handlePrivacyExport,
    handleUpdatePrivacyRetention,
    handleClearAllData,
    handleClearOldData,
  } = privacyPayload
  const {
    restorePoints,
    isLoadingRestorePoints,
    handleCreateRestorePoint,
    handleRestoreFromPoint,
    handleDeleteRestorePoint,
    auditLogs,
    isLoadingAudit,
  } = versioningPayload
  const {
    autoSyncEnabled,
    syncInterval,
    setAutoSyncEnabled,
    setSyncInterval,
    hasConflicts,
    conflicts,
    handleResolveConflict,
    isResolvingConflict,
  } = syncPayload
  const compactCardClass = 'bg-background-elevated shadow-none border-border p-4 md:p-4'
  const compactCardClassMobile = 'bg-background-elevated shadow-none border-border p-4'

  const desktopToolsSections = useMemo(
    () => [
      {
        id: 'accounts',
        title: 'Accounts',
        content: (
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
            onRenameAccount={handleRenameAccount}
            onRemoveAccount={handleRemoveAccount}
            onAddAccount={handleAddAccount}
            className={compactCardClass}
          />
        ),
      },
      {
        id: 'categories',
        title: 'Categories',
        content: (
          <CategoryManager
            categories={allCategories}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            transactions={transactions}
          />
        ),
      },
      {
        id: 'import',
        title: 'Export & Import',
        content: (
          <ImportExport
            variant="desktop"
            includeDeletedExport={includeDeletedExport}
            onToggleIncludeDeleted={setIncludeDeletedExport}
            onExportJson={handleExportJson}
            onExportCsv={handleExportCsv}
            onImportJson={handleImportJson}
            importPreview={importPreview}
            onApplyImport={handleApplyImport}
            onCancelImport={handleCancelImport}
            importError={importError}
            className={compactCardClass}
          />
        ),
      },
      {
        id: 'rates',
        title: 'Currency Studio / Rates',
        content: (
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
            onBaseChange={handleBaseChange}
            onAddCurrency={handleAddCurrency}
            setCurrencyInput={setCurrencyInput}
            onRefreshRates={refreshRates}
            onRateChange={handleRateChange}
            onRemoveCurrency={handleRemoveCurrency}
          />
        ),
      },
      {
        id: 'privacy',
        title: 'Privacy & Data',
        content: (
          <PrivacySettings
            state={{ transactions, accounts, settings }}
            onExport={handlePrivacyExport}
            onUpdateRetention={handleUpdatePrivacyRetention}
            onClearData={handleClearAllData}
            onClearOldData={handleClearOldData}
          />
        ),
      },
      {
        id: 'versioning',
        title: 'Data Versioning',
        content: (
          <VersioningTools
            restorePoints={restorePoints}
            isLoadingRestorePoints={isLoadingRestorePoints}
            onCreateRestorePoint={handleCreateRestorePoint}
            onRestoreFromPoint={handleRestoreFromPoint}
            onDeleteRestorePoint={handleDeleteRestorePoint}
            auditLogs={auditLogs}
            isLoadingAudit={isLoadingAudit}
          />
        ),
      },
      {
        id: 'sync',
        title: 'Cloud Backup',
        content: (
          <SyncTools
            autoSyncEnabled={autoSyncEnabled}
            syncInterval={syncInterval}
            onToggleAutoSync={setAutoSyncEnabled}
            onChangeInterval={setSyncInterval}
            hasConflicts={hasConflicts}
            conflicts={conflicts}
            onResolve={handleResolveConflict}
            isResolving={isResolvingConflict}
          />
        ),
      },
    ],
    [
      accounts,
      accountDrafts,
      setAccountDrafts,
      accountUsage,
      accountError,
      setAccountError,
      accountInput,
      setAccountInput,
      handleRenameAccount,
      handleRemoveAccount,
      handleAddAccount,
      allCategories,
      handleAddCategory,
      handleEditCategory,
      handleDeleteCategory,
      transactions,
      includeDeletedExport,
      setIncludeDeletedExport,
      handleExportJson,
      handleExportCsv,
      handleImportJson,
      importPreview,
      handleApplyImport,
      handleCancelImport,
      importError,
      settings,
      currencyInput,
      currencyError,
      rateStatus,
      rateStatusLabel,
      ratesAsOfLabel,
      benchmarkBaseLabel,
      inputClass,
      handleBaseChange,
      handleAddCurrency,
      setCurrencyInput,
      refreshRates,
      handleRateChange,
      handleRemoveCurrency,
      handlePrivacyExport,
      handleUpdatePrivacyRetention,
      handleClearAllData,
      handleClearOldData,
      restorePoints,
      isLoadingRestorePoints,
      handleCreateRestorePoint,
      handleRestoreFromPoint,
      handleDeleteRestorePoint,
      auditLogs,
      isLoadingAudit,
      autoSyncEnabled,
      syncInterval,
      setAutoSyncEnabled,
      setSyncInterval,
      hasConflicts,
      conflicts,
      handleResolveConflict,
      isResolvingConflict,
    ],
  )

  const mobileToolsSections = useMemo(
    () => [
      {
        id: 'accounts',
        title: 'Accounts',
        content: (
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
            onRenameAccount={handleRenameAccount}
            onRemoveAccount={handleRemoveAccount}
            onAddAccount={handleAddAccount}
            className={compactCardClassMobile}
          />
        ),
      },
      {
        id: 'categories',
        title: 'Categories',
        content: (
          <CategoryManager
            categories={allCategories}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            transactions={transactions}
          />
        ),
      },
      {
        id: 'import',
        title: 'Export & Import',
        content: (
          <ImportExport
            variant="mobile"
            includeDeletedExport={includeDeletedExport}
            onToggleIncludeDeleted={setIncludeDeletedExport}
            onExportJson={handleExportJson}
            onExportCsv={handleExportCsv}
            onImportJson={handleImportJson}
            importPreview={importPreview}
            onApplyImport={handleApplyImport}
            onCancelImport={handleCancelImport}
            importError={importError}
            className={compactCardClassMobile}
          />
        ),
      },
      {
        id: 'rates',
        title: 'Currency Studio / Rates',
        content: (
          <CurrencyTools
            variant="mobile"
            cardClassName={compactCardClassMobile}
            settings={settings}
            currencyInput={currencyInput}
            currencyError={currencyError}
            rateStatus={rateStatus}
            rateStatusLabel={rateStatusLabel}
            ratesAsOfLabel={ratesAsOfLabel}
            benchmarkBaseLabel={benchmarkBaseLabel}
            inputClass={inputClass}
            onBaseChange={handleBaseChange}
            onAddCurrency={handleAddCurrency}
            setCurrencyInput={setCurrencyInput}
            onRefreshRates={refreshRates}
            onRateChange={handleRateChange}
            onRemoveCurrency={handleRemoveCurrency}
          />
        ),
      },
      {
        id: 'privacy',
        title: 'Privacy & Data',
        content: (
          <PrivacySettings
            state={{ transactions, accounts, settings }}
            onExport={handlePrivacyExport}
            onUpdateRetention={handleUpdatePrivacyRetention}
            onClearData={handleClearAllData}
            onClearOldData={handleClearOldData}
          />
        ),
      },
      {
        id: 'versioning',
        title: 'Data Versioning',
        content: (
          <VersioningTools
            restorePoints={restorePoints}
            isLoadingRestorePoints={isLoadingRestorePoints}
            onCreateRestorePoint={handleCreateRestorePoint}
            onRestoreFromPoint={handleRestoreFromPoint}
            onDeleteRestorePoint={handleDeleteRestorePoint}
            auditLogs={auditLogs}
            isLoadingAudit={isLoadingAudit}
          />
        ),
      },
      {
        id: 'sync',
        title: 'Cloud Backup',
        content: (
          <SyncTools
            autoSyncEnabled={autoSyncEnabled}
            syncInterval={syncInterval}
            onToggleAutoSync={setAutoSyncEnabled}
            onChangeInterval={setSyncInterval}
            hasConflicts={hasConflicts}
            conflicts={conflicts}
            onResolve={handleResolveConflict}
            isResolving={isResolvingConflict}
          />
        ),
      },
    ],
    [
      accounts,
      accountDrafts,
      setAccountDrafts,
      accountUsage,
      accountError,
      setAccountError,
      accountInput,
      setAccountInput,
      handleRenameAccount,
      handleRemoveAccount,
      handleAddAccount,
      allCategories,
      handleAddCategory,
      handleEditCategory,
      handleDeleteCategory,
      transactions,
      includeDeletedExport,
      setIncludeDeletedExport,
      handleExportJson,
      handleExportCsv,
      handleImportJson,
      importPreview,
      handleApplyImport,
      handleCancelImport,
      importError,
      settings,
      currencyInput,
      currencyError,
      rateStatus,
      rateStatusLabel,
      ratesAsOfLabel,
      benchmarkBaseLabel,
      inputClass,
      handleBaseChange,
      handleAddCurrency,
      setCurrencyInput,
      refreshRates,
      handleRateChange,
      handleRemoveCurrency,
      handlePrivacyExport,
      handleUpdatePrivacyRetention,
      handleClearAllData,
      handleClearOldData,
      restorePoints,
      isLoadingRestorePoints,
      handleCreateRestorePoint,
      handleRestoreFromPoint,
      handleDeleteRestorePoint,
      auditLogs,
      isLoadingAudit,
      autoSyncEnabled,
      syncInterval,
      setAutoSyncEnabled,
      setSyncInterval,
      hasConflicts,
      conflicts,
      handleResolveConflict,
      isResolvingConflict,
    ],
  )

  return {
    desktopToolsSections,
    mobileToolsSections,
  }
}

export default useToolsSections

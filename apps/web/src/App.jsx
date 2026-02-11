import { useCallback, useEffect, useState } from 'react'
import AppShellView from './views/AppShellView.jsx'

import { useAuthContext } from './contexts/useAuthContext.js'
import { useToast } from './contexts/useToast.js'
import { useStorageError } from './contexts/StorageErrorContext.jsx'
import { useAccountActions } from './hooks/useAccountActions.js'
import { useAudit } from './hooks/useAudit.js'
import { useAutoSyncScheduler } from './hooks/useAutoSyncScheduler.js'
import { useCategories } from './hooks/useCategories.js'
import { useCategoryActions } from './hooks/useCategoryActions.js'
import { useCategoryAnalytics } from './hooks/useCategoryAnalytics.js'
import { useCurrencyActions } from './hooks/useCurrencyActions.js'
import { useDataManagementActions } from './hooks/useDataManagementActions.js'
import { useDebounce } from './hooks/useDebounce.js'
import { useDateRangeState } from './hooks/useDateRangeState.js'
import { useActivityFilters } from './hooks/useActivityFilters.js'
import { useActivityData } from './hooks/useActivityData.js'
import { useAccountUsage } from './hooks/useAccountUsage.js'
import { useFormActions } from './hooks/useFormActions.js'
import { useRates } from './hooks/useRates.js'
import { useRestorePoints } from './hooks/useRestorePoints.js'
import { useSync } from './hooks/useSync.js'
import { useImportExportActions } from './hooks/useImportExportActions.js'
import { useUiLabels } from './hooks/useUiLabels.js'
import { useToolsPayload } from './hooks/useToolsPayload.js'
import { useToolsSections } from './hooks/useToolsSections.jsx'
import { useTransactionActions } from './hooks/useTransactionActions.js'
import { useViewState } from './hooks/useViewState.js'
import { useVersioningDataState } from './hooks/useVersioningDataState.js'
import { useVersioningSyncActions } from './hooks/useVersioningSyncActions.js'
import {
  useStorageState,
} from './hooks/useStorageState.js'
import { getRateForCurrency } from '@easy-ledger/core'
import { formatDate, formatTimestamp } from './lib/formatters.js'
import { APP_NAME } from './lib/ledgerConfig.js'
import {
  getCategoryAccent,
  getDefaultCustomDates,
  getDefaultFormState,
  getToday,
} from './lib/appUtils.js'



function AppInner() {
  const getInitialDarkMode = () => {
    if (typeof window === 'undefined') return false
    try {
      const saved = localStorage.getItem('easy-ledger-dark-mode')
      return saved ? Boolean(JSON.parse(saved)) : false
    } catch {
      return false
    }
  }

  const defaultCustomDates = getDefaultCustomDates()
  const { profileId, profile, user, deviceId } = useAuthContext()
  const { storageError, reportStorageError } = useStorageError()
  const {
    transactions,
    setTransactions,
    settings,
    setSettings,
    accounts,
    setAccounts,
  } = useStorageState(profileId, reportStorageError)
  const { logTransactionChange, getRecentAuditLogs } = useAudit(profileId)
  const { createRestorePoint, getRestorePoints, deleteRestorePoint } = useRestorePoints(profileId)
  const handleSyncedAtChange = useCallback(
    (nextSyncedAt) => {
      setSettings((prev) => ({
        ...prev,
        syncedAt: nextSyncedAt,
      }))
    },
    [setSettings],
  )
  const handleSyncMetaChange = useCallback(
    (nextSyncMeta) => {
      setSettings((prev) => ({
        ...prev,
        syncMeta: {
          ...prev.syncMeta,
          ...nextSyncMeta,
        },
      }))
    },
    [setSettings],
  )
  const {
    syncState,
    lastSyncAt,
    pendingChanges,
    conflicts,
    hasConflicts,
    isOnline,
    triggerSync,
    queueChange,
    resolveConflict,
    SYNC_STATES,
  } = useSync(
    profile?.id,
    deviceId,
    settings.syncedAt,
    handleSyncedAtChange,
    settings.syncMeta,
    handleSyncMetaChange,
  )
  const { success, error: showError, info } = useToast()

  // Handle storage errors
  useEffect(() => {
    if (storageError) {
      showError(storageError.message)
      if (storageError.type === 'quota_exceeded') {
        info('Consider exporting and clearing old data to free up space.')
      } else if (storageError.type === 'storage_disabled') {
        info('Please disable private browsing to save your data permanently.')
      }
    }
  }, [storageError, showError, info])

  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
  const [syncInterval, setSyncInterval] = useState(6 * 60 * 60 * 1000) // 6 hours
  const [isResolvingConflict, setIsResolvingConflict] = useState(false)
  const [showBaseCurrencyDialog, setShowBaseCurrencyDialog] = useState(false)
  const [pendingBaseCurrency, setPendingBaseCurrency] = useState(null)
  const [formState, setFormState] = useState(() =>
    getDefaultFormState(settings.baseCurrency, accounts[0]?.id),
  )
  const [formErrors, setFormErrors] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    accountId: 'all',
    showDeleted: false,
    dateRangeMode: 'this_month',
    customStart: defaultCustomDates.customStart,
    customEnd: defaultCustomDates.customEnd,
  })

  // Debounce search input to prevent excessive filtering on every keystroke
  const debouncedSearch = useDebounce(filters.search, 300)

  const [editingId, setEditingId] = useState(null)
  const [accountInput, setAccountInput] = useState('')
  const [accountDrafts, setAccountDrafts] = useState({})
  const [accountError, setAccountError] = useState('')
  const [currencyInput, setCurrencyInput] = useState('')
  const [currencyError, setCurrencyError] = useState('')
  const [activeView, setActiveView] = useState('activity')
  const [includeDeletedExport, setIncludeDeletedExport] = useState(false)
  const [importError, setImportError] = useState('')
  const [importPreview, setImportPreview] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode)

  const {
    auditLogs,
    restorePoints,
    isLoadingAudit,
    isLoadingRestorePoints,
    setRestorePoints,
  } = useVersioningDataState({
    profileId: profile?.id,
    getRecentAuditLogs,
    getRestorePoints,
    onError: showError,
  })

  // Form actions hook
  const {
    handleCancelEdit,
    handleClearFilters,
    handleSetView,
    toggleDarkMode,
  } = useFormActions({
    setEditingId,
    setFormErrors,
    setFormState,
    setFilters,
    setActiveView,
    setIsDarkMode,
  })

  // Activity filters hook
  const { handleDateRangeModeChange } = useActivityFilters(setFilters)

  // Account actions hook
  const {
    handleAddAccount,
    handleRenameAccount,
    handleRemoveAccount,
  } = useAccountActions({
    accounts,
    transactions,
    accountInput,
    accountDrafts,
    setAccounts,
    setAccountInput,
    setAccountDrafts,
    setAccountError,
    success,
    info,
    queueChange,
  })

  // Category actions hook
  const {
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
  } = useCategoryActions({
    setTransactions,
    setSettings,
    success,
    queueChange,
  })

  const {
    isEditing,
    deleteBanner,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleRestore,
    handleUndoDelete,
    handleDismissDeleteBanner,
  } = useTransactionActions({
    transactions,
    accounts,
    settings,
    formState,
    setFormState,
    setFormErrors,
    editingId,
    setEditingId,
    setTransactions,
    profile,
    user,
    deviceId,
    logTransactionChange,
    handleSetView,
    handleCancelEdit,
    success,
    info,
    queueChange,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('easy-ledger-dark-mode', JSON.stringify(isDarkMode))
    }
  }, [isDarkMode])

  useEffect(() => {
    setFormState((prev) => {
      const currencyAvailable = settings.currencies.includes(prev.currency)
      const nextCurrency = currencyAvailable
        ? prev.currency
        : settings.baseCurrency
      return { ...prev, currency: nextCurrency }
    })
  }, [settings.baseCurrency, settings.currencies])

  useEffect(() => {
    setFormState((prev) => {
      const accountAvailable = accounts.some(
        (account) => account.id === prev.accountId,
      )
      const nextAccountId = accountAvailable ? prev.accountId : accounts[0]?.id
      return { ...prev, accountId: nextAccountId || '' }
    })
    setFilters((prev) => {
      const accountAvailable =
        prev.accountId === 'all' ||
        accounts.some((account) => account.id === prev.accountId)
      return accountAvailable ? prev : { ...prev, accountId: 'all' }
    })
  }, [accounts])

  const {
    handleCreateRestorePoint,
    handleRestoreFromPoint,
    handleDeleteRestorePoint,
    handleManualSync,
    handleResolveConflict,
  } = useVersioningSyncActions({
    profile,
    transactions,
    accounts,
    settings,
    deviceId,
    createRestorePoint,
    deleteRestorePoint,
    triggerSync,
    resolveConflict,
    setRestorePoints,
    setTransactions,
    setAccounts,
    setSettings,
    onSyncMetaChange: handleSyncMetaChange,
    setIsResolvingConflict,
    success,
    showError,
    info,
  })

  useAutoSyncScheduler({
    autoSyncEnabled,
    profileId: profile?.id,
    isOnline,
    syncInterval,
    handleManualSync,
  })

  const {
    activeRange,
    rangeLabel,
    rangeShortLabel,
  } = useDateRangeState(filters)

  const {
    activeTransactions,
    rangeTransactions,
    filteredTransactions,
    accountNameById,
  } = useActivityData({
    transactions,
    filters,
    activeRange,
    debouncedSearch,
    accounts,
  })

  const { rateStatus, refreshRates } = useRates({
    settings,
    setSettings,
    activeTransactions,
  })

  // Get all categories including custom ones
  const { allCategories } = useCategories(settings?.customCategories)

  const {
    totals,
    categoryData,
    categoryTotal,
    topCategory,
    topCategoryPercent,
  } = useCategoryAnalytics({
    rangeTransactions,
    settings,
    allCategories,
  })

  const balance = totals.balance

  const {
    handleExportJson,
    handleExportCsv,
    handleImportJson,
    handleApplyImport,
    handleCancelImport,
  } = useImportExportActions({
    transactions,
    settings,
    accounts,
    includeDeletedExport,
    importPreview,
    profile,
    deviceId,
    createRestorePoint,
    setImportError,
    setImportPreview,
    setSettings,
    setAccounts,
    setTransactions,
    setEditingId,
    setFormErrors,
    setFormState,
    success,
    info,
    queueChange,
  })

  const {
    handleAddCurrency,
    handleRemoveCurrency,
    handleBaseChange,
    confirmBaseCurrencyChange,
    handleRateChange,
  } = useCurrencyActions({
    currencyInput,
    settings,
    activeTransactions,
    pendingBaseCurrency,
    setCurrencyError,
    setSettings,
    setCurrencyInput,
    setPendingBaseCurrency,
    setShowBaseCurrencyDialog,
    refreshRates,
    success,
  })

  const {
    handlePrivacyExport,
    handleUpdatePrivacyRetention,
    handleClearAllData,
    handleClearOldData,
  } = useDataManagementActions({
    profile,
    transactions,
    accounts,
    settings,
    deviceId,
    createRestorePoint,
    setSettings,
    setTransactions,
    setAccounts,
    setActiveView,
    success,
    info,
    queueChange,
  })

  const rateMissingForForm =
    formState.currency !== settings.baseCurrency &&
    !getRateForCurrency(
      settings.rates,
      settings.baseCurrency,
      formState.currency,
    )

  const { accountUsage } = useAccountUsage({
    accounts,
    transactions,
  })

  const {
    showActivity,
    showNew,
    showSnapshot,
    showTools,
  } = useViewState(activeView)

  const {
    todayLabel,
    ratesAsOfLabel,
    syncStatusLabel,
    benchmarkBaseLabel,
    rateStatusLabel,
    hasFilters,
  } = useUiLabels({
    settings,
    totals,
    filters,
    formatDate,
    formatTimestamp,
    getToday,
  })



  const inputClass =
    'mt-2 h-10 w-full rounded-lg border border-border bg-background-elevated px-3 text-sm text-foreground placeholder:text-foreground-subtle transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
  const toolsPayload = useToolsPayload({
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
  })

  const { desktopToolsSections, mobileToolsSections } = useToolsSections(toolsPayload)

  return (
    <AppShellView
      layout={{
        isDarkMode,
        activeView,
        handleSetView,
      }}
      header={{
        APP_NAME,
        syncStatusLabel,
        todayLabel,
        isDarkMode,
        toggleDarkMode,
        syncState,
        lastSyncAt,
        pendingChanges,
        conflicts,
        hasConflicts,
        isOnline,
        handleManualSync,
        SYNC_STATES,
      }}
      deleteBanner={{
        deleteBanner,
        handleUndoDelete,
        handleDismissDeleteBanner,
      }}
      dashboard={{
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
      }}
      activity={{
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
      }}
      tools={{
        desktopToolsSections,
        isDarkMode,
      }}
      mobile={{
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
      }}
      connectivity={{ isOnline }}
      dialog={{
        showBaseCurrencyDialog,
        settings,
        pendingBaseCurrency,
        transactions,
        confirmBaseCurrencyChange,
        setShowBaseCurrencyDialog,
        setPendingBaseCurrency,
      }}
    />
  )
}

function App() {
  const { profileId } = useAuthContext()
  return <AppInner key={profileId || 'default'} />
}

export default App

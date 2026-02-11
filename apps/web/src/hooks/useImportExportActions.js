import { useCallback } from 'react'
import {
  APP_NAME,
  APP_SLUG,
  SCHEMA_VERSION,
} from '../lib/ledgerConfig.js'
import {
  downloadFile,
  getDefaultFormState,
  getToday,
  toCsvValue,
} from '../lib/appUtils.js'
import {
  sanitizeAccounts,
  sanitizeSettings,
  sanitizeTransactions,
} from './useStorageState.js'

export const useImportExportActions = ({
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
}) => {
  const handleExportJson = useCallback(() => {
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      appName: APP_NAME,
      appSlug: APP_SLUG,
      state: {
        transactions,
        settings,
        accounts,
      },
    }
    const filename = `${APP_SLUG}-export-${getToday()}.json`
    downloadFile(JSON.stringify(payload, null, 2), filename, 'application/json')
    success('Data exported as JSON')
  }, [transactions, settings, accounts, success])

  const handleExportCsv = useCallback(() => {
    const rows = [
      [
        'id',
        'name',
        'amount',
        'category',
        'date',
        'type',
        'currency',
        'accountId',
        'createdAt',
        'updatedAt',
        'isDeleted',
        'deletedAt',
      ].join(','),
    ]

    const exportable = includeDeletedExport
      ? transactions
      : transactions.filter((transaction) => !transaction.isDeleted)

    exportable.forEach((transaction) => {
      rows.push(
        [
          transaction.id,
          transaction.name,
          transaction.amount,
          transaction.category,
          transaction.date,
          transaction.type,
          transaction.currency,
          transaction.accountId,
          transaction.createdAt,
          transaction.updatedAt,
          transaction.isDeleted,
          transaction.deletedAt,
        ]
          .map(toCsvValue)
          .join(','),
      )
    })

    const filename = `${APP_SLUG}-export-${getToday()}.csv`
    downloadFile(rows.join('\n'), filename, 'text/csv;charset=utf-8;')
    success('Data exported as CSV')
  }, [includeDeletedExport, transactions, success])

  const handleImportJson = useCallback(
    (event) => {
      const input = event.target
      const file = input.files?.[0]
      if (!file) return

      setImportError('')
      setImportPreview(null)

      const resetInput = () => {
        if (input) input.value = ''
      }

      const reader = new FileReader()
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result)
          if (!parsed || typeof parsed !== 'object') {
            throw new Error('Invalid JSON file.')
          }

          const schemaVersionValue = Number(parsed.schemaVersion)
          const schemaVersion = Number.isFinite(schemaVersionValue)
            ? schemaVersionValue
            : 1

          const state =
            parsed.state && typeof parsed.state === 'object'
              ? parsed.state
              : parsed.data && typeof parsed.data === 'object'
                ? parsed.data
                : parsed

          const hasLedgerState =
            state &&
            typeof state === 'object' &&
            ('transactions' in state || 'settings' in state || 'accounts' in state)

          if (!hasLedgerState) {
            throw new Error('No ledger state found in file.')
          }

          const nextSettings = sanitizeSettings(state?.settings)
          const nextAccounts = sanitizeAccounts(state?.accounts)
          const nextTransactions = sanitizeTransactions(
            state?.transactions,
            nextSettings,
            nextAccounts,
          )

          setImportPreview({
            schemaVersion,
            exportedAt:
              typeof parsed.exportedAt === 'string' ||
              typeof parsed.exportedAt === 'number'
                ? parsed.exportedAt
                : null,
            appName: typeof parsed.appName === 'string' ? parsed.appName : '',
            appSlug: typeof parsed.appSlug === 'string' ? parsed.appSlug : '',
            summary: {
              transactionsCount: nextTransactions.length,
              accountsCount: nextAccounts.length,
              baseCurrency: nextSettings.baseCurrency,
            },
            data: {
              settings: nextSettings,
              accounts: nextAccounts,
              transactions: nextTransactions,
            },
          })
        } catch {
          setImportError('Invalid JSON file. Please select a valid export.')
        }
        resetInput()
      }

      reader.onerror = () => {
        setImportError('Unable to read that file.')
        resetInput()
      }

      reader.readAsText(file)
    },
    [setImportError, setImportPreview],
  )

  const handleApplyImport = useCallback(async () => {
    if (!importPreview?.data) return

    if (profile?.id) {
      try {
        await createRestorePoint({
          userId: profile.id,
          name: 'Before import',
          snapshotType: 'auto',
          state: { transactions, accounts, settings },
          deviceId,
        })
      } catch {
        info?.('Import backup could not be created. Continuing with import.')
      }
    }

    const {
      settings: nextSettings,
      accounts: nextAccounts,
      transactions: nextTransactions,
    } = importPreview.data

    setSettings(nextSettings)
    setAccounts(nextAccounts)
    setTransactions(nextTransactions)
    setEditingId(null)
    setFormErrors({})
    setImportError('')
    setImportPreview(null)
    setFormState((prev) =>
      getDefaultFormState(nextSettings.baseCurrency, nextAccounts[0]?.id, prev.type),
    )
    queueChange?.()
    success(`Import successful! ${nextTransactions.length} transactions imported.`)
  }, [
    importPreview,
    profile?.id,
    createRestorePoint,
    transactions,
    accounts,
    settings,
    deviceId,
    setSettings,
    setAccounts,
    setTransactions,
    setEditingId,
    setFormErrors,
    setImportError,
    setImportPreview,
    setFormState,
    success,
    info,
    queueChange,
  ])

  const handleCancelImport = useCallback(() => {
    setImportPreview(null)
    setImportError('')
  }, [setImportPreview, setImportError])

  return {
    handleExportJson,
    handleExportCsv,
    handleImportJson,
    handleApplyImport,
    handleCancelImport,
  }
}

export default useImportExportActions

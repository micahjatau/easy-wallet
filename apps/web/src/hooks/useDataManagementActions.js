import { useCallback } from 'react'
import { getAccountId } from './useStorageState.js'

export const useDataManagementActions = ({
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
}) => {
  const handlePrivacyExport = useCallback(
    (timestamp) => {
      setSettings((prev) => ({
        ...prev,
        privacy: {
          ...prev.privacy,
          lastExportAt: timestamp,
        },
      }))
    },
    [setSettings],
  )

  const handleUpdatePrivacyRetention = useCallback(
    ({ dataRetentionDays, autoBackup }) => {
      setSettings((prev) => ({
        ...prev,
        privacy: {
          ...prev.privacy,
          dataRetentionDays,
          autoBackup,
        },
      }))
      queueChange?.()
    },
    [setSettings, queueChange],
  )

  const handleClearAllData = useCallback(async () => {
    if (profile?.id) {
      await createRestorePoint({
        userId: profile.id,
        name: 'Before clear all data',
        snapshotType: 'auto',
        state: { transactions, accounts, settings },
        deviceId,
      })
    }

    setTransactions([])
    setAccounts([
      {
        id: getAccountId(),
        name: 'Cash',
        createdAt: Date.now(),
      },
    ])
    setSettings({
      baseCurrency: 'NGN',
      currencies: ['NGN'],
      rates: { NGN: 1 },
      ratesAsOf: null,
      syncedAt: null,
      ratesStale: false,
      privacy: {
        dataRetentionDays: 90,
        autoBackup: true,
        lastExportAt: null,
        storageUsage: {
          localBytes: 0,
          remoteBytes: 0,
        },
      },
    })
    setActiveView('activity')
    queueChange?.()
    const message = profile?.id
      ? 'All data cleared. A restore point was created automatically.'
      : 'All data cleared.'
    success(message)
  }, [
    profile?.id,
    createRestorePoint,
    transactions,
    accounts,
    settings,
    deviceId,
    setTransactions,
    setAccounts,
    setSettings,
    setActiveView,
    success,
    queueChange,
  ])

  const handleClearOldData = useCallback(
    async (daysToKeep = 30) => {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const transactionsToKeep = transactions.filter(
        (transaction) => new Date(transaction.date) >= cutoffDate || transaction.isDeleted,
      )
      const deletedCount = transactions.length - transactionsToKeep.length

      if (deletedCount === 0) {
        info('No old transactions to clear.')
        return
      }

      if (profile?.id) {
        await createRestorePoint({
          userId: profile.id,
          name: `Before clearing ${deletedCount} old transactions`,
          snapshotType: 'auto',
          state: { transactions, accounts, settings },
          deviceId,
        })
      }

      setTransactions(transactionsToKeep)
      queueChange?.()
      success(
        `${deletedCount} old transaction${deletedCount !== 1 ? 's' : ''} cleared. Recent data preserved.`,
      )
    },
    [
      transactions,
      info,
      profile?.id,
      createRestorePoint,
      accounts,
      settings,
      deviceId,
      setTransactions,
      success,
      queueChange,
    ],
  )

  return {
    handlePrivacyExport,
    handleUpdatePrivacyRetention,
    handleClearAllData,
    handleClearOldData,
  }
}

export default useDataManagementActions

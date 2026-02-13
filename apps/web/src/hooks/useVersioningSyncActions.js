import { useCallback } from 'react'
import {
  sanitizeAccounts,
  sanitizeSettings,
  sanitizeTransactions,
} from './useStorageState.js'

const sanitizeIncomingState = (rawState) => {
  if (!rawState || typeof rawState !== 'object') return null

  const hasLedgerState =
    'transactions' in rawState || 'accounts' in rawState || 'settings' in rawState
  if (!hasLedgerState) return null

  const nextSettings = sanitizeSettings(rawState.settings)
  const nextAccounts = sanitizeAccounts(rawState.accounts)
  const nextTransactions = sanitizeTransactions(
    rawState.transactions,
    nextSettings,
    nextAccounts,
  )

  return {
    settings: nextSettings,
    accounts: nextAccounts,
    transactions: nextTransactions,
  }
}

export const useVersioningSyncActions = ({
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
  onSyncMetaChange,
  setIsResolvingConflict,
  success,
  showError,
  info,
}) => {
  const handleCreateRestorePoint = useCallback(
    async (name) => {
      if (!profile?.id) return
      const result = await createRestorePoint({
        userId: profile.id,
        name,
        snapshotType: 'manual',
        state: { transactions, accounts, settings },
        deviceId,
      })
      if (result.data) {
        setRestorePoints((prev) => [result.data, ...prev])
        success(`Snapshot "${name}" created successfully`)
      } else if (result.error) {
        showError(`Failed to create snapshot: ${result.error}`)
      }
      return result
    },
    [
      profile?.id,
      transactions,
      accounts,
      settings,
      deviceId,
      createRestorePoint,
      setRestorePoints,
      success,
      showError,
    ],
  )

  const handleRestoreFromPoint = useCallback(
    async (point) => {
      if (!point?.state_json) return

      const sanitizedState = sanitizeIncomingState(point.state_json)
      if (!sanitizedState) {
        showError('Failed to restore snapshot: invalid payload.')
        return
      }

      setTransactions(sanitizedState.transactions)
      setAccounts(sanitizedState.accounts)
      setSettings(sanitizedState.settings)
      success(`Data restored to "${point.name}"`)
    },
    [setTransactions, setAccounts, setSettings, success, showError],
  )

  const handleDeleteRestorePoint = useCallback(
    async (pointId) => {
      const result = await deleteRestorePoint(pointId)
      if (result.success) {
        setRestorePoints((prev) => prev.filter((point) => point.id !== pointId))
      }
      return result
    },
    [deleteRestorePoint, setRestorePoints],
  )

  const handleManualSync = useCallback(
    async () => {
      const result = await triggerSync({ transactions, accounts, settings })
      
      // Priority 1: Remote data available (restore from cloud immediately)
      if (result.remoteData) {
        const sanitizedState = sanitizeIncomingState(result.remoteData)
        if (!sanitizedState) {
          showError('Backup restore failed: invalid cloud payload.')
          return
        }

        setTransactions(sanitizedState.transactions)
        setAccounts(sanitizedState.accounts)
        setSettings(sanitizedState.settings)
        if (onSyncMetaChange) {
          onSyncMetaChange({
            lastRemoteVersion: Number.isFinite(Number(result.remoteVersion))
              ? Number(result.remoteVersion)
              : sanitizedState.settings?.syncMeta?.lastRemoteVersion || 0,
            lastRemoteUpdatedAt:
              result.remoteUpdatedAt ||
              sanitizedState.settings?.syncMeta?.lastRemoteUpdatedAt ||
              null,
          })
        }
        success('Backup restored from cloud')
        return
      }
      
      // Priority 2: Conflicts detected
      if (result.conflicts) {
        info(
          `${result.conflicts.length} conflict(s) detected. Please resolve in Cloud Backup section.`,
        )
        return
      }
      
      // Priority 3: Error with context
      if (result.error) {
        const errorContext =
          result.errorCode === 'permission' ? 'Authentication error' : 'Backup failed'
        showError(`${errorContext}: ${result.error}`)

        if (result.action === 'retry') {
          info('You can try again when the connection improves.')
        } else if (result.action === 'signin') {
          info('Please sign in again to continue backing up your data.')
        }
        return
      }
      
      // Success: uploaded
      if (result.uploaded) {
        success('Backup saved to cloud')
      }
    },
    [
      triggerSync,
      transactions,
      accounts,
      settings,
      setTransactions,
      setAccounts,
      setSettings,
      onSyncMetaChange,
      success,
      showError,
      info,
    ],
  )

  const handleResolveConflict = useCallback(
    async (conflictId, resolution) => {
      setIsResolvingConflict(true)
      
      // Provide callbacks for local version conflict resolution
      const options = {
        onApplyRemote: (remoteData) => {
          const sanitizedState = sanitizeIncomingState(remoteData)
          if (sanitizedState) {
            setTransactions(sanitizedState.transactions)
            setAccounts(sanitizedState.accounts)
            setSettings(sanitizedState.settings)
          }
        },
        onKeepLocal: () => {
          // Local changes are kept; next sync will push them
          info('Local changes will be synced on next backup')
        },
      }
      
      const result = await resolveConflict(conflictId, resolution, options)
      setIsResolvingConflict(false)
      if (result.success) {
        success('Conflict resolved successfully')
      } else if (result.error) {
        showError(`Failed to resolve conflict: ${result.error}`)
      }
      return result
    },
    [resolveConflict, setIsResolvingConflict, success, showError, info, setTransactions, setAccounts, setSettings],
  )

  return {
    handleCreateRestorePoint,
    handleRestoreFromPoint,
    handleDeleteRestorePoint,
    handleManualSync,
    handleResolveConflict,
  }
}

export default useVersioningSyncActions

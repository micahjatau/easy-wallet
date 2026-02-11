import { useCallback } from 'react'
import { getAccountId } from './useStorageState.js'

export const useAccountActions = ({
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
}) => {
  const handleAddAccount = useCallback(() => {
    const nextName = accountInput.trim()
    if (!nextName) {
      setAccountError('Account name is required.')
      return
    }
    const nameExists = accounts.some(
      (account) => account.name.toLowerCase() === nextName.toLowerCase(),
    )
    if (nameExists) {
      setAccountError('That account already exists.')
      return
    }
    const nextAccount = {
      id: getAccountId(),
      name: nextName,
      createdAt: Date.now(),
    }
    setAccounts((prev) => [...prev, nextAccount])
    queueChange?.()
    setAccountInput('')
    setAccountError('')
    success(`Account "${nextName}" created`)
  }, [accountInput, accounts, setAccounts, setAccountInput, setAccountError, success, queueChange])

  const handleRenameAccount = useCallback((id) => {
    const draft = accountDrafts[id]
    const nextName = typeof draft === 'string' ? draft.trim() : ''
    if (!nextName) {
      setAccountError('Account name is required.')
      return
    }
    const nameExists = accounts.some(
      (account) =>
        account.id !== id &&
        account.name.toLowerCase() === nextName.toLowerCase(),
    )
    if (nameExists) {
      setAccountError('That account already exists.')
      return
    }
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, name: nextName } : account,
      ),
    )
    queueChange?.()
    setAccountDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setAccountError('')
    success(`Account renamed to "${nextName}"`)
  }, [accountDrafts, accounts, setAccounts, setAccountDrafts, setAccountError, success, queueChange])

  const handleRemoveAccount = useCallback((id) => {
    if (accounts.length <= 1) {
      setAccountError('Keep at least one account.')
      return
    }
    const used = transactions.some((transaction) => transaction.accountId === id)
    if (used) {
      setAccountError('Move transactions before deleting this account.')
      return
    }
    const accountName = accounts.find((a) => a.id === id)?.name || 'Account'
    setAccounts((prev) => prev.filter((account) => account.id !== id))
    queueChange?.()
    setAccountDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setAccountError('')
    info(`Account "${accountName}" removed`)
  }, [accounts, transactions, setAccounts, setAccountDrafts, setAccountError, info, queueChange])

  return {
    handleAddAccount,
    handleRenameAccount,
    handleRemoveAccount,
  }
}

export default useAccountActions

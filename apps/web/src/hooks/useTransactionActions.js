import { useCallback, useEffect, useRef, useState } from 'react'
import { getRateForCurrency } from '@easy-ledger/core'
import { getToday } from '../lib/appUtils.js'
import { getId } from './useStorageState.js'

export const useTransactionActions = ({
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
}) => {
  const [deleteBanner, setDeleteBanner] = useState(null)

  const transactionsRef = useRef(transactions)
  const accountsRef = useRef(accounts)
  const settingsRef = useRef(settings)
  const editingIdRef = useRef(editingId)
  const deleteBannerTimerRef = useRef(null)

  transactionsRef.current = transactions
  accountsRef.current = accounts
  settingsRef.current = settings
  editingIdRef.current = editingId

  useEffect(() => {
    return () => {
      if (deleteBannerTimerRef.current) {
        clearTimeout(deleteBannerTimerRef.current)
        deleteBannerTimerRef.current = null
      }
    }
  }, [])

  const isEditing = Boolean(editingId)

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const nextErrors = {}
      const trimmedName = formState.name.trim()
      const amountValue = Number(formState.amount)
      const accountSelected = accountsRef.current.some(
        (account) => account.id === formState.accountId,
      )
      const rateRequired =
        formState.currency !== settingsRef.current.baseCurrency &&
        !getRateForCurrency(
          settingsRef.current.rates,
          settingsRef.current.baseCurrency,
          formState.currency,
        )

      if (!trimmedName) {
        nextErrors.name = 'Add a name for this transaction.'
      } else if (trimmedName.length > 200) {
        nextErrors.name = 'Name must be less than 200 characters.'
      }
      if (!Number.isFinite(amountValue) || amountValue <= 0) {
        nextErrors.amount = 'Amount must be greater than zero.'
      } else if (amountValue > 1000000000) {
        nextErrors.amount = 'Amount exceeds maximum limit (1 billion).'
      }
      if (!formState.date) {
        nextErrors.date = 'Pick a date.'
      } else {
        const txnDate = new Date(formState.date)
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        const oneYearFromNow = new Date(today)
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

        if (txnDate > oneYearFromNow) {
          nextErrors.date = 'Date cannot be more than 1 year in the future.'
        }
      }
      if (!accountSelected) {
        nextErrors.accountId = 'Pick an account.'
      }
      if (rateRequired) {
        nextErrors.currency = `Add a rate for ${formState.currency}.`
      }

      if (Object.keys(nextErrors).length > 0) {
        setFormErrors(nextErrors)
        return
      }

      if (isEditing) {
        const oldTransaction = transactionsRef.current.find(
          (t) => t.id === editingIdRef.current,
        )
        const updatedTransaction = oldTransaction
          ? {
              ...oldTransaction,
              name: trimmedName,
              amount: amountValue,
              category: formState.category,
              date: formState.date,
              type: formState.type,
              currency: formState.currency,
              accountId: formState.accountId,
              updatedAt: Date.now(),
            }
          : null

        if (updatedTransaction) {
          setTransactions((prev) =>
            prev.map((transaction) =>
              transaction.id === editingIdRef.current
                ? updatedTransaction
                : transaction,
            ),
          )

          logTransactionChange({
            userId: profile?.id,
            transactionId: editingIdRef.current,
            action: 'update',
            previousState: oldTransaction,
            newState: updatedTransaction,
            changedBy: user?.email || deviceId,
          })
          queueChange?.()
        }
        setEditingId(null)
      } else {
        const nextTransaction = {
          id: getId(),
          name: trimmedName,
          amount: amountValue,
          category: formState.category,
          date: formState.date,
          type: formState.type,
          currency: formState.currency,
          accountId: formState.accountId,
          createdAt: Date.now(),
          updatedAt: null,
          isDeleted: false,
          deletedAt: null,
        }

        setTransactions((prev) => [nextTransaction, ...prev])

        logTransactionChange({
          userId: profile?.id,
          transactionId: nextTransaction.id,
          action: 'create',
          previousState: null,
          newState: nextTransaction,
          changedBy: user?.email || deviceId,
        })
        queueChange?.()
      }

      setFormState((prev) => ({
        ...prev,
        name: '',
        amount: '',
        date: getToday(),
      }))
      setFormErrors({})
      success(isEditing ? 'Transaction updated successfully' : 'Transaction added successfully')
    },
    [
      formState,
      isEditing,
      profile?.id,
      user?.email,
      deviceId,
      logTransactionChange,
      setEditingId,
      setFormErrors,
      setFormState,
      setTransactions,
      success,
      queueChange,
    ],
  )

  const handleEdit = useCallback(
    (transaction) => {
      if (!transaction || transaction.isDeleted) return
      setEditingId(transaction.id)
      setFormErrors({})
      setFormState({
        name: transaction.name,
        amount: String(transaction.amount),
        category: transaction.category,
        date: transaction.date,
        type: transaction.type,
        currency: transaction.currency,
        accountId: transaction.accountId,
      })
      handleSetView('new')
    },
    [setEditingId, setFormErrors, setFormState, handleSetView],
  )

  const showDeleteBanner = useCallback((transaction, id) => {
    if (deleteBannerTimerRef.current) {
      clearTimeout(deleteBannerTimerRef.current)
      deleteBannerTimerRef.current = null
    }
    setDeleteBanner(
      transaction
        ? { id: transaction.id, name: transaction.name }
        : { id: id || null, name: '' },
    )
    deleteBannerTimerRef.current = setTimeout(() => {
      setDeleteBanner(null)
      deleteBannerTimerRef.current = null
    }, 8000)
  }, [])

  const handleDelete = useCallback(
    (id) => {
      const target = transactionsRef.current.find((transaction) => transaction.id === id)
      if (!target) return

      const deletedTransaction = {
        ...target,
        isDeleted: true,
        deletedAt: Date.now(),
      }

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? deletedTransaction : transaction,
        ),
      )

      logTransactionChange({
        userId: profile?.id,
        transactionId: id,
        action: 'delete',
        previousState: target,
        newState: deletedTransaction,
        changedBy: user?.email || deviceId,
      })
      queueChange?.()

      if (editingIdRef.current === id) {
        handleCancelEdit()
      }
      showDeleteBanner(target, id)
      info('Transaction moved to trash. Click undo to restore.')
    },
    [
      profile?.id,
      user?.email,
      deviceId,
      handleCancelEdit,
      info,
      logTransactionChange,
      showDeleteBanner,
      setTransactions,
      queueChange,
    ],
  )

  const handleRestore = useCallback(
    (id) => {
      const target = transactionsRef.current.find((transaction) => transaction.id === id)
      if (!target) return

      const restoredTransaction = {
        ...target,
        isDeleted: false,
        deletedAt: null,
      }

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? restoredTransaction : transaction,
        ),
      )

      logTransactionChange({
        userId: profile?.id,
        transactionId: id,
        action: 'restore',
        previousState: target,
        newState: restoredTransaction,
        changedBy: user?.email || deviceId,
      })
      queueChange?.()
      success('Transaction restored')
    },
    [
      profile?.id,
      user?.email,
      deviceId,
      logTransactionChange,
      success,
      setTransactions,
      queueChange,
    ],
  )

  const handleUndoDelete = useCallback(() => {
    if (!deleteBanner?.id) return
    handleRestore(deleteBanner.id)
    setDeleteBanner(null)
    if (deleteBannerTimerRef.current) {
      clearTimeout(deleteBannerTimerRef.current)
      deleteBannerTimerRef.current = null
    }
  }, [deleteBanner, handleRestore])

  const handleDismissDeleteBanner = useCallback(() => {
    setDeleteBanner(null)
    if (deleteBannerTimerRef.current) {
      clearTimeout(deleteBannerTimerRef.current)
      deleteBannerTimerRef.current = null
    }
  }, [])

  return {
    isEditing,
    deleteBanner,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleRestore,
    handleUndoDelete,
    handleDismissDeleteBanner,
  }
}

export default useTransactionActions

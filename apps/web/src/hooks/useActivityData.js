import { useMemo } from 'react'
import { filterTransactions, isWithinRange } from '@easy-ledger/core'

export const useActivityData = ({
  transactions,
  filters,
  activeRange,
  debouncedSearch,
  accounts,
}) => {
  const activeTransactions = useMemo(
    () => transactions.filter((transaction) => !transaction.isDeleted),
    [transactions],
  )

  const rangeTransactions = useMemo(
    () =>
      filterTransactions(transactions, {
        range: activeRange,
        includeDeleted: false,
      }),
    [transactions, activeRange],
  )

  const deletedTransactionsInRange = useMemo(() => {
    if (!filters.showDeleted) return []
    return transactions.filter((transaction) => {
      if (!transaction.isDeleted) return false
      return isWithinRange(transaction.date, activeRange)
    })
  }, [transactions, filters.showDeleted, activeRange])

  const filteredTransactions = useMemo(() => {
    const searchTerm = debouncedSearch.trim().toLowerCase()

    let result = filters.showDeleted
      ? deletedTransactionsInRange
      : rangeTransactions

    if (searchTerm) {
      result = result.filter((transaction) =>
        transaction.name.toLowerCase().includes(searchTerm) ||
        transaction.category.toLowerCase().includes(searchTerm),
      )
    }

    if (filters.type !== 'all') {
      result = result.filter((transaction) => transaction.type === filters.type)
    }

    if (filters.category !== 'all') {
      result = result.filter((transaction) => transaction.category === filters.category)
    }

    if (filters.accountId !== 'all') {
      result = result.filter((transaction) => transaction.accountId === filters.accountId)
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      if (dateA !== dateB) return dateB - dateA
      return (b.createdAt || 0) - (a.createdAt || 0)
    })
  }, [
    deletedTransactionsInRange,
    rangeTransactions,
    debouncedSearch,
    filters.type,
    filters.category,
    filters.accountId,
    filters.showDeleted,
  ])

  const accountNameById = useMemo(
    () =>
      accounts.reduce((accumulator, account) => {
        accumulator[account.id] = account.name
        return accumulator
      }, {}),
    [accounts],
  )

  return {
    activeTransactions,
    rangeTransactions,
    deletedTransactionsInRange,
    filteredTransactions,
    accountNameById,
  }
}

export default useActivityData

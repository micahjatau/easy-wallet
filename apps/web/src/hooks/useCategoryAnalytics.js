import { useMemo } from 'react'
import { computeCategoryTotals, computeTotals } from '@easy-ledger/core'
import { CATEGORY_COLORS } from '../lib/ledgerConfig.js'

export const useCategoryAnalytics = ({
  rangeTransactions,
  settings,
  allCategories,
}) => {
  const totals = useMemo(() => {
    const result = computeTotals(rangeTransactions, settings)
    return {
      income: result.incomeBase,
      expense: result.expenseBase,
      balance: result.balanceBase,
      missingRates: result.missingRatesCount,
    }
  }, [rangeTransactions, settings])

  const categoryData = useMemo(() => {
    const { totalsByCategory, missingRatesCount } = computeCategoryTotals(
      rangeTransactions,
      settings,
    )

    const categories = allCategories.reduce((accumulator, category) => {
      accumulator[category] = totalsByCategory[category] || 0
      return accumulator
    }, {})

    const extraTotal = Object.entries(totalsByCategory).reduce(
      (sum, [category, value]) =>
        allCategories.includes(category) ? sum : sum + value,
      0,
    )

    if (extraTotal > 0) {
      categories.Other = (categories.Other || 0) + extraTotal
    }

    const data = Object.entries(categories)
      .filter(([, value]) => value > 0)
      .map(([name, value], index) => ({
        name,
        value,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      }))

    return { data, missingRates: missingRatesCount }
  }, [rangeTransactions, settings, allCategories])

  const categoryTotal = useMemo(
    () => categoryData.data.reduce((total, entry) => total + entry.value, 0),
    [categoryData.data],
  )

  const topCategory = useMemo(
    () =>
      categoryData.data.reduce((currentTop, entry) => {
        if (!currentTop || entry.value > currentTop.value) return entry
        return currentTop
      }, null),
    [categoryData.data],
  )

  const topCategoryPercent = useMemo(
    () =>
      topCategory && categoryTotal > 0
        ? Math.round((topCategory.value / categoryTotal) * 100)
        : 0,
    [topCategory, categoryTotal],
  )

  return {
    totals,
    categoryData,
    categoryTotal,
    topCategory,
    topCategoryPercent,
  }
}

export default useCategoryAnalytics

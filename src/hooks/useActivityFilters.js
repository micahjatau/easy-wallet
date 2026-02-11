import { useCallback } from 'react'
import { formatLocalYmd } from '../lib/appUtils.js'

const getDefaultCustomDates = () => {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  return {
    customStart: formatLocalYmd(startOfMonth),
    customEnd: formatLocalYmd(endOfMonth),
  }
}

export const useActivityFilters = (setFilters) => {
  const handleDateRangeModeChange = useCallback((nextMode) => {
    if (nextMode === 'custom') {
      const fallback = getDefaultCustomDates()
      setFilters((prev) => ({
        ...prev,
        dateRangeMode: 'custom',
        customStart: prev.customStart || fallback.customStart,
        customEnd: prev.customEnd || fallback.customEnd,
      }))
      return
    }
    if (nextMode === 'all_time') {
      setFilters((prev) => ({
        ...prev,
        dateRangeMode: 'all_time',
      }))
      return
    }
    if (nextMode === 'last_month') {
      setFilters((prev) => ({
        ...prev,
        dateRangeMode: 'last_month',
      }))
      return
    }
    setFilters((prev) => ({
      ...prev,
      dateRangeMode: 'this_month',
    }))
  }, [setFilters])

  return { handleDateRangeModeChange }
}

export default useActivityFilters

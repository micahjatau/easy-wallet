import { useMemo } from 'react'
import {
  buildCustomRange,
  getLastMonthRange,
} from '@easy-ledger/core'
import {
  getRangeLabel,
  getThisMonthRange,
} from '../lib/appUtils.js'

export const useDateRangeState = (filters) => {
  const activeRange = useMemo(() => {
    if (filters.dateRangeMode === 'all_time') {
      return { start: null, end: null }
    }
    if (filters.dateRangeMode === 'last_month') {
      return getLastMonthRange(new Date())
    }
    if (filters.dateRangeMode === 'custom') {
      return buildCustomRange(filters.customStart, filters.customEnd)
    }
    return getThisMonthRange()
  }, [filters.dateRangeMode, filters.customStart, filters.customEnd])

  const rangeLabel = useMemo(
    () => getRangeLabel(filters.dateRangeMode, activeRange),
    [filters.dateRangeMode, activeRange],
  )

  const rangeShortLabel = useMemo(() => {
    if (filters.dateRangeMode === 'this_month') return 'This month'
    if (filters.dateRangeMode === 'last_month') return 'Last month'
    if (filters.dateRangeMode === 'all_time') return 'All time'
    return 'Custom range'
  }, [filters.dateRangeMode])

  return {
    activeRange,
    rangeLabel,
    rangeShortLabel,
  }
}

export default useDateRangeState

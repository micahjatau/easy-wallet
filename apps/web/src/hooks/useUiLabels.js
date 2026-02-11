import { useMemo } from 'react'

export const useUiLabels = ({
  settings,
  totals,
  filters,
  formatDate,
  formatTimestamp,
  getToday,
}) => {
  const todayLabel = useMemo(() => formatDate(getToday()), [formatDate, getToday])

  const ratesAsOfLabel = useMemo(
    () => (settings.ratesAsOf ? formatTimestamp(settings.ratesAsOf) : 'Not available'),
    [settings.ratesAsOf, formatTimestamp],
  )

  const syncedLabel = useMemo(
    () => (settings.syncedAt ? formatTimestamp(settings.syncedAt) : null),
    [settings.syncedAt, formatTimestamp],
  )

  const syncStatusLabel = useMemo(() => {
    if (settings.ratesStale) return 'Rates stale — refresh needed'
    if (syncedLabel) return `Synced ${syncedLabel}`
    return 'Not synced yet'
  }, [settings.ratesStale, syncedLabel])

  const benchmarkBaseLabel = useMemo(
    () => `Base ${settings.baseCurrency}`,
    [settings.baseCurrency],
  )

  const rateStatusLabel = useMemo(() => {
    if (settings.ratesStale) return 'Rates stale — refresh needed'
    if (totals.missingRates > 0) return `${totals.missingRates} missing rates`
    if (settings.syncedAt) return 'All rates synced'
    return 'No rates yet'
  }, [settings.ratesStale, settings.syncedAt, totals.missingRates])

  const hasFilters = useMemo(
    () =>
      Boolean(
        filters.search.trim() ||
          filters.type !== 'all' ||
          filters.category !== 'all' ||
          filters.accountId !== 'all' ||
          filters.showDeleted ||
          filters.dateRangeMode !== 'this_month',
      ),
    [
      filters.search,
      filters.type,
      filters.category,
      filters.accountId,
      filters.showDeleted,
      filters.dateRangeMode,
    ],
  )

  return {
    todayLabel,
    ratesAsOfLabel,
    syncedLabel,
    syncStatusLabel,
    benchmarkBaseLabel,
    rateStatusLabel,
    hasFilters,
  }
}

export default useUiLabels

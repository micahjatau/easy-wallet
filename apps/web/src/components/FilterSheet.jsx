import { useCallback, useMemo, useRef, useState } from 'react'
import { useDialogA11y } from '../hooks/useDialogA11y.js'

const FilterSheet = ({
  filters,
  accounts,
  categories,
  hasFilters,
  onClearFilters,
  onDateRangeModeChange,
  setFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const searchInputRef = useRef(null)

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search?.trim()) count++
    if (filters.type !== 'all') count++
    if (filters.category !== 'all') count++
    if (filters.accountId !== 'all') count++
    if (filters.showDeleted) count++
    if (filters.dateRangeMode !== 'this_month') count++
    return count
  }, [filters])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  useDialogA11y({
    isOpen,
    onEscape: handleClose,
    initialFocusRef: searchInputRef,
    lockBodyScroll: true,
  })

  const handleClearAll = useCallback(() => {
    onClearFilters()
  }, [onClearFilters])

  const inputClass =
    'mt-1.5 block w-full rounded-xl border-0 bg-background-muted/60 px-3 py-2.5 text-sm text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-foreground-muted focus:ring-2 focus:ring-inset focus:ring-primary/30'

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-full border border-border bg-background-elevated px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted transition-colors active:scale-95"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {activeFilterCount}
          </span>
        )}
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-3xl bg-background shadow-2xl"
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-border/70" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 id="filter-sheet-title" className="font-display text-lg text-foreground">
            Filters
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-background-muted/40"
            aria-label="Close filters"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Filter content */}
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          <div className="space-y-5">
            {/* Search */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search
                </div>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: event.target.value,
                    }))
                  }
                  placeholder="Search name or category"
                  className={inputClass}
                />
              </label>
            </div>

            {/* Type */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Type
                </div>
                <select
                  value={filters.type}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: event.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="all">All transactions</option>
                  <option value="income">Income only</option>
                  <option value="expense">Expense only</option>
                </select>
              </label>
            </div>

            {/* Category */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Category
                </div>
                <select
                  value={filters.category}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Account */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Account
                </div>
                <select
                  value={filters.accountId}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      accountId: event.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="all">All accounts</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Date range
                </div>
                <select
                  value={filters.dateRangeMode}
                  onChange={(event) =>
                    onDateRangeModeChange(event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="this_month">This month</option>
                  <option value="last_month">Last month</option>
                  <option value="all_time">All time</option>
                  <option value="custom">Custom range</option>
                </select>
              </label>

              {filters.dateRangeMode === 'custom' && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                    Start
                    <input
                      type="date"
                      value={filters.customStart}
                      max={filters.customEnd || undefined}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          dateRangeMode: 'custom',
                          customStart: event.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                    End
                    <input
                      type="date"
                      value={filters.customEnd}
                      min={filters.customStart || undefined}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          dateRangeMode: 'custom',
                          customEnd: event.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Show Deleted */}
            <label className="flex items-center gap-3 rounded-xl bg-background-muted/40 px-4 py-3">
              <input
                type="checkbox"
                checked={filters.showDeleted}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    showDeleted: event.target.checked,
                  }))
                }
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm font-medium text-foreground">
                Show deleted transactions
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              disabled={!hasFilters}
              className="rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-foreground-muted transition-colors hover:bg-background-muted/40 disabled:opacity-40"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold uppercase tracking-[0.1em] text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
            >
              {activeFilterCount > 0
                ? `Show results (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''})`
                : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSheet

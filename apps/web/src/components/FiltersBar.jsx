import FilterSheet from './FilterSheet.jsx'

const FiltersBar = ({
  variant = 'desktop',
  filters,
  accounts,
  categories,
  inputClass,
  hasFilters,
  rateStatusLabel,
  onClearFilters,
  onDateRangeModeChange,
  setFilters,
  className = '',
}) => {
  // Mobile variant now uses FilterSheet component
  if (variant === 'mobile') {
    return (
      <div className="flex items-center justify-between">
        <FilterSheet
          filters={filters}
          accounts={accounts}
          categories={categories}
          hasFilters={hasFilters}
          onClearFilters={onClearFilters}
          onDateRangeModeChange={onDateRangeModeChange}
          setFilters={setFilters}
        />
        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasFilters}
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted transition-colors disabled:opacity-40"
        >
          Reset
        </button>
      </div>
    )
  }

  // Desktop variant remains unchanged
  return (
    <>
      <div
        className={`mt-5 grid gap-3 rounded-2xl bg-background-muted/60 p-4 md:grid-cols-5 ${
          className
        }`.trim()}
      >
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
          Search
          <input
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
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
          Type
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
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
          Category
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
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
          Account
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
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
          Date range
          <select
            value={filters.dateRangeMode}
            onChange={(event) => onDateRangeModeChange(event.target.value)}
            className={inputClass}
          >
            <option value="this_month">This month</option>
            <option value="last_month">Last month</option>
            <option value="all_time">All time</option>
            <option value="custom">Custom</option>
          </select>
        </label>
      </div>

      {filters.dateRangeMode === 'custom' ? (
        <div className="mt-3 grid gap-3 rounded-2xl bg-background-muted/60 p-4 md:grid-cols-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
            Start date
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
          <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
            End date
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
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-foreground-muted">
        <span>{rateStatusLabel}</span>
        <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
          <input
            type="checkbox"
            checked={filters.showDeleted}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                showDeleted: event.target.checked,
              }))
            }
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
          />
          Show deleted
        </label>
        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </>
  )
}

export default FiltersBar

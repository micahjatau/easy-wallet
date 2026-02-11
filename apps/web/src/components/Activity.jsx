import ActivitySkeleton from './skeletons/ActivitySkeleton.jsx'
import FiltersBar from './FiltersBar.jsx'
import SmartTransactionsList from './SmartTransactionsList.jsx'

const Activity = ({
  variant = 'desktop',
  filters,
  accounts,
  categories,
  inputClass,
  filteredTransactions,
  _totalTransactions,
  rateStatusLabel,
  hasFilters,
  rangeLabel,
  rangeShortLabel,
  onClearFilters,
  onDateRangeModeChange,
  setFilters,
  settings,
  accountNameById,
  getCategoryAccent,
  onEdit,
  onDelete,
  onRestore,
  footer,
  className = '',
  showHeader = true,
  headerTitle = 'Activity log',
  headerSubtitle = 'Recent history',
  showCount = true,
  isLoading = false,
}) => {
  if (isLoading) {
    return <ActivitySkeleton />
  }
  if (variant === 'mobile') {
    return (
      <div className="space-y-5">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 -mx-4 bg-background/90 px-4 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                {rangeShortLabel}
              </p>
              <h2 className="mt-1 font-display text-2xl text-foreground">
                Activity log
              </h2>
            </div>
            {showCount && (
              <span className="text-xs text-foreground-muted">
                {filteredTransactions.length}
              </span>
            )}
          </div>
        </header>

        {/* Filter Bar with integrated FilterSheet trigger */}
        <div className="px-1">
          <FiltersBar
            variant="mobile"
            filters={filters}
            accounts={accounts}
            categories={categories}
            inputClass={inputClass}
            hasFilters={hasFilters}
            rateStatusLabel={rateStatusLabel}
            onClearFilters={onClearFilters}
            onDateRangeModeChange={onDateRangeModeChange}
            setFilters={setFilters}
          />
        </div>

        {/* Date Range Label */}
        <div className="px-1">
          <div className="inline-flex items-center rounded-full border border-border bg-background-elevated px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
            {rangeLabel}
          </div>
        </div>

        {/* Transactions List */}
        <SmartTransactionsList
          variant="mobile"
          transactions={filteredTransactions}
          settings={settings}
          accountNameById={accountNameById}
          getCategoryAccent={getCategoryAccent}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestore={onRestore}
          emptyTitle="No activity yet"
          emptyBody="Add your first entry to see activity here."
        />

        {footer}
      </div>
    )
  }

  const baseClassName = `rounded-3xl border border-border bg-background-elevated/90 p-6 shadow-soft md:p-7 dark:shadow-black/40${
    variant === 'desktop' ? ' flex flex-col min-h-0' : ''
  }`
  const filtersClassName = showHeader ? '' : 'mt-3'
  return (
    <div className={className ? `${baseClassName} ${className}` : baseClassName}>
      {showHeader ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
              {headerTitle}
            </p>
            <h2 className="mt-2 font-display text-2xl text-foreground">
              {headerSubtitle}
            </h2>
          </div>
        </div>
      ) : null}

      <FiltersBar
        variant="desktop"
        filters={filters}
        accounts={accounts}
        categories={categories}
        inputClass={inputClass}
        hasFilters={hasFilters}
        rateStatusLabel={rateStatusLabel}
        onClearFilters={onClearFilters}
        onDateRangeModeChange={onDateRangeModeChange}
        setFilters={setFilters}
        className={filtersClassName}
      />

      <div className="mt-5 flex-1 min-h-0 overflow-y-auto pr-1">
        <SmartTransactionsList
          variant="desktop"
          transactions={filteredTransactions}
          settings={settings}
          accountNameById={accountNameById}
          getCategoryAccent={getCategoryAccent}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestore={onRestore}
          emptyTitle="No transactions yet"
          emptyBody="Add your first entry to see spending history here."
        />
      </div>
    </div>
  )
}

export default Activity

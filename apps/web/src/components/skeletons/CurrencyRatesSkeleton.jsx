const CurrencyRatesSkeleton = () => {
  const SkeletonCard = () => (
    <div className="animate-pulse rounded-xl bg-background-elevated/60 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-12 rounded bg-background-muted/40" />
          <div className="h-3 w-20 rounded bg-background-muted/30" />
        </div>
        <div className="h-6 w-24 rounded bg-background-muted/40" />
      </div>
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 rounded bg-background-muted/40" />
          <div className="h-4 w-64 rounded bg-background-muted/30" />
        </div>
        <div className="h-10 w-28 rounded-lg bg-background-muted/40" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

export default CurrencyRatesSkeleton

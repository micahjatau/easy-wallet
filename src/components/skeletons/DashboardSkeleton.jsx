const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Balance Card Skeleton */}
      <div className="animate-pulse rounded-[32px] bg-gradient-to-br from-primary/40 via-background-muted/60 to-foreground/40 p-6 shadow-2xl">
        <div className="space-y-4">
          <div className="h-4 w-32 rounded bg-background-elevated/30" />
          <div className="h-12 w-48 rounded bg-background-elevated/30" />
          <div className="flex gap-4">
            <div className="h-8 w-24 rounded bg-background-elevated/30" />
            <div className="h-8 w-24 rounded bg-background-elevated/30" />
          </div>
        </div>
      </div>

      {/* Form and Chart Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Skeleton */}
        <div className="animate-pulse rounded-3xl border border-border/60 bg-background-elevated/80 p-6 shadow-soft">
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-background-muted/40" />
            <div className="h-8 w-48 rounded bg-background-muted/40" />
            <div className="grid gap-4">
              <div className="h-10 rounded bg-background-muted/30" />
              <div className="h-10 rounded bg-background-muted/30" />
            </div>
            <div className="h-12 rounded bg-background-muted/40" />
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="animate-pulse rounded-3xl border border-border/60 bg-background-elevated/80 p-6 shadow-soft">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded bg-background-muted/40" />
            <div className="h-8 w-40 rounded bg-background-muted/40" />
            <div className="flex h-48 items-end justify-center gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 rounded-t bg-background-muted/30"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSkeleton

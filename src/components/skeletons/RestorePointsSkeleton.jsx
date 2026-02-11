const RestorePointsSkeleton = () => {
  const SkeletonRow = () => (
    <div className="animate-pulse rounded-xl bg-background-elevated/60 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-background-muted/40" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-background-muted/40" />
            <div className="h-3 w-20 rounded bg-background-muted/30" />
          </div>
        </div>
        <div className="h-8 w-16 rounded-lg bg-background-muted/40" />
      </div>
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 rounded bg-background-muted/40" />
          <div className="h-4 w-48 rounded bg-background-muted/30" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-background-muted/40" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  )
}

export default RestorePointsSkeleton

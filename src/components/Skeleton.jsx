export const TransactionSkeleton = () => (
  <div className="p-4 border-b border-border animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-background-muted/50" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-background-muted/50 rounded" />
          <div className="w-20 h-3 bg-background-muted/30 rounded" />
        </div>
      </div>
      <div className="w-16 h-4 bg-background-muted/50 rounded" />
    </div>
  </div>
)

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-border p-6 bg-background animate-pulse space-y-4">
    <div className="w-1/3 h-6 bg-background-muted/50 rounded" />
    <div className="w-2/3 h-8 bg-background-muted/50 rounded" />
    <div className="w-full h-4 bg-background-muted/30 rounded" />
  </div>
)

export const ListSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-12 bg-background-muted/30 rounded-lg animate-pulse" />
    ))}
  </div>
)

export const FormSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="w-full h-10 bg-background-muted/50 rounded-lg" />
    <div className="w-full h-10 bg-background-muted/50 rounded-lg" />
    <div className="w-full h-10 bg-background-muted/50 rounded-lg" />
    <div className="w-1/2 h-10 bg-background-muted/50 rounded-lg" />
  </div>
)

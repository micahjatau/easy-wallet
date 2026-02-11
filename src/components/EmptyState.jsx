const EmptyState = ({ title, body }) => (
  <div className="rounded-3xl border border-border bg-background-muted/40 px-6 py-10 text-center text-sm text-foreground-muted">
    <p className="font-display text-lg text-foreground">{title}</p>
    <p className="mt-2 text-sm text-foreground-muted">{body}</p>
  </div>
)

export default EmptyState

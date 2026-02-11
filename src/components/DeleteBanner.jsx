const DeleteBanner = ({ deleteBanner, onUndo, onDismiss }) => {
  if (!deleteBanner) return null

  return (
    <div className="rounded-2xl border border-error/30 bg-error-background px-4 py-3 text-xs text-foreground shadow-soft dark:shadow-black/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span>
          Deleted{deleteBanner.name ? ` "${deleteBanner.name}"` : ''}.
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onUndo}
            className="rounded-full bg-primary px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full border border-border bg-background-elevated px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteBanner

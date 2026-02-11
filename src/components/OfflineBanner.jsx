export default function OfflineBanner({ isOnline }) {
  if (isOnline) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate/90 px-4 py-3 text-center text-sm text-white backdrop-blur dark:bg-charcoal/90">
      <div className="flex items-center justify-center gap-2">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-6.364 2.829a9 9 0 010-12.728m0 0l2.829 2.829M3 3l18 18" />
        </svg>
        <span>You&apos;re working offline. Changes will be saved locally and synced when you reconnect.</span>
      </div>
    </div>
  )
}

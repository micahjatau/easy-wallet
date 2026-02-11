import Header from '../components/Header.jsx'
import ProfileSwitcher from '../components/auth/ProfileSwitcher.jsx'
import SyncStatus from '../components/sync/SyncStatus.jsx'

const AppHeaderView = ({
  APP_NAME,
  isDarkMode,
  toggleDarkMode,
  syncState,
  lastSyncAt,
  pendingChanges,
  conflicts,
  hasConflicts,
  isOnline,
  handleManualSync,
  SYNC_STATES,
}) => {
  return (
    <>
      <div className="hidden lg:flex items-end justify-between gap-6">
        <Header
          variant="desktop"
          appName={APP_NAME}
          tagline="Your quiet space for mindful financial tracking."
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-full border border-dune dark:border-cream/30 bg-white dark:bg-[#0d2820] p-2 text-slate dark:text-cream hover:bg-pine/10 dark:hover:bg-cream/10 transition shadow-sm"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="material-symbols-outlined text-lg">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <SyncStatus
            syncState={syncState}
            lastSyncAt={lastSyncAt}
            pendingChanges={pendingChanges}
            conflicts={conflicts}
            hasConflicts={hasConflicts}
            isOnline={isOnline}
            onManualSync={handleManualSync}
            isSyncing={syncState === SYNC_STATES.SYNCING}
          />
          <ProfileSwitcher />
        </div>
      </div>

      <div className="lg:hidden space-y-3">
        <Header
          variant="mobile"
          appName={APP_NAME}
          tagline="Your quiet space for mindful financial tracking."
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-full border border-dune dark:border-cream/30 bg-white dark:bg-[#0d2820] p-2 text-slate dark:text-cream hover:bg-pine/10 dark:hover:bg-cream/10 transition shadow-sm"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="material-symbols-outlined text-lg">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <SyncStatus
            syncState={syncState}
            lastSyncAt={lastSyncAt}
            pendingChanges={pendingChanges}
            conflicts={conflicts}
            hasConflicts={hasConflicts}
            isOnline={isOnline}
            onManualSync={handleManualSync}
            isSyncing={syncState === SYNC_STATES.SYNCING}
          />
          <ProfileSwitcher />
        </div>
      </div>
    </>
  )
}

export default AppHeaderView

import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import PrivacySettings from '../components/privacy/PrivacySettings.jsx'
import SyncTools from '../components/tools/SyncTools.jsx'
import VersioningTools from '../components/tools/VersioningTools.jsx'
import ImportExport from '../components/ImportExport.jsx'
import ProfileSwitcher from '../components/auth/ProfileSwitcher.jsx'

const TABS = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'preferences', label: 'Preferences', icon: 'settings' },
  { id: 'data', label: 'Data', icon: 'database' },
  { id: 'about', label: 'About', icon: 'info' },
]

const SettingsView = memo(function SettingsView({
  settings,
  _onUpdateSettings,
  onExportData,
  _onImportData,
  onClearData,
  user,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
  transactions,
  accounts,
  includeDeletedExport,
  setIncludeDeletedExport,
  onExportJson,
  onExportCsv,
  onImportJson,
  importPreview,
  onApplyImport,
  onCancelImport,
  importError,
  onUpdatePrivacyRetention,
  onClearOldData,
  restorePoints,
  isLoadingRestorePoints,
  onCreateRestorePoint,
  onRestoreFromPoint,
  onDeleteRestorePoint,
  auditLogs,
  isLoadingAudit,
  autoSyncEnabled,
  syncInterval,
  onToggleAutoSync,
  onChangeInterval,
  hasConflicts,
  conflicts,
  onResolve,
  isResolving,
}) {
  const [activeTab, setActiveTab] = useState('profile')
  const compactCardClass = 'bg-background-elevated shadow-none border-border p-4 md:p-4'

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-background-elevated p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">account_circle</span>
                User Profile
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-primary">
                      {user?.photoURL ? 'image' : 'person'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {user?.displayName || user?.email || 'Guest User'}
                    </p>
                    <p className="text-sm text-foreground-muted">
                      {user?.email || 'Not signed in'}
                    </p>
                  </div>
                </div>
                <div className="pt-1">
                  <ProfileSwitcher />
                </div>
                {onLogout && user && !user.isAnonymous && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-error/30 bg-error-background hover:bg-error-background/80 transition-colors text-error"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                  </button>
                )}
              </div>
            </section>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-background-elevated p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                Application Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div>
                    <p className="text-foreground font-medium">Dark Mode</p>
                    <p className="text-sm text-foreground-muted">Toggle between light and dark theme</p>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDarkMode ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-foreground font-medium">Base Currency</p>
                    <p className="text-sm text-foreground-muted">Primary currency for reports</p>
                  </div>
                  <span className="text-primary font-semibold px-3 py-1 rounded-lg bg-primary/10">
                    {settings?.baseCurrency || 'NGN'}
                  </span>
                </div>
              </div>
            </section>
          </div>
        )

      case 'data':
        return (
          <div className="space-y-6">
            {/* Import/Export Section */}
            <section className="rounded-2xl border border-border bg-background-elevated/50 p-1">
              <div className="p-4 pb-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">import_export</span>
                  Import & Export
                </h3>
                <p className="text-sm text-foreground-muted mt-1">
                  Backup and restore your data
                </p>
              </div>
              <div className="p-4 pt-2">
                <ImportExport
                  variant="desktop"
                  includeDeletedExport={includeDeletedExport}
                  onToggleIncludeDeleted={setIncludeDeletedExport}
                  onExportJson={onExportJson}
                  onExportCsv={onExportCsv}
                  onImportJson={onImportJson}
                  importPreview={importPreview}
                  onApplyImport={onApplyImport}
                  onCancelImport={onCancelImport}
                  importError={importError}
                  className={compactCardClass}
                />
              </div>
            </section>

            {/* Privacy & Data Management Section */}
            <section className="rounded-2xl border border-border bg-background-elevated/50 p-1">
              <div className="p-4 pb-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">security</span>
                  Privacy & Data Management
                </h3>
                <p className="text-sm text-foreground-muted mt-1">
                  Manage storage and clear old data
                </p>
              </div>
              <div className="p-4 pt-2">
                <PrivacySettings
                  state={{ transactions, accounts, settings }}
                  onExport={onExportData}
                  onUpdateRetention={onUpdatePrivacyRetention}
                  onClearData={onClearData}
                  onClearOldData={onClearOldData}
                />
              </div>
            </section>

            {/* Data Versioning Section */}
            <section className="rounded-2xl border border-border bg-background-elevated/50 p-1">
              <div className="p-4 pb-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Data Versioning
                </h3>
                <p className="text-sm text-foreground-muted mt-1">
                  Create and manage restore points
                </p>
              </div>
              <div className="p-4 pt-2">
                <VersioningTools
                  restorePoints={restorePoints}
                  isLoadingRestorePoints={isLoadingRestorePoints}
                  onCreateRestorePoint={onCreateRestorePoint}
                  onRestoreFromPoint={onRestoreFromPoint}
                  onDeleteRestorePoint={onDeleteRestorePoint}
                  auditLogs={auditLogs}
                  isLoadingAudit={isLoadingAudit}
                />
              </div>
            </section>

            {/* Cloud Backup Section */}
            <section className="rounded-2xl border border-border bg-background-elevated/50 p-1">
              <div className="p-4 pb-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">cloud_sync</span>
                  Cloud Backup
                </h3>
                <p className="text-sm text-foreground-muted mt-1">
                  Sync your data across devices
                </p>
              </div>
              <div className="p-4 pt-2">
                <SyncTools
                  autoSyncEnabled={autoSyncEnabled}
                  syncInterval={syncInterval}
                  onToggleAutoSync={onToggleAutoSync}
                  onChangeInterval={onChangeInterval}
                  hasConflicts={hasConflicts}
                  conflicts={conflicts}
                  onResolve={onResolve}
                  isResolving={isResolving}
                />
              </div>
            </section>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-background-elevated p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                About Easy Wallet
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-foreground-muted">Version</span>
                  <span className="font-medium text-foreground">2.1.0</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-foreground-muted">License</span>
                  <span className="font-medium text-foreground">MIT</span>
                </div>
                <div className="py-2">
                  <p className="text-sm text-foreground-muted mb-2">
                    Built with React, Vite, and Tailwind CSS
                  </p>
                  <p className="text-sm text-foreground-muted">
                    A personal finance tracker designed for simplicity and privacy.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to="/support"
                    className="mb-2 inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined">help</span>
                    Get Help / Report Issue
                  </Link>
                </div>
                <div>
                  <a
                    href="https://github.com/micahjatau/easy-wallet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined">open_in_new</span>
                    View on GitHub
                  </a>
                </div>
              </div>
            </section>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-foreground">Settings</h1>
        <p className="text-foreground-muted mt-1">
          Manage your profile, preferences, and data
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex gap-1 p-1 rounded-xl bg-background-elevated/50 border border-border overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-foreground-muted hover:text-foreground hover:bg-background'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-8">
        {renderTabContent()}
      </div>
    </div>
  )
})

export default SettingsView

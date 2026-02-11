import SyncSettings from '../sync/SyncSettings.jsx'
import ConflictResolver from '../sync/ConflictResolver.jsx'

const SyncTools = ({
  autoSyncEnabled,
  syncInterval,
  onToggleAutoSync,
  onChangeInterval,
  hasConflicts,
  conflicts,
  onResolve,
  isResolving,
}) => (
  <div className="space-y-6">
    <SyncSettings
      autoSyncEnabled={autoSyncEnabled}
      syncInterval={syncInterval}
      onToggleAutoSync={onToggleAutoSync}
      onChangeInterval={onChangeInterval}
    />
    {hasConflicts && (
      <ConflictResolver
        conflicts={conflicts}
        onResolve={onResolve}
        isResolving={isResolving}
      />
    )}
  </div>
)

export default SyncTools

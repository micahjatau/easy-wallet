import RestorePointManager from '../versioning/RestorePointManager.jsx'
import AuditLog from '../versioning/AuditLog.jsx'

const VersioningTools = ({
  restorePoints,
  isLoadingRestorePoints,
  onCreateRestorePoint,
  onRestoreFromPoint,
  onDeleteRestorePoint,
  auditLogs,
  isLoadingAudit,
}) => (
  <div className="space-y-6">
    <RestorePointManager
      restorePoints={restorePoints}
      isLoading={isLoadingRestorePoints}
      onCreate={onCreateRestorePoint}
      onRestore={onRestoreFromPoint}
      onDelete={onDeleteRestorePoint}
    />
    <AuditLog logs={auditLogs} isLoading={isLoadingAudit} />
  </div>
)

export default VersioningTools

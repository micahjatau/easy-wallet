import { useEffect, useState } from 'react'

export const useVersioningDataState = ({
  profileId,
  getRecentAuditLogs,
  getRestorePoints,
  onError,
}) => {
  const [auditLogs, setAuditLogs] = useState([])
  const [restorePoints, setRestorePoints] = useState([])
  const [isLoadingAudit, setIsLoadingAudit] = useState(false)
  const [isLoadingRestorePoints, setIsLoadingRestorePoints] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadAuditLogs = async () => {
      if (!profileId) return
      setIsLoadingAudit(true)
      try {
        const result = await getRecentAuditLogs(profileId)
        if (isMounted && result.data) {
          setAuditLogs(result.data)
        }
      } catch {
        onError?.('Failed to load audit logs')
      } finally {
        if (isMounted) {
          setIsLoadingAudit(false)
        }
      }
    }
    loadAuditLogs()
    return () => {
      isMounted = false
    }
  }, [profileId, getRecentAuditLogs, onError])

  useEffect(() => {
    let isMounted = true
    const loadRestorePoints = async () => {
      if (!profileId) return
      setIsLoadingRestorePoints(true)
      try {
        const result = await getRestorePoints(profileId)
        if (isMounted && result.data) {
          setRestorePoints(result.data)
        }
      } catch {
        onError?.('Failed to load restore points')
      } finally {
        if (isMounted) {
          setIsLoadingRestorePoints(false)
        }
      }
    }
    loadRestorePoints()
    return () => {
      isMounted = false
    }
  }, [profileId, getRestorePoints, onError])

  return {
    auditLogs,
    setAuditLogs,
    restorePoints,
    setRestorePoints,
    isLoadingAudit,
    isLoadingRestorePoints,
  }
}

export default useVersioningDataState

import { useEffect, useRef } from 'react'

export const useAutoSyncScheduler = ({
  autoSyncEnabled,
  profileId,
  isOnline,
  syncInterval,
  handleManualSync,
}) => {
  const syncRef = useRef(handleManualSync)

  useEffect(() => {
    syncRef.current = handleManualSync
  }, [handleManualSync])

  useEffect(() => {
    if (!autoSyncEnabled || !profileId || !isOnline || syncInterval === 0) return

    const timer = setInterval(() => {
      syncRef.current?.()
    }, syncInterval)

    return () => clearInterval(timer)
  }, [autoSyncEnabled, profileId, isOnline, syncInterval])
}

export default useAutoSyncScheduler

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  updateDoc,
  where,
  setDoc,
} from 'firebase/firestore'
import { firebaseDb } from '../lib/firebase.js'
import { categorizeError, ERROR_CODES } from '../lib/errorHandling.js'

const SYNC_STATES = {
  IDLE: 'idle',
  SYNCING: 'syncing',
  OFFLINE: 'offline',
  CONFLICT: 'conflict',
  ERROR: 'error',
}

const SYNC_CONFIG = {
  autoSyncInterval: 6 * 60 * 60 * 1000, // 6 hours
  debounceDelay: 2000, // 2 seconds
  retryAttempts: 3,
  retryDelay: 5000, // 5 seconds
}

const CONFLICT_KINDS = {
  REMOTE: 'remote_conflict',
  LOCAL_VERSION: 'local_version_conflict',
}

const LOCAL_CONFLICTS_STORAGE_KEY = 'easy-ledger-pending-conflicts'

export const shouldCreateConflict = ({
  remoteVersion,
  localVersion,
  remoteUpdatedAt,
  localSyncedAt,
}) => {
  const hasRemoteVersion = remoteVersion !== null && remoteVersion !== undefined && Number.isFinite(Number(remoteVersion))
  const hasLocalVersion = localVersion !== null && localVersion !== undefined && Number.isFinite(Number(localVersion))

  if (hasRemoteVersion && hasLocalVersion) {
    return Number(remoteVersion) > Number(localVersion)
  }

  if (remoteUpdatedAt && localSyncedAt) {
    return new Date(remoteUpdatedAt).toISOString() > new Date(localSyncedAt).toISOString()
  }

  return false
}

export const useSync = (
  userId,
  deviceId,
  syncedAt,
  onSyncedAtChange,
  syncMeta,
  onSyncMetaChange,
) => {
  const [syncState, setSyncState] = useState(SYNC_STATES.IDLE)
  const [pendingChanges, setPendingChanges] = useState(0)
  const [conflicts, setConflicts] = useState([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [autoSyncTrigger, setAutoSyncTrigger] = useState(0)
  const debounceTimerRef = useRef(null)
  const pendingSyncRef = useRef(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load persisted local conflicts on mount or when userId changes
  useEffect(() => {
    const persisted = loadPersistedLocalConflicts(userId)
    if (persisted.length > 0) {
      setConflicts((prev) => mergeConflicts(persisted, prev))
    }
  }, [userId])

  const lastSyncAt = syncedAt || null

  const checkConflicts = useCallback(async () => {
    if (!userId || !firebaseDb) return { data: [] }

    try {
      const conflictsRef = collection(firebaseDb, 'conflicts')
      const conflictsQuery = query(
        conflictsRef,
        where('user_id', '==', userId),
        where('resolved_at', '==', null),
        orderBy('detected_at', 'desc')
      )

      const snapshot = await getDocs(conflictsQuery)
      const data = snapshot.docs.map((docSnap) => {
        const conflict = docSnap.data()
        return {
          kind: CONFLICT_KINDS.REMOTE,
          id: docSnap.id,
          remoteConflictId: docSnap.id,
          userId: conflict.user_id,
          entityType: conflict.entity_type || null,
          entityId: conflict.entity_id || null,
          detectedAt: normalizeTimestamp(conflict.detected_at),
          resolvedAt: normalizeTimestamp(conflict.resolved_at),
          localUpdatedAt: normalizeTimestamp(conflict.local_updated_at),
          remoteUpdatedAt: normalizeTimestamp(conflict.remote_updated_at),
          localVersion: Number.isFinite(Number(conflict.local_version))
            ? Number(conflict.local_version)
            : null,
          remoteVersion: Number.isFinite(Number(conflict.remote_version))
            ? Number(conflict.remote_version)
            : null,
          localData: conflict.local_data || null,
          remoteData: conflict.remote_data || null,
          // Keep legacy fields for backwards compatibility
          user_id: conflict.user_id,
          entity_type: conflict.entity_type || null,
          entity_id: conflict.entity_id || null,
          detected_at: normalizeTimestamp(conflict.detected_at),
          resolved_at: normalizeTimestamp(conflict.resolved_at),
          local_updated_at: normalizeTimestamp(conflict.local_updated_at),
          remote_updated_at: normalizeTimestamp(conflict.remote_updated_at),
          local_version: Number.isFinite(Number(conflict.local_version))
            ? Number(conflict.local_version)
            : null,
          remote_version: Number.isFinite(Number(conflict.remote_version))
            ? Number(conflict.remote_version)
            : null,
          local_data: conflict.local_data || null,
          remote_data: conflict.remote_data || null,
        }
      })

      return { data }
    } catch (err) {
      const errorInfo = categorizeError(err)
      return { 
        error: errorInfo.message,
        errorCode: errorInfo.code,
        action: errorInfo.action,
      }
    }
  }, [userId])

  const resolveConflict = useCallback(async (conflictId, resolution, options = {}) => {
    const conflict = conflicts.find((entry) => entry.id === conflictId)
    if (!conflict) {
      return { error: 'Conflict not found', errorCode: 'not_found' }
    }

    // Handle local version conflicts in-memory
    if (conflict.kind === CONFLICT_KINDS.LOCAL_VERSION) {
      if (resolution === 'remote' && conflict.remoteData) {
        options.onApplyRemote?.(conflict.remoteData)
      }
      if (resolution === 'local') {
        options.onKeepLocal?.()
      }

      setConflicts((prev) => prev.filter((entry) => entry.id !== conflictId))
      removePersistedLocalConflict(conflictId, userId)
      return { success: true }
    }

    // Handle remote conflicts via Firestore
    if (!firebaseDb) return { error: 'Firebase not configured' }

    try {
      const remoteConflictId = conflict.remoteConflictId || conflict.id
      const conflictRef = doc(firebaseDb, 'conflicts', remoteConflictId)
      await updateDoc(conflictRef, {
        resolution,
        resolved_at: new Date().toISOString(),
      })

      setConflicts((prev) => prev.filter((entry) => entry.id !== conflictId))
      return { success: true }
    } catch (err) {
      const errorInfo = categorizeError(err)
      return {
        error: errorInfo.message,
        errorCode: errorInfo.code,
        action: errorInfo.action,
      }
    }
  }, [conflicts, userId])

  const syncData = useCallback(async (localState, options = {}) => {
    if (!userId || !isOnline) {
      setSyncState(isOnline ? SYNC_STATES.IDLE : SYNC_STATES.OFFLINE)
      return { error: !isOnline ? 'Offline' : 'Not authenticated' }
    }

    if (!firebaseDb) {
      setSyncState(SYNC_STATES.ERROR)
      return { error: 'Firebase not configured' }
    }

    setSyncState(SYNC_STATES.SYNCING)

    try {
      const conflictsResult = await checkConflicts()
      
      if (conflictsResult.data && conflictsResult.data.length > 0) {
        setConflicts((prev) => {
          const localOnly = prev.filter(
            (conflict) => conflict.kind === CONFLICT_KINDS.LOCAL_VERSION,
          )
          return mergeConflicts(conflictsResult.data, localOnly)
        })
        setSyncState(SYNC_STATES.CONFLICT)
        return { conflicts: conflictsResult.data }
      }

      const userDataRef = doc(firebaseDb, 'user_data', userId)
      const stateJson = JSON.stringify(localState)
      const checksum = await computeChecksum(stateJson)
      const now = new Date().toISOString()

      // Optimistic locking: fetch current remote data first
      const remoteDoc = await getDoc(userDataRef)
      
      if (remoteDoc.exists()) {
        const remoteData = remoteDoc.data()
        const remoteUpdatedAt = remoteData?.updated_at
        const remoteVersion = Number(remoteData?.version)
        const lastSynced = lastSyncAt ? new Date(lastSyncAt).toISOString() : null
        const localVersion = Number(syncMeta?.lastRemoteVersion ?? 0)
        
        if (!options.force && shouldCreateConflict({
          remoteVersion,
          localVersion,
          remoteUpdatedAt,
          localSyncedAt: lastSynced,
        })) {
          const conflict = buildLocalVersionConflict({
            userId,
            now,
            localUpdatedAt: lastSynced,
            remoteUpdatedAt,
            localVersion,
            remoteVersion: Number.isFinite(remoteVersion) ? remoteVersion : null,
            localData: localState,
            remoteData: remoteData?.state_json,
          })
          persistLocalConflict(conflict)
          setConflicts((prev) => [conflict, ...prev])
          setSyncState(SYNC_STATES.CONFLICT)
          return {
            error: 'Data has been modified on another device',
            conflict: true,
            remoteData: remoteData?.state_json,
            remoteVersion: Number.isFinite(remoteVersion) ? remoteVersion : null,
            remoteUpdatedAt,
          }
        }
      }

      const nextVersion = (remoteDoc.exists() ? (remoteDoc.data()?.version || 0) : 0) + 1
      await setDoc(userDataRef, {
        user_id: userId,
        device_id: deviceId,
        state_json: localState,
        checksum,
        updated_at: now,
        version: nextVersion,
      })

      if (onSyncedAtChange) {
        onSyncedAtChange(now)
      }
      if (onSyncMetaChange) {
        onSyncMetaChange({
          lastRemoteVersion: nextVersion,
          lastRemoteUpdatedAt: now,
        })
      }
      setSyncState(SYNC_STATES.IDLE)
      setPendingChanges(0)
      pendingSyncRef.current = false
      return { success: true, uploaded: true }
    } catch (err) {
      const errorInfo = categorizeError(err)
      
      // Set appropriate sync state based on error type
      if (errorInfo.code === ERROR_CODES.NETWORK || errorInfo.code === ERROR_CODES.OFFLINE) {
        setSyncState(SYNC_STATES.OFFLINE)
      } else {
        setSyncState(SYNC_STATES.ERROR)
      }
      
      return { 
        error: errorInfo.message,
        errorCode: errorInfo.code,
        action: errorInfo.action,
        raw: err,
      }
    }
  }, [
    userId,
    deviceId,
    isOnline,
    checkConflicts,
    lastSyncAt,
    syncMeta?.lastRemoteVersion,
    onSyncedAtChange,
    onSyncMetaChange,
  ])

  const queueChange = useCallback(() => {
    setPendingChanges((prev) => prev + 1)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (isOnline && userId) {
        // Mark that a sync is pending - component will pick this up
        pendingSyncRef.current = true
        // Increment trigger to notify component
        setAutoSyncTrigger(prev => prev + 1)
      }
    }, SYNC_CONFIG.debounceDelay)
  }, [isOnline, userId])

  const triggerSync = useCallback(
    async (localState) => {
      if (syncState === SYNC_STATES.SYNCING) return { skipped: true }
      return syncData(localState)
    },
    [syncState, syncData]
  )

  return useMemo(
    () => ({
      syncState,
      lastSyncAt,
      pendingChanges,
      conflicts,
      isOnline,
      hasConflicts: conflicts.length > 0,
      autoSyncTrigger,
      shouldAutoSync: pendingSyncRef.current,
      syncData,
      triggerSync,
      resolveConflict,
      queueChange,
      checkConflicts,
      SYNC_STATES,
      CONFLICT_KINDS,
    }),
    [
      syncState,
      lastSyncAt,
      pendingChanges,
      conflicts,
      isOnline,
      autoSyncTrigger,
      syncData,
      triggerSync,
      resolveConflict,
      queueChange,
      checkConflicts,
    ]
  )
}

const normalizeTimestamp = (value) => {
  if (!value) return null
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value.toDate === 'function') return value.toDate().toISOString()
  return null
}

async function computeChecksum(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const buildLocalVersionConflict = ({
  userId,
  now,
  localUpdatedAt,
  remoteUpdatedAt,
  localVersion,
  remoteVersion,
  localData,
  remoteData,
}) => ({
  kind: CONFLICT_KINDS.LOCAL_VERSION,
  id: `local_conflict_${Date.now()}`,
  userId,
  detectedAt: now,
  resolvedAt: null,
  localUpdatedAt,
  remoteUpdatedAt,
  localVersion,
  remoteVersion,
  localData,
  remoteData,
  reason: 'version_mismatch',
  // Legacy fields for backwards compatibility
  user_id: userId,
  detected_at: now,
  resolved_at: null,
  local_updated_at: localUpdatedAt,
  remote_updated_at: remoteUpdatedAt,
  local_version: localVersion,
  remote_version: remoteVersion,
  local_data: localData,
  remote_data: remoteData,
})

const mergeConflicts = (incoming, existing) => {
  const merged = new Map()
  ;[...(incoming || []), ...(existing || [])].forEach((conflict) => {
    if (!conflict?.id) return
    merged.set(conflict.id, conflict)
  })
  return Array.from(merged.values())
}

const loadPersistedLocalConflicts = (userId) => {
  if (!userId || typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(LOCAL_CONFLICTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((conflict) => {
      if (!conflict || typeof conflict !== 'object') return false
      if (conflict.kind !== CONFLICT_KINDS.LOCAL_VERSION) return false
      return conflict.userId === userId || conflict.user_id === userId
    })
  } catch {
    return []
  }
}

const persistLocalConflict = (conflict) => {
  if (typeof window === 'undefined') return

  try {
    const raw = localStorage.getItem(LOCAL_CONFLICTS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    const existing = Array.isArray(parsed) ? parsed : []
    const next = mergeConflicts(existing, [conflict])
    localStorage.setItem(LOCAL_CONFLICTS_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore persistence errors
  }
}

const removePersistedLocalConflict = (conflictId, userId) => {
  if (!conflictId || !userId || typeof window === 'undefined') return

  try {
    const raw = localStorage.getItem(LOCAL_CONFLICTS_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return
    const filtered = parsed.filter((conflict) => {
      if (!conflict || typeof conflict !== 'object') return false
      const conflictUserId = conflict.userId || conflict.user_id
      if (conflictUserId !== userId) return true
      return conflict.id !== conflictId
    })
    localStorage.setItem(LOCAL_CONFLICTS_STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    // ignore persistence errors
  }
}

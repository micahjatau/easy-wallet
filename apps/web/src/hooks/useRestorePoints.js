import { useCallback, useMemo } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit as limitDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { firebaseDb } from '../lib/firebase.js'

const LOCAL_RESTORE_KEY = 'easy-ledger-local-restore-points'

const getRestoreStorageKey = (scopeId) =>
  `${LOCAL_RESTORE_KEY}-${scopeId || 'default'}`

const migrateLegacyRestorePoints = (scopeId) => {
  try {
    const scopedKey = getRestoreStorageKey(scopeId)
    const scoped = localStorage.getItem(scopedKey)
    if (scoped) return scoped

    const legacy = localStorage.getItem(LOCAL_RESTORE_KEY)
    if (!legacy) return null

    localStorage.setItem(scopedKey, legacy)
    localStorage.removeItem(LOCAL_RESTORE_KEY)
    return legacy
  } catch {
    return null
  }
}

const getLocalRestorePoints = (scopeId) => {
  try {
    const key = getRestoreStorageKey(scopeId)
    const stored = localStorage.getItem(key) || migrateLegacyRestorePoints(scopeId)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveLocalRestorePoints = (points, scopeId) => {
  try {
    localStorage.setItem(getRestoreStorageKey(scopeId), JSON.stringify(points))
  } catch {
    // Ignore storage errors
  }
}

export const useRestorePoints = (profileScopeId = 'default') => {
  const createRestorePoint = useCallback(async ({
    userId,
    name,
    snapshotType = 'manual',
    state,
    deviceId,
  }) => {
    const stateJson = JSON.stringify(state)
    const sizeBytes = new Blob([stateJson]).size
    const checksum = await computeChecksum(stateJson)
    const createdAt = new Date().toISOString()
    const pointId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const restorePoint = {
      id: pointId,
      user_id: userId || 'anonymous',
      name: name || `Snapshot ${new Date().toLocaleString()}`,
      snapshot_type: snapshotType,
      state_json: state,
      checksum,
      size_bytes: sizeBytes,
      device_id: deviceId,
      created_at: createdAt,
    }

    // If no userId or Firebase not configured, store locally
    if (!userId || !firebaseDb) {
      try {
        const scopeId = userId || profileScopeId
        const points = getLocalRestorePoints(scopeId)
        points.unshift(restorePoint)
        // Keep only last 10 local restore points to prevent storage bloat
        const trimmedPoints = points.slice(0, 10)
        saveLocalRestorePoints(trimmedPoints, scopeId)
        return { data: restorePoint, local: true }
      } catch (err) {
        return { error: err.message }
      }
    }

    // Store in Firebase for authenticated users
    try {
      const docRef = await addDoc(collection(firebaseDb, 'restore_points'), {
        user_id: userId,
        name: restorePoint.name,
        snapshot_type: snapshotType,
        state_json: state,
        checksum,
        size_bytes: sizeBytes,
        device_id: deviceId,
        created_at: createdAt,
      })

      return {
        data: {
          ...restorePoint,
          id: docRef.id,
        },
      }
    } catch (err) {
      // Fallback to local storage on Firebase error
      try {
        const scopeId = userId || profileScopeId
        const points = getLocalRestorePoints(scopeId)
        points.unshift(restorePoint)
        const trimmedPoints = points.slice(0, 10)
        saveLocalRestorePoints(trimmedPoints, scopeId)
        return { data: restorePoint, local: true, fallback: true }
      } catch {
        return { error: err.message }
      }
    }
  }, [profileScopeId])

  const getRestorePoints = useCallback(async (userId, limit = 20) => {
    // If no userId or Firebase not configured, get from local storage
    if (!userId || !firebaseDb) {
      try {
        const points = getLocalRestorePoints(userId || profileScopeId)
        const sorted = points.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, limit)
        return { data: sorted, local: true }
      } catch (err) {
        return { error: err.message }
      }
    }

    try {
      const restoreQuery = query(
        collection(firebaseDb, 'restore_points'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc'),
        limitDocs(limit)
      )

      const snapshot = await getDocs(restoreQuery)
      const data = snapshot.docs.map((docSnap) => {
        const point = docSnap.data()
        return {
          id: docSnap.id,
          ...point,
          created_at: normalizeTimestamp(point.created_at),
        }
      })

      return { data }
    } catch (err) {
      return { error: err.message }
    }
  }, [profileScopeId])

  const deleteRestorePoint = useCallback(async (pointId) => {
    // Handle local restore points
    if (pointId.startsWith('local-')) {
      try {
        const points = getLocalRestorePoints(profileScopeId)
        const filtered = points.filter(p => p.id !== pointId)
        saveLocalRestorePoints(filtered, profileScopeId)
        return { success: true, local: true }
      } catch (err) {
        return { error: err.message }
      }
    }

    if (!firebaseDb) return { error: 'Firebase not configured' }

    try {
      await deleteDoc(doc(firebaseDb, 'restore_points', pointId))
      return { success: true }
    } catch (err) {
      return { error: err.message }
    }
  }, [profileScopeId])

  const cleanupOldRestorePoints = useCallback(async (userId, keepCount = 10) => {
    // Handle local cleanup
    if (!userId || !firebaseDb) {
      try {
        const points = getLocalRestorePoints(userId || profileScopeId)
        const toDelete = points.slice(keepCount)
        const kept = points.slice(0, keepCount)
        saveLocalRestorePoints(kept, userId || profileScopeId)
        return { deletedCount: toDelete.length, local: true }
      } catch (err) {
        return { error: err.message }
      }
    }

    if (!firebaseDb) return { error: 'Firebase not configured' }

    try {
      const restoreQuery = query(
        collection(firebaseDb, 'restore_points'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      )

      const snapshot = await getDocs(restoreQuery)
      const points = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      const toDelete = points.slice(keepCount)

      await Promise.all(toDelete.map((point) => deleteDoc(doc(firebaseDb, 'restore_points', point.id))))

      return { deletedCount: toDelete.length }
    } catch (err) {
      return { error: err.message }
    }
  }, [profileScopeId])

  return useMemo(
    () => ({
      createRestorePoint,
      getRestorePoints,
      deleteRestorePoint,
      cleanupOldRestorePoints,
    }),
    [createRestorePoint, getRestorePoints, deleteRestorePoint, cleanupOldRestorePoints]
  )
}

const normalizeTimestamp = (value) => {
  if (!value) return null
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value.toDate === 'function') return value.toDate().toISOString()
  return null
}

/**
 * Compute SHA-256 checksum with graceful degradation
 * Falls back to simple hash when crypto.subtle is unavailable
 */
async function computeChecksum(str) {
  try {
    // Try crypto.subtle first (secure, preferred)
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(str)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    }
  } catch (err) {
    console.warn('crypto.subtle failed, using fallback checksum:', err)
  }

  // Fallback: Simple hash for private browsing/HTTP contexts
  // Not cryptographically secure, but sufficient for integrity checking
  return computeFallbackChecksum(str)
}

/**
 * Simple hash function for environments without crypto.subtle
 * Used in private browsing mode or non-secure contexts
 */
function computeFallbackChecksum(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return `fb_${Math.abs(hash).toString(16).padStart(8, '0')}`
}

import { useCallback } from 'react'
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  limit as limitDocs,
} from 'firebase/firestore'
import { firebaseDb } from '../lib/firebase.js'

const LOCAL_AUDIT_KEY = 'easy-ledger-local-audit'

const getAuditStorageKey = (scopeId) =>
  `${LOCAL_AUDIT_KEY}-${scopeId || 'default'}`

const migrateLegacyAuditLogs = (scopeId) => {
  try {
    const scopedKey = getAuditStorageKey(scopeId)
    const scoped = localStorage.getItem(scopedKey)
    if (scoped) return scoped

    const legacy = localStorage.getItem(LOCAL_AUDIT_KEY)
    if (!legacy) return null

    localStorage.setItem(scopedKey, legacy)
    localStorage.removeItem(LOCAL_AUDIT_KEY)
    return legacy
  } catch {
    return null
  }
}

const getLocalAuditLogs = (scopeId) => {
  try {
    const key = getAuditStorageKey(scopeId)
    const stored = localStorage.getItem(key) || migrateLegacyAuditLogs(scopeId)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveLocalAuditLogs = (logs, scopeId) => {
  try {
    localStorage.setItem(getAuditStorageKey(scopeId), JSON.stringify(logs))
  } catch {
    // Ignore storage errors
  }
}

export const useAudit = (profileScopeId = 'default') => {
  const logTransactionChange = useCallback(async ({
    userId,
    transactionId,
    action,
    previousState,
    newState,
    changedBy,
  }) => {
    const logEntry = {
      user_id: userId || 'anonymous',
      transaction_id: transactionId,
      action,
      previous_state: previousState,
      new_state: newState,
      changed_by: changedBy,
      changed_at: new Date().toISOString(),
    }

    // If no userId or Firebase not configured, store locally
    if (!userId || !firebaseDb) {
      try {
        const logs = getLocalAuditLogs(userId || profileScopeId)
        logs.unshift(logEntry)
        // Keep only last 100 local logs to prevent storage bloat
        const trimmedLogs = logs.slice(0, 100)
        saveLocalAuditLogs(trimmedLogs, userId || profileScopeId)
        return { success: true, local: true }
      } catch (err) {
        return { error: err.message }
      }
    }

    // Store in Firebase for authenticated users
    try {
      await addDoc(collection(firebaseDb, 'audit_log'), logEntry)
      return { success: true }
    } catch (err) {
      // Fallback to local storage on Firebase error
      try {
        const logs = getLocalAuditLogs(userId || profileScopeId)
        logs.unshift(logEntry)
        const trimmedLogs = logs.slice(0, 100)
        saveLocalAuditLogs(trimmedLogs, userId || profileScopeId)
        return { success: true, local: true, fallback: true }
      } catch {
        return { error: err.message }
      }
    }
  }, [profileScopeId])

  const getTransactionHistory = useCallback(async (userId, transactionId) => {
    // If no userId or Firebase not configured, get from local storage
    if (!userId || !firebaseDb) {
      try {
        const logs = getLocalAuditLogs(userId || profileScopeId)
        const filtered = logs.filter(
          log => log.transaction_id === transactionId
        ).sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))
        return { data: filtered, local: true }
      } catch (err) {
        return { error: err.message }
      }
    }

    try {
      const auditQuery = query(
        collection(firebaseDb, 'audit_log'),
        where('user_id', '==', userId),
        where('transaction_id', '==', transactionId),
        orderBy('changed_at', 'desc')
      )

      const snapshot = await getDocs(auditQuery)
      const data = snapshot.docs.map((docSnap) => {
        const log = docSnap.data()
        return {
          id: docSnap.id,
          ...log,
          changed_at: normalizeTimestamp(log.changed_at),
        }
      })

      return { data }
    } catch (err) {
      return { error: err.message }
    }
  }, [profileScopeId])

  const getRecentAuditLogs = useCallback(async (userId, limit = 50) => {
    // If no userId or Firebase not configured, get from local storage
    if (!userId || !firebaseDb) {
      try {
        const logs = getLocalAuditLogs(userId || profileScopeId)
        const sorted = logs.sort((a, b) => 
          new Date(b.changed_at) - new Date(a.changed_at)
        ).slice(0, limit)
        return { data: sorted, local: true }
      } catch (err) {
        return { error: err.message }
      }
    }

    try {
      const auditQuery = query(
        collection(firebaseDb, 'audit_log'),
        where('user_id', '==', userId),
        orderBy('changed_at', 'desc'),
        limitDocs(limit)
      )

      const snapshot = await getDocs(auditQuery)
      const data = snapshot.docs.map((docSnap) => {
        const log = docSnap.data()
        return {
          id: docSnap.id,
          ...log,
          changed_at: normalizeTimestamp(log.changed_at),
        }
      })

      return { data }
    } catch (err) {
      return { error: err.message }
    }
  }, [profileScopeId])

  return {
    logTransactionChange,
    getTransactionHistory,
    getRecentAuditLogs,
  }
}

const normalizeTimestamp = (value) => {
  if (!value) return null
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value.toDate === 'function') return value.toDate().toISOString()
  return null
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseAuth, firebaseDb } from '../lib/firebase.js'

// State machine statuses
const AUTH_STATUS = {
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  AUTHENTICATING: 'authenticating',
  LOADING_PROFILE: 'loading_profile',
  AUTHENTICATED: 'authenticated',
  ANONYMOUS: 'anonymous',
  ERROR: 'error',
}

// Module-level state - survives StrictMode remounts
const globalAuthState = {
  initialized: false,
  unsubscribe: null,
  currentOperationId: 0,
  deviceId: null,
}

// Configuration
const PROFILE_LOAD_TIMEOUT = 8000
const DEVICE_ID_KEY = 'easy-ledger-device-id'

const generateDeviceId = () => {
  return `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

const getOrCreateDeviceId = () => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(DEVICE_ID_KEY)
    if (stored) return stored
    const newId = generateDeviceId()
    localStorage.setItem(DEVICE_ID_KEY, newId)
    return newId
  } catch {
    return generateDeviceId()
  }
}

export const useAuth = () => {
  // Core state with state machine pattern
  const [authState, setAuthState] = useState({
    status: AUTH_STATUS.IDLE,
    user: null,
    profile: null,
    error: null,
    isLoading: true,
  })

  // Local refs for this component instance
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef(null)
  const timeoutRef = useRef(null)

  // Initialize deviceId on first render
  useEffect(() => {
    if (!globalAuthState.deviceId) {
      globalAuthState.deviceId = getOrCreateDeviceId()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      abortControllerRef.current?.abort()
      clearTimeout(timeoutRef.current)
    }
  }, [])

  // Computed values
  const isAuthenticated = useMemo(() => {
    return authState.status === AUTH_STATUS.AUTHENTICATED
  }, [authState.status])

  const isAnonymous = useMemo(() => {
    return authState.status === AUTH_STATUS.ANONYMOUS || !authState.user
  }, [authState.status, authState.user])

  const profileId = useMemo(() => {
    return authState.profile?.id || globalAuthState.deviceId || 'default'
  }, [authState.profile])

  const deviceId = useMemo(() => {
    return globalAuthState.deviceId
  }, [])

  // Helper to safely update state
  const safeSetState = useCallback((updates) => {
    if (isMountedRef.current) {
      setAuthState((prev) => ({ ...prev, ...updates }))
    }
  }, [])

  // Fetch profile from Firestore
  const fetchProfile = useCallback(async (userId, signal) => {
    if (!firebaseDb || signal?.aborted) return null

    try {
      const profileRef = doc(firebaseDb, 'profiles', userId)
      const snapshot = await getDoc(profileRef)
      
      if (signal?.aborted) return null
      
      if (!snapshot.exists()) {
        return null
      }

      return { id: snapshot.id, ...snapshot.data() }
    } catch (err) {
      if (!signal?.aborted) {
        console.error('Exception fetching profile:', err)
      }
      return null
    }
  }, [])

  // Handle auth state change
  const handleAuthStateChange = useCallback(async (firebaseUser) => {
    // Clear any existing timeout
    clearTimeout(timeoutRef.current)

    if (!isMountedRef.current) return

    if (firebaseUser) {
      // User is authenticated, now load profile
      safeSetState({ 
        status: AUTH_STATUS.LOADING_PROFILE,
        user: firebaseUser,
        isLoading: true 
      })

      // Set timeout for profile loading
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          safeSetState({
            status: AUTH_STATUS.ERROR,
            error: 'Profile loading timeout',
            isLoading: false,
          })
        }
      }, PROFILE_LOAD_TIMEOUT)

      // Create new abort controller for this operation
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      
      const userProfile = await fetchProfile(firebaseUser.uid, abortControllerRef.current.signal)

      clearTimeout(timeoutRef.current)
      
      if (!isMountedRef.current) return

      // Profile found - user is fully authenticated
      if (userProfile) {
        safeSetState({
          status: AUTH_STATUS.AUTHENTICATED,
          profile: userProfile,
          error: null,
          isLoading: false,
        })
      } else {
        // User exists but no profile - stay in loading state until explicit profile creation
        // This allows the UI to prompt user to create profile
        safeSetState({
          status: AUTH_STATUS.LOADING_PROFILE,
          profile: null,
          error: null,
          isLoading: false,
        })
      }
    } else {
      // No user - anonymous mode
      safeSetState({
        status: AUTH_STATUS.ANONYMOUS,
        user: null,
        profile: null,
        error: null,
        isLoading: false,
      })
    }
  }, [fetchProfile, safeSetState])

  // Track status in ref to avoid dependency array issues
  const statusRef = useRef(authState.status)
  useEffect(() => {
    statusRef.current = authState.status
  }, [authState.status])

  // Initialize auth listener - runs only once
  useEffect(() => {
    // Prevent re-initialization if already initialized globally
    if (globalAuthState.initialized) {
      // Just sync with current global state
      if (globalAuthState.unsubscribe) {
        return
      }
    }

    if (!firebaseAuth) {
      safeSetState({
        status: AUTH_STATUS.ERROR,
        error: 'Firebase is not configured',
        isLoading: false,
      })
      return
    }

    globalAuthState.initialized = true
    safeSetState({
      status: AUTH_STATUS.INITIALIZING,
      isLoading: true,
    })

    // Set initial timeout
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && statusRef.current === AUTH_STATUS.INITIALIZING) {
        safeSetState({
          status: AUTH_STATUS.ERROR,
          error: 'Auth initialization timeout',
          isLoading: false,
        })
      }
    }, PROFILE_LOAD_TIMEOUT)

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      handleAuthStateChange(firebaseUser)
    })

    globalAuthState.unsubscribe = unsubscribe

    return () => {
      unsubscribe()
      globalAuthState.unsubscribe = null
      // Don't set initialized to false - keeps state across remounts
    }
  }, [handleAuthStateChange, safeSetState])

  // Create profile explicitly (requires explicit action per requirements)
  const createProfile = useCallback(async (profileData = {}) => {
    if (!firebaseDb || !authState.user) {
      return { error: 'Not authenticated' }
    }

    const operationId = ++globalAuthState.currentOperationId
    
    try {
      safeSetState({ isLoading: true })
      
      const profileRef = doc(firebaseDb, 'profiles', authState.user.uid)
      const timestamp = new Date().toISOString()
      const newProfile = {
        id: authState.user.uid,
        is_anonymous: false,
        device_id: globalAuthState.deviceId || 'unknown',
        local_storage_key: `easy-ledger-state-${authState.user.uid}`,
        sync_enabled: false,
        created_at: timestamp,
        updated_at: timestamp,
        ...profileData,
      }

      await setDoc(profileRef, newProfile, { merge: true })

      // Verify operation is still current
      if (operationId !== globalAuthState.currentOperationId) {
        return { cancelled: true }
      }

      const snapshot = await getDoc(profileRef)
      if (snapshot.exists()) {
        const createdProfile = { id: snapshot.id, ...snapshot.data() }
        safeSetState({
          status: AUTH_STATUS.AUTHENTICATED,
          profile: createdProfile,
          isLoading: false,
        })
        return { profile: createdProfile }
      }

      return { error: 'Failed to create profile' }
    } catch (err) {
      if (operationId !== globalAuthState.currentOperationId) {
        return { cancelled: true }
      }
      
      safeSetState({
        error: err.message,
        isLoading: false,
      })
      return { error: err.message }
    }
  }, [authState.user, safeSetState])

  // Login operation
  const login = useCallback(async (email, password) => {
    if (!firebaseAuth) return { error: 'Firebase is not configured' }

    const operationId = ++globalAuthState.currentOperationId
    
    safeSetState({
      status: AUTH_STATUS.AUTHENTICATING,
      isLoading: true,
      error: null,
    })

    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password)
      
      // Check if operation is still current
      if (operationId !== globalAuthState.currentOperationId) {
        return { cancelled: true }
      }

      return { user: result.user }
    } catch (err) {
      if (operationId !== globalAuthState.currentOperationId) {
        return { cancelled: true }
      }

      safeSetState({
        status: AUTH_STATUS.ERROR,
        error: err.message,
        isLoading: false,
      })
      return { error: err.message }
    }
  }, [safeSetState])

  // Signup operation
  const signup = useCallback(async (email, password) => {
    if (!firebaseAuth) return { error: 'Firebase is not configured' }

    const operationId = ++globalAuthState.currentOperationId
    
    safeSetState({
      status: AUTH_STATUS.AUTHENTICATING,
      isLoading: true,
      error: null,
    })

    try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      
      // Check if operation is still current
      if (operationId !== globalAuthState.currentOperationId) {
        return { cancelled: true }
      }

      return { user: result.user }
    } catch (err) {
      if (operationId !== globalAuthState.currentOperationId) {
        return { cancelled: true }
      }

      safeSetState({
        status: AUTH_STATUS.ERROR,
        error: err.message,
        isLoading: false,
      })
      return { error: err.message }
    }
  }, [safeSetState])

  // Logout operation
  const logout = useCallback(async () => {
    if (!firebaseAuth) return { error: 'Firebase is not configured' }

    const operationId = ++globalAuthState.currentOperationId
    
    safeSetState({ isLoading: true })

    try {
      await firebaseSignOut(firebaseAuth)
      
      // Check if operation is still current
      if (operationId !== globalAuthState.currentOperationId) {
        return { cancelled: true }
      }

      safeSetState({
        status: AUTH_STATUS.ANONYMOUS,
        user: null,
        profile: null,
        error: null,
        isLoading: false,
      })
      
      return { success: true }
    } catch (err) {
      if (operationId !== globalAuthState.currentOperationId) {
        return { cancelled: true }
      }

      safeSetState({
        error: err.message,
        isLoading: false,
      })
      return { error: err.message }
    }
  }, [safeSetState])

  // Continue as anonymous/guest
  const continueAsGuest = useCallback(() => {
    safeSetState({
      status: AUTH_STATUS.ANONYMOUS,
      user: null,
      profile: null,
      error: null,
      isLoading: false,
    })
  }, [safeSetState])

  // Clear error
  const clearError = useCallback(() => {
    safeSetState({ error: null })
  }, [safeSetState])

  return {
    // State
    user: authState.user,
    profile: authState.profile,
    status: authState.status,
    error: authState.error,
    isLoading: authState.isLoading,
    
    // Computed
    isAuthenticated,
    isAnonymous,
    profileId,
    deviceId,
    
    // Operations
    login,
    signup,
    logout,
    createProfile,
    continueAsGuest,
    clearError,
  }
}

export { AUTH_STATUS }
export default useAuth

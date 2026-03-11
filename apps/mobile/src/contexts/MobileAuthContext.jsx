import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AUTH_STORAGE_KEY = 'easy-wallet-mobile-auth'

export const MobileAuthContext = createContext(null)

const DEFAULT_STATE = {
  user: null,
  profile: null,
}

export function MobileAuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(DEFAULT_STATE.user)
  const [profile, setProfile] = useState(DEFAULT_STATE.profile)

  const persistState = useCallback(async (nextState) => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState))
    } catch {
      // keep app usable even if persistence fails
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadStoredAuth = async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
        if (!raw) return

        const parsed = JSON.parse(raw)
        if (!parsed || typeof parsed !== 'object') return

        if (isMounted) {
          setUser(parsed.user || null)
          setProfile(parsed.profile || null)
        }
      } catch {
        // ignore invalid persisted state
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadStoredAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const signIn = useCallback(async (input = {}) => {
    const now = new Date().toISOString()
    const nextUser = {
      id: input.id || `mobile_user_${Date.now()}`,
      email: input.email || 'mobile@example.com',
      displayName: input.displayName || 'Mobile User',
      createdAt: input.createdAt || now,
    }
    const nextProfile = {
      id: nextUser.id,
      setupComplete: Boolean(input.setupComplete),
      setupCompletedAt: input.setupComplete ? now : null,
      updatedAt: now,
    }

    setUser(nextUser)
    setProfile(nextProfile)
    await persistState({ user: nextUser, profile: nextProfile })

    return { user: nextUser, profile: nextProfile }
  }, [persistState])

  const signOut = useCallback(async () => {
    setUser(null)
    setProfile(null)
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {
      // noop
    }
  }, [])

  const markSetupComplete = useCallback(async (updates = {}) => {
    if (!user || !profile) return null

    const now = new Date().toISOString()
    const nextProfile = {
      ...profile,
      ...updates,
      setupComplete: true,
      setupCompletedAt: updates.setupCompletedAt || now,
      updatedAt: now,
    }

    setProfile(nextProfile)
    await persistState({ user, profile: nextProfile })
    return nextProfile
  }, [persistState, profile, user])

  const value = useMemo(() => ({
    isLoading,
    user,
    profile,
    isAuthenticated: Boolean(user?.id),
    signIn,
    signOut,
    markSetupComplete,
  }), [isLoading, markSetupComplete, profile, signIn, signOut, user])

  return (
    <MobileAuthContext.Provider value={value}>
      {children}
    </MobileAuthContext.Provider>
  )
}

export default MobileAuthProvider

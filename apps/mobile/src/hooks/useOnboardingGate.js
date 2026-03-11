import { useMemo } from 'react'
import { useMobileAuthContext } from '../contexts/useMobileAuthContext.js'

export const useOnboardingGate = () => {
  const {
    isLoading,
    user,
    profile,
    isAuthenticated,
    markSetupComplete,
  } = useMobileAuthContext()

  const setupComplete = Boolean(profile?.setupComplete)
  const shouldShowOnboarding = useMemo(
    () => isAuthenticated && !setupComplete,
    [isAuthenticated, setupComplete],
  )

  return {
    isAuthenticated,
    setupComplete,
    shouldShowOnboarding,
    isGateLoading: isLoading,
    user,
    profile,
    markSetupComplete,
  }
}

export default useOnboardingGate

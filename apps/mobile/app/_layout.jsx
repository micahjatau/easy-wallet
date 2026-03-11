import { StatusBar } from 'expo-status-bar'
import { Redirect, Stack, useSegments } from 'expo-router'
import { TamaguiProvider } from '@tamagui/core'
import { tamaguiConfig } from '@easy-ledger/ui'
import { useOnboardingGate } from '../src/hooks/useOnboardingGate.js'
import { MobileAuthProvider } from '../src/contexts/MobileAuthContext.jsx'

function OnboardingRedirectGate() {
  const segments = useSegments()
  const {
    isAuthenticated,
    setupComplete,
    shouldShowOnboarding,
    isGateLoading,
  } = useOnboardingGate()

  const isOnboardingRoute = segments[0] === 'onboarding'

  if (!isGateLoading && shouldShowOnboarding && !isOnboardingRoute) {
    return <Redirect href="/onboarding" />
  }

  if (!isGateLoading && isAuthenticated && setupComplete && isOnboardingRoute) {
    return <Redirect href="/(tabs)" />
  }

  return null
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <MobileAuthProvider>
        <StatusBar style="dark" />
        <OnboardingRedirectGate />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="reports" options={{ title: 'Reports' }} />
          <Stack.Screen name="accounts" options={{ title: 'Accounts' }} />
          <Stack.Screen name="transaction/[id]" options={{ title: 'Transaction' }} />
        </Stack>
      </MobileAuthProvider>
    </TamaguiProvider>
  )
}

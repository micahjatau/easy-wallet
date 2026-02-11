import { StatusBar } from 'expo-status-bar'
import { Slot } from 'expo-router'
import { TamaguiProvider } from '@tamagui/core'
import { tamaguiConfig } from '@easy-ledger/ui'

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <StatusBar style="dark" />
      <Slot />
    </TamaguiProvider>
  )
}

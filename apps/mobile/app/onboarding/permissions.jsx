import { useRouter } from 'expo-router'
import { Button, Card, Screen, Text } from '@easy-ledger/ui'
import { useOnboardingGate } from '../../src/hooks/useOnboardingGate.js'

export default function OnboardingPermissionsScreen() {
  const router = useRouter()
  const { markSetupComplete } = useOnboardingGate()

  return (
    <Screen style={{ justifyContent: 'center', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Permissions</Text>
        <Text>Configure notification and device permissions.</Text>
        <Button
          label="Finish Setup"
          onPress={async () => {
            await markSetupComplete({
              notificationsEnabled: true,
            })
            router.replace('/(tabs)')
          }}
        />
      </Card>
    </Screen>
  )
}

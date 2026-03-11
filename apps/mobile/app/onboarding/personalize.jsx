import { useRouter } from 'expo-router'
import { Button, Card, Screen, Text } from '@easy-ledger/ui'

export default function OnboardingPersonalizeScreen() {
  const router = useRouter()

  return (
    <Screen style={{ justifyContent: 'center', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Personalize</Text>
        <Text>Choose your base currency, defaults, and categories.</Text>
        <Button label="Continue" onPress={() => router.push('/onboarding/permissions')} />
      </Card>
    </Screen>
  )
}

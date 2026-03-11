import { useRouter } from 'expo-router'
import { Button, Card, Screen, Text } from '@easy-ledger/ui'
import { useMobileAuthContext } from '../../src/contexts/useMobileAuthContext.js'

export default function OnboardingIndexScreen() {
  const router = useRouter()
  const { isAuthenticated, signIn } = useMobileAuthContext()

  return (
    <Screen style={{ justifyContent: 'center', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Welcome</Text>
        <Text>Set up your profile before entering the app.</Text>
        {!isAuthenticated ? (
          <Button
            label="Sign In"
            onPress={async () => {
              await signIn()
              router.push('/onboarding/personalize')
            }}
          />
        ) : (
          <Button label="Get Started" onPress={() => router.push('/onboarding/personalize')} />
        )}
      </Card>
    </Screen>
  )
}

import { useRouter } from 'expo-router'
import { Button, Card, Screen, Text } from '@easy-ledger/ui'
import { useMobileAuthContext } from '../../src/contexts/useMobileAuthContext.js'

export default function SettingsTabScreen() {
  const router = useRouter()
  const {
    isAuthenticated,
    user,
    profile,
    signIn,
    signOut,
  } = useMobileAuthContext()

  return (
    <Screen style={{ justifyContent: 'flex-start', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Settings</Text>
        <Text>Profile, sync, theme, and export controls.</Text>
      </Card>

      <Card>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Account</Text>
        <Text>
          {isAuthenticated
            ? `Signed in as ${user?.email || user?.displayName || user?.id}`
            : 'Not signed in'}
        </Text>
        <Text>
          Setup complete: {profile?.setupComplete ? 'Yes' : 'No'}
        </Text>
        {!isAuthenticated ? (
          <Button label="Sign In" onPress={() => signIn()} />
        ) : (
          <>
            {!profile?.setupComplete ? (
              <Button label="Continue Setup" onPress={() => router.push('/onboarding')} />
            ) : null}
            <Button label="Sign Out" onPress={() => signOut()} />
          </>
        )}
      </Card>

      <Card>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Secondary Screens</Text>
        <Button label="Reports" onPress={() => router.push('/reports')} />
        <Button label="Accounts" onPress={() => router.push('/accounts')} />
      </Card>
    </Screen>
  )
}

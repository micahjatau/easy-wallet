import { useRouter } from 'expo-router'
import { Button, Card, Screen, Text } from '@easy-ledger/ui'
import { ENABLE_HOME_QUICK_ACTIONS } from '../../src/config/features.js'

export default function HomeTabScreen() {
  const router = useRouter()

  return (
    <Screen style={{ justifyContent: 'flex-start', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Home</Text>
        <Text>Current-month dashboard snapshot for mobile.</Text>
      </Card>

      {ENABLE_HOME_QUICK_ACTIONS ? (
        <Card>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>Quick Actions</Text>
          <Button label="Add Transaction" onPress={() => router.push('/(tabs)/add')} />
          <Button label="View Reports" onPress={() => router.push('/reports')} />
          <Button label="Open Accounts" onPress={() => router.push('/accounts')} />
        </Card>
      ) : null}
    </Screen>
  )
}

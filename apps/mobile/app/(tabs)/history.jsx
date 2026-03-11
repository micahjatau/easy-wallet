import { useRouter } from 'expo-router'
import { Button, Card, Screen, Text } from '@easy-ledger/ui'

export default function HistoryTabScreen() {
  const router = useRouter()

  return (
    <Screen style={{ justifyContent: 'flex-start', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>History</Text>
        <Text>Selected-range metrics and transaction list live here.</Text>
      </Card>

      <Card>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Sample Navigation</Text>
        <Button label="Open Transaction Detail" onPress={() => router.push('/transaction/demo-id')} />
      </Card>
    </Screen>
  )
}

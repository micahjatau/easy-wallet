import { useLocalSearchParams } from 'expo-router'
import { Card, Screen, Text } from '@easy-ledger/ui'

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams()

  return (
    <Screen style={{ justifyContent: 'flex-start', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Transaction</Text>
        <Text>Detail route for transaction id: {String(id || '')}</Text>
      </Card>
    </Screen>
  )
}

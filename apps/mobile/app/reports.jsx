import { Card, Screen, Text } from '@easy-ledger/ui'

export default function ReportsScreen() {
  return (
    <Screen style={{ justifyContent: 'flex-start', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Reports</Text>
        <Text>Deeper analytics and trend breakdowns.</Text>
      </Card>
    </Screen>
  )
}

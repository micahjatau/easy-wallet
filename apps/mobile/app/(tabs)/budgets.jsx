import { Card, Screen, Text } from '@easy-ledger/ui'

export default function BudgetsTabScreen() {
  return (
    <Screen style={{ justifyContent: 'flex-start', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Budgets</Text>
        <Text>Budget progress and alerts will be surfaced here.</Text>
      </Card>
    </Screen>
  )
}

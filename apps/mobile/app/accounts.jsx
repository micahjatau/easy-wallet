import { Card, Screen, Text } from '@easy-ledger/ui'

export default function AccountsScreen() {
  return (
    <Screen style={{ justifyContent: 'flex-start', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Accounts</Text>
        <Text>Manage wallets and account balances.</Text>
      </Card>
    </Screen>
  )
}

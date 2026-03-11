import { Button, Card, Screen, Text } from '@easy-ledger/ui'

export default function AddTabScreen() {
  return (
    <Screen style={{ justifyContent: 'flex-start', gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Add</Text>
        <Text>Fast transaction capture screen.</Text>
      </Card>

      <Card>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>MVP Placeholder</Text>
        <Button label="Save Transaction" onPress={() => {}} />
      </Card>
    </Screen>
  )
}

import { Button, Card, Screen, Text } from '@easy-ledger/ui'

export default function HomeScreen() {
  return (
    <Screen>
      <Card>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>Easy Ledger Mobile</Text>
        <Text>Expo Router and Tamagui are wired for mobile-first development.</Text>
        <Button label="Continue" />
      </Card>
    </Screen>
  )
}

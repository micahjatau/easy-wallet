import { Pressable } from 'react-native'
import { useTheme } from '@tamagui/core'
import { Text } from './Text.jsx'

export function Button({ label, onPress }) {
  const theme = useTheme()

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: theme.accent.val,
        borderRadius: 10,
        opacity: pressed ? 0.85 : 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
      })}
    >
      <Text style={{ color: theme.accentText.val, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  )
}

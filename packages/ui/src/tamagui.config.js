import { createTamagui, createTokens } from '@tamagui/core'

const tokens = createTokens({
  color: {
    background: '#f5f1e8',
    surface: '#fffaf2',
    text: '#1f2933',
    muted: '#5b6770',
    accent: '#0f766e',
    accentText: '#ecfeff',
    border: '#d6d0c5',
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
  },
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 22,
  },
  radius: {
    0: 0,
    1: 6,
    2: 10,
    3: 14,
  },
})

const themes = {
  light: {
    background: '$background',
    color: '$text',
    mutedColor: '$muted',
    borderColor: '$border',
    surface: '$surface',
    accent: '$accent',
    accentText: '$accentText',
  },
}

const tamaguiConfig = createTamagui({
  tokens,
  themes,
  defaultTheme: 'light',
})

export default tamaguiConfig

import { describe, expect, it } from 'vitest'
import { sanitizeSettings } from './useStorageState.js'

describe('sanitizeSettings syncMeta normalization', () => {
  it('provides default syncMeta when missing', () => {
    const settings = sanitizeSettings({
      baseCurrency: 'NGN',
      currencies: ['NGN'],
      rates: { NGN: 1 },
    })

    expect(settings.syncMeta).toEqual({
      lastRemoteVersion: 0,
      lastRemoteUpdatedAt: null,
    })
  })

  it('normalizes invalid syncMeta values', () => {
    const settings = sanitizeSettings({
      baseCurrency: 'NGN',
      currencies: ['NGN'],
      rates: { NGN: 1 },
      syncMeta: {
        lastRemoteVersion: 'not-a-number',
        lastRemoteUpdatedAt: { bad: true },
      },
    })

    expect(settings.syncMeta.lastRemoteVersion).toBe(0)
    expect(settings.syncMeta.lastRemoteUpdatedAt).toBeNull()
  })
})

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRestorePoints } from './useRestorePoints.js'

describe('useRestorePoints local key scoping', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('isolates local restore points by profile scope', async () => {
    const { result: scopeA } = renderHook(() => useRestorePoints('profile-a'))
    const { result: scopeB } = renderHook(() => useRestorePoints('profile-b'))

    await act(async () => {
      await scopeA.current.createRestorePoint({
        userId: null,
        name: 'A snapshot',
        snapshotType: 'manual',
        state: { settings: {}, accounts: [], transactions: [] },
        deviceId: 'device-a',
      })
    })

    const pointsA = await scopeA.current.getRestorePoints(null, 10)
    const pointsB = await scopeB.current.getRestorePoints(null, 10)

    expect(pointsA.data.length).toBe(1)
    expect(pointsA.data[0].name).toBe('A snapshot')
    expect(pointsB.data.length).toBe(0)
  })

  it('migrates legacy restore key to scoped key', async () => {
    localStorage.setItem(
      'easy-ledger-local-restore-points',
      JSON.stringify([
        {
          id: 'legacy-1',
          name: 'Legacy snapshot',
          created_at: new Date().toISOString(),
          state_json: { settings: {}, accounts: [], transactions: [] },
        },
      ]),
    )

    const { result } = renderHook(() => useRestorePoints('profile-a'))
    const points = await result.current.getRestorePoints(null, 10)

    expect(points.data.length).toBe(1)
    expect(points.data[0].id).toBe('legacy-1')
    expect(localStorage.getItem('easy-ledger-local-restore-points')).toBeNull()
    expect(localStorage.getItem('easy-ledger-local-restore-points-profile-a')).not.toBeNull()
  })

  it('creates restore point when crypto.subtle is unavailable', async () => {
    // Mock crypto.subtle as undefined (private browsing mode)
    const originalSubtle = window.crypto.subtle
    Object.defineProperty(window.crypto, 'subtle', {
      value: undefined,
      configurable: true,
    })

    const { result } = renderHook(() => useRestorePoints('profile-test'))

    let createResult
    await act(async () => {
      createResult = await result.current.createRestorePoint({
        userId: null,
        name: 'Test without crypto',
        snapshotType: 'manual',
        state: { settings: {}, accounts: [], transactions: [] },
        deviceId: 'device-test',
      })
    })

    // Restore original crypto.subtle
    Object.defineProperty(window.crypto, 'subtle', {
      value: originalSubtle,
      configurable: true,
    })

    expect(createResult.data).toBeDefined()
    expect(createResult.error).toBeUndefined()
    expect(createResult.data.checksum).toMatch(/^fb_[a-f0-9]{8}$/)
  })

  it('creates restore point when crypto.subtle.digest throws', async () => {
    // Mock crypto.subtle.digest to throw
    const originalSubtle = window.crypto.subtle
    Object.defineProperty(window.crypto, 'subtle', {
      value: {
        digest: vi.fn().mockRejectedValue(new Error('Crypto not available')),
      },
      configurable: true,
    })

    const { result } = renderHook(() => useRestorePoints('profile-test'))

    let createResult
    await act(async () => {
      createResult = await result.current.createRestorePoint({
        userId: null,
        name: 'Test with crypto error',
        snapshotType: 'manual',
        state: { settings: {}, accounts: [], transactions: [] },
        deviceId: 'device-test',
      })
    })

    // Restore original crypto.subtle
    Object.defineProperty(window.crypto, 'subtle', {
      value: originalSubtle,
      configurable: true,
    })

    expect(createResult.data).toBeDefined()
    expect(createResult.error).toBeUndefined()
    expect(createResult.data.checksum).toMatch(/^fb_[a-f0-9]{8}$/)
  })
})

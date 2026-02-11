import { renderHook } from '@testing-library/react'
import { act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { shouldCreateConflict, useSync } from './useSync.js'

describe('useSync canonical syncedAt source', () => {
  it('derives lastSyncAt from syncedAt input', () => {
    const syncedAt = '2026-02-07T10:00:00.000Z'
    const { result } = renderHook(() =>
      useSync('user-1', 'device-1', syncedAt, () => {}),
    )

    expect(result.current.lastSyncAt).toBe(syncedAt)
  })

  it('prefers version-based conflict checks when versions are present', () => {
    expect(
      shouldCreateConflict({
        remoteVersion: 5,
        localVersion: 4,
        remoteUpdatedAt: '2026-02-08T10:00:00.000Z',
        localSyncedAt: '2026-02-09T10:00:00.000Z',
      }),
    ).toBe(true)

    expect(
      shouldCreateConflict({
        remoteVersion: 4,
        localVersion: 4,
        remoteUpdatedAt: '2026-02-10T10:00:00.000Z',
        localSyncedAt: '2026-02-09T10:00:00.000Z',
      }),
    ).toBe(false)
  })

  it('falls back to timestamp comparison when versions are missing', () => {
    expect(
      shouldCreateConflict({
        remoteVersion: null,
        localVersion: null,
        remoteUpdatedAt: '2026-02-09T10:00:00.000Z',
        localSyncedAt: '2026-02-08T10:00:00.000Z',
      }),
    ).toBe(true)

    expect(
      shouldCreateConflict({
        remoteVersion: null,
        localVersion: null,
        remoteUpdatedAt: '2026-02-08T10:00:00.000Z',
        localSyncedAt: '2026-02-09T10:00:00.000Z',
      }),
    ).toBe(false)
  })

  it('does not create conflict when both version and timestamps are unavailable', () => {
    expect(
      shouldCreateConflict({
        remoteVersion: undefined,
        localVersion: undefined,
        remoteUpdatedAt: null,
        localSyncedAt: null,
      }),
    ).toBe(false)
  })

  it('queues pending changes and schedules auto sync trigger', () => {
    vi.useFakeTimers()

    const { result } = renderHook(() =>
      useSync('user-1', 'device-1', null, () => {}),
    )

    expect(result.current.pendingChanges).toBe(0)
    expect(result.current.autoSyncTrigger).toBe(0)
    expect(result.current.shouldAutoSync).toBe(false)

    act(() => {
      result.current.queueChange()
    })

    expect(result.current.pendingChanges).toBe(1)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.autoSyncTrigger).toBe(1)
    expect(result.current.shouldAutoSync).toBe(true)

    vi.useRealTimers()
  })

  it('returns offline sync result when browser goes offline', async () => {
    const { result } = renderHook(() =>
      useSync('user-1', 'device-1', null, () => {}),
    )

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    let output
    await act(async () => {
      output = await result.current.syncData({ transactions: [] })
    })

    expect(output).toEqual({ error: 'Offline' })
  })

  it('returns auth error when trying to sync without user', async () => {
    const { result } = renderHook(() =>
      useSync(null, 'device-1', null, () => {}),
    )

    const output = await result.current.syncData({ transactions: [] })
    expect(output).toEqual({ error: 'Not authenticated' })
    expect(result.current.syncState).toBe('idle')
  })

})

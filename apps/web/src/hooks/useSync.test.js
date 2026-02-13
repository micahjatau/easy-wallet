import { renderHook } from '@testing-library/react'
import { act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
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

describe('conflict resolution', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('exports CONFLICT_KINDS constant', () => {
    const { result } = renderHook(() =>
      useSync('user-1', 'device-1', null, () => {}),
    )

    expect(result.current.CONFLICT_KINDS).toBeDefined()
    expect(result.current.CONFLICT_KINDS.REMOTE).toBe('remote_conflict')
    expect(result.current.CONFLICT_KINDS.LOCAL_VERSION).toBe('local_version_conflict')
  })

  it('resolves local version conflicts in-memory without Firestore', async () => {
    const { result } = renderHook(() =>
      useSync('user-1', 'device-1', null, () => {}),
    )

    // Manually add a local version conflict
    const localConflict = {
      kind: result.current.CONFLICT_KINDS.LOCAL_VERSION,
      id: 'local_conflict_test_123',
      userId: 'user-1',
      localData: { transactions: [], accounts: [] },
      remoteData: { transactions: [], accounts: [] },
    }

    act(() => {
      // Add conflict by setting state directly via internal mechanism
      result.current.conflicts.push(localConflict)
    })

    const onApplyRemote = vi.fn()
    const onKeepLocal = vi.fn()

    await act(async () => {
      await result.current.resolveConflict('local_conflict_test_123', 'remote', {
        onApplyRemote,
        onKeepLocal,
      })
    })

    expect(onApplyRemote).toHaveBeenCalled()
    expect(result.current.conflicts).toHaveLength(0)
  })

  it('returns error when resolving non-existent conflict', async () => {
    const { result } = renderHook(() =>
      useSync('user-1', 'device-1', null, () => {}),
    )

    let resolveResult
    await act(async () => {
      resolveResult = await result.current.resolveConflict('non-existent-id', 'remote')
    })

    expect(resolveResult.error).toBe('Conflict not found')
    expect(resolveResult.errorCode).toBe('not_found')
  })
})

describe('local conflict persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads persisted local conflicts on mount', () => {
    // Pre-populate localStorage with a local conflict
    const persistedConflict = {
      kind: 'local_version_conflict',
      id: 'local_conflict_persisted',
      userId: 'user-1',
      localData: {},
      remoteData: {},
    }
    localStorage.setItem('easy-ledger-pending-conflicts', JSON.stringify([persistedConflict]))

    const { result } = renderHook(() =>
      useSync('user-1', 'device-1', null, () => {}),
    )

    // Should load persisted conflict
    expect(result.current.conflicts).toHaveLength(1)
    expect(result.current.conflicts[0].id).toBe('local_conflict_persisted')
  })

  it('filters out persisted conflicts for different users', () => {
    const otherUserConflict = {
      kind: 'local_version_conflict',
      id: 'local_conflict_other',
      userId: 'user-2',
      localData: {},
      remoteData: {},
    }
    localStorage.setItem('easy-ledger-pending-conflicts', JSON.stringify([otherUserConflict]))

    const { result } = renderHook(() =>
      useSync('user-1', 'device-1', null, () => {}),
    )

    expect(result.current.conflicts).toHaveLength(0)
  })
})

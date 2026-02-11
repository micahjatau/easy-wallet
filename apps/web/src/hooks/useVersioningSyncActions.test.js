import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useVersioningSyncActions } from './useVersioningSyncActions.js'

const buildProps = (overrides = {}) => ({
  profile: { id: 'user-1' },
  transactions: [],
  accounts: [{ id: 'acc-1', name: 'Cash', createdAt: Date.now() }],
  settings: { baseCurrency: 'NGN', currencies: ['NGN'], rates: { NGN: 1 } },
  deviceId: 'device-1',
  createRestorePoint: vi.fn(),
  deleteRestorePoint: vi.fn(),
  triggerSync: vi.fn(),
  resolveConflict: vi.fn(),
  setRestorePoints: vi.fn(),
  setTransactions: vi.fn(),
  setAccounts: vi.fn(),
  setSettings: vi.fn(),
  setIsResolvingConflict: vi.fn(),
  success: vi.fn(),
  showError: vi.fn(),
  info: vi.fn(),
  ...overrides,
})

describe('useVersioningSyncActions inbound state hardening', () => {
  it('sanitizes snapshot payload before restoring', async () => {
    const props = buildProps()
    const { result } = renderHook(() => useVersioningSyncActions(props))

    await act(async () => {
      await result.current.handleRestoreFromPoint({
        name: 'Point A',
        state_json: {
          settings: { baseCurrency: 'USD', currencies: ['USD'], rates: { USD: 1 } },
          accounts: [{ id: 'a1', name: 'Main', createdAt: Date.now() }],
          transactions: [
            {
              id: 't1',
              name: 'Coffee',
              amount: 12,
              category: 'Food',
              date: '2026-02-07',
              type: 'expense',
              currency: 'USD',
              accountId: 'a1',
              createdAt: Date.now(),
            },
          ],
        },
      })
    })

    expect(props.setSettings).toHaveBeenCalled()
    expect(props.setAccounts).toHaveBeenCalled()
    expect(props.setTransactions).toHaveBeenCalled()
    expect(props.success).toHaveBeenCalledWith('Data restored to "Point A"')
  })

  it('rejects invalid snapshot payload and shows an error', async () => {
    const props = buildProps()
    const { result } = renderHook(() => useVersioningSyncActions(props))

    await act(async () => {
      await result.current.handleRestoreFromPoint({
        name: 'Broken Point',
        state_json: { foo: 'bar' },
      })
    })

    expect(props.showError).toHaveBeenCalledWith(
      'Failed to restore snapshot: invalid payload.',
    )
    expect(props.setSettings).not.toHaveBeenCalled()
    expect(props.setAccounts).not.toHaveBeenCalled()
    expect(props.setTransactions).not.toHaveBeenCalled()
  })

  it('sanitizes remoteData from manual sync before applying', async () => {
    const props = buildProps({
      triggerSync: vi.fn().mockResolvedValue({
        remoteData: {
          settings: { baseCurrency: 'NGN', currencies: ['NGN'], rates: { NGN: 1 } },
          accounts: [{ id: 'acc-x', name: 'Cash', createdAt: Date.now() }],
          transactions: [],
        },
      }),
    })

    const { result } = renderHook(() => useVersioningSyncActions(props))

    await act(async () => {
      await result.current.handleManualSync()
    })

    expect(props.setSettings).toHaveBeenCalled()
    expect(props.setAccounts).toHaveBeenCalled()
    expect(props.setTransactions).toHaveBeenCalled()
    expect(props.success).toHaveBeenCalledWith('Backup restored from cloud')
  })
})

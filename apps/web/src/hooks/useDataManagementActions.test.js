import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDataManagementActions } from './useDataManagementActions.js'

describe('useDataManagementActions', () => {
  it('updates retention settings without overwriting lastExportAt', () => {
    let settingsState = {
      privacy: {
        dataRetentionDays: 90,
        autoBackup: true,
        lastExportAt: 12345,
      },
    }

    const setSettings = vi.fn((updater) => {
      settingsState = updater(settingsState)
    })

    const { result } = renderHook(() =>
      useDataManagementActions({
        profile: null,
        transactions: [],
        accounts: [],
        settings: settingsState,
        deviceId: 'device-1',
        createRestorePoint: vi.fn(),
        setSettings,
        setTransactions: vi.fn(),
        setAccounts: vi.fn(),
        setActiveView: vi.fn(),
        success: vi.fn(),
        info: vi.fn(),
      }),
    )

    act(() => {
      result.current.handleUpdatePrivacyRetention({
        dataRetentionDays: 30,
        autoBackup: false,
      })
    })

    expect(settingsState.privacy.dataRetentionDays).toBe(30)
    expect(settingsState.privacy.autoBackup).toBe(false)
    expect(settingsState.privacy.lastExportAt).toBe(12345)
  })

  it('updates privacy export timestamp only', () => {
    let settingsState = {
      privacy: {
        dataRetentionDays: 90,
        autoBackup: true,
        lastExportAt: null,
      },
    }

    const setSettings = vi.fn((updater) => {
      settingsState = updater(settingsState)
    })

    const { result } = renderHook(() =>
      useDataManagementActions({
        profile: null,
        transactions: [],
        accounts: [],
        settings: settingsState,
        deviceId: 'device-1',
        createRestorePoint: vi.fn(),
        setSettings,
        setTransactions: vi.fn(),
        setAccounts: vi.fn(),
        setActiveView: vi.fn(),
        success: vi.fn(),
        info: vi.fn(),
      }),
    )

    act(() => {
      result.current.handlePrivacyExport(777)
    })

    expect(settingsState.privacy.lastExportAt).toBe(777)
    expect(settingsState.privacy.dataRetentionDays).toBe(90)
    expect(settingsState.privacy.autoBackup).toBe(true)
  })

  it('clears all data without restore point for anonymous profile', async () => {
    const setTransactions = vi.fn()
    const setAccounts = vi.fn()
    const setSettings = vi.fn()
    const setActiveView = vi.fn()
    const success = vi.fn()
    const queueChange = vi.fn()

    const { result } = renderHook(() =>
      useDataManagementActions({
        profile: null,
        transactions: [{ id: 'txn-1' }],
        accounts: [{ id: 'acc-1', name: 'Cash', createdAt: Date.now() }],
        settings: { baseCurrency: 'NGN', currencies: ['NGN'], rates: { NGN: 1 } },
        deviceId: 'device-1',
        createRestorePoint: vi.fn(),
        setSettings,
        setTransactions,
        setAccounts,
        setActiveView,
        success,
        info: vi.fn(),
        queueChange,
      }),
    )

    await act(async () => {
      await result.current.handleClearAllData()
    })

    expect(setTransactions).toHaveBeenCalledWith([])
    expect(setAccounts).toHaveBeenCalled()
    const defaultAccounts = setAccounts.mock.calls[0][0]
    expect(Array.isArray(defaultAccounts)).toBe(true)
    expect(defaultAccounts).toHaveLength(1)
    expect(defaultAccounts[0].name).toBe('Cash')
    expect(setSettings).toHaveBeenCalled()
    expect(setActiveView).toHaveBeenCalledWith('activity')
    expect(queueChange).toHaveBeenCalled()
    expect(success).toHaveBeenCalledWith('All data cleared.')
  })

  it('returns info when no old transactions qualify for cleanup', async () => {
    const info = vi.fn()
    const setTransactions = vi.fn()

    const { result } = renderHook(() =>
      useDataManagementActions({
        profile: null,
        transactions: [{ id: 'txn-1', date: '2099-01-01', isDeleted: false }],
        accounts: [],
        settings: {},
        deviceId: 'device-1',
        createRestorePoint: vi.fn(),
        setSettings: vi.fn(),
        setTransactions,
        setAccounts: vi.fn(),
        setActiveView: vi.fn(),
        success: vi.fn(),
        info,
      }),
    )

    await act(async () => {
      await result.current.handleClearOldData(30)
    })

    expect(info).toHaveBeenCalledWith('No old transactions to clear.')
    expect(setTransactions).not.toHaveBeenCalled()
  })

  it('clears old transactions and creates restore point for signed in profile', async () => {
    const createRestorePoint = vi.fn().mockResolvedValue({})
    const setTransactions = vi.fn()
    const success = vi.fn()
    const queueChange = vi.fn()

    const { result } = renderHook(() =>
      useDataManagementActions({
        profile: { id: 'user-1' },
        transactions: [
          { id: 'old-1', date: '2000-01-01', isDeleted: false },
          { id: 'deleted-1', date: '2000-01-01', isDeleted: true },
        ],
        accounts: [{ id: 'acc-1', name: 'Cash', createdAt: Date.now() }],
        settings: { baseCurrency: 'NGN' },
        deviceId: 'device-1',
        createRestorePoint,
        setSettings: vi.fn(),
        setTransactions,
        setAccounts: vi.fn(),
        setActiveView: vi.fn(),
        success,
        info: vi.fn(),
        queueChange,
      }),
    )

    await act(async () => {
      await result.current.handleClearOldData(30)
    })

    expect(createRestorePoint).toHaveBeenCalled()
    expect(setTransactions).toHaveBeenCalledWith([
      { id: 'deleted-1', date: '2000-01-01', isDeleted: true },
    ])
    expect(queueChange).toHaveBeenCalled()
    expect(success).toHaveBeenCalledWith('1 old transaction cleared. Recent data preserved.')
  })
})

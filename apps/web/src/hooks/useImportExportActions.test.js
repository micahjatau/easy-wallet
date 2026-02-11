import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useImportExportActions } from './useImportExportActions.js'

describe('useImportExportActions import schema compatibility', () => {
  const OriginalFileReader = globalThis.FileReader
  let nextReaderResult = '{}'
  let nextReaderMode = 'load'

  beforeEach(() => {
    class MockFileReader {
      readAsText() {
        if (nextReaderMode === 'error') {
          if (this.onerror) this.onerror(new Error('read failed'))
          return
        }
        this.result = nextReaderResult
        if (this.onload) this.onload()
      }
    }
    globalThis.FileReader = MockFileReader
    nextReaderMode = 'load'
  })

  afterEach(() => {
    globalThis.FileReader = OriginalFileReader
  })

  it('accepts legacy { data: { ... } } export shape', () => {
    const setImportError = vi.fn()
    const setImportPreview = vi.fn()

    nextReaderResult = JSON.stringify({
      schemaVersion: 2,
      appName: 'Easy Ledger',
      appSlug: 'easy-ledger',
      data: {
        settings: { baseCurrency: 'NGN', currencies: ['NGN'], rates: { NGN: 1 } },
        accounts: [{ id: 'acc-1', name: 'Cash', createdAt: Date.now() }],
        transactions: [
          {
            id: 'txn-1',
            name: 'Lunch',
            amount: 2000,
            category: 'Food',
            date: '2026-02-07',
            type: 'expense',
            currency: 'NGN',
            accountId: 'acc-1',
            createdAt: Date.now(),
          },
        ],
      },
    })

    const { result } = renderHook(() =>
      useImportExportActions({
        transactions: [],
        settings: { baseCurrency: 'NGN', currencies: ['NGN'], rates: { NGN: 1 } },
        accounts: [{ id: 'acc-1', name: 'Cash', createdAt: Date.now() }],
        includeDeletedExport: false,
        importPreview: null,
        profile: null,
        deviceId: 'device-1',
        createRestorePoint: vi.fn(),
        setImportError,
        setImportPreview,
        setSettings: vi.fn(),
        setAccounts: vi.fn(),
        setTransactions: vi.fn(),
        setEditingId: vi.fn(),
        setFormErrors: vi.fn(),
        setFormState: vi.fn(),
        success: vi.fn(),
        info: vi.fn(),
      }),
    )

    const event = {
      target: {
        files: [new File(['{}'], 'import.json', { type: 'application/json' })],
        value: 'x',
      },
    }

    act(() => {
      result.current.handleImportJson(event)
    })

    expect(setImportError).toHaveBeenCalledWith('')
    expect(setImportPreview).toHaveBeenCalled()

    const previewArg = setImportPreview.mock.calls.at(-1)[0]
    expect(previewArg.data.settings.baseCurrency).toBe('NGN')
    expect(previewArg.summary.transactionsCount).toBe(1)
  })

  it('shows import error for invalid ledger payload', () => {
    const setImportError = vi.fn()
    const setImportPreview = vi.fn()

    nextReaderResult = JSON.stringify({ foo: 'bar' })

    const { result } = renderHook(() =>
      useImportExportActions({
        transactions: [],
        settings: { baseCurrency: 'NGN', currencies: ['NGN'], rates: { NGN: 1 } },
        accounts: [{ id: 'acc-1', name: 'Cash', createdAt: Date.now() }],
        includeDeletedExport: false,
        importPreview: null,
        profile: null,
        deviceId: 'device-1',
        createRestorePoint: vi.fn(),
        setImportError,
        setImportPreview,
        setSettings: vi.fn(),
        setAccounts: vi.fn(),
        setTransactions: vi.fn(),
        setEditingId: vi.fn(),
        setFormErrors: vi.fn(),
        setFormState: vi.fn(),
        success: vi.fn(),
        info: vi.fn(),
      }),
    )

    const event = {
      target: {
        files: [new File(['{}'], 'invalid.json', { type: 'application/json' })],
        value: 'x',
      },
    }

    act(() => {
      result.current.handleImportJson(event)
    })

    expect(setImportError).toHaveBeenLastCalledWith(
      'Invalid JSON file. Please select a valid export.',
    )
  })

  it('shows read error when file reader fails', () => {
    const setImportError = vi.fn()
    nextReaderMode = 'error'

    const { result } = renderHook(() =>
      useImportExportActions({
        transactions: [],
        settings: { baseCurrency: 'NGN', currencies: ['NGN'], rates: { NGN: 1 } },
        accounts: [{ id: 'acc-1', name: 'Cash', createdAt: Date.now() }],
        includeDeletedExport: false,
        importPreview: null,
        profile: null,
        deviceId: 'device-1',
        createRestorePoint: vi.fn(),
        setImportError,
        setImportPreview: vi.fn(),
        setSettings: vi.fn(),
        setAccounts: vi.fn(),
        setTransactions: vi.fn(),
        setEditingId: vi.fn(),
        setFormErrors: vi.fn(),
        setFormState: vi.fn(),
        success: vi.fn(),
        info: vi.fn(),
      }),
    )

    const event = {
      target: {
        files: [new File(['{}'], 'broken.json', { type: 'application/json' })],
        value: 'x',
      },
    }

    act(() => {
      result.current.handleImportJson(event)
    })

    expect(setImportError).toHaveBeenLastCalledWith('Unable to read that file.')
  })

  it('applies import even when restore point creation fails', async () => {
    const setSettings = vi.fn()
    const setAccounts = vi.fn()
    const setTransactions = vi.fn()
    const setEditingId = vi.fn()
    const setFormErrors = vi.fn()
    const setImportError = vi.fn()
    const setImportPreview = vi.fn()
    const setFormState = vi.fn()
    const info = vi.fn()
    const success = vi.fn()
    const queueChange = vi.fn()
    const createRestorePoint = vi.fn().mockRejectedValue(new Error('storage failed'))

    const importPreview = {
      data: {
        settings: { baseCurrency: 'USD', currencies: ['USD'], rates: { USD: 1 } },
        accounts: [{ id: 'acc-2', name: 'Wallet', createdAt: Date.now() }],
        transactions: [
          {
            id: 'txn-2',
            name: 'Salary',
            amount: 1000,
            category: 'Salary',
            date: '2026-02-07',
            type: 'income',
            currency: 'USD',
            accountId: 'acc-2',
            createdAt: Date.now(),
          },
        ],
      },
    }

    const { result } = renderHook(() =>
      useImportExportActions({
        transactions: [],
        settings: { baseCurrency: 'NGN', currencies: ['NGN'], rates: { NGN: 1 } },
        accounts: [{ id: 'acc-1', name: 'Cash', createdAt: Date.now() }],
        includeDeletedExport: false,
        importPreview,
        profile: { id: 'user-1' },
        deviceId: 'device-1',
        createRestorePoint,
        setImportError,
        setImportPreview,
        setSettings,
        setAccounts,
        setTransactions,
        setEditingId,
        setFormErrors,
        setFormState,
        success,
        info,
        queueChange,
      }),
    )

    await act(async () => {
      await result.current.handleApplyImport()
    })

    expect(info).toHaveBeenCalledWith('Import backup could not be created. Continuing with import.')
    expect(setSettings).toHaveBeenCalledWith(importPreview.data.settings)
    expect(setAccounts).toHaveBeenCalledWith(importPreview.data.accounts)
    expect(setTransactions).toHaveBeenCalledWith(importPreview.data.transactions)
    expect(setEditingId).toHaveBeenCalledWith(null)
    expect(setFormErrors).toHaveBeenCalledWith({})
    expect(setImportError).toHaveBeenCalledWith('')
    expect(setImportPreview).toHaveBeenCalledWith(null)
    expect(setFormState).toHaveBeenCalled()
    expect(queueChange).toHaveBeenCalled()
    expect(success).toHaveBeenCalledWith('Import successful! 1 transactions imported.')
  })

  it('cancels import preview and clears import error', () => {
    const setImportPreview = vi.fn()
    const setImportError = vi.fn()

    const { result } = renderHook(() =>
      useImportExportActions({
        transactions: [],
        settings: { baseCurrency: 'NGN', currencies: ['NGN'], rates: { NGN: 1 } },
        accounts: [{ id: 'acc-1', name: 'Cash', createdAt: Date.now() }],
        includeDeletedExport: false,
        importPreview: { data: {} },
        profile: null,
        deviceId: 'device-1',
        createRestorePoint: vi.fn(),
        setImportError,
        setImportPreview,
        setSettings: vi.fn(),
        setAccounts: vi.fn(),
        setTransactions: vi.fn(),
        setEditingId: vi.fn(),
        setFormErrors: vi.fn(),
        setFormState: vi.fn(),
        success: vi.fn(),
        info: vi.fn(),
      }),
    )

    act(() => {
      result.current.handleCancelImport()
    })

    expect(setImportPreview).toHaveBeenCalledWith(null)
    expect(setImportError).toHaveBeenCalledWith('')
  })
})

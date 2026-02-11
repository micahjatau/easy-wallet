import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useAudit } from './useAudit.js'

describe('useAudit local key scoping', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('isolates local audit logs by profile scope', async () => {
    const { result: scopeA } = renderHook(() => useAudit('profile-a'))
    const { result: scopeB } = renderHook(() => useAudit('profile-b'))

    await act(async () => {
      await scopeA.current.logTransactionChange({
        userId: null,
        transactionId: 'txn-a',
        action: 'create',
        previousState: null,
        newState: { id: 'txn-a' },
        changedBy: 'device-a',
      })
    })

    const resultA = await scopeA.current.getRecentAuditLogs(null, 10)
    const resultB = await scopeB.current.getRecentAuditLogs(null, 10)

    expect(resultA.data.length).toBe(1)
    expect(resultA.data[0].transaction_id).toBe('txn-a')
    expect(resultB.data.length).toBe(0)
  })

  it('migrates legacy audit key to scoped key', async () => {
    localStorage.setItem(
      'easy-ledger-local-audit',
      JSON.stringify([{ transaction_id: 'legacy-txn', changed_at: new Date().toISOString() }]),
    )

    const { result } = renderHook(() => useAudit('profile-a'))
    const scoped = await result.current.getRecentAuditLogs(null, 10)

    expect(scoped.data.length).toBe(1)
    expect(scoped.data[0].transaction_id).toBe('legacy-txn')
    expect(localStorage.getItem('easy-ledger-local-audit')).toBeNull()
    expect(localStorage.getItem('easy-ledger-local-audit-profile-a')).not.toBeNull()
  })
})

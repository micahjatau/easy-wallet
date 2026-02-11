import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useActivityData } from './useActivityData.js'

const buildFilters = (overrides = {}) => ({
  search: '',
  type: 'all',
  category: 'all',
  accountId: 'all',
  showDeleted: false,
  dateRangeMode: 'custom',
  customStart: '2026-02-01',
  customEnd: '2026-02-02',
  ...overrides,
})

describe('useActivityData range consistency', () => {
  const accounts = [{ id: 'acc-1', name: 'Cash' }]
  const activeRange = {
    start: new Date(2026, 1, 1),
    end: new Date(2026, 1, 3),
  }

  const transactions = [
    {
      id: 'active-in-range',
      name: 'A',
      category: 'Food',
      date: '2026-02-02',
      type: 'expense',
      accountId: 'acc-1',
      createdAt: 1,
      isDeleted: false,
    },
    {
      id: 'active-on-end',
      name: 'B',
      category: 'Food',
      date: '2026-02-03',
      type: 'expense',
      accountId: 'acc-1',
      createdAt: 2,
      isDeleted: false,
    },
    {
      id: 'deleted-in-range',
      name: 'C',
      category: 'Food',
      date: '2026-02-02',
      type: 'expense',
      accountId: 'acc-1',
      createdAt: 3,
      isDeleted: true,
    },
    {
      id: 'deleted-on-end',
      name: 'D',
      category: 'Food',
      date: '2026-02-03',
      type: 'expense',
      accountId: 'acc-1',
      createdAt: 4,
      isDeleted: true,
    },
  ]

  it('uses the same end-exclusive range semantics for deleted and active views', () => {
    const { result: activeResult } = renderHook(() =>
      useActivityData({
        transactions,
        filters: buildFilters({ showDeleted: false }),
        activeRange,
        debouncedSearch: '',
        accounts,
      }),
    )

    const { result: deletedResult } = renderHook(() =>
      useActivityData({
        transactions,
        filters: buildFilters({ showDeleted: true }),
        activeRange,
        debouncedSearch: '',
        accounts,
      }),
    )

    expect(activeResult.current.filteredTransactions.map((t) => t.id)).toContain(
      'active-in-range',
    )
    expect(activeResult.current.filteredTransactions.map((t) => t.id)).not.toContain(
      'active-on-end',
    )

    expect(deletedResult.current.filteredTransactions.map((t) => t.id)).toContain(
      'deleted-in-range',
    )
    expect(deletedResult.current.filteredTransactions.map((t) => t.id)).not.toContain(
      'deleted-on-end',
    )
  })
})

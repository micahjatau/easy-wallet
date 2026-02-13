import { describe, expect, it } from 'vitest'
import {
  dedupeTransactions,
  dedupeAndMergeTransactions,
  findDuplicateIds,
  getTransactionVersions,
} from './deduplication.js'

describe('deduplication', () => {
  describe('dedupeTransactions', () => {
    it('removes duplicates by ID', () => {
      const txs = [
        { id: '1', name: 'First', amount: 10 },
        { id: '2', name: 'Second', amount: 20 },
        { id: '1', name: 'Duplicate', amount: 10 },
      ]
      const result = dedupeTransactions(txs)
      expect(result).toHaveLength(2)
      expect(result.map((t) => t.id).sort()).toEqual(['1', '2'])
    })

    it('keeps newest by updatedAt', () => {
      const txs = [
        { id: '1', name: 'Old', amount: 10, updatedAt: 1000 },
        { id: '1', name: 'New', amount: 15, updatedAt: 2000 },
      ]
      const result = dedupeTransactions(txs)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('New')
      expect(result[0].amount).toBe(15)
    })

    it('falls back to createdAt when updatedAt missing', () => {
      const txs = [
        { id: '1', name: 'Old', amount: 10, createdAt: 1000 },
        { id: '1', name: 'New', amount: 15, createdAt: 2000 },
      ]
      const result = dedupeTransactions(txs)
      expect(result[0].name).toBe('New')
    })

    it('prefers updatedAt over createdAt', () => {
      const txs = [
        { id: '1', name: 'A', amount: 10, createdAt: 3000, updatedAt: 1000 },
        { id: '1', name: 'B', amount: 15, createdAt: 1000, updatedAt: 2000 },
      ]
      const result = dedupeTransactions(txs)
      expect(result[0].name).toBe('B') // B has newer updatedAt
    })

    it('keeps first occurrence when timestamps equal', () => {
      const txs = [
        { id: '1', name: 'First', amount: 10, updatedAt: 1000 },
        { id: '1', name: 'Second', amount: 15, updatedAt: 1000 },
      ]
      const result = dedupeTransactions(txs)
      expect(result[0].name).toBe('First')
    })

    it('ignores transactions without ID', () => {
      const txs = [
        { id: '1', name: 'Valid' },
        { name: 'No ID' },
        { id: null, name: 'Null ID' },
      ]
      const result = dedupeTransactions(txs)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Valid')
    })

    it('handles empty array', () => {
      expect(dedupeTransactions([])).toEqual([])
    })

    it('handles non-array input', () => {
      expect(dedupeTransactions(null)).toEqual([])
      expect(dedupeTransactions(undefined)).toEqual([])
      expect(dedupeTransactions('string')).toEqual([])
    })

    it('preserves all properties of newest transaction', () => {
      const txs = [
        {
          id: '1',
          name: 'Old',
          amount: 10,
          category: 'Food',
          date: '2024-01-01',
          updatedAt: 1000,
        },
        {
          id: '1',
          name: 'New',
          amount: 15,
          category: 'Drinks',
          date: '2024-01-02',
          updatedAt: 2000,
        },
      ]
      const result = dedupeTransactions(txs)
      expect(result[0]).toEqual({
        id: '1',
        name: 'New',
        amount: 15,
        category: 'Drinks',
        date: '2024-01-02',
        updatedAt: 2000,
      })
    })
  })

  describe('dedupeAndMergeTransactions', () => {
    it('uses custom merge strategy when provided', () => {
      const txs = [
        { id: '1', name: 'A', amount: 10, tags: ['food'], updatedAt: 1000 },
        { id: '1', name: 'B', amount: 15, tags: ['drinks'], updatedAt: 2000 },
      ]

      const mergeStrategy = (existing, incoming) => ({
        ...incoming,
        tags: [...(existing.tags || []), ...(incoming.tags || [])],
      })

      const result = dedupeAndMergeTransactions(txs, mergeStrategy)
      expect(result[0].tags).toEqual(['food', 'drinks'])
    })

    it('falls back to standard dedupe when no strategy provided', () => {
      const txs = [
        { id: '1', name: 'Old', updatedAt: 1000 },
        { id: '1', name: 'New', updatedAt: 2000 },
      ]
      const result = dedupeAndMergeTransactions(txs)
      expect(result[0].name).toBe('New')
    })
  })

  describe('findDuplicateIds', () => {
    it('returns duplicate IDs', () => {
      const txs = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' },
        { id: '1', name: 'Duplicate of 1' },
        { id: '3', name: 'Third' },
        { id: '2', name: 'Duplicate of 2' },
      ]
      const duplicates = findDuplicateIds(txs)
      expect(duplicates.sort()).toEqual(['1', '2'])
    })

    it('returns empty array when no duplicates', () => {
      const txs = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' },
      ]
      expect(findDuplicateIds(txs)).toEqual([])
    })

    it('ignores transactions without ID', () => {
      const txs = [
        { id: '1', name: 'First' },
        { name: 'No ID' },
        { id: '1', name: 'Duplicate' },
      ]
      expect(findDuplicateIds(txs)).toEqual(['1'])
    })

    it('handles empty array', () => {
      expect(findDuplicateIds([])).toEqual([])
    })
  })

  describe('getTransactionVersions', () => {
    it('returns all versions of a transaction', () => {
      const txs = [
        { id: '1', name: 'A', updatedAt: 1000 },
        { id: '2', name: 'B', updatedAt: 2000 },
        { id: '1', name: 'C', updatedAt: 3000 },
      ]
      const versions = getTransactionVersions(txs, '1')
      expect(versions).toHaveLength(2)
      expect(versions.map((v) => v.name).sort()).toEqual(['A', 'C'])
    })

    it('returns empty array when ID not found', () => {
      const txs = [{ id: '1', name: 'A' }]
      expect(getTransactionVersions(txs, '999')).toEqual([])
    })

    it('returns empty array when no ID provided', () => {
      const txs = [{ id: '1', name: 'A' }]
      expect(getTransactionVersions(txs, null)).toEqual([])
      expect(getTransactionVersions(txs, undefined)).toEqual([])
    })

    it('handles empty array', () => {
      expect(getTransactionVersions([], '1')).toEqual([])
    })
  })
})

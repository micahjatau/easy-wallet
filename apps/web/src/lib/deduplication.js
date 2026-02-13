/**
 * Deduplicate transactions by ID, keeping newest by updatedAt
 * Industry standard: content-addressable with last-write-wins
 */

/**
 * Get timestamp from transaction for comparison
 * Falls back to createdAt if updatedAt not present
 */
const getTransactionTimestamp = (tx) => {
  if (!tx) return 0
  const updatedAt = Number(tx.updatedAt)
  if (Number.isFinite(updatedAt) && updatedAt > 0) return updatedAt
  const createdAt = Number(tx.createdAt)
  if (Number.isFinite(createdAt) && createdAt > 0) return createdAt
  return 0
}

/**
 * Check if transaction A is newer than transaction B
 */
const isNewer = (txA, txB) => {
  return getTransactionTimestamp(txA) > getTransactionTimestamp(txB)
}

/**
 * Deduplicate transactions by ID, keeping newest by updatedAt
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Deduplicated array
 */
export const dedupeTransactions = (transactions) => {
  if (!Array.isArray(transactions)) return []

  const seen = new Map()

  for (const tx of transactions) {
    if (!tx?.id) continue

    const existing = seen.get(tx.id)

    if (!existing) {
      seen.set(tx.id, tx)
      continue
    }

    // Keep newer transaction by updatedAt
    if (isNewer(tx, existing)) {
      seen.set(tx.id, tx)
    }
  }

  return Array.from(seen.values())
}

/**
 * Deduplicate and merge transactions with custom merge strategy
 * @param {Array} transactions - Array of transaction objects
 * @param {Function} mergeStrategy - (existing, incoming) => merged
 * @returns {Array} - Deduplicated and merged array
 */
export const dedupeAndMergeTransactions = (transactions, mergeStrategy) => {
  if (!Array.isArray(transactions)) return []
  if (typeof mergeStrategy !== 'function') {
    return dedupeTransactions(transactions)
  }

  const seen = new Map()

  for (const tx of transactions) {
    if (!tx?.id) continue

    const existing = seen.get(tx.id)

    if (!existing) {
      seen.set(tx.id, tx)
      continue
    }

    // Apply custom merge strategy
    const merged = isNewer(tx, existing)
      ? mergeStrategy(existing, tx)
      : existing

    seen.set(tx.id, merged)
  }

  return Array.from(seen.values())
}

/**
 * Find duplicate transactions by ID
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Array of duplicate IDs
 */
export const findDuplicateIds = (transactions) => {
  if (!Array.isArray(transactions)) return []

  const seen = new Set()
  const duplicates = new Set()

  for (const tx of transactions) {
    if (!tx?.id) continue
    if (seen.has(tx.id)) {
      duplicates.add(tx.id)
    } else {
      seen.add(tx.id)
    }
  }

  return Array.from(duplicates)
}

/**
 * Get all versions of a transaction by ID
 * @param {Array} transactions - Array of transaction objects
 * @param {string} id - Transaction ID
 * @returns {Array} - All versions found
 */
export const getTransactionVersions = (transactions, id) => {
  if (!Array.isArray(transactions) || !id) return []
  return transactions.filter((tx) => tx?.id === id)
}

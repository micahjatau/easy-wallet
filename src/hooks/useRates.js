import { useCallback, useEffect, useRef, useState } from 'react'
import {
  EXCHANGE_API_FALLBACK,
  EXCHANGE_API_PRIMARY,
} from '../lib/ledgerConfig.js'
import { isValidCurrency, normalizeCurrency } from '../lib/currency.js'

// Exponential backoff configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
}

const calculateBackoff = (attempt) => {
  const delay = Math.min(
    RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
    RETRY_CONFIG.maxDelay
  )
  return delay
}

export const useRates = ({ settings, setSettings, activeTransactions }) => {
  const [rateStatus, setRateStatus] = useState({
    loading: false,
    error: '',
  })
  const [retryCount, setRetryCount] = useState(0)
  const [lastAttemptTime, setLastAttemptTime] = useState(null)
  const rateRequestRef = useRef(0)
  const retryTimerRef = useRef(null)
  const retryCountRef = useRef(0) // Use ref to avoid stale closure

  // Keep ref in sync with state
  retryCountRef.current = retryCount

  // Clear retry timer on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
    }
  }, [])

  const refreshRates = useCallback(
    async (baseOverride, isRetry = false) => {
      const baseCurrency = normalizeCurrency(
        typeof baseOverride === 'string' ? baseOverride : settings.baseCurrency,
      )
      if (!isValidCurrency(baseCurrency)) {
        setRateStatus({ loading: false, error: 'Invalid base currency.' })
        setRetryCount(0)
        retryCountRef.current = 0
        return
      }
      
      const transactionCurrencies = Array.from(
        new Set(
          activeTransactions
            .map((transaction) => normalizeCurrency(transaction.currency))
            .filter((currency) => isValidCurrency(currency)),
        ),
      )
      const currenciesToUpdate = Array.from(
        new Set([...settings.currencies, ...transactionCurrencies, baseCurrency]),
      )
      
      const requestId = rateRequestRef.current + 1
      rateRequestRef.current = requestId
      
      if (!isRetry) {
        setRetryCount(0)
        retryCountRef.current = 0
      }
      
      setRateStatus({ loading: true, error: '' })
      setLastAttemptTime(Date.now())
      
      try {
        const base = baseCurrency.toLowerCase()
        const endpoints = [
          `${EXCHANGE_API_PRIMARY}/${base}.json`,
          `${EXCHANGE_API_FALLBACK}/${base}.json`,
        ]
        let data = null
        let lastError = null

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint)
            if (!response.ok) {
              lastError = new Error(`HTTP ${response.status}`)
              continue
            }
            data = await response.json()
            break
          } catch (err) {
            lastError = err
            // Try the fallback endpoint.
          }
        }

        if (!data) {
          throw lastError || new Error('Unable to fetch rates right now.')
        }
        
        const baseRates = data?.[base]
        if (!baseRates) {
          throw new Error(`No rates found for ${baseCurrency}.`)
        }
        
        // Check if this is still the latest request before updating state
        if (rateRequestRef.current !== requestId) {
          return
        }
        
        setSettings((prev) => {
          if (prev.baseCurrency.toLowerCase() !== base) {
            return prev
          }
          const nextRates = { ...prev.rates, [prev.baseCurrency]: 1 }
          currenciesToUpdate.forEach((code) => {
            if (code === prev.baseCurrency) return
            const apiRate = baseRates?.[code.toLowerCase()]
            if (typeof apiRate === 'number' && apiRate > 0) {
              nextRates[code] = apiRate
            }
          })
          return {
            ...prev,
            rates: nextRates,
            ratesAsOf:
              typeof data?.date === 'string' || typeof data?.date === 'number'
                ? data.date
                : prev.ratesAsOf,
            syncedAt: new Date().toISOString(),
            ratesStale: false,
          }
        })
        
        setRateStatus({ loading: false, error: '' })
        setRetryCount(0) // Reset retry count on success
        retryCountRef.current = 0
        
      } catch (error) {
        // Check if this is still the latest request
        if (rateRequestRef.current !== requestId) {
          return
        }
        
        // Use ref to get current retry count to avoid stale closure
        const currentRetry = isRetry ? retryCountRef.current : 0
        
        if (currentRetry < RETRY_CONFIG.maxRetries) {
          const nextRetry = currentRetry + 1
          const delay = calculateBackoff(currentRetry)
          
          setRetryCount(nextRetry)
          retryCountRef.current = nextRetry
          setRateStatus({
            loading: true,
            error: `Failed to fetch rates. Retrying in ${Math.round(delay / 1000)}s... (Attempt ${nextRetry}/${RETRY_CONFIG.maxRetries})`,
          })
          
          // Schedule retry
          retryTimerRef.current = setTimeout(() => {
            refreshRates(baseOverride, true)
          }, delay)
          
        } else {
          // Max retries reached
          setRateStatus({
            loading: false,
            error: error?.message || `Unable to refresh rates after ${RETRY_CONFIG.maxRetries} attempts.`,
          })
          setRetryCount(0)
          retryCountRef.current = 0
        }
      }
    },
    [activeTransactions, settings.baseCurrency, settings.currencies, setSettings],
  )

  // Cancel retry if currency settings change
  useEffect(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
      setRetryCount(0)
      retryCountRef.current = 0
      setRateStatus({ loading: false, error: '' })
    }
  }, [settings.baseCurrency, settings.currencies])

  return { rateStatus, refreshRates, retryCount, lastAttemptTime }
}

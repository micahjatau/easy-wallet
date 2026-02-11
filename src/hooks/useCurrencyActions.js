import { useCallback } from 'react'
import {
  isValidCurrency,
  normalizeCurrency,
} from '../lib/currency.js'

export const useCurrencyActions = ({
  currencyInput,
  settings,
  activeTransactions,
  pendingBaseCurrency,
  setCurrencyError,
  setSettings,
  setCurrencyInput,
  setPendingBaseCurrency,
  setShowBaseCurrencyDialog,
  refreshRates,
  success,
}) => {
  const handleAddCurrency = useCallback(() => {
    const normalized = normalizeCurrency(currencyInput)
    if (!isValidCurrency(normalized)) {
      setCurrencyError('Use a 3-5 letter code (e.g. USD).')
      return
    }
    if (settings.currencies.includes(normalized)) {
      setCurrencyError('That currency already exists.')
      return
    }
    setSettings((prev) => ({
      ...prev,
      currencies: [...prev.currencies, normalized],
      rates: {
        ...prev.rates,
        [normalized]: normalized === prev.baseCurrency ? 1 : null,
      },
    }))
    setCurrencyInput('')
    setCurrencyError('')
    success(`Currency "${normalized}" added`)
  }, [
    currencyInput,
    settings.currencies,
    setCurrencyError,
    setSettings,
    setCurrencyInput,
    success,
  ])

  const handleRemoveCurrency = useCallback(
    (code) => {
      if (code === settings.baseCurrency) return
      const usedInTransactions = activeTransactions.some(
        (transaction) => transaction.currency === code,
      )
      setSettings((prev) => {
        const nextCurrencies = prev.currencies.filter((currency) => currency !== code)
        const nextRates = { ...prev.rates }
        if (!usedInTransactions) {
          delete nextRates[code]
        } else if (nextRates[code] === undefined) {
          nextRates[code] = null
        }
        return { ...prev, currencies: nextCurrencies, rates: nextRates }
      })
    },
    [settings.baseCurrency, activeTransactions, setSettings],
  )

  const handleBaseChange = useCallback(
    (event) => {
      const nextBase = event.target.value
      if (nextBase === settings.baseCurrency) return
      setPendingBaseCurrency(nextBase)
      setShowBaseCurrencyDialog(true)
    },
    [settings.baseCurrency, setPendingBaseCurrency, setShowBaseCurrencyDialog],
  )

  const confirmBaseCurrencyChange = useCallback(
    (keepHistorical) => {
      if (!pendingBaseCurrency) return

      const nextBase = pendingBaseCurrency
      setSettings((prev) => {
        if (prev.baseCurrency === nextBase) return prev
        const nextCurrencies = prev.currencies.includes(nextBase)
          ? prev.currencies
          : [nextBase, ...prev.currencies]
        const prevRates = prev.rates || {}
        const nextBaseRate = Number(prevRates?.[nextBase])
        const canCrossConvert = Number.isFinite(nextBaseRate) && nextBaseRate > 0
        const nextRates = {}
        nextCurrencies.forEach((code) => {
          if (code === nextBase) {
            nextRates[code] = 1
            return
          }
          const prevRate = Number(prevRates?.[code])
          if (canCrossConvert && Number.isFinite(prevRate) && prevRate > 0) {
            nextRates[code] = prevRate / nextBaseRate
          } else {
            nextRates[code] = Number.isFinite(prevRate) && prevRate > 0 ? prevRate : null
          }
        })
        return {
          ...prev,
          baseCurrency: nextBase,
          currencies: nextCurrencies,
          rates: nextRates,
          ratesAsOf: keepHistorical ? prev.ratesAsOf : null,
          syncedAt: prev.syncedAt,
          ratesStale: true,
        }
      })
      refreshRates(nextBase)
      setShowBaseCurrencyDialog(false)
      setPendingBaseCurrency(null)
      success(`Base currency changed to ${nextBase}. Fetching new rates...`)
    },
    [
      pendingBaseCurrency,
      setSettings,
      refreshRates,
      setShowBaseCurrencyDialog,
      setPendingBaseCurrency,
      success,
    ],
  )

  const handleRateChange = useCallback(
    (code, event) => {
      const rawValue = event.target.value
      if (rawValue === '') {
        setSettings((prev) => ({
          ...prev,
          rates: { ...prev.rates, [code]: null },
        }))
        return
      }
      const nextValue = event.target.valueAsNumber
      if (!Number.isFinite(nextValue) || nextValue <= 0) return
      setSettings((prev) => ({
        ...prev,
        rates: { ...prev.rates, [code]: nextValue },
      }))
    },
    [setSettings],
  )

  return {
    handleAddCurrency,
    handleRemoveCurrency,
    handleBaseChange,
    confirmBaseCurrencyChange,
    handleRateChange,
  }
}

export default useCurrencyActions

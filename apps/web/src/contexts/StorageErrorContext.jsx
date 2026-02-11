import { createContext, useContext, useState, useCallback } from 'react'

const StorageErrorContext = createContext(null)

// Check if localStorage is available and working
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

// Detect private browsing mode
const isPrivateBrowsing = () => {
  try {
    localStorage.setItem('__private_test__', '1')
    localStorage.removeItem('__private_test__')
    return false
  } catch {
    return true
  }
}

export const StorageErrorProvider = ({ children }) => {
  const [storageError, setStorageError] = useState(null)
  const [storageAvailable] = useState(() => isLocalStorageAvailable())
  const [isPrivate] = useState(() => isPrivateBrowsing())

  const reportStorageError = useCallback((error) => {
    // Check for private browsing mode (storage disabled)
    if (!storageAvailable || isPrivate) {
      setStorageError({
        type: 'storage_disabled',
        message: 'Data cannot be saved in private browsing mode. Your changes will be lost when you close this window.',
        action: 'disable_private_mode',
        isPrivateBrowsing: true,
      })
      return
    }

    if (error.name === 'QuotaExceededError' || error.code === 22 || error.code === 1014) {
      setStorageError({
        type: 'quota_exceeded',
        message: 'Storage quota exceeded. Please export and clear old data.',
        action: 'export_and_clear',
      })
    } else {
      setStorageError({
        type: 'unknown',
        message: 'Failed to save data. Please try again.',
        action: 'retry',
      })
    }
  }, [storageAvailable, isPrivate])

  const clearStorageError = useCallback(() => {
    setStorageError(null)
  }, [])

  return (
    <StorageErrorContext.Provider
      value={{ 
        storageError, 
        reportStorageError, 
        clearStorageError,
        storageAvailable,
        isPrivateBrowsing: isPrivate,
      }}
    >
      {children}
    </StorageErrorContext.Provider>
  )
}

export const useStorageError = () => {
  const context = useContext(StorageErrorContext)
  if (!context) {
    throw new Error('useStorageError must be used within StorageErrorProvider')
  }
  return context
}

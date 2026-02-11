import { createContext, useCallback, useEffect, useRef, useState } from 'react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const timeoutsRef = useRef(new Map())

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId)
      })
      timeoutsRef.current.clear()
    }
  }, [])

  const removeToast = useCallback((id) => {
    // Clear the timeout if it exists
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id))
      timeoutsRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random() // Add randomness to prevent duplicate IDs
    const toast = { id, message, type, duration }
    setToasts((prev) => [...prev, toast])

    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        // Use functional update to access current state
        setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id))
        // Clean up the timeout ref
        timeoutsRef.current.delete(id)
      }, duration)
      
      // Store timeout reference for cleanup
      timeoutsRef.current.set(id, timeoutId)
    }

    return id
  }, [])

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast])
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast])
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast])
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg max-w-sm animate-fade-in ${
              toast.type === 'success'
                ? 'bg-forest text-white'
                : toast.type === 'error'
                ? 'bg-rose text-white'
                : toast.type === 'warning'
                ? 'bg-amber text-charcoal'
                : 'bg-charcoal text-white'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/80 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastContext

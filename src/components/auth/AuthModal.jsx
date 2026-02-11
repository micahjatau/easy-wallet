import { useCallback, useMemo, useRef, useState } from 'react'
import { useAuthContext } from '../../contexts/useAuthContext.js'
import { useDialogA11y } from '../../hooks/useDialogA11y.js'
import PasswordInput from './PasswordInput.jsx'

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailInputRef = useRef(null)

  const { login, signup, isAnonymous, error: authError, clearError } = useAuthContext()

  const isUpgradeMode = useMemo(() => isAnonymous && mode === 'signup', [isAnonymous, mode])

  const resetForm = useCallback(() => {
    setEmail('')
    setPassword('')
    setLocalError('')
    setMode('login')
    clearError()
  }, [clearError])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [resetForm, onClose])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      
      // Prevent double submission
      if (isSubmitting) return
      
      setLocalError('')
      clearError()
      setIsSubmitting(true)

      try {
        let result
        if (mode === 'login') {
          result = await login(email, password)
        } else {
          result = await signup(email, password)
        }

        if (result.error) {
          setLocalError(result.error)
        } else if (result.cancelled) {
          // Operation was cancelled (race condition), ignore
          console.log('Auth operation was cancelled')
        } else {
          resetForm()
          onSuccess?.()
          onClose()
        }
      } catch (err) {
        setLocalError('An unexpected error occurred')
        console.error('Auth submission error:', err)
      } finally {
        setIsSubmitting(false)
      }
    },
    [mode, email, password, login, signup, isSubmitting, resetForm, onSuccess, onClose, clearError]
  )

  const handleContinueAsGuest = useCallback(() => {
    resetForm()
    onClose()
  }, [resetForm, onClose])

  const displayError = localError || authError

  useDialogA11y({
    isOpen,
    onEscape: () => {
      if (!isSubmitting) {
        handleClose()
      }
    },
    initialFocusRef: emailInputRef,
  })

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="auth-modal-title" className="text-xl font-semibold text-foreground">
            {mode === 'login' ? 'Sign In' : isUpgradeMode ? 'Create Account' : 'Sign Up'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-foreground-muted hover:text-foreground transition-colors"
            disabled={isSubmitting}
            aria-label="Close authentication modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isUpgradeMode && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg text-sm text-primary">
            Upgrade from anonymous to keep your data synced across devices.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              id="email"
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              showStrength={mode === 'signup'}
              disabled={isSubmitting}
            />
          </div>

          {displayError && (
            <div className="p-3 bg-error-background border border-error/20 rounded-lg text-sm text-error">
              {displayError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In'
              : isUpgradeMode
              ? 'Create Account'
              : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <p className="text-sm text-foreground-muted">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-primary hover:underline font-medium"
                disabled={isSubmitting}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-sm text-foreground-muted">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary hover:underline font-medium"
                disabled={isSubmitting}
              >
                Sign in
              </button>
            </p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleContinueAsGuest}
            disabled={isSubmitting}
            className="w-full py-2 text-sm text-foreground-muted hover:text-foreground transition-colors disabled:opacity-50"
          >
            {mode === 'login' ? 'Continue as Guest (Anonymous)' : 'Maybe Later - Continue as Guest'}
          </button>
        </div>
      </div>
    </div>
  )
}

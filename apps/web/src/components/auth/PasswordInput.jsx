import { useCallback, useMemo, useState } from 'react'

const MIN_PASSWORD_LENGTH = 8

const calculatePasswordStrength = (password) => {
  let score = 0
  if (password.length >= MIN_PASSWORD_LENGTH) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}

const getStrengthLabel = (score) => {
  if (score === 0) return { label: 'Too short', color: 'bg-error' }
  if (score <= 2) return { label: 'Weak', color: 'bg-error' }
  if (score <= 3) return { label: 'Fair', color: 'bg-warning' }
  if (score <= 4) return { label: 'Good', color: 'bg-primary' }
  return { label: 'Strong', color: 'bg-success' }
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Enter password',
  showStrength = true,
  id = 'password',
}) {
  const [isVisible, setIsVisible] = useState(false)

  const strength = useMemo(() => calculatePasswordStrength(value), [value])
  const strengthInfo = useMemo(() => getStrengthLabel(strength), [strength])
  const strengthWidth = useMemo(() => `${(strength / 5) * 100}%`, [strength])

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev)
  }, [])

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
          tabIndex={-1}
        >
          {isVisible ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      
      {showStrength && value && (
        <div className="space-y-1">
          <div className="h-1 w-full bg-background-muted/40 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strengthInfo.color}`}
              style={{ width: strengthWidth }}
            />
          </div>
          <p className={`text-xs ${strength <= 2 ? 'text-error' : strength <= 3 ? 'text-warning' : strength <= 4 ? 'text-primary' : 'text-success'}`}>
            {strengthInfo.label}
          </p>
        </div>
      )}
    </div>
  )
}

import { useCallback, useMemo, useState } from 'react'
import { useAuthContext } from '../../contexts/useAuthContext.js'
import AuthModal from './AuthModal.jsx'

export default function ProfileSwitcher({ compact = false, fullWidth = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const {
    user,
    isAnonymous,
    isLoading,
    logout,
  } = useAuthContext()

  const displayEmail = useMemo(() => {
    if (isAnonymous) return 'Guest'
    return user?.email || 'User'
  }, [isAnonymous, user])

  const avatarInitial = useMemo(() => {
    if (isAnonymous) return '?'
    return user?.email?.charAt(0).toUpperCase() || 'U'
  }, [isAnonymous, user])

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const handleOpenAuth = useCallback(() => {
    setIsMenuOpen(false)
    setShowAuthModal(true)
  }, [])

  const handleCloseAuth = useCallback(() => {
    setShowAuthModal(false)
  }, [])

  const handleLogout = useCallback(async () => {
    handleCloseMenu()
    const result = await logout()
    if (result.error) {
      alert(`Logout failed: ${result.error}`)
    }
  }, [logout, handleCloseMenu])

  const handleSuccess = useCallback(() => {
    // Auth success - modal closes automatically
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-muted/50">
        <div className="w-7 h-7 rounded-full bg-background-muted animate-pulse" />
        <span className="text-sm text-foreground-muted">Loading...</span>
      </div>
    )
  }

  if (isAnonymous) {
    return (
      <>
        <button
          type="button"
          onClick={handleOpenAuth}
          className={`border border-border bg-background-elevated text-foreground hover:bg-background-muted transition-colors ${
            compact
              ? 'w-10 h-10 rounded-lg flex items-center justify-center'
              : `px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''}`
          }`}
          title="Sign In"
          aria-label="Sign In"
        >
          <span className="material-symbols-outlined text-lg">login</span>
          {!compact && <span className="text-sm font-medium">Sign In</span>}
        </button>

        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseAuth}
          onSuccess={handleSuccess}
        />
      </>
    )
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={handleToggleMenu}
          className={`bg-background-muted/50 hover:bg-background-muted transition-colors ${
            compact
              ? 'w-10 h-10 rounded-lg flex items-center justify-center'
              : `flex items-center gap-2 px-3 py-1.5 rounded-full ${fullWidth ? 'w-full justify-between rounded-lg py-2' : ''}`
          }`}
          title={compact ? 'Account' : undefined}
          aria-label="Account menu"
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
              isAnonymous ? 'bg-warning text-primary-foreground' : 'bg-primary text-primary-foreground'
            }`}
          >
            {avatarInitial}
          </div>

          {!compact && (
            <span className="text-sm text-foreground max-w-[140px] truncate">
              {displayEmail}
            </span>
          )}

          {!compact && (
            <svg
              className={`w-4 h-4 text-foreground-muted transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={handleCloseMenu} />
            <div
              className={`w-56 rounded-xl bg-background-elevated shadow-lg border border-border z-50 py-1 ${
                compact
                  ? 'absolute left-0 bottom-full mb-2'
                  : fullWidth
                    ? 'absolute left-0 bottom-full mb-2 w-full min-w-56'
                    : 'absolute right-0 mt-2'
              }`}
            >
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">{displayEmail}</p>
                <p className="text-xs text-foreground-subtle">
                  {isAnonymous ? 'Anonymous User' : 'Authenticated'}
                </p>
              </div>

              <div className="py-1">
                {isAnonymous ? (
                  <button
                    onClick={handleOpenAuth}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-background-muted/40 transition-colors"
                  >
                    Sign In / Create Account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-background-muted/40 transition-colors"
                  >
                    Sign Out
                  </button>
                )}
              </div>

              <div className="border-t border-border py-1">
                <button
                  onClick={handleCloseMenu}
                  className="w-full px-4 py-2 text-left text-sm text-foreground-muted hover:bg-background-muted/40 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseAuth}
        onSuccess={handleSuccess}
      />
    </>
  )
}

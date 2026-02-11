import { useCallback, useMemo, useState } from 'react'
import { useAuthContext } from '../../contexts/useAuthContext.js'
import AuthModal from './AuthModal.jsx'

export default function ProfileSwitcher() {
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

  return (
    <>
      <div className="relative">
        <button
          onClick={handleToggleMenu}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-muted/50 hover:bg-background-muted transition-colors"
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
              isAnonymous ? 'bg-warning text-primary-foreground' : 'bg-primary text-primary-foreground'
            }`}
          >
            {avatarInitial}
          </div>
          <span className="text-sm text-foreground hidden sm:inline max-w-[120px] truncate">
            {displayEmail}
          </span>
          <svg
            className={`w-4 h-4 text-foreground-muted transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={handleCloseMenu} />
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-background-elevated shadow-lg border border-border z-50 py-1">
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

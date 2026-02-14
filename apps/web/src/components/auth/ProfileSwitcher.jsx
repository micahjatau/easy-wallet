import { useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuthContext } from '../../contexts/useAuthContext.js'
import AuthModal from './AuthModal.jsx'

export default function ProfileSwitcher({ compact = false, fullWidth = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [menuPosition, setMenuPosition] = useState(null)

  const {
    user,
    isAnonymous,
    isLoading,
    logout,
  } = useAuthContext()

  const buttonRef = useRef(null)
  const authButtonRef = useRef(null)

  const displayEmail = useMemo(() => {
    if (isAnonymous) return 'Guest'
    return user?.email || 'User'
  }, [isAnonymous, user])

  const avatarInitial = useMemo(() => {
    if (isAnonymous) return '?'
    return user?.email?.charAt(0).toUpperCase() || 'U'
  }, [isAnonymous, user])

  const handleToggleMenu = useCallback(() => {
    if (!isMenuOpen && authButtonRef.current) {
      const rect = authButtonRef.current.getBoundingClientRect()
      const menuWidth = 224 // w-56 = 14rem = 224px
      
      // Position under the button, aligned to left edge
      let left = rect.left
      
      // If it would go off the right edge, align to right instead
      if (left + menuWidth > window.innerWidth - 16) {
        left = rect.right - menuWidth
      }
      
      // Ensure it doesn't go off the left edge
      left = Math.max(16, left)
      
      setMenuPosition({
        top: rect.bottom + 8,
        left: left,
      })
    }
    setIsMenuOpen((prev) => !prev)
  }, [isMenuOpen])

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
          ref={buttonRef}
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
          anchorRef={buttonRef}
        />
      </>
    )
  }

  return (
    <>
      <div className="relative">
        <button
          ref={authButtonRef}
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

        {isMenuOpen && menuPosition && createPortal(
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={handleCloseMenu}
            />
            <div
              className="fixed z-50 w-56 rounded-xl bg-background-elevated shadow-lg border border-border py-1"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
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
          </>,
          document.body
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseAuth}
        onSuccess={handleSuccess}
        anchorRef={buttonRef}
      />
    </>
  )
}

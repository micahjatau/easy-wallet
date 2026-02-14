import { useCallback, useEffect, useState } from 'react'
import Sidebar from './navigation/Sidebar.jsx'
import QuickAddButton from './QuickAddButton.jsx'

const Layout = ({
  children,
  sidebarProps,
  showQuickAdd,
  onQuickAdd,
  isDarkMode,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!sidebarProps || isSidebarCollapsed || window.innerWidth < 1024) {
        return
      }

      const sidebarElement = event.target.closest('[data-sidebar="app"]')
      if (!sidebarElement) {
        setIsSidebarCollapsed(true)
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [sidebarProps, isSidebarCollapsed])

  return (
    <div
      className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-background text-foreground`}
    >
      {/* Sidebar - Hidden on mobile */}
      {sidebarProps && (
        <div className="hidden lg:block">
          <Sidebar
            {...sidebarProps}
            isCollapsed={isSidebarCollapsed}
            onToggle={handleToggleSidebar}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`relative overflow-hidden min-h-screen transition-all duration-300 ${
          sidebarProps ? (isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64') : ''
        }`}
      >
        {/* Background decorations */}
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-border/25 blur-3xl animate-float-slow dark:bg-white/5" />
        <div className="pointer-events-none absolute left-10 top-1/3 h-40 w-40 rounded-full bg-primary/20 blur-3xl animate-float-slow dark:bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-56 w-56 rounded-full bg-warning/20 blur-3xl animate-float-slow dark:bg-white/5" />

        {/* Content */}
        <main className="relative z-10 min-h-screen p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {showQuickAdd && (
        <QuickAddButton onClick={onQuickAdd} isDarkMode={isDarkMode} />
      )}
    </div>
  )
}

export default Layout

const Layout = ({ children, bottomNav, isDarkMode }) => {
  return (
    <div
      className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-background text-foreground`}
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-border/25 blur-3xl animate-float-slow dark:bg-white/5" />
        <div className="pointer-events-none absolute left-10 top-1/3 h-40 w-40 rounded-full bg-primary/20 blur-3xl animate-float-slow dark:bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-56 w-56 rounded-full bg-warning/20 blur-3xl animate-float-slow dark:bg-white/5" />

        <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 pb-28 pt-8 md:gap-8 md:pb-20 md:pt-12 lg:px-10">
          {children}
        </main>

        {bottomNav}
      </div>
    </div>
  )
}

export default Layout

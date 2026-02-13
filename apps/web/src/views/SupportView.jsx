import { memo } from 'react'

const GITHUB_ISSUES_URL = 'https://github.com/micahjatau/easy-wallet/issues/new/choose'

const SupportView = memo(function SupportView() {
  return (
    <div className="h-full space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Support</h1>
        <p className="mt-1 text-foreground-muted">
          Need help or want to report a complaint? Use GitHub Issues.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-background-elevated p-6">
        <h2 className="mb-2 font-semibold text-foreground">Report a Complaint</h2>
        <p className="mb-4 text-sm text-foreground-muted">
          Submit bugs, complaints, and feature requests directly to the project issue tracker.
        </p>
        <a
          href={GITHUB_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <span className="material-symbols-outlined text-base">open_in_new</span>
          Open GitHub Issues
        </a>
      </section>

      <section className="rounded-2xl border border-border bg-background-elevated p-6">
        <h2 className="mb-3 font-semibold text-foreground">What to Include</h2>
        <ul className="space-y-2 text-sm text-foreground-muted">
          <li>- Steps to reproduce the issue</li>
          <li>- Expected behavior vs actual behavior</li>
          <li>- Screenshots or screen recordings</li>
          <li>- Browser, OS, and device details</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-background-elevated p-6">
        <h2 className="mb-3 font-semibold text-foreground">Quick Checks Before Reporting</h2>
        <ul className="space-y-2 text-sm text-foreground-muted">
          <li>- Refresh the page and retry the flow</li>
          <li>- Confirm your internet connection is stable</li>
          <li>- Check whether the issue happens on another browser</li>
          <li>- Include any error message text exactly as shown</li>
        </ul>
      </section>
    </div>
  )
})

export default SupportView

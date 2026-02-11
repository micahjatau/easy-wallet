import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Error logged for debugging
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-error/30 p-6 bg-error-background text-center">
          <h3 className="text-lg font-medium text-error mb-2">Something went wrong</h3>
          <p className="text-sm text-foreground-muted mb-4">
            We encountered an unexpected error. You can try again or refresh the page.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-background-elevated border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
            >
              Refresh Page
            </button>
          </div>
          {import.meta.env.DEV && (
            <pre className="mt-4 text-xs text-left bg-background-elevated p-2 rounded overflow-x-auto text-foreground">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

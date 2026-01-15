'use client'

import Link from 'next/link'
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    // Consider logging to an external error monitoring service e.g. Sentry, LogRocket, etc.
  }

  public render() {
    if (this.state.hasError) {
      // Enhanced fallback UI
      return (
        <div>
          <h1>Oops! Something went wrong.</h1>
          <p>Sorry for the inconvenience.</p>
          <p>
            You might want to <Link href="/">return to the homepage</Link> or
            refresh the page.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

// Named export
export { ErrorBoundary }

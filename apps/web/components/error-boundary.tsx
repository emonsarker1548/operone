"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { InternalServerErrorCard } from "./error-cards"

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void
  }
}

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
    
    // You could also log to an error reporting service here
    if (typeof window !== 'undefined' && 'gtag' in window && typeof window.gtag === 'function') {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      })
    }
  }

  private handleRefresh = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = "/"
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <InternalServerErrorCard
            errorCode="500"
            timestamp={new Date().toISOString()}
            action={{
              label: "Try Again",
              onClick: this.handleRefresh,
            }}
            secondaryAction={{
              label: "Go Home",
              onClick: this.handleGoHome,
            }}
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

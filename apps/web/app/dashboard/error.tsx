"use client"

import { InternalServerErrorCard } from "@/components/error-cards"

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const handleRefresh = () => {
    reset()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <InternalServerErrorCard
        errorCode="500"
        timestamp={new Date().toISOString()}
        action={{
          label: "Try Again",
          onClick: handleRefresh,
        }}
        secondaryAction={{
          label: "Go Home",
          onClick: handleGoHome,
        }}
      />
    </div>
  )
}

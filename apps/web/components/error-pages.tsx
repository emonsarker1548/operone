"use client"

import { useRouter } from "next/navigation"
import { InternalServerErrorCard, NotFoundErrorCard } from "./error-cards"

export function InternalServerErrorPage() {
  const router = useRouter()

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    router.push("/")
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

export function NotFoundPage() {
  const router = useRouter()

  const handleSearch = () => {
    router.push("/search")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <NotFoundErrorCard
        resourceType="Page"
        action={{
          label: "Search",
          onClick: handleSearch,
        }}
        secondaryAction={{
          label: "Go Home",
          onClick: handleGoHome,
        }}
      />
    </div>
  )
}

export function SearchNotFoundPage({ searchQuery }: { searchQuery: string }) {
  const router = useRouter()

  const handleAdvancedSearch = () => {
    router.push("/search?advanced=true")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <NotFoundErrorCard
        resourceType="Results"
        searchQuery={searchQuery}
        action={{
          label: "Advanced Search",
          onClick: handleAdvancedSearch,
        }}
        secondaryAction={{
          label: "Go Home",
          onClick: handleGoHome,
        }}
      />
    </div>
  )
}

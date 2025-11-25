"use client"

import { NotFoundErrorCard } from "@/components/error-cards"
import { useRouter } from "next/navigation"

export default function DashboardNotFound() {
  const router = useRouter()

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <NotFoundErrorCard
        resourceType="Dashboard Page"
        action={{
          label: "Dashboard",
          onClick: handleGoToDashboard,
        }}
        secondaryAction={{
          label: "Go Home",
          onClick: handleGoHome,
        }}
      />
    </div>
  )
}

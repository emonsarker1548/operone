"use client"

import { NotFoundErrorCard } from "@/components/error-cards"
import { useRouter } from "next/navigation"

export default function LoginNotFound() {
  const router = useRouter()

  const handleGoToLogin = () => {
    router.push("/login")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <NotFoundErrorCard
        resourceType="Login Page"
        action={{
          label: "Back to Login",
          onClick: handleGoToLogin,
        }}
        secondaryAction={{
          label: "Go Home",
          onClick: handleGoHome,
        }}
      />
    </div>
  )
}

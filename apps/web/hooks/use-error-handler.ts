"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

interface ApiErrorResponse {
  error: {
    message: string
    code: string
    statusCode: number
    timestamp: string
  }
}

export function useErrorHandler() {
  const [error, setError] = useState<ApiErrorResponse | null>(null)

  const handleError = useCallback((error: unknown) => {
    console.error("Error occurred:", error)

    if (error && typeof error === "object" && "error" in error) {
      const apiError = error as ApiErrorResponse
      setError(apiError)
      
      // Show toast notification for user feedback
      toast.error(apiError.error.message, {
        description: `Error Code: ${apiError.error.code}`,
      })
      
      return apiError
    }

    if (error instanceof Error) {
      const fallbackError: ApiErrorResponse = {
        error: {
          message: error.message || "An unexpected error occurred",
          code: "CLIENT_ERROR",
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      }
      setError(fallbackError)
      toast.error(fallbackError.error.message)
      return fallbackError
    }

    const unknownError: ApiErrorResponse = {
      error: {
        message: "An unknown error occurred",
        code: "UNKNOWN_ERROR",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
    }
    setError(unknownError)
    toast.error(unknownError.error.message)
    return unknownError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const isNotFoundError = useCallback((error: ApiErrorResponse) => {
    return error.error.statusCode === 404
  }, [])

  const isServerError = useCallback((error: ApiErrorResponse) => {
    return error.error.statusCode >= 500
  }, [])

  const isClientError = useCallback((error: ApiErrorResponse) => {
    return error.error.statusCode >= 400 && error.error.statusCode < 500
  }, [])

  return {
    error,
    handleError,
    clearError,
    isNotFoundError,
    isServerError,
    isClientError,
  }
}

import { NextResponse } from "next/server"

export class ApiError extends Error {
  public statusCode: number
  public code?: string

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
    this.code = code
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found", code?: string) {
    super(message, 404, code)
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = "Validation failed", code?: string) {
    super(message, 400, code)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized access", code?: string) {
    super(message, 401, code)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Access forbidden", code?: string) {
    super(message, 403, code)
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Internal server error", code?: string) {
    super(message, 500, code)
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          timestamp: new Date().toISOString(),
        },
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: "UNKNOWN_ERROR",
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      error: {
        message: "An unexpected error occurred",
        code: "UNEXPECTED_ERROR",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 500 }
  )
}

export function createErrorResponse(message: string, statusCode: number = 500, code?: string) {
  return NextResponse.json(
    {
      error: {
        message,
        code: code || getDefaultErrorCode(statusCode),
        statusCode,
        timestamp: new Date().toISOString(),
      },
    },
    { status: statusCode }
  )
}

function getDefaultErrorCode(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return "BAD_REQUEST"
    case 401:
      return "UNAUTHORIZED"
    case 403:
      return "FORBIDDEN"
    case 404:
      return "NOT_FOUND"
    case 500:
      return "INTERNAL_SERVER_ERROR"
    default:
      return "UNKNOWN_ERROR"
  }
}

"use client"

import { AlertCircle, RefreshCw, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface BaseErrorCardProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  className?: string
}

interface InternalServerErrorCardProps extends Omit<BaseErrorCardProps, 'title' | 'description'> {
  errorCode?: string
  timestamp?: string
}

interface NotFoundErrorCardProps extends Omit<BaseErrorCardProps, 'title' | 'description'> {
  resourceType?: string
  searchQuery?: string
}

export function InternalServerErrorCard({
  errorCode = "500",
  timestamp,
  action,
  secondaryAction,
  className,
}: InternalServerErrorCardProps) {
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-semibold">Internal Server Error</CardTitle>
        <CardDescription>
          Something went wrong on our end. Please try again in a moment.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-2">
        <div className="text-sm text-muted-foreground">
          Error Code: <span className="font-mono font-medium">{errorCode}</span>
        </div>
        {timestamp && (
          <div className="text-xs text-muted-foreground">
            Timestamp: {new Date(timestamp).toLocaleString()}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 justify-center">
        {action && (
          <Button onClick={action.onClick} className="gap-2">
            {action.icon || <RefreshCw className="h-4 w-4" />}
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick} className="gap-2">
            {secondaryAction.icon || <Home className="h-4 w-4" />}
            {secondaryAction.label}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export function NotFoundErrorCard({
  resourceType = "Page",
  searchQuery,
  action,
  secondaryAction,
  className,
}: NotFoundErrorCardProps) {
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-2xl font-semibold">Not Found</CardTitle>
        <CardDescription>
          {searchQuery 
            ? `No results found for "${searchQuery}"`
            : `The ${resourceType.toLowerCase()} you're looking for doesn't exist.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-sm text-muted-foreground">
          Error Code: <span className="font-mono font-medium">404</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-center">
        {action && (
          <Button onClick={action.onClick} className="gap-2">
            {action.icon || <Search className="h-4 w-4" />}
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick} className="gap-2">
            {secondaryAction.icon || <Home className="h-4 w-4" />}
            {secondaryAction.label}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export function GenericErrorCard({
  title,
  description,
  action,
  secondaryAction,
  className,
}: BaseErrorCardProps) {
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        {title && <CardTitle className="text-2xl font-semibold">{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {(action || secondaryAction) && (
        <CardFooter className="flex gap-2 justify-center">
          {action && (
            <Button onClick={action.onClick} className="gap-2">
              {action.icon}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick} className="gap-2">
              {secondaryAction.icon}
              {secondaryAction.label}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

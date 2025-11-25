# Error Handling System

This directory contains a comprehensive error handling system for the Operone web application.

## Components

### Error Cards (`error-cards.tsx`)
- **`InternalServerErrorCard`** - For 500/internal server errors
- **`NotFoundErrorCard`** - For 404/not found errors  
- **`GenericErrorCard`** - Flexible base component for custom errors

### Error Pages (`error-pages.tsx`)
- **`InternalServerErrorPage`** - Full page layout for server errors
- **`NotFoundPage`** - Full page layout for 404 errors
- **`SearchNotFoundPage`** - For search result not found scenarios

### Error Boundary (`error-boundary.tsx`)
React component that catches JavaScript errors in their child component tree, logs those errors, and displays a fallback UI.

## Usage

### Basic Error Card
```tsx
import { InternalServerErrorCard } from '@/components/error-cards'

<InternalServerErrorCard 
  errorCode="500"
  timestamp={new Date().toISOString()}
  action={{
    label: "Try Again",
    onClick: handleRetry,
  }}
  secondaryAction={{
    label: "Go Home",
    onClick: goHome,
  }}
/>
```

### Full Page Error
```tsx
import { InternalServerErrorPage } from '@/components/error-pages'

export default function CustomErrorPage() {
  return <InternalServerErrorPage />
}
```

### Error Boundary
```tsx
import ErrorBoundary from '@/components/error-boundary'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### API Error Handling
```tsx
import { handleApiError, NotFoundError } from '@/lib/api-error-handler'

export async function GET() {
  try {
    // Your API logic
    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Client-Side Error Handling
```tsx
import { useErrorHandler } from '@/hooks/use-error-handler'

function MyComponent() {
  const { handleError, isServerError, isNotFoundError } = useErrorHandler()

  const handleClick = async () => {
    try {
      await someApiCall()
    } catch (error) {
      const errorInfo = handleError(error)
      
      if (isServerError(errorInfo)) {
        // Handle server error
      }
    }
  }
}
```

## Next.js Integration

### Error Files Created
- `app/error.tsx` - Root error boundary
- `app/global-error.tsx` - Global error boundary
- `app/not-found.tsx` - 404 page
- `app/dashboard/error.tsx` - Dashboard error boundary
- `app/dashboard/not-found.tsx` - Dashboard 404 page
- `app/login/error.tsx` - Login error boundary
- `app/login/not-found.tsx` - Login 404 page

### API Error Classes
- `ApiError` - Base error class
- `NotFoundError` - 404 errors
- `ValidationError` - 400 errors
- `UnauthorizedError` - 401 errors
- `ForbiddenError` - 403 errors
- `InternalServerError` - 500 errors

## Features

- **Consistent Design** - All error components follow the same design patterns
- **Responsive Layout** - Works on all screen sizes
- **Accessibility** - Semantic HTML and ARIA roles
- **Customizable Actions** - Primary and secondary action buttons
- **Error Tracking** - Timestamps and error codes for debugging
- **Toast Notifications** - Client-side error feedback
- **TypeScript Support** - Full type safety

## Styling

The error cards use Tailwind CSS classes and integrate with your existing theme system. They automatically adapt to light/dark mode and use your app's color scheme.

## Best Practices

1. **Use specific error types** - Use `NotFoundError`, `ValidationError`, etc. instead of generic `ApiError`
2. **Provide helpful actions** - Always give users a way to recover from errors
3. **Log errors** - All errors are automatically logged to the console
4. **Test error states** - Use the error boundary to catch unexpected errors
5. **Customize messages** - Provide user-friendly error messages

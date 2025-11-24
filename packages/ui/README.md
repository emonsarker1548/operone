# @repo/ui

A shared UI component library built with shadcn/ui components for the Operone monorepo.

## Installation

This package is part of a pnpm workspace and should be installed as a workspace dependency:

```bash
pnpm add @repo/ui
```

## Usage

### Importing Components

```tsx
// Import individual components
import { Button, Card, Input } from '@repo/ui'

// Import all components
import * as UI from '@repo/ui'

// Import utilities
import { cn } from '@repo/ui'
```

### Importing CSS

Make sure to import the global CSS in your application's entry point:

```tsx
import '@repo/ui/globals.css'
```

### Available Components (57 total)

**Form & Input**
- **Button** - Customizable button component with variants
- **Input** - Form input field with various types
- **Input OTP** - One-time password input component
- **Label** - Form label component
- **Textarea** - Multi-line text input
- **Select** - Dropdown select component
- **Checkbox** - Checkbox input component
- **Radio Group** - Radio button group component
- **Switch** - Toggle switch component
- **Slider** - Range slider component
- **Form** - Form validation and field components
- **Field** - Form field wrapper component
- **Input Group** - Input grouping component
- **Item** - List item component

**Layout & Containers**
- **Card** - Container component with header and content
- **Sheet** - Slide-out panel component
- **Sidebar** - Collapsible sidebar component
- **Separator** - Visual separator line
- **Scroll Area** - Custom scrollable area
- **Resizable** - Resizable panel component
- **Aspect Ratio** - Maintain aspect ratio container
- **Skeleton** - Loading skeleton placeholder

**Navigation**
- **Tabs** - Tab navigation component
- **Breadcrumb** - Breadcrumb navigation
- **Pagination** - Pagination controls
- **Navigation Menu** - Navigation menu component
- **Menubar** - Application menubar
- **Command** - Command palette component
- **Command Menu** - Command menu interface

**Feedback & Overlays**
- **Dialog** - Modal dialog component
- **Alert Dialog** - Confirmation dialog
- **Alert** - Notification/alert component
- **Toast** - Toast notifications with useToast hook
- **Toaster** - Toast container component
- **Sonner** - Alternative toast notifications
- **Popover** - Popover overlay component
- **Tooltip** - Tooltip component
- **Hover Card** - Hover-triggered card
- **Progress** - Progress indicator
- **Spinner** - Loading spinner

**Data Display**
- **Table** - Data table component
- **Badge** - Small status indicator
- **Avatar** - User avatar component
- **Carousel** - Image/content carousel
- **Calendar** - Date picker calendar
- **Chart** - Data visualization components
- **Empty** - Empty state component
- **Kbd** - Keyboard key display

**Interactive**
- **Dropdown Menu** - Context menu component
- **Context Menu** - Right-click context menu
- **Drawer** - Slide-out drawer
- **Collapsible** - Collapsible content
- **Accordion** - Collapsible content sections
- **Toggle** - Toggle button component
- **Toggle Group** - Group of toggle buttons
- **Button Group** - Group of buttons

**Utilities**
- **cn()** - Utility function for combining Tailwind CSS classes with clsx and tailwind-merge

### Hooks

#### useToast Hook

```tsx
import { useToast, Toast } from '@repo/ui'

function MyComponent() {
  const { toast } = useToast()

  const showToast = () => {
    toast({
      title: "Success!",
      description: "Your action was completed.",
    })
  }

  return (
    <div>
      <Button onClick={showToast}>Show Toast</Button>
      <Toast />
    </div>
  )
}
```

#### useMobile Hook

```tsx
import { useMobile } from '@repo/ui'

function MyComponent() {
  const isMobile = useMobile()

  return (
    <div>
      {isMobile ? "Mobile view" : "Desktop view"}
    </div>
  )
}
```

### Utility Functions

- **cn()** - Utility function for combining Tailwind CSS classes with clsx and tailwind-merge

## Development

### Adding New Components

To add new shadcn/ui components:

```bash
cd packages/ui
npx shadcn@latest add [component-name]
```

### Building

```bash
pnpm build
```

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm check-types
```

## Configuration

This package uses:
- **Tailwind CSS** for styling
- **shadcn/ui** for component design system
- **Radix UI** for accessible primitives
- **TypeScript** for type safety
- **ESLint** for code quality

The Tailwind configuration is set up with shadcn/ui's CSS variables and design tokens.

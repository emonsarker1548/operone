import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const Header = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"header">
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    className={cn(
      "flex h-16 shrink-0 items-center gap-2 border-b px-4",
      className
    )}
    {...props}
  />
))
Header.displayName = "Header"

const HeaderList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-1.5 text-sm font-medium",
      className
    )}
    {...props}
  />
))
HeaderList.displayName = "HeaderList"

const HeaderItem = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-muted-foreground", className)}
    {...props}
  />
))
HeaderItem.displayName = "HeaderItem"

const HeaderSeparator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("flex items-center text-muted-foreground", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </span>
))
HeaderSeparator.displayName = "HeaderSeparator"

const HeaderTitle = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-foreground font-semibold", className)}
    {...props}
  />
))
HeaderTitle.displayName = "HeaderTitle"

export {
  Header,
  HeaderList,
  HeaderItem,
  HeaderSeparator,
  HeaderTitle,
}

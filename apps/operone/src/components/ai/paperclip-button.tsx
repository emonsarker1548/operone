"use client"

import * as React from "react"
import { AtSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"

interface PaperclipButtonProps extends Omit<ButtonProps, "children" | "size"> {
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  isActive?: boolean;
}

export const PaperclipButton = React.forwardRef<HTMLButtonElement, PaperclipButtonProps>(
  ({ className, size = "sm", isActive = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size={size}
        className={cn(
          "rounded-full hover:bg-accent/50",
          isActive && "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30",
          className
        )}
        {...props}
      >
        <AtSign className={cn("h-4 w-4", isActive && "animate-pulse")} />
      </Button>
    );
  }
);

PaperclipButton.displayName = "PaperclipButton";

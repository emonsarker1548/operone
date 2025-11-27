import * as React from "react"
import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"

interface MicButtonProps extends Omit<ButtonProps, "children" | "size"> {
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  isListening?: boolean;
}

export const MicButton = React.forwardRef<HTMLButtonElement, MicButtonProps>(
  ({ className, size = "sm", isListening = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size={size}
        className={cn(
          "rounded-full hover:bg-accent/50",
          isListening && "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30",
          className
        )}
        {...props}
      >
        <Mic className={cn("h-4 w-4", isListening && "animate-pulse")} />
      </Button>
    );
  }
);

MicButton.displayName = "MicButton";

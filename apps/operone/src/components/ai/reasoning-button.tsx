import * as React from "react"
import { Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

interface ReasoningButtonProps extends Omit<ButtonProps, "children" | "size"> {
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  reasoningMode?: 'think' | 'act' | 'observe' | 'off';
  onReasoningModeChange?: (mode: 'think' | 'act' | 'observe' | 'off') => void;
}

const reasoningModes = [
  { id: 'off' as const, label: 'Off', color: 'text-gray-500' },
  { id: 'think' as const, label: 'Think', color: 'text-blue-500' },
  { id: 'act' as const, label: 'Act', color: 'text-green-500' },
  { id: 'observe' as const, label: 'Observe', color: 'text-purple-500' },
];

export const ReasoningButton = React.forwardRef<HTMLButtonElement, ReasoningButtonProps>(
  ({ className, size = "sm", reasoningMode = 'off', onReasoningModeChange, ...props }, ref) => {
    const selectedMode = reasoningModes.find(m => m.id === reasoningMode);
    
    if (onReasoningModeChange) {
      // Dropdown version
      return (
        <Select value={reasoningMode} onValueChange={onReasoningModeChange}>
          <SelectTrigger 
            className={cn(
              "w-full rounded-full border-0 outline-none ring-0 focus:ring-0 focus:border-0 px-1.5 py-0.5 bg-muted",
              className
            )}
          >
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {selectedMode && (
                <>
                  <Square className={cn("size-2", selectedMode.color)} />
                  <span className="truncate text-xs font-medium">
                    {selectedMode.label}
                  </span>
                </>
              )}
            </div>
          </SelectTrigger>
          <SelectContent
            className={cn(
              "z-50 max-h-[var(--radix-select-content-available-height)] min-w-[110px] border-0",
              "max-h-[--radix-select-content-available-height] w-[110px]"
            )}
          >
            {reasoningModes.map((modeInfo) => (
              <SelectItem 
                key={modeInfo.id} 
                value={modeInfo.id} 
                className="px-1.5 py-0.5 data-[state=checked]:bg-muted"
              >
                <div className="flex items-center gap-1.5">
                  <Square className={cn("size-2", modeInfo.color)} />
                  <span className="text-xs font-medium">{modeInfo.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Simple button version
    return (
      <Button
        ref={ref}
        variant="ghost"
        size={size}
        className={cn("rounded-full hover:bg-accent/50", className)}
        {...props}
      >
        <Square className={cn("h-4 w-4", selectedMode?.color || "text-gray-500")} />
        <span className="sr-only">Reasoning mode</span>
      </Button>
    );
  }
);

ReasoningButton.displayName = "ReasoningButton";

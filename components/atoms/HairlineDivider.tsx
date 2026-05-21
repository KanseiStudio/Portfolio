import { cn } from "@/lib/utils"

interface HairlineDividerProps {
  orientation?: "horizontal" | "vertical"
  variant?: "full" | "half"
  label?: { left?: string; right?: string }
  className?: string
}

export function HairlineDivider({
  orientation = "horizontal",
  variant = "full",
  label,
  className,
}: HairlineDividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(
          "w-px self-stretch border-l border-ks-hairline-active",
          className
        )}
      />
    )
  }

  if (label?.left || label?.right) {
    return (
      <div
        role="separator"
        className={cn("flex items-center gap-6 my-8 lg:my-12", className)}
      >
        {label.left && (
          <span className="text-small font-mono text-ks-fg opacity-70 shrink-0">
            {label.left}
          </span>
        )}
        <div className="flex-1 border-t border-ks-hairline-active" />
        {label.right && (
          <span className="text-small font-mono text-ks-fg opacity-70 shrink-0">
            {label.right}
          </span>
        )}
      </div>
    )
  }

  return (
    <hr
      className={cn(
        "border-t border-ks-hairline-active my-8 lg:my-12",
        variant === "half" && "w-1/2",
        className
      )}
    />
  )
}

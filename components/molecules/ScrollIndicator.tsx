import { cn } from "@/lib/utils"

interface ScrollIndicatorProps {
  total: number
  current: number
  position?: "left" | "right"
}

export function ScrollIndicator({ total, current, position = "left" }: ScrollIndicatorProps) {
  return (
    <div
      className={cn(
        "fixed top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 z-40",
        position === "left" ? "left-6" : "right-6"
      )}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-4">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "w-1 h-1 rounded-full",
              i + 1 === current ? "bg-ks-accent" : "bg-ks-fg opacity-30"
            )}
          />
        ))}
      </div>

      <span
        className="text-eyebrow font-body uppercase tracking-widest opacity-60 mt-2"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Scroll to explore
      </span>
    </div>
  )
}

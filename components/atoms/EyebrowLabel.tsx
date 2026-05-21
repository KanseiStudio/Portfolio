import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EyebrowLabelProps {
  number?: string
  children: ReactNode
  accent?: boolean
  as?: "span" | "div"
  className?: string
}

export function EyebrowLabel({
  number,
  children,
  accent = false,
  as: Tag = "div",
  className,
}: EyebrowLabelProps) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center text-eyebrow font-body font-medium uppercase tracking-widest text-ks-fg",
        className
      )}
    >
      {number && (
        <>
          <span className="shrink-0">{number}</span>
          <span
            className="inline-block w-px mx-3 shrink-0 opacity-20 bg-ks-fg"
            style={{ height: "0.8em" }}
            aria-hidden="true"
          />
        </>
      )}
      <span>{children}</span>
      {accent && (
        <span
          className="inline-block w-1 h-1 rounded-full bg-ks-accent shrink-0 ml-3"
          aria-hidden="true"
        />
      )}
    </Tag>
  )
}

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ContainerProps {
  children: ReactNode
  as?: "div" | "section" | "article" | "main"
  className?: string
}

export function Container({
  children,
  as: Tag = "div",
  className,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12",
        className
      )}
    >
      {children}
    </Tag>
  )
}

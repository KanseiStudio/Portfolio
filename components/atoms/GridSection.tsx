import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Container } from "./Container"

interface GridSectionProps {
  children: ReactNode
  id?: string
  dark?: boolean
  noPaddingY?: boolean
  className?: string
}

export function GridSection({
  children,
  id,
  dark = false,
  noPaddingY = false,
  className,
}: GridSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full",
        !noPaddingY && "py-20 lg:py-[120px]",
        dark && "bg-ks-dark-bg text-ks-dark-fg dark-section",
        className
      )}
    >
      <Container>
        <div className="grid grid-cols-12 gap-8">{children}</div>
      </Container>
    </section>
  )
}

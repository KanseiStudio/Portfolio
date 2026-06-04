import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: number
  className?: string
  alt?: string
  /** true = dark background (white logo, no CSS tricks needed) */
  onDark?: boolean
}

export function Logo({ size = 28, className, alt = "Kansei Studio", onDark = false }: LogoProps) {
  return (
    <div
      className={cn("shrink-0 aspect-square", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/home-flower.png"
        alt={alt}
        width={size}
        height={size}
        priority
        className={cn(
          "block",
          !onDark && "invert mix-blend-multiply",
          onDark  && "mix-blend-screen",
        )}
      />
    </div>
  )
}

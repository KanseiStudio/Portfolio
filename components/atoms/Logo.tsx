import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: number
  className?: string
  alt?: string
}

export function Logo({ size = 28, className, alt = "Kansei Studio" }: LogoProps) {
  return (
    <div
      className={cn("shrink-0 aspect-square", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt={alt}
        width={size}
        height={size}
        priority
        className="block"
      />
    </div>
  )
}

"use client"

import { forwardRef } from "react"
import Link from "next/link"
import { Plus, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

type IconType = "plus" | "arrow" | "close"
type SizeType = "sm" | "md" | "lg"

interface BaseProps {
  icon?: IconType
  size?: SizeType
  disabled?: boolean
  className?: string
  "aria-label": string
}

interface ButtonProps extends BaseProps {
  href?: undefined
  onClick?: () => void
}

interface LinkProps extends BaseProps {
  href: string
  onClick?: never
}

type CirclePlusButtonProps = ButtonProps | LinkProps

const icons: Record<IconType, typeof Plus> = {
  plus: Plus,
  arrow: ArrowRight,
  close: X,
}

const sizeConfig: Record<SizeType, { container: string; iconSize: number }> = {
  sm: { container: "w-6 h-6", iconSize: 10 },
  md: { container: "w-8 h-8", iconSize: 12 },
  lg: { container: "w-12 h-12", iconSize: 16 },
}

const baseClasses =
  "inline-flex items-center justify-center rounded-full border border-ks-fg bg-transparent text-ks-fg " +
  "transition-colors duration-600 ease-kansei " +
  "hover:bg-ks-fg hover:text-ks-bg " +
  "active:scale-95 " +
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-ks-fg focus-visible:outline-offset-4 " +
  "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"

export const CirclePlusButton = forwardRef<HTMLButtonElement, CirclePlusButtonProps>(
  function CirclePlusButton(
    { icon = "plus", size = "md", href, onClick, disabled, className, "aria-label": ariaLabel },
    ref
  ) {
    const Icon = icons[icon]
    const { container, iconSize } = sizeConfig[size]

    const content = (
      <Icon size={iconSize} strokeWidth={1.5} aria-hidden="true" />
    )

    const classes = cn(baseClasses, container, className)

    if (href) {
      return (
        <Link href={href} className={classes} aria-label={ariaLabel}>
          {content}
        </Link>
      )
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </button>
    )
  }
)

import type { LucideIcon } from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

interface ContactCardProps {
  icon: LucideIcon
  label: string
  value: string
  href?: string
  className?: string
}

const innerClasses =
  "flex items-center gap-4 border border-ks-hairline-active p-4 md:p-5 min-h-[44px]"

const hoverClasses =
  "transition-colors duration-[250ms] ease-kansei-std hover:bg-ks-fg hover:text-ks-bg hover:border-ks-fg"

export function ContactCard({ icon: Icon, label, value, href, className }: ContactCardProps) {
  const content = (
    <>
      <Icon size={20} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
      <div className="flex flex-col min-w-0">
        <span className="text-mono-ks font-mono uppercase tracking-widest opacity-60 leading-none mb-1">
          {label}
        </span>
        <span className="text-small font-body truncate">{value}</span>
      </div>
    </>
  )

  if (!href) {
    return (
      <div className={cn(innerClasses, className)}>
        {content}
      </div>
    )
  }

  // Internal route: use next-intl Link
  if (href.startsWith("/")) {
    return (
      <Link
        href={href as never}
        aria-label={`${label}: ${value}`}
        className={cn(innerClasses, hoverClasses, className)}
      >
        {content}
      </Link>
    )
  }

  // External URL or mailto: use native <a>
  const isExternal = href.startsWith("https://") || href.startsWith("http://")
  return (
    <a
      href={href}
      aria-label={`${label}: ${value}`}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(innerClasses, hoverClasses, className)}
    >
      {content}
    </a>
  )
}

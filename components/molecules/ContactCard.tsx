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

const BASE =
  "flex items-center gap-4 border border-[#F5F4F0]/12 px-5 py-4 min-h-[72px]"

const HOVER =
  "transition-colors duration-300 " +
  "hover:bg-[#F5F4F0] hover:text-[#0A0A0A] hover:border-[#F5F4F0] " +
  "group cursor-pointer"

function CardContent({
  icon: Icon,
  label,
  value,
  showArrow,
}: {
  icon: LucideIcon
  label: string
  value: string
  showArrow: boolean
}) {
  return (
    <>
      <Icon
        size={17}
        strokeWidth={1.5}
        className="shrink-0 text-[#F5F4F0]/45 group-hover:text-[#0A0A0A] transition-colors duration-300"
        aria-hidden="true"
      />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#F5F4F0]/30 group-hover:text-[#0A0A0A]/50 transition-colors duration-300 leading-none mb-1">
          {label}
        </span>
        <span className="font-n27 font-light text-sm text-[#F5F4F0]/70 group-hover:text-[#0A0A0A] transition-colors duration-300 truncate">
          {value}
        </span>
      </div>
      {showArrow && (
        <span className="text-[11px] text-[#F5F4F0]/30 group-hover:text-[#0A0A0A]/50 transition-colors duration-300 shrink-0">
          ↗
        </span>
      )}
    </>
  )
}

export function ContactCard({ icon: Icon, label, value, href, className }: ContactCardProps) {
  /* ── Non-interactive (no href: Newsletter) ─── */
  if (!href) {
    return (
      <div className={cn(BASE, "cursor-default", className)}>
        <CardContent icon={Icon} label={label} value={value} showArrow={false} />
      </div>
    )
  }

  const shared = { icon: Icon, label, value, showArrow: true }

  /* ── Internal route ─────────────────────── */
  if (href.startsWith("/")) {
    return (
      <Link
        href={href as never}
        aria-label={`${label}: ${value}`}
        className={cn(BASE, HOVER, className)}
      >
        <CardContent {...shared} />
      </Link>
    )
  }

  /* ── External / mailto ──────────────────── */
  const isExternal = href.startsWith("https://") || href.startsWith("http://")
  return (
    <a
      href={href}
      aria-label={`${label}: ${value}`}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(BASE, HOVER, className)}
    >
      <CardContent {...shared} />
    </a>
  )
}

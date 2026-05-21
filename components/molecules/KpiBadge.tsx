import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiBadgeProps {
  icon: LucideIcon
  value: string
  label: string
  className?: string
}

export function KpiBadge({ icon: Icon, value, label, className }: KpiBadgeProps) {
  return (
    <div className={cn("border border-ks-hairline-active p-4 md:p-6", className)}>
      <div className="grid grid-cols-12 gap-3 items-start">
        <div className="col-span-2 pt-0.5">
          <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="col-span-10">
          <p className="text-ks-h3 font-mono font-normal leading-none mb-1">{value}</p>
          <p className="text-small font-body opacity-70 leading-tight">{label}</p>
        </div>
      </div>
    </div>
  )
}

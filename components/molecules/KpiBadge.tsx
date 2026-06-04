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
    <div className={cn("border border-[#F5F4F0]/12 p-4 md:p-6", className)}>
      <div className="flex flex-col gap-4">
        <Icon size={16} strokeWidth={1.5} className="text-[#F5F4F0]/35" aria-hidden="true" />
        <div>
          <p className="font-mono text-[1.75rem] font-normal leading-none tracking-tight text-[#F5F4F0] mb-1.5">
            {value}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#F5F4F0]/40 leading-tight">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

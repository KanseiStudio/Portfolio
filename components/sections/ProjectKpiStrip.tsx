import {
  TrendingUp,
  Database,
  Zap,
  Activity,
  Users,
  Clock,
  CheckCircle,
  Layers,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/atoms/Container"
import { KpiBadge } from "@/components/molecules/KpiBadge"

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Database,
  Zap,
  Activity,
  Users,
  Clock,
  CheckCircle,
  Layers,
}

export interface KpiData {
  id: number
  icon: string
  value: string
  label: string
}

export function ProjectKpiStrip({ kpis }: { kpis: KpiData[] }) {
  if (kpis.length === 0) return null

  return (
    <Container as="section" className="py-16 lg:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = ICON_MAP[kpi.icon] ?? Activity
          return (
            <KpiBadge
              key={kpi.id}
              icon={Icon}
              value={kpi.value}
              label={kpi.label}
            />
          )
        })}
      </div>
    </Container>
  )
}

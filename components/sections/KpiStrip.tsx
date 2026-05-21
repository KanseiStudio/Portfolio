import { TrendingUp, Database, Zap, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/atoms/Container"
import { KpiBadge } from "@/components/molecules/KpiBadge"
import { RevealText } from "@/components/molecules/RevealText"

const kpis = [
  { icon: TrendingUp, value: "38%", label: "Increase in audience engagement" },
  { icon: Database, value: "2.4M+", label: "Live data events processed" },
  { icon: Zap, value: "<90ms", label: "System response time" },
  { icon: Activity, value: "24/7", label: "Operational stability" },
] as const

interface KpiStripProps {
  className?: string
}

export function KpiStrip({ className }: KpiStripProps) {
  return (
    <section id="kpi-strip" className={cn("w-full", className)}>
      <Container className="py-24 lg:py-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <RevealText key={kpi.value} as="div" delay={i * 100}>
              <KpiBadge icon={kpi.icon} value={kpi.value} label={kpi.label} />
            </RevealText>
          ))}
        </div>
      </Container>
    </section>
  )
}

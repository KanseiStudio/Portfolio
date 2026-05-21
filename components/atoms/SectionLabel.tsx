import { cn } from "@/lib/utils"
import { EyebrowLabel } from "./EyebrowLabel"

interface SectionLabelProps {
  number: string
  name: string
  id?: string
  className?: string
}

export function SectionLabel({ number, name, id, className }: SectionLabelProps) {
  return (
    <div id={id} className={cn(className)}>
      <EyebrowLabel number={number} accent>
        {name}
      </EyebrowLabel>
    </div>
  )
}

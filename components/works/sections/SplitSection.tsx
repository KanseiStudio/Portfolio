import type { LocalizedWorkSection } from "@/lib/works"
import { Cell, SectionHeader, WorkImage, autoGrid, ws } from "../ui"
import { cn } from "@/lib/utils"

/** SPLIT — immagine a sinistra, intestazione e celle a destra. Una colonna sotto 900px circa. */
export function SplitSection({ section }: { section: LocalizedWorkSection }) {
  return (
    <div className="grid gap-10 md:gap-14 items-start" style={autoGrid(420)}>
      {section.image && (
        <figure className={cn("border overflow-hidden", ws.hairline)}>
          <WorkImage src={section.image} alt={section.imageAlt} sizes="(max-width: 959px) 100vw, 590px" />
        </figure>
      )}
      <div className="flex flex-col gap-7">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} body={section.body} layout="stacked" />
        {section.items.map((it) => (
          <Cell key={it.id} label={it.label} title={it.title} body={it.body} />
        ))}
      </div>
    </div>
  )
}

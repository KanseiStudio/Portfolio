import type { LocalizedWorkSection } from "@/lib/works"
import { SectionHeader, WorkImage, ws } from "../ui"
import { cn } from "@/lib/utils"

/** IMAGE — immagine a tutta colonna nelle sue proporzioni, intestazione opzionale */
export function ImageSection({ section }: { section: LocalizedWorkSection }) {
  if (!section.image) return null
  return (
    <div className="flex flex-col gap-10">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <figure className={cn("border overflow-hidden", ws.hairline)}>
        <WorkImage src={section.image} alt={section.imageAlt} sizes="(max-width: 767px) 100vw, 1184px" />
      </figure>
    </div>
  )
}

import type { ComponentType } from "react"
import type { LocalizedWorkSection } from "@/lib/works"
import type { SectionKindValue } from "@/lib/validations/work"
import { cn } from "@/lib/utils"
import { ws } from "./ui"
import { CardsSection } from "./sections/CardsSection"
import { TimelineSection } from "./sections/TimelineSection"
import { TableSection } from "./sections/TableSection"
import { SpecsSection } from "./sections/SpecsSection"
import { GallerySection } from "./sections/GallerySection"
import { QuoteSection } from "./sections/QuoteSection"
import { ImageSection } from "./sections/ImageSection"
import { SplitSection } from "./sections/SplitSection"

type SectionProps = { section: LocalizedWorkSection; scrollLabel: string }

const RENDERERS: Record<SectionKindValue, ComponentType<SectionProps>> = {
  CARDS: CardsSection,
  TIMELINE: TimelineSection,
  TABLE: TableSection,
  SPECS: SpecsSection,
  GALLERY: GallerySection,
  QUOTE: QuoteSection,
  IMAGE: ImageSection,
  SPLIT: SplitSection,
}

/**
 * Raggruppa le sezioni: una sezione con eyebrow apre un nuovo blocco numerato
 * (filetto superiore + padding); quelle senza eyebrow lo proseguono.
 */
function groupSections(sections: LocalizedWorkSection[]) {
  const groups: LocalizedWorkSection[][] = []
  for (const s of sections) {
    if (s.eyebrow || groups.length === 0) groups.push([s])
    else groups[groups.length - 1].push(s)
  }
  return groups
}

export function WorkSections({
  sections,
  scrollLabel,
  borderFirst = true,
}: {
  sections: LocalizedWorkSection[]
  scrollLabel: string
  /** false quando sopra c'è già un filetto (fascia stats) */
  borderFirst?: boolean
}) {
  return (
    <>
      {groupSections(sections).map((group, gi) => (
        <section
          key={group[0].id}
          className={cn("flex flex-col gap-10 py-14 md:py-[72px]", (gi > 0 || borderFirst) && `border-t ${ws.hairline}`)}
        >
          {group.map((section) => {
            // Un tipo sconosciuto non rompe la pagina: non renderizza nulla
            const Renderer = RENDERERS[section.kind as SectionKindValue]
            return Renderer ? <Renderer key={section.id} section={section} scrollLabel={scrollLabel} /> : null
          })}
        </section>
      ))}
    </>
  )
}

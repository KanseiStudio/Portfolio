import type { LocalizedWorkSection } from "@/lib/works"
import { SectionHeader, autoGrid, ws } from "../ui"
import { cn } from "@/lib/utils"

/**
 * SPECS — tabella etichetta / valore. Con titolo o testo: intestazione a sinistra e
 * tabella a destra. Solo eyebrow (es. "Dove vive K-Avatar"): etichetta sopra la tabella.
 */
export function SpecsSection({ section }: { section: LocalizedWorkSection }) {
  const rows = (
    <dl className={cn("border-t", ws.hairline)}>
      {section.items.map((it) => (
        <div
          key={it.id}
          className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] gap-x-6 gap-y-1 py-3.5 border-b border-[#F5F4F0]/8"
        >
          <dt className={ws.lbl}>{it.label}</dt>
          <dd className={ws.body}>{it.body}</dd>
        </div>
      ))}
    </dl>
  )

  if (!section.title && !section.body) {
    return (
      <div className="flex flex-col gap-4 max-w-[760px]">
        {section.eyebrow && <span className={ws.lbl}>{section.eyebrow}</span>}
        {rows}
      </div>
    )
  }

  return (
    <div className="grid gap-10 md:gap-14" style={autoGrid(360)}>
      <SectionHeader eyebrow={section.eyebrow} title={section.title} body={section.body} layout="stacked" />
      {rows}
    </div>
  )
}

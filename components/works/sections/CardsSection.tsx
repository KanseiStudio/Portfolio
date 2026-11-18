import type { LocalizedWorkSection } from "@/lib/works"
import { Cell, SectionHeader, autoGrid, ws } from "../ui"
import { cn } from "@/lib/utils"

/**
 * CARDS — griglia di celle. Con etichette ("01", "Una porta"): celle con filetto.
 * Senza etichette (es. garanzie): riquadri separati da hairline.
 */
export function CardsSection({ section }: { section: LocalizedWorkSection }) {
  const { items } = section
  const labelled = items.some((it) => it.label)

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} body={section.body} />
      {items.length > 0 &&
        (labelled ? (
          <div className="grid gap-8" style={autoGrid(items.length > 4 ? 190 : 220)}>
            {items.map((it) => (
              <Cell key={it.id} label={it.label} title={it.title} body={it.body} />
            ))}
          </div>
        ) : (
          <div className={cn("grid gap-px border bg-[#F5F4F0]/12", ws.hairline)} style={autoGrid(240)}>
            {items.map((it) => (
              <div key={it.id} className="flex flex-col gap-2 bg-[#0A0A0A] p-6">
                {it.title && <h3 className={ws.h3}>{it.title}</h3>}
                {it.body && <p className={cn(ws.body, "whitespace-pre-line")}>{it.body}</p>}
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}

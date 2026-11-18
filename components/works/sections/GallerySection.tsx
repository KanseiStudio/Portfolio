import type { LocalizedWorkSection } from "@/lib/works"
import { SectionHeader, WorkImage, autoGrid, ws } from "../ui"
import { cn } from "@/lib/utils"

/**
 * GALLERY — immagini con didascalia. Il formato segue il contenuto:
 * - voci con testo (step) → orizzontale 16:10
 * - 4+ voci senza testo (personaggi) → verticale 3:5, inquadratura dall'alto
 * - altrimenti (mondi) → verticale 4:5
 */
export function GallerySection({ section }: { section: LocalizedWorkSection }) {
  const items = section.items.filter((it) => it.image)
  if (items.length === 0) return null
  const withText = items.some((it) => it.body)
  const ratio = withText ? "16 / 10" : items.length >= 4 ? "3 / 5" : "4 / 5"
  const min = withText ? 220 : items.length >= 4 ? 200 : 240
  const cols = Math.min(items.length, 4)

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className="grid gap-5" style={autoGrid(min)}>
        {items.map((it) => (
          <figure key={it.id} className="flex flex-col gap-2.5 md:gap-3">
            <WorkImage
              src={it.image!}
              alt={it.imageAlt}
              ratio={ratio}
              position={ratio === "3 / 5" ? "top" : undefined}
              sizes={`(max-width: 767px) 100vw, ${Math.round(1184 / cols)}px`}
              className={cn("border", ws.hairline)}
            />
            {(it.label || it.body) && (
              <figcaption className="flex flex-col gap-1.5">
                {it.label && <span className={ws.lbl}>{it.label}</span>}
                {it.body && <span className={ws.body}>{it.body}</span>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  )
}

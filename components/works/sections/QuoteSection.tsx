import type { LocalizedWorkSection } from "@/lib/works"
import { ws } from "../ui"
import { cn } from "@/lib/utils"

/**
 * QUOTE — box citazione. La barra verticale è l'UNICO uso del rosso del logo
 * (#E31E24) in tutto il sito: l'etichetta resta nel colore delle label.
 */
export function QuoteSection({ section }: { section: LocalizedWorkSection }) {
  if (!section.body) return null
  return (
    <figure className="grid grid-cols-[4px_minmax(0,1fr)] gap-6 py-7 pr-7 bg-[#F5F4F0]/4">
      <span aria-hidden="true" className="bg-[#E31E24]" />
      <div className="flex flex-col gap-2.5">
        {section.title && <figcaption className={ws.lbl}>{section.title}</figcaption>}
        <blockquote className={cn(ws.serif, "text-[22px] md:text-[26px] leading-[1.3] font-light")}>
          <p>{section.body}</p>
        </blockquote>
      </div>
    </figure>
  )
}

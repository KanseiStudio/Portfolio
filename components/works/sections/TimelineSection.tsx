import type { LocalizedWorkSection } from "@/lib/works"
import { SectionHeader, ws } from "../ui"
import { cn } from "@/lib/utils"

/** TIMELINE — righe numerate con il tempo a destra. Sotto 768px: numero e tempo in alto, testo sotto. */
export function TimelineSection({ section }: { section: LocalizedWorkSection }) {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} body={section.body} />
      {section.items.length > 0 && (
        <ol className={cn("border-t", ws.hairline)}>
          {section.items.map((it) => (
            <li
              key={it.id}
              className="grid grid-cols-[1fr_auto] md:grid-cols-[56px_minmax(0,1fr)_minmax(0,2fr)_80px] gap-x-5 gap-y-2 py-[18px] border-b border-[#F5F4F0]/8 items-baseline"
            >
              <span className={ws.lbl}>{it.label}</span>
              <span className={cn(ws.lbl, "text-right md:order-last tabular-nums")}>{it.extra}</span>
              {it.title && <h3 className={cn(ws.h3, "col-span-2 md:col-span-1")}>{it.title}</h3>}
              {it.body && <p className={cn(ws.body, "col-span-2 md:col-span-1")}>{it.body}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

import type { LocalizedWorkSection } from "@/lib/works"
import { SectionHeader, ws } from "../ui"
import { cn } from "@/lib/utils"

/**
 * TABLE — tabella a 3 colonne con intestazioni salvate (`columns`).
 * Sotto 768px scorre orizzontalmente dentro il proprio box (focusabile da tastiera).
 */
export function TableSection({ section, scrollLabel }: { section: LocalizedWorkSection; scrollLabel: string }) {
  const [c1, c2, c3] = section.columns
  const label = section.title ?? section.eyebrow ?? undefined
  return (
    <div className="flex flex-col gap-10">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} body={section.body} />
      {section.items.length > 0 && (
        <div className="flex flex-col gap-2">
          <p aria-hidden="true" className={cn(ws.lbl, "md:hidden text-right")}>
            {scrollLabel} →
          </p>
          <div
            className="overflow-x-auto focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#F5F4F0]/50"
            tabIndex={0}
            role="region"
            aria-label={label ? `${label} — ${scrollLabel}` : scrollLabel}
          >
            <table className={cn("w-full min-w-[640px] border-t text-left", ws.hairline)}>
              {(c1 || c2 || c3) && (
                <thead>
                  <tr className="border-b border-[#F5F4F0]/8">
                    {[c1, c2, c3].map((c, i) => (
                      <th key={i} scope="col" className={cn(ws.lbl, "font-normal text-[9px] py-3 pr-6", i === 0 ? "w-1/5" : "w-2/5")}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {section.items.map((it) => (
                  <tr key={it.id} className="border-b border-[#F5F4F0]/8 align-baseline">
                    <th scope="row" className={cn(ws.h3, "py-4 pr-6 text-left")}>
                      {it.label}
                    </th>
                    <td className={cn(ws.body, "py-4 pr-6")}>{it.body}</td>
                    <td className={cn(ws.body, "py-4")}>{it.extra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

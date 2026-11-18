import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import type { LocalizedWork } from "@/lib/works"
import { cn } from "@/lib/utils"
import { Arrow, WorkImage, autoGrid, ws } from "./ui"

const pad = (n: number) => String(n).padStart(2, "0")

export async function WorkBreadcrumb({ work }: { work: LocalizedWork }) {
  const t = await getTranslations("Works")
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap justify-between gap-3 pt-7">
      <Link href="/works" className={cn(ws.lbl, "inline-flex items-center gap-2 min-h-11 hover:text-[#F5F4F0] transition-colors")}>
        <Arrow>←</Arrow> {t("breadcrumbRoot")} / {pad(work.position)} — {work.name}
      </Link>
      <span className={cn(ws.lbl, "inline-flex items-center")}>
        {t("ref")} {work.name.toUpperCase()}
      </span>
    </nav>
  )
}

/** Immagine con angoli HUD e didascalia; il tono (chiaro/scuro) è salvato per lavoro */
export function HudFigure({
  work,
  ratio,
  sizes,
  eager,
  showNumber,
  className,
}: {
  work: Pick<LocalizedWork, "hero" | "position">
  ratio: string
  sizes: string
  eager?: boolean
  showNumber?: boolean
  className?: string
}) {
  const light = work.hero.tone === "LIGHT"
  const ink = light ? "border-[#F5F4F0]" : "border-[#0A0A0A]"
  const text = light ? "text-[#F5F4F0]/80" : "text-[#0A0A0A]/75"
  return (
    <figure className={cn("relative m-0 overflow-hidden border", ws.hairline, className)}>
      {/* Hero = ritratti verticali: fuoco in alto per non tagliare i volti */}
      <WorkImage src={work.hero.image} alt={work.hero.alt} ratio={ratio} sizes={sizes} eager={eager} position="center top" />
      <span aria-hidden="true" className={cn("absolute top-2.5 left-2.5 size-3.5 border-t border-l", ink)} />
      <span aria-hidden="true" className={cn("absolute bottom-2.5 right-2.5 size-3.5 border-b border-r", ink)} />
      {showNumber && (
        <span aria-hidden="true" className={cn("absolute left-4 top-3.5 font-mono text-[10px] uppercase tracking-[0.12em]", text)}>
          {pad(work.position)}
        </span>
      )}
      {work.hero.caption && (
        <figcaption
          className={cn(
            "absolute bottom-3.5 font-mono text-[9px] uppercase tracking-[0.12em]",
            showNumber ? "right-8" : "left-4",
            text,
          )}
        >
          {work.hero.caption}
        </figcaption>
      )}
    </figure>
  )
}

export function WorkHero({ work }: { work: LocalizedWork }) {
  return (
    <section className="grid gap-10 md:gap-14 items-center pt-10 pb-16 md:pb-[88px]" style={autoGrid(440)}>
      <div className="flex flex-col gap-6">
        <span className={ws.lbl}>{work.type}</span>
        <h1 className={cn(ws.serif, "text-[clamp(56px,9vw,128px)] leading-[0.9]")}>{work.name}</h1>
        <p className={cn(ws.serif, "text-[24px] md:text-[30px] leading-[1.2] font-light italic")}>{work.tagline}</p>
        <p className={cn(ws.body, "text-[14px] max-w-[520px] whitespace-pre-line")}>{work.intro}</p>
        {work.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {work.tags.map((tag) => (
              <li key={tag} className={cn(ws.lbl, "text-[9px] px-2.5 py-1.5 border border-[#F5F4F0]/20")}>
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
      <HudFigure work={work} ratio="4 / 5" sizes="(max-width: 959px) 100vw, 590px" eager />
    </section>
  )
}

export async function WorkStats({ work }: { work: LocalizedWork }) {
  if (work.stats.length === 0) return null
  const t = await getTranslations("Works")
  return (
    <section aria-label={t("statsLabel")} className={cn("border-y py-9", ws.hairline)}>
      <dl className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {work.stats.map((s) => (
          <div key={`${s.value}-${s.label}`} className="flex flex-col gap-2.5">
            <dt className={cn(ws.lbl, "text-[9px]")}>{s.label}</dt>
            <dd className={cn(ws.num, "order-first text-[40px] md:text-[48px]")}>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export async function WorkNext({ work }: { work: LocalizedWork }) {
  const t = await getTranslations("Works")
  return (
    <section
      className={cn("grid gap-10 items-end border-t pt-16 pb-24", ws.hairline)}
      style={autoGrid(420)}
    >
      <div className="flex flex-col gap-4">
        {work.closing && (
          <p className={cn(ws.serif, "text-[28px] md:text-[36px] leading-[1.2] font-light")}>{work.closing}</p>
        )}
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className={ws.cta}>
            {work.ctaLabel ?? t("defaultCta")} <Arrow />
          </Link>
          <Link href="/works" className={cn(ws.cta, "border-transparent")}>
            <Arrow>←</Arrow> {t("allWorks")}
          </Link>
        </div>
      </div>
      {work.next && (
        <Link
          href={`/works/${work.next.slug}`}
          className={cn(
            "flex items-end justify-between gap-4 border p-6 transition-colors duration-300 hover:bg-[#F5F4F0]/4",
            ws.hairline,
          )}
        >
          <span className="flex flex-col gap-2">
            <span className={ws.lbl}>
              {t("next")} · {pad(work.next.position)}
            </span>
            <span className={cn(ws.serif, "text-[32px] md:text-[40px] leading-none")}>{work.next.name}</span>
          </span>
          <Arrow>→</Arrow>
        </Link>
      )}
    </section>
  )
}

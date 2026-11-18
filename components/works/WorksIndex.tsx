import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import type { LocalizedWorkSummary } from "@/lib/works"
import { cn } from "@/lib/utils"
import { Arrow, autoGrid, ws } from "./ui"

const pad = (n: number) => String(n).padStart(2, "0")

export async function WorksPageHead({ count }: { count: number }) {
  const t = await getTranslations("Works")
  return (
    <section className="grid gap-10 items-end pt-14 md:pt-[72px] pb-14" style={autoGrid(420)}>
      <div className="flex flex-col gap-5">
        <span className={ws.lbl}>{t("sectionLabel")}</span>
        <h1 className={cn(ws.serif, "text-[clamp(48px,7vw,96px)] leading-[0.95]")}>{t("title")}</h1>
        <p className={cn(ws.body, "text-[14px] max-w-[560px]")}>{t("description")}</p>
      </div>
      <div className="flex flex-col items-start md:items-end gap-2">
        <span className={ws.lbl}>{t("archiveLabel")}</span>
        <span className={cn(ws.num, "text-[64px] tabular-nums")} data-testid="works-count">
          {pad(count)}
        </span>
      </div>
    </section>
  )
}

const rowGrid = "grid grid-cols-[40px_minmax(0,1fr)_auto_24px] md:grid-cols-[64px_minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_40px] gap-4 items-center"

export async function WorksIndexTable({ works }: { works: LocalizedWorkSummary[] }) {
  const t = await getTranslations("Works")
  return (
    <nav aria-label={t("indexLabel")} className={cn("border-t mb-16 md:mb-24", ws.hairline)}>
      <div aria-hidden="true" className={cn(rowGrid, ws.lbl, "text-[9px] py-3 border-b border-[#F5F4F0]/8")}>
        <span>{t("colNumber")}</span>
        <span>{t("colProject")}</span>
        <span className="hidden md:block">{t("colType")}</span>
        <span>{t("colStatus")}</span>
        <span />
      </div>
      <ol>
        {works.map((w) => (
          <li key={w.slug}>
            <Link
              href={`/works/${w.slug}`}
              className={cn(rowGrid, "min-h-16 py-3 border-b border-[#F5F4F0]/8 transition-colors duration-300 hover:bg-[#F5F4F0]/4")}
            >
              <span className={ws.lbl}>{pad(w.position)}</span>
              <span className={cn(ws.serif, "text-[22px] md:text-[24px]")}>{w.name}</span>
              <span className={cn(ws.lbl, "hidden md:block text-[#F5F4F0]/75")}>{w.type}</span>
              <span className={cn(ws.lbl, "text-[#F5F4F0]/75")}>{w.status}</span>
              <span className="text-right">
                <Arrow />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export async function WorkCard({ work, index }: { work: LocalizedWorkSummary; index: number }) {
  const t = await getTranslations("Works")
  const flip = index % 2 === 1
  const light = work.hero.tone === "LIGHT"
  const overlay = light ? "text-[#F5F4F0]/80" : "text-[#0A0A0A]/75"

  return (
    <article
      className={cn("grid grid-cols-1 md:grid-cols-2 border mb-10", "border-[#F5F4F0]/12")}
      data-testid="work-card"
    >
      {/* Immagine: link duplicato della CTA, escluso da tab e screen reader */}
      <Link
        href={`/works/${work.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          "group relative block overflow-hidden bg-[#15161a] min-h-[360px] md:min-h-[520px] border-[#F5F4F0]/12",
          flip ? "md:order-last md:border-l" : "md:border-r",
          "border-b md:border-b-0",
        )}
      >
        {/* Le hero sono ritratti verticali: fuoco in alto per non tagliare i volti */}
        <Image
          src={work.hero.image}
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, 640px"
          className="object-cover transition-transform duration-1200 ease-kansei group-hover:scale-[1.03]"
          style={{ objectPosition: "center top" }}
        />
        <span className={cn("absolute left-4 top-3.5 font-mono text-[10px] uppercase tracking-[0.12em]", overlay)}>
          {pad(work.position)}
        </span>
        {work.hero.caption && (
          <span className={cn("absolute right-4 bottom-3.5 font-mono text-[9px] uppercase tracking-[0.12em]", overlay)}>
            {work.hero.caption}
          </span>
        )}
      </Link>

      <div className="flex flex-col justify-between gap-10 p-6 md:p-10">
        <div className="flex flex-col gap-[18px]">
          <span className={ws.lbl}>{work.type}</span>
          <h2 className={cn(ws.serif, "text-[44px] md:text-[56px] leading-none")}>{work.name}</h2>
          <p className={cn(ws.serif, "text-[20px] md:text-[22px] font-light italic text-[#F5F4F0]/90")}>{work.tagline}</p>
          <p className={cn(ws.body, "max-w-[480px] whitespace-pre-line")}>{work.summary}</p>
        </div>

        {work.cardStats.length > 0 && (
          <dl className="grid grid-cols-3 gap-4 border-t border-[#F5F4F0]/10 pt-5">
            {work.cardStats.map((s) => (
              <div key={`${s.value}-${s.cardLabel}`} className="flex flex-col gap-1.5">
                <dt className={cn(ws.lbl, "text-[9px]")}>{s.cardLabel}</dt>
                <dd className={cn(ws.num, "order-first text-[26px] md:text-[32px] tracking-[-0.02em]")}>{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          {work.tags.length > 0 && <span className={cn(ws.lbl, "text-[9px]")}>{work.tags.join(" · ")}</span>}
          <Link href={`/works/${work.slug}`} className={ws.cta}>
            {t("openProject")}
            <span className="sr-only"> — {work.name}</span> <Arrow />
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function WorksClosing() {
  const t = await getTranslations("Works")
  return (
    <section className={cn("flex flex-wrap justify-between items-end gap-8 border-t pt-16 md:pt-[72px] pb-24", ws.hairline)}>
      <div className="flex flex-col gap-4 max-w-[640px]">
        <span className={ws.lbl}>{t("closingLabel")}</span>
        <p className={cn(ws.serif, "text-[30px] md:text-[40px] leading-[1.15] font-light")}>{t("closingText")}</p>
      </div>
      <Link href="/contact" className={ws.cta}>
        {t("contactCta")} <Arrow />
      </Link>
    </section>
  )
}

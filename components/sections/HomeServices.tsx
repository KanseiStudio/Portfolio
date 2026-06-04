import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"

/* ─── Geometric glyphs: line-art, 18×18 viewBox, stroke white ──────────── */
function GlyphCube() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"
      className="w-[14px] h-[14px] opacity-35" aria-hidden="true">
      {/* top rhombus */}
      <path d="M9 1 L17 5 L9 9 L1 5 Z" />
      {/* left face */}
      <path d="M1 5 L1 13 L9 17 L9 9 Z" />
      {/* right face */}
      <path d="M17 5 L17 13 L9 17 L9 9 Z" />
    </svg>
  )
}

function GlyphCircleSlash() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"
      className="w-[14px] h-[14px] opacity-35" aria-hidden="true">
      <circle cx="9" cy="9" r="7" />
      <line x1="3.5" y1="3.5" x2="14.5" y2="14.5" />
    </svg>
  )
}

function GlyphAsterisk() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"
      className="w-[14px] h-[14px] opacity-35" aria-hidden="true">
      {/* 6-spoke radial asterisk */}
      <line x1="9" y1="1.5"  x2="9"    y2="16.5" />
      <line x1="2.5" y1="5.25" x2="15.5" y2="12.75" />
      <line x1="2.5" y1="12.75" x2="15.5" y2="5.25" />
    </svg>
  )
}

function GlyphBracketSquare() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"
      className="w-[14px] h-[14px] opacity-35" aria-hidden="true">
      {/* corner brackets */}
      <path d="M1 6 L1 1 L6 1" />
      <path d="M12 1 L17 1 L17 6" />
      <path d="M17 12 L17 17 L12 17" />
      <path d="M6 17 L1 17 L1 12" />
    </svg>
  )
}

const GLYPHS = [GlyphCube, GlyphCircleSlash, GlyphAsterisk, GlyphBracketSquare]

interface Capability {
  number: string
  title: string
  description: string
  bullets: string[]
}

export async function HomeServices() {
  const t = await getTranslations("HomeServices")

  const capabilities: Capability[] = [
    {
      number:      t("service01.number"),
      title:       t("service01.title"),
      description: t("service01.description"),
      bullets:     t.raw("service01.bullets") as string[],
    },
    {
      number:      t("service02.number"),
      title:       t("service02.title"),
      description: t("service02.description"),
      bullets:     t.raw("service02.bullets") as string[],
    },
    {
      number:      t("service03.number"),
      title:       t("service03.title"),
      description: t("service03.description"),
      bullets:     t.raw("service03.bullets") as string[],
    },
    {
      number:      t("service04.number"),
      title:       t("service04.title"),
      description: t("service04.description"),
      bullets:     t.raw("service04.bullets") as string[],
    },
  ]

  return (
    /* shrink-0 keeps the services bar from collapsing inside the
       flex-col no-scroll layout on lg+ screens                    */
    <section className="shrink-0 border-t border-[#F5F4F0]/10">
      <Container className="px-0 sm:px-0 lg:px-0" as="div">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap, idx) => {
            const Glyph = GLYPHS[idx]
            const isLast = idx === capabilities.length - 1
            return (
              <article
                key={cap.number}
                className={[
                  "flex flex-col gap-2.5 px-6 lg:px-7 py-5 lg:py-6",
                  /* vertical dividers between columns */
                  !isLast && "border-b sm:border-b-0 border-[#F5F4F0]/8",
                  idx > 0 && "sm:border-l border-[#F5F4F0]/8",
                ].filter(Boolean).join(" ")}
              >
                {/* Number + glyph */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5F4F0]/30 leading-none">
                    {cap.number}
                  </span>
                  <Glyph />
                </div>

                {/* Title */}
                <h3 className="font-n27 font-semibold leading-tight text-[#F5F4F0]"
                  style={{ fontSize: "clamp(0.9rem, 1.25vw, 1.2rem)" }}>
                  {cap.title}
                </h3>

                {/* Description */}
                <p className="font-n27 font-light text-[11px] lg:text-[12px] leading-relaxed text-[#F5F4F0]/55">
                  {cap.description}
                </p>

                {/* Bullets */}
                <ul className="mt-auto pt-3 border-t border-[#F5F4F0]/8 space-y-1.5">
                  {cap.bullets.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 font-mono text-[9px] uppercase tracking-wider text-[#F5F4F0]/38 leading-snug"
                    >
                      <span className="shrink-0 opacity-40 mt-px">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

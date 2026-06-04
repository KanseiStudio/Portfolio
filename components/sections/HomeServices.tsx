import { getTranslations } from "next-intl/server"

/* ── Geometric glyphs (line-art, 18×18 viewBox, stroke white) ─────────── */

function GlyphCube() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor"
      strokeWidth="0.9" strokeLinejoin="round"
      className="w-[13px] h-[13px] opacity-40 shrink-0" aria-hidden="true">
      <path d="M9 1 L17 5 L9 9 L1 5 Z" />
      <path d="M1 5 L1 13 L9 17 L9 9 Z" />
      <path d="M17 5 L17 13 L9 17 L9 9 Z" />
    </svg>
  )
}

function GlyphCircleSlash() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor"
      strokeWidth="0.9" strokeLinecap="round"
      className="w-[13px] h-[13px] opacity-40 shrink-0" aria-hidden="true">
      <circle cx="9" cy="9" r="7" />
      <line x1="3.5" y1="3.5" x2="14.5" y2="14.5" />
    </svg>
  )
}

function GlyphAsterisk() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor"
      strokeWidth="0.9" strokeLinecap="round"
      className="w-[13px] h-[13px] opacity-40 shrink-0" aria-hidden="true">
      <line x1="9"   y1="1.5"  x2="9"    y2="16.5" />
      <line x1="2.5" y1="5.25" x2="15.5" y2="12.75" />
      <line x1="2.5" y1="12.75" x2="15.5" y2="5.25" />
    </svg>
  )
}

function GlyphBracketSquare() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor"
      strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"
      className="w-[13px] h-[13px] opacity-40 shrink-0" aria-hidden="true">
      <path d="M1 6 L1 1 L6 1" />
      <path d="M12 1 L17 1 L17 6" />
      <path d="M17 12 L17 17 L12 17" />
      <path d="M6 17 L1 17 L1 12" />
    </svg>
  )
}

const GLYPHS = [GlyphCube, GlyphCircleSlash, GlyphAsterisk, GlyphBracketSquare]

interface Cap {
  number: string
  title: string
  description: string
  bullets: string[]
}

export async function HomeServices() {
  const t = await getTranslations("HomeServices")

  const caps: Cap[] = (["01", "02", "03", "04"] as const).map((n, idx) => ({
    number:      t(`service0${idx + 1}.number`),
    title:       t(`service0${idx + 1}.title`),
    description: t(`service0${idx + 1}.description`),
    bullets:     t.raw(`service0${idx + 1}.bullets`) as string[],
  }))

  return (
    <section className="shrink-0 border-t border-[#F5F4F0]/24">
      <div className="w-full px-[9vw]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {caps.map((cap, idx) => {
            const Glyph = GLYPHS[idx]
            const isLast = idx === caps.length - 1
            return (
              <article
                key={cap.number}
                className={[
                  "flex flex-col gap-[5px] px-5 lg:px-6 py-3 lg:py-[14px]",
                  !isLast && "border-b sm:border-b-0 border-[#F5F4F0]/20",
                  idx > 0 && "sm:border-l border-[#F5F4F0]/20",
                ].filter(Boolean).join(" ")}
              >
                {/* Number + glyph row */}
                <div className="flex items-center gap-[7px]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em]
                                   text-[#F5F4F0]/30 leading-none">
                    {cap.number}
                  </span>
                  <Glyph />
                </div>

                {/* Title */}
                <h3
                  className="font-n27 font-semibold leading-tight text-[#F5F4F0]"
                  style={{ fontSize: "clamp(17px, 1.3vw, 22px)" }}
                >
                  {cap.title}
                </h3>

                {/* Description */}
                <p
                  className="font-n27 font-light leading-relaxed text-[#F5F4F0]/55"
                  style={{ fontSize: "clamp(12px, .9vw, 15px)" }}
                >
                  {cap.description}
                </p>

                {/* Bullet list */}
                <ul className="mt-auto pt-[8px] border-t border-[#F5F4F0]/20 space-y-[4px]">
                  {cap.bullets.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-[7px] font-mono uppercase
                                 tracking-wider text-[#F5F4F0]/38 leading-snug"
                      style={{ fontSize: "clamp(11px, .85vw, 14px)" }}
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
      </div>
    </section>
  )
}

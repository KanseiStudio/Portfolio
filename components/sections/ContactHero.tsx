import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"
import { HomeFlowerOrbit } from "@/components/atoms/HomeFlowerOrbit"

interface ContactHeroProps {
  studioName: string
  email: string
  location: string
  availability: string
  focus: string
}

export async function ContactHero({
  studioName,
  email,
  location,
  availability,
  focus,
}: ContactHeroProps) {
  const t = await getTranslations("Contact")

  const rows = [
    { label: t("studioLabel"),       value: studioName  },
    { label: t("locationLabel"),     value: location    },
    { label: t("availabilityLabel"), value: availability },
    { label: t("emailLabel"),        value: email       },
    { label: t("focusLabel"),        value: focus       },
  ]

  return (
    <Container as="section" className="pt-16 lg:pt-24 pb-12 lg:pb-16">
      <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">

        {/* ── LEFT: headline + body + metadata ───────────────────── */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col gap-8">

          {/* Headline — intentionally hardcoded EN per spec */}
          <h1 className="font-display font-normal leading-[0.92] tracking-[-0.025em] text-[#F5F4F0] text-[clamp(2.4rem,5vw,5rem)]">
            Let's build<br />sensory software.
          </h1>

          {/* Body */}
          <p className="font-n27 font-light text-base lg:text-lg leading-relaxed text-[#F5F4F0]/60 max-w-[420px]">
            {t("heroDescription")}
          </p>

          {/* Metadata table */}
          <table className="w-full">
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-[#F5F4F0]/10 last:border-b">
                  <td className="py-3 pr-6 align-top font-mono text-[8px] uppercase tracking-[0.16em] text-[#F5F4F0]/30 whitespace-nowrap">
                    {row.label}
                  </td>
                  <td className="py-3 align-top font-n27 font-light text-sm text-[#F5F4F0]/70 leading-snug">
                    {row.value || <span className="opacity-40">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── RIGHT: bordered flower + wordmark box ─────────────── */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 mt-8 lg:mt-0">
          <div className="relative border border-[#F5F4F0]/14 overflow-hidden">

            {/* Corner ticks */}
            {(["top-0 left-0 border-t border-l",
               "top-0 right-0 border-t border-r",
               "bottom-0 left-0 border-b border-l",
               "bottom-0 right-0 border-b border-r"] as const).map((pos, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 border-[#F5F4F0]/35 z-10 ${pos}`}
                style={{ margin: -1 }}
              />
            ))}

            {/* Orbital flower visual — same as Home hero */}
            <HomeFlowerOrbit />

            {/* Hairline + serif wordmark */}
            <div className="border-t border-[#F5F4F0]/10 py-6 flex justify-center">
              <p className="font-display font-normal text-[clamp(2.2rem,4.5vw,4rem)] tracking-[-0.02em] text-[#F5F4F0] leading-none">
                Kansei
              </p>
            </div>
          </div>
        </div>

      </div>
    </Container>
  )
}

import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { Container } from "@/components/atoms/Container"
import { HomeFlowerOrbit } from "@/components/atoms/HomeFlowerOrbit"

export async function HomeHero() {
  const t = await getTranslations("Home")

  return (
    <section className="relative w-full flex-1 min-h-0 flex items-center overflow-hidden">
      <Container className="w-full py-6 lg:py-0 h-full flex items-center">

        <div className="w-full grid grid-cols-12 gap-4 lg:gap-6 items-center">

          {/* ── LEFT: Title + eyebrow + manifesto + CTA ──────────── */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col min-w-0">

            {/* Display title — fluid size: capped by both vw and vh so it
                never overflows on short viewports (e.g. 1280×720)         */}
            <h1
              className="font-n27 font-bold uppercase leading-[0.88] tracking-[-0.02em] text-[#F5F4F0]"
              style={{ fontSize: "clamp(3.5rem, min(10vw, 13vh), 9.5rem)" }}
            >
              <span className="block">{t("titleLine1")}</span>
              <span className="block">{t("titleLine2")}</span>
            </h1>

            {/* Eyebrow — edge-to-edge under the title ─────────────
                Uses flex justify-between so the two labels sit at the
                left and right edges of the column, mirroring the
                edge-to-edge bar visible in the mockup                 */}
            <div className="mt-2.5 lg:mt-3 pb-2.5 border-b border-[#F5F4F0]/12 w-full flex items-center justify-between gap-2">
              <span className="font-mono uppercase text-[#F5F4F0]/55 leading-none whitespace-nowrap"
                style={{ fontSize: "clamp(8px, 0.65vw, 10px)", letterSpacing: "0.22em" }}>
                {t("eyebrow")}
              </span>
              <span className="font-mono text-[#F5F4F0]/22 leading-none flex-shrink-0"
                style={{ fontSize: "clamp(8px, 0.65vw, 10px)" }}>
                {t("eyebrowDivider")}
              </span>
              <span className="font-mono uppercase text-[#F5F4F0]/55 leading-none whitespace-nowrap"
                style={{ fontSize: "clamp(8px, 0.65vw, 10px)", letterSpacing: "0.22em" }}>
                {t("eyebrowSecond")}
              </span>
            </div>

            {/* Manifesto body — fluid size, capped lines on small screens */}
            <p
              className="mt-4 lg:mt-5 font-n27 font-light leading-relaxed text-[#F5F4F0]/70 max-w-[440px]"
              style={{ fontSize: "clamp(0.8rem, 1.4vh, 1.05rem)" }}
            >
              {t("bodyText")}
            </p>

            {/* CTA */}
            <div className="mt-5 lg:mt-6">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2.5 font-mono uppercase tracking-widest border border-[#F5F4F0]/28 text-[#F5F4F0]/65 hover:border-[#F5F4F0]/55 hover:text-[#F5F4F0]/90 px-4 py-2.5 transition-colors duration-300"
                style={{ fontSize: "clamp(8px, 0.65vw, 10px)" }}
              >
                {t("viewProjects")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Ripple + flower visual ─────────────────────── */}
          {/* max-w capped by both vh and vw to prevent overflow at
              small desktop viewports (e.g. 1280×720)                 */}
          <div
            className="col-span-12 lg:col-span-6 xl:col-span-5 flex items-center justify-center mt-6 lg:mt-0"
          >
            <div
              className="w-full mx-auto"
              style={{ maxWidth: "min(38vh, 42vw, 520px)" }}
            >
              <HomeFlowerOrbit />
            </div>
          </div>

        </div>
      </Container>
    </section>
  )
}

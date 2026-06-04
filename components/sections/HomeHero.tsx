import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { Container } from "@/components/atoms/Container"
import { HomeFlowerOrbit } from "@/components/atoms/HomeFlowerOrbit"

export async function HomeHero() {
  const t = await getTranslations("Home")

  return (
    <section className="relative w-full min-h-[calc(100vh-93px)] flex items-center">
      <Container className="py-16 lg:py-0 w-full">
        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center">

          {/* ── LEFT: Title + eyebrow + manifesto + CTA ────────────── */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col">

            {/* Display title */}
            <h1 className="font-n27 font-bold uppercase leading-[0.9] tracking-tight text-[#F5F4F0]">
              <span className="block text-[clamp(4rem,10vw,9.5rem)]">
                {t("titleLine1")}
              </span>
              <span className="block text-[clamp(4rem,10vw,9.5rem)]">
                {t("titleLine2")}
              </span>
            </h1>

            {/* Mono eyebrow + hairline */}
            <div className="mt-3 lg:mt-4 pb-3 border-b border-[#F5F4F0]/12">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#F5F4F0]/55">
                {t("eyebrow")}
                <span className="mx-3 opacity-40">{t("eyebrowDivider")}</span>
                {t("eyebrowSecond")}
              </p>
            </div>

            {/* Manifesto body */}
            <p className="mt-6 lg:mt-8 font-n27 font-light text-base lg:text-lg leading-relaxed text-[#F5F4F0]/70 max-w-[480px]">
              {t("bodyText")}
            </p>

            {/* CTA */}
            <div className="mt-8 lg:mt-10">
              <Link
                href="/projects"
                className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest border border-[#F5F4F0]/28 text-[#F5F4F0]/65 hover:border-[#F5F4F0]/55 hover:text-[#F5F4F0]/90 px-5 py-3 transition-colors duration-300"
              >
                {t("viewProjects")}
                <span aria-hidden="true" className="text-[12px]">→</span>
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Orbital flower visual ──────────────────────── */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex items-center justify-center mt-8 lg:mt-0">
            <HomeFlowerOrbit />
          </div>

        </div>
      </Container>
    </section>
  )
}

import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import { Container } from "@/components/atoms/Container"
import { KanseiHexPattern } from "@/components/atoms/KanseiHexPattern"

interface AboutHeroProps {
  className?: string
}

export async function AboutHero({ className }: AboutHeroProps) {
  const t = await getTranslations("About")

  return (
    <section
      id="about-hero"
      className={cn("w-full lg:min-h-[calc(100vh-93px)] flex items-center", className)}
    >
      <Container className="py-12 lg:py-0 w-full">
        <div className="grid grid-cols-12 gap-6 lg:gap-10 items-center">

          {/* ── LEFT: bordered generative box ─────────────────────── */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-6">
            <KanseiHexPattern />
          </div>

          {/* ── RIGHT: headline + description + CTA ───────────────── */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-6 lg:pl-6 xl:pl-12 flex flex-col gap-8">

            {/* Display headline — intentionally hardcoded EN, not translated */}
            <h1 className="font-display font-normal leading-[0.92] tracking-[-0.025em] text-[#F5F4F0] text-[clamp(2.6rem,5.5vw,5.5rem)]">
              Where technology<br />
              becomes sensation.
            </h1>

            {/* Manifesto */}
            <p className="font-n27 font-light text-base lg:text-lg leading-relaxed text-[#F5F4F0]/65 max-w-[440px]">
              {t("description")}
            </p>

            {/* Text CTA — scrolls to #filosofia */}
            <div>
              <a
                href="#filosofia"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#F5F4F0]/55 hover:text-[#F5F4F0]/90 transition-colors duration-300"
              >
                <span>{t("philosophyCta")}</span>
                <span
                  aria-hidden="true"
                  className="text-sm leading-none transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  +
                </span>
              </a>
            </div>

          </div>

        </div>
      </Container>
    </section>
  )
}

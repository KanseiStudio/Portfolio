import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"
import { HomeFlowerOrbit } from "@/components/atoms/HomeFlowerOrbit"
import { LogoRipple } from "@/components/atoms/LogoRipple"

export async function HomeHero() {
  const t = await getTranslations("Home")

  return (
    <section className="relative w-full flex-1 min-h-0 flex items-center">
      <LogoRipple />

      <Container className="relative z-10 w-full py-6 lg:py-0 h-full flex items-center">
        <div className="w-full grid grid-cols-12 gap-4 lg:gap-6 items-center">

          {/* ── LEFT: ~40 % (5/12) ───────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-5 flex flex-col min-w-0">

            {/* w-fit so the eyebrow bar is exactly as wide as the title text */}
            <div className="lg:w-fit flex flex-col">

              {/* Display headline — Fraunces regular, matches reference */}
              <h1
                className="font-display uppercase leading-[0.92] tracking-[-0.015em] text-[#F5F4F0]"
                style={{ fontSize: "clamp(3.8rem, min(10.5vw, 16vh), 10.5rem)", fontWeight: 400 }}
              >
                <span className="block">{t("titleLine1")}</span>
                <span className="block">{t("titleLine2")}</span>
              </h1>

              {/* Eyebrow — mono, small, spans title width */}
              <div className="mt-2 pb-2 border-b border-[#F5F4F0]/12 w-full flex items-center justify-between gap-2">
                <span className="font-mono uppercase text-[#F5F4F0]/50 leading-none whitespace-nowrap"
                  style={{ fontSize: "9px", letterSpacing: "0.20em" }}>
                  {t("eyebrow")}
                </span>
                <span className="font-mono text-[#F5F4F0]/25 leading-none shrink-0"
                  style={{ fontSize: "9px" }}>
                  {t("eyebrowDivider")}
                </span>
                <span className="font-mono uppercase text-[#F5F4F0]/50 leading-none whitespace-nowrap"
                  style={{ fontSize: "9px", letterSpacing: "0.20em" }}>
                  {t("eyebrowSecond")}
                </span>
              </div>
            </div>

            {/* Body */}
            <p
              className="mt-5 lg:mt-6 font-n27 font-light leading-relaxed text-[#F5F4F0]/65 max-w-[420px]"
              style={{ fontSize: "clamp(0.8rem, 1.3vh, 0.94rem)" }}
            >
              {t("bodyText")}
            </p>

          </div>

          {/* ── RIGHT: ~60 % (7/12) ───────────────────────────────────── */}
          {/* w-full fills the column → aspect-square makes height=width.
              The orbit exceeds hero height; overflow is clipped by
              main's lg:overflow-hidden → orbit bleeds top/bottom
              exactly as in the reference.                             */}
          <div className="col-span-12 lg:col-span-7 flex items-center justify-center mt-8 lg:mt-0">
            <div className="w-full">
              <HomeFlowerOrbit />
            </div>
          </div>

        </div>
      </Container>
    </section>
  )
}

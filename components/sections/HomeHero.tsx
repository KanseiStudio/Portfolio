import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"
import { HomeFlowerOrbit } from "@/components/atoms/HomeFlowerOrbit"

export async function HomeHero() {
  const t = await getTranslations("Home")

  return (
    <section className="relative w-full flex-1 min-h-0 flex items-center overflow-hidden">
      <Container className="w-full py-6 lg:py-0 h-full flex items-center">

        <div className="w-full grid grid-cols-12 gap-4 lg:gap-6 items-center">

          {/* ── LEFT: Title + eyebrow + manifesto ────────────────── */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col min-w-0">

            {/* w-fit wrapper: makes the eyebrow bar span exactly
                the same width as the rendered title text ("KANSEI" /
                "STUDIO"). On mobile (< lg) it's full-width instead. */}
            <div className="lg:w-fit flex flex-col">

              {/* Display title */}
              <h1
                className="font-n27 font-bold uppercase leading-[0.88] tracking-[-0.02em] text-[#F5F4F0]"
                style={{ fontSize: "clamp(3.5rem, min(10vw, 13vh), 9.5rem)" }}
              >
                <span className="block">{t("titleLine1")}</span>
                <span className="block">{t("titleLine2")}</span>
              </h1>

              {/* Eyebrow — edge-to-edge under title via w-full + justify-between.
                  The parent's w-fit makes this div exactly as wide as the h1
                  text, so the two labels sit under the first and last glyph. */}
              <div className="mt-2 pb-2 border-b border-[#F5F4F0]/12 w-full flex items-center justify-between gap-3">
                <span
                  className="font-mono uppercase text-[#F5F4F0]/55 leading-none whitespace-nowrap"
                  style={{ fontSize: "clamp(7px, 0.62vw, 9.5px)", letterSpacing: "0.20em" }}
                >
                  {t("eyebrow")}
                </span>
                <span
                  className="font-mono text-[#F5F4F0]/22 leading-none shrink-0"
                  style={{ fontSize: "clamp(7px, 0.62vw, 9.5px)" }}
                >
                  {t("eyebrowDivider")}
                </span>
                <span
                  className="font-mono uppercase text-[#F5F4F0]/55 leading-none whitespace-nowrap"
                  style={{ fontSize: "clamp(7px, 0.62vw, 9.5px)", letterSpacing: "0.20em" }}
                >
                  {t("eyebrowSecond")}
                </span>
              </div>

            </div>{/* /w-fit */}

            {/* Manifesto body */}
            <p
              className="mt-4 lg:mt-5 font-n27 font-light leading-relaxed text-[#F5F4F0]/70 max-w-[440px]"
              style={{ fontSize: "clamp(0.8rem, 1.4vh, 1.05rem)" }}
            >
              {t("bodyText")}
            </p>

          </div>

          {/* ── RIGHT: Orbit + flower ─────────────────────────────── */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex items-center justify-center mt-6 lg:mt-0">
            <div className="w-full mx-auto" style={{ maxWidth: "min(38vh, 42vw, 520px)" }}>
              <HomeFlowerOrbit />
            </div>
          </div>

        </div>
      </Container>
    </section>
  )
}

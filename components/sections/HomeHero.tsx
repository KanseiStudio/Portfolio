import { getTranslations } from "next-intl/server"
import { HomeFlowerOrbit } from "@/components/atoms/HomeFlowerOrbit"
import { LogoRipple } from "@/components/atoms/LogoRipple"

export async function HomeHero() {
  const t = await getTranslations("Home")

  return (
    <section className="relative w-full flex-1 min-h-0 overflow-hidden">
      <LogoRipple />

      {/* ── Desktop (lg+) ───────────────────────────────────────────────── */}
      <div className="hidden lg:block absolute inset-0 z-10">

        {/* Text block: left 13vw, vertically ~52% above centre */}
        <div
          className="absolute top-1/2 -translate-y-[52%] flex flex-col"
          style={{ left: "13vw", width: "27vw" }}
        >
          <div className="flex flex-col">
            <h1
              className="font-n27 uppercase text-[#F5F4F0] leading-[0.92]"
              style={{
                fontWeight:    300,
                letterSpacing: "0.03em",
                fontSize:      "clamp(3rem, 10vw, 11rem)",
              }}
            >
              <span className="block">{t("titleLine1")}</span>
              <span className="block">{t("titleLine2")}</span>
            </h1>

            {/* Eyebrow — three blocks, justify-between, edge-to-edge */}
            <div
              className="mt-[6px] pb-[6px] border-b border-[#F5F4F0]/24 w-full
                          flex items-start justify-between"
            >
              <span
                className="font-mono uppercase text-[#F5F4F0]/50 leading-snug"
                style={{ fontSize: "clamp(14px, 1.4vw, 22px)", letterSpacing: "0.18em" }}
              >
                {t("eyebrow")}
              </span>
              <span
                className="font-mono text-[#F5F4F0]/22 leading-snug shrink-0 px-2"
                style={{ fontSize: "clamp(14px, 1.4vw, 22px)" }}
              >
                {t("eyebrowDivider")}
              </span>
              <span
                className="font-mono uppercase text-[#F5F4F0]/50 leading-snug text-right"
                style={{ fontSize: "clamp(14px, 1.4vw, 22px)", letterSpacing: "0.18em" }}
              >
                {t("eyebrowSecond")}
              </span>
            </div>
          </div>

          {/* Manifesto body */}
          <p
            className="mt-5 font-n27 font-light text-[#F5F4F0]/62"
            style={{
              fontSize:   "clamp(15px, 1.15vw, 19px)",
              lineHeight: 1.6,
            }}
          >
            {t("bodyText")}
          </p>
        </div>

        {/* Flower orbit: right half, capped at min(38vh, 32vw) to stay in viewport */}
        <div
          className="absolute top-0 bottom-0 flex items-center justify-center"
          style={{ left: "43vw", right: 0 }}
        >
          <div style={{ width: "min(70vh, 56vw)", height: "min(70vh, 56vw)" }}>
            <HomeFlowerOrbit />
          </div>
        </div>
      </div>

      {/* ── Mobile (below lg) ───────────────────────────────────────────── */}
      <div className="lg:hidden relative z-10 w-full h-full flex flex-col
                      justify-center gap-8 px-6 py-8">
        <div className="flex flex-col">
          <h1
            className="font-n27 uppercase text-[#F5F4F0] leading-[0.92]"
            style={{ fontWeight: 300, letterSpacing: "0.03em", fontSize: "clamp(3rem, 15vw, 5rem)" }}
          >
            <span className="block">{t("titleLine1")}</span>
            <span className="block">{t("titleLine2")}</span>
          </h1>
          <div className="mt-[6px] pb-[6px] border-b border-[#F5F4F0]/24 w-full
                          flex items-start justify-between">
            <span
              className="font-mono uppercase text-[#F5F4F0]/50 leading-snug"
              style={{ fontSize: "11px", letterSpacing: "0.18em" }}
            >
              {t("eyebrow")}
            </span>
            <span
              className="font-mono text-[#F5F4F0]/22 leading-snug shrink-0 px-1"
              style={{ fontSize: "11px" }}
            >
              {t("eyebrowDivider")}
            </span>
            <span
              className="font-mono uppercase text-[#F5F4F0]/50 leading-snug text-right"
              style={{ fontSize: "11px", letterSpacing: "0.18em" }}
            >
              {t("eyebrowSecond")}
            </span>
          </div>
          <p
            className="mt-5 font-n27 font-light text-[#F5F4F0]/62"
            style={{ fontSize: "0.9rem", lineHeight: 1.6 }}
          >
            {t("bodyText")}
          </p>
        </div>
        <HomeFlowerOrbit />
      </div>
    </section>
  )
}

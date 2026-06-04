import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { HomeHero } from "@/components/sections/HomeHero"
import { HomeServices } from "@/components/sections/HomeServices"
import { HomeRippleOverlay } from "@/components/atoms/HomeRippleOverlay"

type Params = Promise<{ locale: string }>

const SITE_TITLE = "Kansei Studio — Where technology becomes sensation"
const SITE_NAME  = "Kansei Studio"

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Home" })
  const description = t("metaDescription")
  const ogLocale = locale === "it" ? "it_IT" : "en_US"

  return {
    title: SITE_TITLE,
    description,
    openGraph: {
      title: SITE_TITLE,
      description,
      siteName: SITE_NAME,
      type: "website",
      locale: ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description,
    },
  }
}

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    /* Desktop (lg+): lock the entire Home inside the viewport.
       calc(100dvh - 93px) = 100dvh minus header(53px) + ticker(40px).
       flex-col: hero takes flex-1 (remaining height), services shrink-0.
       overflow-hidden prevents any accidental scroll.
       Mobile: natural document flow, no height constraint.             */
    <>
      {/* Ripple rings behind everything — fixed, z-5 */}
      <HomeRippleOverlay />
      {/* Content above ripple — relative z-10 creates stacking context
          so InstrumentFrame fixed elements (z-30/50) remain on top  */}
      <main
        className="relative lg:h-[calc(100dvh-93px)] lg:flex lg:flex-col lg:overflow-hidden"
        style={{ zIndex: 10 }}
      >
        <HomeHero />
        <HomeServices />
      </main>
    </>
  )
}

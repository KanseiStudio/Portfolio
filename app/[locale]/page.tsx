import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { HomeHero } from "@/components/sections/HomeHero"
import { HomeServices } from "@/components/sections/HomeServices"

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
    <main>
      <HomeHero />
      <HomeServices />
    </main>
  )
}

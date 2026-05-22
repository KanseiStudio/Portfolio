import { setRequestLocale, getTranslations } from "next-intl/server"
import { TopNav } from "@/components/molecules/TopNav"
import { ScrollIndicator } from "@/components/molecules/ScrollIndicator"
import { HomeHero } from "@/components/sections/HomeHero"
import { HomeTelemetry } from "@/components/sections/HomeTelemetry"
import { ServicesGrid } from "@/components/sections/ServicesGrid"

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("Home")

  return (
    <>
      <TopNav />
      <ScrollIndicator total={4} current={1} />
      <main>
        <div className="relative">
          <HomeHero
            title={t("title")}
            tagline={t("tagline")}
            description={t("description")}
            visualSrc="/visuals/tree-home.png"
            visualAlt="Kansei Studio generative tree visualization"
          />
          <HomeTelemetry />
        </div>
        <ServicesGrid />
      </main>
    </>
  )
}

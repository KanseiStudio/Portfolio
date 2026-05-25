import { setRequestLocale } from "next-intl/server"
import { TopNav } from "@/components/molecules/TopNav"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { HomeHero } from "@/components/sections/HomeHero"
import { HomeServices } from "@/components/sections/HomeServices"
import { HomeTelemetry } from "@/components/sections/HomeTelemetry"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main>
      <TopNav />
      <HairlineDivider />

      <HomeHero />
      <HomeServices />

      {/* Overlay fisso al viewport — segue lo scroll */}
      <HomeTelemetry />
    </main>
  )
}

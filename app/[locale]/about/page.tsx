import { setRequestLocale } from "next-intl/server"
import { AboutHero } from "@/components/sections/AboutHero"
import { PhilosophySection } from "@/components/sections/PhilosophySection"
import { CompetenceGrid } from "@/components/sections/CompetenceGrid"

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main>
      <AboutHero />
      <PhilosophySection />
      <CompetenceGrid />
    </main>
  )
}

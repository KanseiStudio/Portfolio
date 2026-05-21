import { setRequestLocale } from "next-intl/server"
import { TopNav } from "@/components/molecules/TopNav"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AboutHero } from "@/components/sections/AboutHero"
import { CompetenceGrid } from "@/components/sections/CompetenceGrid"

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <TopNav />
      <main>
        <HairlineDivider className="my-0" />
        <AboutHero />
        <CompetenceGrid />
      </main>
    </>
  )
}

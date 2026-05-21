import { getTranslations, setRequestLocale } from "next-intl/server"
import { TopNav } from "@/components/molecules/TopNav"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { ContactHero } from "@/components/sections/ContactHero"
import { ContactChannels } from "@/components/sections/ContactChannels"

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Contact")

  return (
    <>
      <TopNav />
      <main>
        <HairlineDivider className="my-0" />

        <ContactHero />

        <HairlineDivider className="my-0" />

        <ContactChannels />
      </main>
    </>
  )
}

export function generateStaticParams() {
  return [{ locale: "it" }, { locale: "en" }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Contact" })

  return {
    title: `${t("sectionLabel")} · Kansei Studio`,
    description: t("heroDescription"),
  }
}

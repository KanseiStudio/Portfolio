import { getTranslations, setRequestLocale } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import { ContactHero } from "@/components/sections/ContactHero"
import { ContactChannels } from "@/components/sections/ContactChannels"

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [info, channels] = await Promise.all([
    prisma.contactInfo.findFirst({
      include: { translations: { where: { locale } } },
    }),
    prisma.contactChannel.findMany({
      where: { enabled: true },
      include: { translations: { where: { locale } } },
      orderBy: { sortOrder: "asc" },
    }),
  ])

  const tr = info?.translations[0]

  return (
    <main>
      <ContactHero
        studioName={info?.studioName ?? "Kansei Studio"}
        email={info?.email ?? ""}
        location={tr?.location ?? ""}
        availability={tr?.availability ?? ""}
        focus={tr?.focus ?? ""}
      />

      <ContactChannels
        channels={channels.map((c) => ({
          id: c.id,
          iconName: c.iconName,
          handle: c.handle,
          url: c.url,
          label: c.translations[0]?.label ?? c.platform,
        }))}
      />
    </main>
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

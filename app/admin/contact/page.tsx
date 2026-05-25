import { prisma } from "@/lib/prisma"
import { Container } from "@/components/atoms/Container"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { ContactInfoForm } from "@/app/admin/_components/ContactInfoForm"
import { ContactChannelsManager } from "@/app/admin/_components/ContactChannelsManager"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"

export const metadata = {
  title: "Gestione contatti · Admin",
  robots: { index: false },
}

export default async function AdminContactPage() {
  const [info, channels] = await Promise.all([
    prisma.contactInfo.findFirst({ include: { translations: true } }),
    prisma.contactChannel.findMany({
      include: { translations: true },
      orderBy: { sortOrder: "asc" },
    }),
  ])

  const itTr = info?.translations.find((t) => t.locale === "it")
  const enTr = info?.translations.find((t) => t.locale === "en")

  const initialInfo = {
    studioName: info?.studioName ?? "Kansei Studio",
    email: info?.email ?? "",
    translations: {
      it: {
        location: itTr?.location ?? "",
        availability: itTr?.availability ?? "",
        focus: itTr?.focus ?? "",
      },
      en: {
        location: enTr?.location ?? "",
        availability: enTr?.availability ?? "",
        focus: enTr?.focus ?? "",
      },
    },
  }

  const shapedChannels = channels.map((c) => ({
    id: c.id,
    platform: c.platform,
    iconName: c.iconName,
    handle: c.handle,
    url: c.url,
    enabled: c.enabled,
    sortOrder: c.sortOrder,
    labels: {
      it: c.translations.find((t) => t.locale === "it")?.label ?? "",
      en: c.translations.find((t) => t.locale === "en")?.label ?? "",
    },
  }))

  return (
    <main>
      <AdminHeader active="contact" />
      <Container className="py-16">
        <div className="mb-12">
          <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">
            Contatti
          </p>
          <h1 className="mt-4 font-display text-4xl lg:text-5xl">
            Gestione contatti
          </h1>
          <p className="mt-4 text-small opacity-70 max-w-md">
            Modifica le informazioni dello studio e i canali di contatto
            mostrati sulla pagina pubblica /contact.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="font-display text-2xl mb-8">Informazioni studio</h2>
          <ContactInfoForm initialData={initialInfo} />
        </section>

        <HairlineDivider />

        <section className="mt-16">
          <h2 className="font-display text-2xl mb-8">Canali di contatto</h2>
          <ContactChannelsManager channels={shapedChannels} />
        </section>
      </Container>
    </main>
  )
}

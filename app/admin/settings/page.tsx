import { getSiteSettings } from "@/lib/site-settings"
import { Container } from "@/components/atoms/Container"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { SiteSettingsForm } from "@/app/admin/_components/SiteSettingsForm"

export const metadata = {
  title: "Impostazioni sito · Admin",
  robots: { index: false },
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <main>
      <AdminHeader active="settings" />
      <Container className="py-16">
        <div className="mb-12">
          <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">
            Impostazioni
          </p>
          <h1 className="mt-4 font-display text-4xl lg:text-5xl">
            Audio / Impostazioni sito
          </h1>
          <p className="mt-4 text-small opacity-70 max-w-md">
            Configura la musica ambientale opzionale che i visitatori possono attivare dal frame del sito.
          </p>
        </div>

        <section className="max-w-2xl">
          <h2 className="font-display text-2xl mb-8">Musica di sottofondo</h2>
          <SiteSettingsForm
            initialData={{
              musicUrl:     settings?.musicUrl ?? null,
              musicEnabled: settings?.musicEnabled ?? false,
            }}
          />
        </section>
      </Container>
    </main>
  )
}

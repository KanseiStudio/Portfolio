import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

const RADIO_URL = "https://radio.kansei-studio.art"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Radio" })
  return { title: t("metaTitle"), description: t("metaDescription") }
}

/**
 * Pagina RADIO: il player completo di Kansei Radio (visual audio-reattivi)
 * pubblicato su radio.kansei-studio.art, incorporato a tutta pagina sotto
 * l'header del sito. La musica di sottofondo (SND) è disattivata qui
 * (vedi InstrumentFrame) per non sovrapporsi alla radio.
 */
export default async function RadioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Radio")

  return (
    <main className="h-[calc(100dvh-53px)] md:h-[calc(100dvh-93px)] w-full bg-[#0A0A0A]">
      <iframe
        src={RADIO_URL}
        title={t("iframeTitle")}
        allow="autoplay; fullscreen"
        className="block h-full w-full border-0"
      />
    </main>
  )
}

import { setRequestLocale, getMessages } from "next-intl/server"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { InstrumentFrame } from "@/components/chrome/InstrumentFrame"
import { getSiteSettings } from "@/lib/site-settings"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const [messages, settings] = await Promise.all([getMessages(), getSiteSettings()])

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <InstrumentFrame
        musicUrl={settings?.musicUrl ?? null}
        musicEnabled={settings?.musicEnabled ?? false}
      >
        {children}
      </InstrumentFrame>
    </NextIntlClientProvider>
  )
}

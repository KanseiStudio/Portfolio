import "./globals.css"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { fraunces, geistSans, geistMono } from "@/lib/fonts"

export const metadata: Metadata = {
  title: "Kansei Studio",
  description:
    "We design sensory systems and interactive installations that connect technology and human emotion.",
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-ks-bg text-ks-fg font-body">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

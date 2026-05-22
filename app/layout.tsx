import "./globals.css"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { fraunces, geistSans, geistMono } from "@/lib/fonts"

export const metadata: Metadata = {
  title: "Kansei Studio",
  description:
    "We design sensory systems and interactive installations that connect technology and human emotion.",
}

// Root layout is kept alive across soft navigations — no NextIntlClientProvider here.
// Provider lives in app/[locale]/layout.tsx so it re-renders on locale changes.
export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-ks-bg text-ks-fg font-body">
        {children}
      </body>
    </html>
  )
}

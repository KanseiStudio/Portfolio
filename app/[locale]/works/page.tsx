import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getPublishedWorks, type WorkLocale } from "@/lib/works"
import { ws } from "@/components/works/ui"
import { WorkCard, WorksClosing, WorksIndexTable, WorksPageHead } from "@/components/works/WorksIndex"

type Params = Promise<{ locale: string }>

export function generateStaticParams() {
  return [{ locale: "it" }, { locale: "en" }]
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Works" })
  const works = await getPublishedWorks(locale as WorkLocale)
  return {
    title: t("metaTitle"),
    description: t("description"),
    openGraph: {
      title: t("metaTitle"),
      description: t("description"),
      images: works[0] ? [{ url: works[0].hero.image, alt: works[0].hero.alt }] : undefined,
    },
  }
}

export default async function WorksIndexPage({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const works = await getPublishedWorks(locale as WorkLocale)

  return (
    <main className={ws.container}>
      <WorksPageHead count={works.length} />
      {works.length > 0 && (
        <>
          <WorksIndexTable works={works} />
          {works.map((w, i) => (
            <WorkCard key={w.slug} work={w} index={i} />
          ))}
        </>
      )}
      <WorksClosing />
    </main>
  )
}

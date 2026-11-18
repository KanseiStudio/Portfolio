import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getAdminSession } from "@/lib/session"
import { getPublishedWorkSlugs, getWorkBySlug, type WorkLocale } from "@/lib/works"
import { ws } from "@/components/works/ui"
import { WorkSections } from "@/components/works/WorkSections"
import { WorkBreadcrumb, WorkHero, WorkNext, WorkStats } from "@/components/works/WorkDetail"
import { ArtifactEmbed } from "@/components/works/ArtifactEmbed"
import { cn } from "@/lib/utils"

type Params = Promise<{ locale: string; slug: string }>
type SearchParams = Promise<{ preview?: string | string[] }>

// Lavori creati dopo la build vengono renderizzati on-demand
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPublishedWorkSlugs()
  return slugs.flatMap((slug) => [
    { locale: "it", slug },
    { locale: "en", slug },
  ])
}

/** Anteprima bozze: `?preview=1` vale solo con una sessione admin valida */
async function isPreview(searchParams: SearchParams) {
  const { preview } = await searchParams
  if (preview !== "1") return false
  try {
    return Boolean((await getAdminSession()).isAdmin)
  } catch {
    return false
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}): Promise<Metadata> {
  const { locale, slug } = await params
  const preview = await isPreview(searchParams)
  const work = await getWorkBySlug(slug, locale as WorkLocale, { preview })
  if (!work) return {}
  const t = await getTranslations({ locale, namespace: "Works" })
  const title = `${work.name} · ${t("metaTitle")}`
  return {
    title,
    description: work.tagline,
    openGraph: { title, description: work.tagline, images: [{ url: work.hero.image, alt: work.hero.alt }] },
    ...(!work.published && { robots: { index: false, follow: false } }),
  }
}

export default async function WorkPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const preview = await isPreview(searchParams)
  const work = await getWorkBySlug(slug, locale as WorkLocale, { preview })
  if (!work) notFound()

  const t = await getTranslations("Works")

  return (
    <main className={ws.container}>
      {!work.published && (
        <div
          role="status"
          className="fixed top-[63px] left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-2 px-3 py-1.5 border border-[#F5F4F0]/40 bg-[#0A0A0A]/90 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F5F4F0]"
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-[#F5F4F0]" />
          {t("draftBadge")}
        </div>
      )}
      <WorkBreadcrumb work={work} />
      <WorkHero work={work} />
      <WorkStats work={work} />
      {/* Esplora: artefatti interattivi pubblicati, subito dopo hero e stats. Solo se ce ne sono. */}
      {work.artifacts.length > 0 && (
        <section
          aria-labelledby="explore-heading"
          // Sotto 768px almeno 15vh liberi dopo l'ultima didascalia: il canvas degli artefatti
          // (es. KBox, touch-action: none) intercetta il dito, serve una zona per continuare a scorrere
          className={cn(
            "flex flex-col gap-10 py-14 md:py-[72px] max-md:pb-[max(15vh,3.5rem)]",
            work.stats.length === 0 && `border-t ${ws.hairline}`,
          )}
          data-testid="works-explore"
        >
          <h2 id="explore-heading" className={ws.lbl}>
            {t("exploreLabel")}
          </h2>
          {work.artifacts.map((a) => (
            <ArtifactEmbed key={a.id} artifact={a} />
          ))}
        </section>
      )}
      <WorkSections
        sections={work.sections}
        scrollLabel={t("scrollHint")}
        borderFirst={work.stats.length === 0 || work.artifacts.length > 0}
      />
      <WorkNext work={work} />
    </main>
  )
}

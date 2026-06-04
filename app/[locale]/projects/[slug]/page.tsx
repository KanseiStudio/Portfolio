import { notFound } from "next/navigation"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { ProjectDetailHeader } from "@/components/sections/ProjectDetailHeader"
import { ProjectProblemSolution } from "@/components/sections/ProjectProblemSolution"
import { ProjectKpiStrip } from "@/components/sections/ProjectKpiStrip"
import { ProjectBackLink } from "@/components/molecules/ProjectBackLink"
import { prisma } from "@/lib/prisma"
import { youTubeThumbnail } from "@/lib/youtube"

type Params = Promise<{ locale: string; slug: string }>

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations("Projects")

  const project = await prisma.project.findUnique({
    where: { slug, published: true },
    include: {
      translations: { where: { locale } },
      categories: {
        include: {
          category: {
            include: { translations: { where: { locale } } },
          },
        },
      },
      kpis: {
        include: { translations: { where: { locale } } },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  if (!project || project.translations.length === 0) {
    notFound()
  }

  const tr = project.translations[0]

  const headerData = {
    title: tr.title,
    tagline: tr.tagline ?? null,
    client: project.client,
    year: project.year,
    format: project.format,
    environment: project.environment,
    technologies: project.technologies,
    notes: project.notes ?? null,
    videoUrl: project.videoUrl ?? null,
    posterUrl: project.posterUrl ?? youTubeThumbnail(project.videoUrl ?? null, "maxres"),
  }

  const hasProblemOrSolution = Boolean(tr.problem || tr.solution)
  const hasKpis = project.kpis.length > 0

  const shapedKpis = project.kpis.map((k) => ({
    id: k.id,
    icon: k.icon,
    value: k.value,
    label: k.translations[0]?.label ?? "",
  }))

  return (
    <>
      <main>
        <ProjectDetailHeader data={headerData} />

        {hasProblemOrSolution && (
          <>
            <HairlineDivider className="my-0" />
            <ProjectProblemSolution problem={tr.problem ?? null} solution={tr.solution ?? null} />
          </>
        )}

        {hasKpis && (
          <>
            <HairlineDivider className="my-0" />
            <ProjectKpiStrip kpis={shapedKpis} />
          </>
        )}

        <HairlineDivider className="my-0" />
        <ProjectBackLink />
      </main>
    </>
  )
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  })

  return projects.flatMap((p) => [
    { locale: "it", slug: p.slug },
    { locale: "en", slug: p.slug },
  ])
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, slug } = await params

  const project = await prisma.project.findUnique({
    where: { slug, published: true },
    include: { translations: { where: { locale } } },
  })

  if (!project || project.translations.length === 0) return {}

  const tr = project.translations[0]
  return {
    title: `${tr.title} · Kansei Studio`,
    description: tr.description,
  }
}

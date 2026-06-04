import { setRequestLocale, getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"
import { ProjectsArchive } from "@/components/sections/ProjectsArchive"
import { prisma } from "@/lib/prisma"
import { youTubeThumbnail } from "@/lib/youtube"

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Projects")

  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      include: {
        translations: { where: { locale } },
        categories: {
          include: {
            category: {
              include: {
                translations: { where: { locale } },
              },
            },
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({
      include: {
        translations: { where: { locale } },
      },
      orderBy: { sortOrder: "asc" },
    }),
  ])

  // Only show categories that have at least one published project
  const usedCategoryIds = new Set(
    projects.flatMap((p) => p.categories.map((pc) => pc.categoryId))
  )
  const visibleCategories = categories.filter((c) => usedCategoryIds.has(c.id))

  const shapedProjects = projects.map((p) => {
    const tr = p.translations[0]
    const computedPoster =
      p.posterUrl ?? youTubeThumbnail(p.videoUrl, "maxres") ?? null
    return {
      id: p.id,
      slug: p.slug,
      year: p.year,
      title: tr?.title ?? p.client,
      description: tr?.description ?? "",
      tagline: tr?.tagline ?? null,
      posterUrl: computedPoster,
      videoUrl: p.videoUrl,
      technologies: p.technologies,
      categoryIds: p.categories.map((pc) => pc.categoryId),
      categoryNames: p.categories
        .map((pc) => pc.category.translations[0]?.name ?? pc.category.slug)
        .filter(Boolean),
    }
  })

  const shapedCategories = visibleCategories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.translations[0]?.name ?? c.slug,
  }))

  return (
    <main>
      {/* ── Page header ─────────────────────────────────────────── */}
      <Container as="section" className="pt-16 lg:pt-24 pb-12 lg:pb-16">
        <div className="flex flex-col gap-5 max-w-2xl">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F4F0]/35">
            {t("archive")}
          </p>
          <h1 className="font-display font-normal leading-[0.92] tracking-[-0.025em] text-[#F5F4F0] text-[clamp(2.8rem,6vw,5.5rem)]">
            {t("title")}
          </h1>
          <p className="font-n27 font-light text-base lg:text-lg leading-relaxed text-[#F5F4F0]/55 max-w-xl">
            {t("description")}
          </p>
        </div>
      </Container>

      <ProjectsArchive
        projects={shapedProjects}
        categories={shapedCategories}
      />
    </main>
  )
}

export function generateStaticParams() {
  return [{ locale: "it" }, { locale: "en" }]
}

import { setRequestLocale, getTranslations } from "next-intl/server"
import { TopNav } from "@/components/molecules/TopNav"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
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
    <>
      <TopNav />
      <main>
        <HairlineDivider className="my-0" />

        {/* Archive header */}
        <Container as="section" className="pt-16 lg:pt-24 pb-12 lg:pb-16">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="text-eyebrow font-body uppercase tracking-widest text-ks-fg opacity-60">
                {t("archive")}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9">
              <h1 className="font-display text-ks-h1 leading-[0.95] tracking-tight text-ks-fg">
                {t("title")}
              </h1>
              <p className="mt-8 text-base font-body leading-relaxed text-ks-fg opacity-90 max-w-xl">
                {t("description")}
              </p>
            </div>
          </div>
        </Container>

        <HairlineDivider className="my-0" />

        <ProjectsArchive
          projects={shapedProjects}
          categories={shapedCategories}
        />
      </main>
    </>
  )
}

export function generateStaticParams() {
  return [{ locale: "it" }, { locale: "en" }]
}

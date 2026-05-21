import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { ProjectForm } from "@/app/admin/_components/ProjectForm"
import type { ProjectFormValues } from "@/lib/validations/project"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminProjectEditPage({ params }: Props) {
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) notFound()

  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        translations: true,
        categories: true,
        kpis: { include: { translations: true }, orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { translations: { where: { locale: "it" } } },
    }),
  ])

  if (!project) notFound()

  const itTrans = project.translations.find((t) => t.locale === "it")
  const enTrans = project.translations.find((t) => t.locale === "en")

  const initialValues: Partial<ProjectFormValues> = {
    slug: project.slug,
    year: project.year,
    client: project.client,
    format: project.format,
    environment: project.environment,
    technologies: project.technologies,
    notes: project.notes ?? "",
    videoUrl: project.videoUrl ?? "",
    posterUrl: project.posterUrl ?? "",
    coverUrl: project.coverUrl ?? "",
    published: project.published,
    sortOrder: project.sortOrder,
    categoryIds: project.categories.map((pc) => pc.categoryId),
    translations: [
      {
        locale: "it",
        title: itTrans?.title ?? "",
        tagline: itTrans?.tagline ?? "",
        description: itTrans?.description ?? "",
        problem: itTrans?.problem ?? "",
        solution: itTrans?.solution ?? "",
      },
      {
        locale: "en",
        title: enTrans?.title ?? "",
        tagline: enTrans?.tagline ?? "",
        description: enTrans?.description ?? "",
        problem: enTrans?.problem ?? "",
        solution: enTrans?.solution ?? "",
      },
    ],
    kpis: project.kpis.map((kpi) => ({
      icon: kpi.icon,
      value: kpi.value,
      sortOrder: kpi.sortOrder,
      labelIt: kpi.translations.find((t) => t.locale === "it")?.label ?? "",
      labelEn: kpi.translations.find((t) => t.locale === "en")?.label ?? "",
    })),
  }

  const catOptions = categories.map((c) => ({
    id: c.id,
    nameIt: c.translations[0]?.name ?? c.slug,
  }))

  return (
    <main>
      <AdminHeader active="projects" />

      <Container className="py-12 lg:py-16">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-small font-medium opacity-60 hover:opacity-100 hover:underline underline-offset-4 transition-opacity mb-10"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Torna ai progetti
        </Link>

        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">Admin</p>
        <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-tight mb-2">
          {itTrans?.title ?? project.client}
        </h1>
        <p className="font-mono text-eyebrow opacity-40 mb-10">{project.slug}</p>

        <HairlineDivider />

        <div className="mt-10">
          <ProjectForm
            initialValues={initialValues}
            projectId={id}
            categories={catOptions}
          />
        </div>
      </Container>
    </main>
  )
}

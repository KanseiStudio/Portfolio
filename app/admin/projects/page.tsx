import Link from "next/link"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { ProjectsTable } from "@/app/admin/_components/ProjectsTable"

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    include: {
      translations: { where: { locale: "it" } },
      categories: { include: { category: { include: { translations: { where: { locale: "it" } } } } } },
    },
  })

  const rows = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    client: p.client,
    year: p.year,
    published: p.published,
    title: p.translations[0]?.title ?? p.client,
    categories: p.categories.map((pc) => pc.category.translations[0]?.name ?? pc.category.slug),
    updatedAt: p.updatedAt,
  }))

  return (
    <main>
      <AdminHeader active="projects" />

      <Container className="py-12 lg:py-16">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">Admin</p>
            <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-tight">
              Progetti
            </h1>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-ks-fg text-ks-bg text-small font-medium hover:bg-ks-fg/90 transition-colors mt-1"
          >
            <Plus size={14} strokeWidth={1.5} />
            Nuovo progetto
          </Link>
        </div>

        <HairlineDivider />

        <ProjectsTable projects={rows} />
      </Container>
    </main>
  )
}

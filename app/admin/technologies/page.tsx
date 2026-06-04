import Link from "next/link"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { TechnologiesTable } from "@/app/admin/_components/TechnologiesTable"

export default async function AdminTechnologiesPage() {
  const technologies = await prisma.technology.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  })

  const rows = technologies.map((t) => ({
    id:        t.id,
    slug:      t.slug,
    name:      t.name,
    published: t.published,
    mainImage: t.mainImage,
    updatedAt: t.updatedAt,
  }))

  return (
    <main>
      <AdminHeader active="technologies" />

      <Container className="py-12 lg:py-16">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">Admin</p>
            <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-tight">
              Tecnologie
            </h1>
          </div>
          <Link
            href="/admin/technologies/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-ks-fg text-ks-bg text-small font-medium hover:bg-ks-fg/90 transition-colors mt-1"
          >
            <Plus size={14} strokeWidth={1.5} />
            Nuova tecnologia
          </Link>
        </div>

        <HairlineDivider />

        <TechnologiesTable technologies={rows} />
      </Container>
    </main>
  )
}

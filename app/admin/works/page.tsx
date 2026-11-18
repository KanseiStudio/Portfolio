import Link from "next/link"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { WorksTable } from "@/app/admin/_components/works/WorksTable"

export const dynamic = "force-dynamic"

export default async function AdminWorksPage() {
  const works = await prisma.work.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true, slug: true, name: true, typeIt: true, published: true, updatedAt: true },
  })

  const fmt = new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Rome",
  })
  const rows = works.map((w) => ({
    id: w.id,
    slug: w.slug,
    name: w.name,
    type: w.typeIt,
    published: w.published,
    updatedAt: fmt.format(w.updatedAt),
  }))

  return (
    <main>
      <AdminHeader active="works" />
      <Container className="py-12 lg:py-16">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">Admin</p>
            <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-tight">Works</h1>
          </div>
          <Link
            href="/admin/works/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-ks-fg text-ks-bg text-small font-medium hover:bg-ks-fg/90 transition-colors mt-1"
          >
            <Plus size={14} strokeWidth={1.5} />
            Nuovo lavoro
          </Link>
        </div>
        <HairlineDivider />
        <WorksTable works={rows} />
      </Container>
    </main>
  )
}

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { ProjectForm } from "@/app/admin/_components/ProjectForm"

export default async function AdminProjectNewPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: { where: { locale: "it" } } },
  })

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
        <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-tight mb-10">
          Nuovo progetto
        </h1>

        <HairlineDivider />

        <div className="mt-10">
          <ProjectForm categories={catOptions} />
        </div>
      </Container>
    </main>
  )
}

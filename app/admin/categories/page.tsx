import { prisma } from "@/lib/prisma"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { CategoriesManager } from "@/app/admin/_components/CategoriesManager"

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      translations: true,
      projects: true,
    },
  })

  const rows = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    sortOrder: c.sortOrder,
    nameIt: c.translations.find((t) => t.locale === "it")?.name ?? c.slug,
    nameEn: c.translations.find((t) => t.locale === "en")?.name ?? c.slug,
    projectCount: c.projects.length,
  }))

  return (
    <main>
      <AdminHeader active="categories" />

      <Container className="py-12 lg:py-16">
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">Admin</p>
        <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-tight mb-10">
          Categorie
        </h1>

        <HairlineDivider />

        <div className="mt-10">
          <CategoriesManager categories={rows} />
        </div>
      </Container>
    </main>
  )
}

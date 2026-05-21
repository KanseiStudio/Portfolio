import { setRequestLocale } from "next-intl/server"
import { prisma } from "@/lib/prisma"

export default async function DbTestPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const categories = await prisma.category.findMany({
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  })

  const projects = await prisma.project.findMany({
    include: {
      translations: true,
      categories: { include: { category: true } },
    },
  })

  return (
    <main className="p-12 space-y-12 font-mono text-sm">
      <section>
        <h2 className="text-2xl font-bold mb-6">Database smoke test</h2>
        <p className="opacity-70">Categories: {categories.length} · Projects: {projects.length}</p>
      </section>
      <section>
        <h3 className="text-xl font-bold mb-4">Categories</h3>
        <pre className="text-xs leading-loose">{JSON.stringify(categories, null, 2)}</pre>
      </section>
      <section>
        <h3 className="text-xl font-bold mb-4">Projects</h3>
        <pre className="text-xs leading-loose">{JSON.stringify(projects, null, 2)}</pre>
      </section>
    </main>
  )
}

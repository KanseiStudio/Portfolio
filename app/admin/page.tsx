import Link from "next/link"
import { FolderOpen, Tags, TrendingUp, LogOut, Globe, Zap } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { logoutAction } from "@/app/admin/_actions/auth"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"

export default async function AdminDashboardPage() {
  const [totalProjects, publishedProjects, totalCategories, totalTechnologies, latestProjects] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.category.count(),
      prisma.technology.count(),
      prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { translations: { where: { locale: "it" } } },
      }),
    ])

  return (
    <main>
      {/* Admin header */}
      <header className="border-b border-ks-hairline-active">
        <Container className="py-5 flex items-center justify-between">
          <span className="text-eyebrow font-mono uppercase tracking-widest opacity-60">
            Kansei Studio · Admin
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-small font-medium hover:underline underline-offset-4"
            >
              <Globe size={14} strokeWidth={1.5} />
              <span>Vai al sito</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-small font-medium hover:underline underline-offset-4"
              >
                <LogOut size={14} strokeWidth={1.5} />
                <span>Logout</span>
              </button>
            </form>
          </nav>
        </Container>
      </header>

      {/* Dashboard content */}
      <Container className="py-16 lg:py-24">
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">
          Dashboard
        </p>
        <h1 className="mt-4 font-display text-5xl lg:text-6xl leading-tight">
          Benvenuto.
        </h1>
        <p className="mt-6 text-base font-body opacity-80 max-w-md">
          Da qui puoi gestire progetti, categorie e tecnologie del sito.
        </p>

        {/* Stats grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={FolderOpen} label="Progetti totali" value={String(totalProjects)} />
          <StatCard
            icon={TrendingUp}
            label="Progetti pubblicati"
            value={`${publishedProjects} / ${totalProjects}`}
          />
          <StatCard icon={Tags} label="Categorie" value={String(totalCategories)} />
          <StatCard icon={Zap} label="Tecnologie" value={String(totalTechnologies)} />
        </div>

        <HairlineDivider />

        {/* Quick actions */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            title="Gestisci progetti"
            description="Crea, modifica ed elimina i case study"
            href="/admin/projects"
          />
          <ActionCard
            title="Gestisci categorie"
            description="Aggiungi nuove categorie e modifica le esistenti"
            href="/admin/categories"
          />
          <ActionCard
            title="Gestisci contatti"
            description="Modifica email, social e informazioni dello studio"
            href="/admin/contact"
          />
          <ActionCard
            title="Gestisci tecnologie"
            description="Aggiungi e aggiorna i software e sistemi con immagini e descrizioni"
            href="/admin/technologies"
          />
        </div>

        <HairlineDivider />

        {/* Latest projects */}
        <div className="mt-16">
          <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-8">
            Ultimi progetti modificati
          </p>

          {latestProjects.length === 0 ? (
            <p className="text-base opacity-60">
              Nessun progetto ancora. Inizia creandone uno nuovo.
            </p>
          ) : (
            <ul className="divide-y divide-ks-hairline-active border border-ks-hairline-active">
              {latestProjects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="flex items-center justify-between p-4 hover:bg-ks-fg/5 transition-colors duration-300"
                  >
                    <div>
                      <p className="font-medium text-small">
                        {p.translations[0]?.title ?? p.client}
                      </p>
                      <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mt-1">
                        {p.slug} · {p.published ? "Pubblicato" : "Bozza"}
                      </p>
                    </div>
                    <span className="text-small opacity-50">
                      {p.updatedAt.toLocaleDateString("it-IT")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </main>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FolderOpen
  label: string
  value: string
}) {
  return (
    <div className="border border-ks-hairline-active p-6">
      <Icon size={20} strokeWidth={1.5} className="opacity-70" />
      <p className="mt-6 font-mono text-3xl">{value}</p>
      <p className="mt-2 text-small opacity-70">{label}</p>
    </div>
  )
}

function ActionCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block border border-ks-hairline-active p-8 group hover:bg-ks-fg/5 transition-colors duration-300"
    >
      <h3 className="font-display text-2xl leading-tight">{title}</h3>
      <p className="mt-3 text-small opacity-70">{description}</p>
      <span className="mt-6 inline-block text-small font-medium group-hover:underline underline-offset-4">
        Apri →
      </span>
    </Link>
  )
}

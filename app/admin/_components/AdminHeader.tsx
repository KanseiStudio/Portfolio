import Link from "next/link"
import { Globe, LogOut, FolderOpen, Tags, AtSign, Zap, Settings2 } from "lucide-react"
import { Container } from "@/components/atoms/Container"
import { logoutAction } from "@/app/admin/_actions/auth"

interface AdminHeaderProps {
  active?: "projects" | "categories" | "contact" | "technologies" | "settings" | "dashboard"
}

export function AdminHeader({ active }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-ks-hairline-active bg-ks-bg/95 backdrop-blur-[8px]">
      <Container className="py-4 flex items-center justify-between gap-6">
        <nav className="flex items-center gap-6">
          <Link
            href="/admin"
            className="text-eyebrow font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
          >
            Admin
          </Link>
          <span className="text-ks-hairline-active">|</span>
          <Link
            href="/admin/projects"
            className={`inline-flex items-center gap-1.5 text-small font-medium hover:underline underline-offset-4 ${active === "projects" ? "opacity-100" : "opacity-60"}`}
          >
            <FolderOpen size={14} strokeWidth={1.5} />
            <span>Progetti</span>
          </Link>
          <Link
            href="/admin/categories"
            className={`inline-flex items-center gap-1.5 text-small font-medium hover:underline underline-offset-4 ${active === "categories" ? "opacity-100" : "opacity-60"}`}
          >
            <Tags size={14} strokeWidth={1.5} />
            <span>Categorie</span>
          </Link>
          <Link
            href="/admin/contact"
            className={`inline-flex items-center gap-1.5 text-small font-medium hover:underline underline-offset-4 ${active === "contact" ? "opacity-100" : "opacity-60"}`}
          >
            <AtSign size={14} strokeWidth={1.5} />
            <span>Contatti</span>
          </Link>
          <Link
            href="/admin/technologies"
            className={`inline-flex items-center gap-1.5 text-small font-medium hover:underline underline-offset-4 ${active === "technologies" ? "opacity-100" : "opacity-60"}`}
          >
            <Zap size={14} strokeWidth={1.5} />
            <span>Tecnologie</span>
          </Link>
          <Link
            href="/admin/settings"
            className={`inline-flex items-center gap-1.5 text-small font-medium hover:underline underline-offset-4 ${active === "settings" ? "opacity-100" : "opacity-60"}`}
          >
            <Settings2 size={14} strokeWidth={1.5} />
            <span>Impostazioni</span>
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-small font-medium opacity-60 hover:opacity-100 hover:underline underline-offset-4 transition-opacity"
          >
            <Globe size={14} strokeWidth={1.5} />
            <span>Sito</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-small font-medium opacity-60 hover:opacity-100 hover:underline underline-offset-4 transition-opacity"
            >
              <LogOut size={14} strokeWidth={1.5} />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </Container>
    </header>
  )
}

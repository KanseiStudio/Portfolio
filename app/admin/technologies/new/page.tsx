import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { TechnologyForm } from "@/app/admin/_components/TechnologyForm"

export default function AdminTechnologyNewPage() {
  return (
    <main>
      <AdminHeader active="technologies" />

      <Container className="py-12 lg:py-16">
        <Link
          href="/admin/technologies"
          className="inline-flex items-center gap-2 text-small font-medium opacity-60 hover:opacity-100 hover:underline underline-offset-4 transition-opacity mb-10"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Torna alle tecnologie
        </Link>

        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">Admin</p>
        <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-tight mb-10">
          Nuova tecnologia
        </h1>

        <HairlineDivider />

        <div className="mt-10">
          <TechnologyForm />
        </div>
      </Container>
    </main>
  )
}

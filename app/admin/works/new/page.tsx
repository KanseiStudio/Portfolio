import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { WorkForm } from "@/app/admin/_components/works/WorkForm"

export default function AdminWorkNewPage() {
  return (
    <main>
      <AdminHeader active="works" />
      <Container className="py-12 lg:py-16">
        <Link
          href="/admin/works"
          className="inline-flex items-center gap-2 text-small font-medium opacity-60 hover:opacity-100 hover:underline underline-offset-4 transition-opacity mb-10"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Torna ai works
        </Link>
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">Admin · Works</p>
        <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-tight mb-10">Nuovo lavoro</h1>
        <HairlineDivider />
        <div className="mt-10">
          <WorkForm />
        </div>
      </Container>
    </main>
  )
}

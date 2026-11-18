import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { WorkForm } from "@/app/admin/_components/works/WorkForm"
import { workEditorInclude, workToFormValues } from "../_lib"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ created?: string }>
}

export default async function AdminWorkEditPage({ params, searchParams }: Props) {
  const { id } = await params
  const { created } = await searchParams

  const work = await prisma.work.findUnique({ where: { id }, include: workEditorInclude })
  if (!work) notFound()

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
        <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-tight mb-2">{work.name}</h1>
        <p className="font-mono text-eyebrow opacity-40 mb-10">{work.slug}</p>
        <HairlineDivider />
        <div className="mt-10">
          {/* key: dopo un salvataggio con slug diverso il form riparte dai dati del server */}
          <WorkForm key={work.id} workId={work.id} initialValues={workToFormValues(work)} justCreated={created === "1"} />
        </div>
      </Container>
    </main>
  )
}

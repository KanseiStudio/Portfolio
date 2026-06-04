import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { AdminHeader } from "@/app/admin/_components/AdminHeader"
import { TechnologyForm } from "@/app/admin/_components/TechnologyForm"
import type { TechnologyFormValues } from "@/lib/validations/technology"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminTechnologyEditPage({ params }: Props) {
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) notFound()

  const technology = await prisma.technology.findUnique({
    where: { id },
    include: { translations: true },
  })
  if (!technology) notFound()

  const itTrans = technology.translations.find((t) => t.locale === "it")
  const enTrans = technology.translations.find((t) => t.locale === "en")

  const initialValues: Partial<TechnologyFormValues> = {
    slug:        technology.slug,
    name:        technology.name,
    videoUrl:    technology.videoUrl    ?? "",
    mainImage:   technology.mainImage   ?? "",
    usageImage1: technology.usageImage1 ?? "",
    usageImage2: technology.usageImage2 ?? "",
    usageImage3: technology.usageImage3 ?? "",
    published:   technology.published,
    sortOrder:   technology.sortOrder,
    translations: [
      {
        locale:       "it",
        description:  itTrans?.description  ?? "",
        applications: itTrans?.applications ?? "",
      },
      {
        locale:       "en",
        description:  enTrans?.description  ?? "",
        applications: enTrans?.applications ?? "",
      },
    ],
  }

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
        <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-tight mb-2">
          {technology.name}
        </h1>
        <p className="font-mono text-eyebrow opacity-40 mb-10">{technology.slug}</p>

        <HairlineDivider />

        <div className="mt-10">
          <TechnologyForm
            initialValues={initialValues}
            technologyId={id}
          />
        </div>
      </Container>
    </main>
  )
}

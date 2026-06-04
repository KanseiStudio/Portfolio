"use server"

import { revalidatePath } from "next/cache"
import { redirect }       from "next/navigation"
import { prisma }         from "@/lib/prisma"
import { getAdminSession } from "@/lib/session"
import {
  technologyFormSchema,
  type TechnologyFormValues,
} from "@/lib/validations/technology"

type ActionResult = { error: string } | null

async function requireAdmin() {
  const session = await getAdminSession()
  if (!session.isAdmin) redirect("/admin/login")
}

function revalidateAll(slug?: string) {
  revalidatePath("/admin/technologies")
  revalidatePath("/it/technologies")
  revalidatePath("/en/technologies")
  revalidatePath("/admin")
  if (slug) {
    revalidatePath(`/it/technologies`)
    revalidatePath(`/en/technologies`)
  }
}

export async function createTechnologyAction(
  data: TechnologyFormValues,
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = technologyFormSchema.safeParse(data)
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" }

  const {
    slug, name, videoUrl, mainImage,
    usageImage1, usageImage2, usageImage3,
    published, sortOrder, translations,
  } = parsed.data

  const existing = await prisma.technology.findUnique({ where: { slug } })
  if (existing) return { error: `Slug "${slug}" già in uso` }

  await prisma.technology.create({
    data: {
      slug,
      name,
      videoUrl:    videoUrl    || null,
      mainImage:   mainImage   || null,
      usageImage1: usageImage1 || null,
      usageImage2: usageImage2 || null,
      usageImage3: usageImage3 || null,
      published,
      sortOrder,
      translations: {
        create: translations.map((t) => ({
          locale:       t.locale,
          description:  t.description,
          applications: t.applications,
        })),
      },
    },
  })

  revalidateAll(slug)
  redirect("/admin/technologies")
}

export async function updateTechnologyAction(
  id: number,
  data: TechnologyFormValues,
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = technologyFormSchema.safeParse(data)
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" }

  const {
    slug, name, videoUrl, mainImage,
    usageImage1, usageImage2, usageImage3,
    published, sortOrder, translations,
  } = parsed.data

  const existing = await prisma.technology.findUnique({ where: { slug } })
  if (existing && existing.id !== id)
    return { error: `Slug "${slug}" già in uso da un'altra tecnologia` }

  await prisma.$transaction(async (tx) => {
    await tx.technology.update({
      where: { id },
      data: {
        slug,
        name,
        videoUrl:    videoUrl    || null,
        mainImage:   mainImage   || null,
        usageImage1: usageImage1 || null,
        usageImage2: usageImage2 || null,
        usageImage3: usageImage3 || null,
        published,
        sortOrder,
      },
    })

    await tx.technologyTranslation.deleteMany({ where: { technologyId: id } })
    await tx.technologyTranslation.createMany({
      data: translations.map((t) => ({
        technologyId: id,
        locale:       t.locale,
        description:  t.description,
        applications: t.applications,
      })),
    })
  })

  revalidateAll(slug)
  redirect("/admin/technologies")
}

export async function softDeleteTechnologyAction(id: number): Promise<ActionResult> {
  await requireAdmin()
  await prisma.technology.update({ where: { id }, data: { published: false } })
  revalidatePath("/admin/technologies")
  return null
}

export async function restoreTechnologyAction(id: number): Promise<ActionResult> {
  await requireAdmin()
  await prisma.technology.update({ where: { id }, data: { published: true } })
  revalidatePath("/admin/technologies")
  return null
}

export async function hardDeleteTechnologyAction(
  id: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin()

  const tech = await prisma.technology.findUnique({ where: { id } })
  if (!tech) return { ok: false, error: "Tecnologia non trovata" }

  await prisma.technology.delete({ where: { id } })

  revalidatePath("/admin/technologies")
  revalidatePath("/admin")
  revalidatePath("/[locale]/technologies", "page")
  return { ok: true }
}

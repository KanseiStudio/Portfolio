"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { projectFormSchema, type ProjectFormValues } from "@/lib/validations/project"

type ActionResult = { error: string } | null

export async function createProjectAction(data: ProjectFormValues): Promise<ActionResult> {
  const parsed = projectFormSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" }
  }

  const { slug, year, client, format, environment, technologies, notes, videoUrl, posterUrl, coverUrl, published, sortOrder, categoryIds, translations, kpis } = parsed.data

  const existing = await prisma.project.findUnique({ where: { slug } })
  if (existing) return { error: `Slug "${slug}" già in uso` }

  await prisma.project.create({
    data: {
      slug,
      year,
      client,
      format,
      environment,
      technologies,
      notes: notes || null,
      videoUrl: videoUrl || null,
      posterUrl: posterUrl || null,
      coverUrl: coverUrl || null,
      published,
      sortOrder,
      translations: {
        create: translations.map((t) => ({
          locale: t.locale,
          title: t.title,
          tagline: t.tagline || null,
          description: t.description,
          problem: t.problem || null,
          solution: t.solution || null,
        })),
      },
      categories: {
        create: categoryIds.map((categoryId) => ({ categoryId })),
      },
      kpis: {
        create: kpis.map((kpi, i) => ({
          icon: kpi.icon,
          value: kpi.value,
          sortOrder: kpi.sortOrder ?? i,
          translations: {
            create: [
              { locale: "it", label: kpi.labelIt },
              { locale: "en", label: kpi.labelEn },
            ],
          },
        })),
      },
    },
  })

  revalidatePath("/admin/projects")
  revalidatePath("/it/projects")
  revalidatePath("/en/projects")
  redirect("/admin/projects")
}

export async function updateProjectAction(id: number, data: ProjectFormValues): Promise<ActionResult> {
  const parsed = projectFormSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" }
  }

  const { slug, year, client, format, environment, technologies, notes, videoUrl, posterUrl, coverUrl, published, sortOrder, categoryIds, translations, kpis } = parsed.data

  const existing = await prisma.project.findUnique({ where: { slug } })
  if (existing && existing.id !== id) return { error: `Slug "${slug}" già in uso da un altro progetto` }

  await prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: { id },
      data: {
        slug,
        year,
        client,
        format,
        environment,
        technologies,
        notes: notes || null,
        videoUrl: videoUrl || null,
        posterUrl: posterUrl || null,
        coverUrl: coverUrl || null,
        published,
        sortOrder,
      },
    })

    // Replace translations
    await tx.projectTranslation.deleteMany({ where: { projectId: id } })
    await tx.projectTranslation.createMany({
      data: translations.map((t) => ({
        projectId: id,
        locale: t.locale,
        title: t.title,
        tagline: t.tagline || null,
        description: t.description,
        problem: t.problem || null,
        solution: t.solution || null,
      })),
    })

    // Replace categories
    await tx.projectCategory.deleteMany({ where: { projectId: id } })
    if (categoryIds.length > 0) {
      await tx.projectCategory.createMany({
        data: categoryIds.map((categoryId) => ({ projectId: id, categoryId })),
      })
    }

    // Replace KPIs
    await tx.projectKpi.deleteMany({ where: { projectId: id } })
    for (let i = 0; i < kpis.length; i++) {
      const kpi = kpis[i]
      await tx.projectKpi.create({
        data: {
          projectId: id,
          icon: kpi.icon,
          value: kpi.value,
          sortOrder: kpi.sortOrder ?? i,
          translations: {
            create: [
              { locale: "it", label: kpi.labelIt },
              { locale: "en", label: kpi.labelEn },
            ],
          },
        },
      })
    }
  })

  revalidatePath("/admin/projects")
  revalidatePath(`/it/projects/${slug}`)
  revalidatePath(`/en/projects/${slug}`)
  redirect("/admin/projects")
}

export async function softDeleteProjectAction(id: number): Promise<ActionResult> {
  await prisma.project.update({ where: { id }, data: { published: false } })
  revalidatePath("/admin/projects")
  return null
}

export async function restoreProjectAction(id: number): Promise<ActionResult> {
  await prisma.project.update({ where: { id }, data: { published: true } })
  revalidatePath("/admin/projects")
  return null
}

export async function hardDeleteProjectAction(id: number): Promise<ActionResult> {
  await prisma.project.delete({ where: { id } })
  revalidatePath("/admin/projects")
  revalidatePath("/it/projects")
  revalidatePath("/en/projects")
  return null
}

"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validations/project"

type ActionResult = { error: string } | null

export async function createCategoryAction(data: CategoryFormValues): Promise<ActionResult> {
  const parsed = categoryFormSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" }
  }

  const { slug, sortOrder, nameIt, nameEn } = parsed.data

  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) return { error: `Slug "${slug}" già in uso` }

  await prisma.category.create({
    data: {
      slug,
      sortOrder,
      translations: {
        create: [
          { locale: "it", name: nameIt },
          { locale: "en", name: nameEn },
        ],
      },
    },
  })

  revalidatePath("/admin/categories")
  return null
}

export async function updateCategoryAction(id: number, data: CategoryFormValues): Promise<ActionResult> {
  const parsed = categoryFormSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" }
  }

  const { slug, sortOrder, nameIt, nameEn } = parsed.data

  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing && existing.id !== id) return { error: `Slug "${slug}" già in uso da un'altra categoria` }

  await prisma.$transaction(async (tx) => {
    await tx.category.update({ where: { id }, data: { slug, sortOrder } })
    await tx.categoryTranslation.deleteMany({ where: { categoryId: id } })
    await tx.categoryTranslation.createMany({
      data: [
        { categoryId: id, locale: "it", name: nameIt },
        { categoryId: id, locale: "en", name: nameEn },
      ],
    })
  })

  revalidatePath("/admin/categories")
  return null
}

export async function deleteCategoryAction(id: number): Promise<ActionResult> {
  await prisma.category.delete({ where: { id } })
  revalidatePath("/admin/categories")
  return null
}

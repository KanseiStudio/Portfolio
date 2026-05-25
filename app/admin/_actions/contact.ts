"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { getAdminSession } from "@/lib/session"

async function requireAdmin() {
  const session = await getAdminSession()
  if (!session.isAdmin) redirect("/admin/login")
}

// ── Validation ──────────────────────────────────────────────────────────────

const contactInfoSchema = z.object({
  studioName: z.string().min(1).max(120),
  email: z.string().email("Email non valida"),
  translations: z.object({
    it: z.object({
      location: z.string().min(1).max(180),
      availability: z.string().min(1).max(250),
      focus: z.string().min(1).max(250),
    }),
    en: z.object({
      location: z.string().min(1).max(180),
      availability: z.string().min(1).max(250),
      focus: z.string().min(1).max(250),
    }),
  }),
})

const urlValidator = z.string()
  .nullable()
  .refine(
    (v) =>
      v === null ||
      v.startsWith("https://") ||
      v.startsWith("http://") ||
      v.startsWith("mailto:"),
    "URL non valido (usa https://, http:// o mailto:)"
  )

const contactChannelSchema = z.object({
  platform: z.string().min(1).max(40),
  iconName: z.string().min(1).max(40),
  handle: z.string().min(1).max(200),
  url: z.preprocess((val) => (val === "" ? null : val), urlValidator),
  enabled: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  labels: z.object({
    it: z.string().min(1).max(80),
    en: z.string().min(1).max(80),
  }),
})

// ── Update ContactInfo (singleton upsert) ─────────────────────────────────

export async function updateContactInfoAction(
  data: z.infer<typeof contactInfoSchema>
) {
  await requireAdmin()

  const parsed = contactInfoSchema.safeParse(data)
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Dati non validi",
      issues: parsed.error.issues,
    }
  }

  const d = parsed.data

  try {
    let info = await prisma.contactInfo.findFirst()

    if (!info) {
      info = await prisma.contactInfo.create({
        data: { studioName: d.studioName, email: d.email },
      })
    } else {
      info = await prisma.contactInfo.update({
        where: { id: info.id },
        data: { studioName: d.studioName, email: d.email },
      })
    }

    await prisma.contactInfoTranslation.upsert({
      where: { contactInfoId_locale: { contactInfoId: info.id, locale: "it" } },
      create: { contactInfoId: info.id, locale: "it", ...d.translations.it },
      update: d.translations.it,
    })

    await prisma.contactInfoTranslation.upsert({
      where: { contactInfoId_locale: { contactInfoId: info.id, locale: "en" } },
      create: { contactInfoId: info.id, locale: "en", ...d.translations.en },
      update: d.translations.en,
    })

    revalidatePath("/[locale]/contact", "page")
    revalidatePath("/admin/contact")

    return { ok: true as const }
  } catch (err) {
    console.error("[updateContactInfo] error:", err)
    return { ok: false as const, error: "Errore durante il salvataggio", issues: [] }
  }
}

// ── Create ContactChannel ─────────────────────────────────────────────────

export async function createContactChannelAction(
  data: z.infer<typeof contactChannelSchema>
) {
  await requireAdmin()

  const parsed = contactChannelSchema.safeParse(data)
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Dati non validi",
      issues: parsed.error.issues,
    }
  }

  const d = parsed.data

  try {
    await prisma.contactChannel.create({
      data: {
        platform: d.platform,
        iconName: d.iconName,
        handle: d.handle,
        url: d.url ?? null,
        enabled: d.enabled,
        sortOrder: d.sortOrder,
        translations: {
          create: [
            { locale: "it", label: d.labels.it },
            { locale: "en", label: d.labels.en },
          ],
        },
      },
    })

    revalidatePath("/[locale]/contact", "page")
    revalidatePath("/admin/contact")

    return { ok: true as const }
  } catch (err) {
    console.error("[createContactChannel] error:", err)
    return { ok: false as const, error: "Errore durante la creazione", issues: [] }
  }
}

// ── Update ContactChannel ─────────────────────────────────────────────────

export async function updateContactChannelAction(
  id: number,
  data: z.infer<typeof contactChannelSchema>
) {
  await requireAdmin()

  const parsed = contactChannelSchema.safeParse(data)
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Dati non validi",
      issues: parsed.error.issues,
    }
  }

  const d = parsed.data

  try {
    await prisma.$transaction([
      prisma.contactChannel.update({
        where: { id },
        data: {
          platform: d.platform,
          iconName: d.iconName,
          handle: d.handle,
          url: d.url ?? null,
          enabled: d.enabled,
          sortOrder: d.sortOrder,
        },
      }),
      prisma.contactChannelTranslation.upsert({
        where: { contactChannelId_locale: { contactChannelId: id, locale: "it" } },
        create: { contactChannelId: id, locale: "it", label: d.labels.it },
        update: { label: d.labels.it },
      }),
      prisma.contactChannelTranslation.upsert({
        where: { contactChannelId_locale: { contactChannelId: id, locale: "en" } },
        create: { contactChannelId: id, locale: "en", label: d.labels.en },
        update: { label: d.labels.en },
      }),
    ])

    revalidatePath("/[locale]/contact", "page")
    revalidatePath("/admin/contact")

    return { ok: true as const }
  } catch (err) {
    console.error("[updateContactChannel] error:", err)
    return { ok: false as const, error: "Errore durante l'aggiornamento", issues: [] }
  }
}

// ── Delete ContactChannel ─────────────────────────────────────────────────

export async function deleteContactChannelAction(id: number) {
  await requireAdmin()

  try {
    await prisma.contactChannel.delete({ where: { id } })

    revalidatePath("/[locale]/contact", "page")
    revalidatePath("/admin/contact")

    return { ok: true as const }
  } catch (err) {
    console.error("[deleteContactChannel] error:", err)
    return { ok: false as const, error: "Errore durante l'eliminazione" }
  }
}

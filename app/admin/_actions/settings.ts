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

const settingsSchema = z.object({
  musicUrl: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().url("URL non valido — usa https://").max(500).nullable()
  ),
  musicEnabled: z.boolean(),
})

export async function updateSiteSettingsAction(data: {
  musicUrl: string | null
  musicEnabled: boolean
}) {
  await requireAdmin()

  const parsed = settingsSchema.safeParse(data)
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Dati non validi",
    }
  }

  const d = parsed.data

  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", musicUrl: d.musicUrl, musicEnabled: d.musicEnabled },
      update: { musicUrl: d.musicUrl, musicEnabled: d.musicEnabled },
    })

    revalidatePath("/it", "layout")
    revalidatePath("/en", "layout")
    revalidatePath("/admin/settings")

    return { ok: true as const }
  } catch (err) {
    console.error("[updateSiteSettings] error:", err)
    return { ok: false as const, error: "Errore durante il salvataggio" }
  }
}

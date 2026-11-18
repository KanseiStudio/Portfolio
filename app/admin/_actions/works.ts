"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"
import { isAdminSession } from "@/lib/session"
import { collectWorkImages, deleteUnusedBlobs, isWorkBlobUrl } from "@/lib/blob"
import { deleteArtifactPoster, deleteArtifactPrefix } from "@/lib/artifacts-server"
import {
  SECTION_KIND_CONFIG,
  workFormSchema,
  type WorkFormValues,
} from "@/lib/validations/work"

export type SaveWorkResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string; field?: "slug" }

type SimpleResult = { ok: true } | { ok: false; error: string }

async function requireAdmin() {
  if (!(await isAdminSession())) redirect("/admin/login")
}

function revalidateWorks(...slugs: (string | undefined)[]) {
  revalidatePath("/admin/works")
  revalidatePath("/admin")
  for (const locale of ["it", "en"]) {
    revalidatePath(`/${locale}/works`)
    for (const slug of new Set(slugs.filter(Boolean))) revalidatePath(`/${locale}/works/${slug}`)
  }
}

const orNull = (v: string) => (v === "" ? null : v)

/** Converte i valori del form nei dati Prisma per i figli (tag, stats, sezioni) */
function childrenData(d: WorkFormValues) {
  return {
    tags: d.tags.map((t, i) => ({ order: i, labelIt: t.labelIt, labelEn: t.labelEn })),
    stats: d.stats.map((s, i) => ({
      order: i,
      value: s.value,
      labelIt: s.labelIt,
      labelEn: s.labelEn,
      cardLabelIt: orNull(s.cardLabelIt),
      cardLabelEn: orNull(s.cardLabelEn),
      onCard: s.onCard,
      onPage: s.onPage,
    })),
    sections: d.sections.map((s, i) => {
      // Azzera i campi non pertinenti al tipo (restano nel form se si cambia tipo)
      const cfg = SECTION_KIND_CONFIG[s.kind]
      const f = cfg.fields
      const itf = cfg.items?.fields ?? {}
      return {
        order: i,
        kind: s.kind,
        eyebrowIt: f.eyebrow ? orNull(s.eyebrowIt) : null,
        eyebrowEn: f.eyebrow ? orNull(s.eyebrowEn) : null,
        titleIt: f.title ? orNull(s.titleIt) : null,
        titleEn: f.title ? orNull(s.titleEn) : null,
        bodyIt: f.body ? orNull(s.bodyIt) : null,
        bodyEn: f.body ? orNull(s.bodyEn) : null,
        columnsIt: f.columns ? orNull(s.columnsIt) : null,
        columnsEn: f.columns ? orNull(s.columnsEn) : null,
        image: f.image ? orNull(s.image) : null,
        imageAltIt: f.image ? orNull(s.imageAltIt) : null,
        imageAltEn: f.image ? orNull(s.imageAltEn) : null,
        items: cfg.items
          ? s.items.map((it, j) => ({
              order: j,
              labelIt: itf.label ? orNull(it.labelIt) : null,
              labelEn: itf.label ? orNull(it.labelEn) : null,
              titleIt: itf.title ? orNull(it.titleIt) : null,
              titleEn: itf.title ? orNull(it.titleEn) : null,
              bodyIt: itf.body ? orNull(it.bodyIt) : null,
              bodyEn: itf.body ? orNull(it.bodyEn) : null,
              extraIt: itf.extra ? orNull(it.extraIt) : null,
              extraEn: itf.extra ? orNull(it.extraEn) : null,
              image: itf.image ? orNull(it.image) : null,
              imageAltIt: itf.image ? orNull(it.imageAltIt) : null,
              imageAltEn: itf.image ? orNull(it.imageAltEn) : null,
            }))
          : [],
      }
    }),
  }
}

function workData(d: WorkFormValues) {
  return {
    slug: d.slug,
    name: d.name,
    published: d.published,
    typeIt: d.typeIt,
    typeEn: d.typeEn,
    typeShortIt: orNull(d.typeShortIt),
    typeShortEn: orNull(d.typeShortEn),
    statusIt: d.statusIt,
    statusEn: d.statusEn,
    taglineIt: d.taglineIt,
    taglineEn: d.taglineEn,
    introIt: d.introIt,
    introEn: d.introEn,
    summaryIt: orNull(d.summaryIt),
    summaryEn: orNull(d.summaryEn),
    closingIt: orNull(d.closingIt),
    closingEn: orNull(d.closingEn),
    ctaLabelIt: orNull(d.ctaLabelIt),
    ctaLabelEn: orNull(d.ctaLabelEn),
    heroImage: d.heroImage,
    heroAltIt: d.heroAltIt,
    heroAltEn: d.heroAltEn,
    heroCaption: orNull(d.heroCaption),
    heroTone: d.heroTone,
  }
}

/** Sostituisce completamente tag, stats, sezioni e voci di un lavoro (dentro una transazione) */
async function replaceChildren(tx: Prisma.TransactionClient, workId: string, d: WorkFormValues) {
  const { tags, stats, sections } = childrenData(d)
  await tx.workTag.deleteMany({ where: { workId } })
  await tx.workStat.deleteMany({ where: { workId } })
  await tx.workSection.deleteMany({ where: { workId } }) // cascade sulle voci
  if (tags.length) await tx.workTag.createMany({ data: tags.map((t) => ({ ...t, workId })) })
  if (stats.length) await tx.workStat.createMany({ data: stats.map((s) => ({ ...s, workId })) })
  for (const { items, ...section } of sections) {
    await tx.workSection.create({
      data: { ...section, workId, items: { create: items } },
    })
  }
}

function validationError(error: z.ZodError): SaveWorkResult {
  const issue = error.issues[0]
  const path = issue?.path.join(".")
  return {
    ok: false,
    error: issue ? `${path ? `${path}: ` : ""}${issue.message}` : "Dati non validi",
    field: issue?.path[0] === "slug" ? "slug" : undefined,
  }
}

const slugTaken = (slug: string): SaveWorkResult => ({
  ok: false,
  error: `Lo slug "${slug}" è già usato da un altro lavoro`,
  field: "slug",
})

function isUniqueViolation(err: unknown) {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
}

// ─── CRUD ──────────────────────────────────────────────────────────────────

export async function createWork(data: WorkFormValues): Promise<SaveWorkResult> {
  await requireAdmin()

  const parsed = workFormSchema.safeParse(data)
  if (!parsed.success) return validationError(parsed.error)
  const d = parsed.data

  if (await prisma.work.findUnique({ where: { slug: d.slug } })) return slugTaken(d.slug)

  const last = await prisma.work.aggregate({ _max: { order: true } })
  let id: string
  try {
    id = await prisma.$transaction(async (tx) => {
      const work = await tx.work.create({
        data: { ...workData(d), order: (last._max.order ?? 0) + 1 },
      })
      await replaceChildren(tx, work.id, d)
      return work.id
    })
  } catch (err) {
    if (isUniqueViolation(err)) return slugTaken(d.slug)
    throw err
  }

  revalidateWorks(d.slug)
  redirect(`/admin/works/${id}?created=1`)
}

export async function updateWork(id: string, data: WorkFormValues): Promise<SaveWorkResult> {
  await requireAdmin()

  const parsed = workFormSchema.safeParse(data)
  if (!parsed.success) return validationError(parsed.error)
  const d = parsed.data

  const current = await prisma.work.findUnique({
    where: { id },
    include: { sections: { select: { image: true, items: { select: { image: true } } } } },
  })
  if (!current) return { ok: false, error: "Lavoro non trovato" }

  const clash = await prisma.work.findUnique({ where: { slug: d.slug } })
  if (clash && clash.id !== id) return slugTaken(d.slug)

  try {
    await prisma.$transaction(async (tx) => {
      await tx.work.update({ where: { id }, data: workData(d) })
      await replaceChildren(tx, id, d)
    })
  } catch (err) {
    if (isUniqueViolation(err)) return slugTaken(d.slug)
    throw err
  }

  // Blob sostituiti o rimossi → cancellati se nessun altro li usa
  const before = collectWorkImages(current)
  const after = collectWorkImages({
    heroImage: d.heroImage,
    sections: d.sections.map((s) => ({ image: s.image, items: s.items })),
  })
  await deleteUnusedBlobs([...before].filter((u) => !after.has(u)))

  revalidateWorks(d.slug, current.slug)
  return { ok: true, id, slug: d.slug }
}

export async function deleteWork(id: string): Promise<SimpleResult> {
  await requireAdmin()
  if (!z.string().min(1).safeParse(id).success) return { ok: false, error: "ID non valido" }

  const work = await prisma.work.findUnique({
    where: { id },
    include: {
      sections: { select: { image: true, items: { select: { image: true } } } },
      artifacts: { select: { blobPrefix: true, previousBlobPrefix: true, posterUrl: true } },
    },
  })
  if (!work) return { ok: false, error: "Lavoro non trovato" }

  // Il cascade elimina i record degli artefatti ma non i loro blob: puliscili prima
  try {
    for (const a of work.artifacts) {
      await deleteArtifactPrefix(a.blobPrefix)
      if (a.previousBlobPrefix) await deleteArtifactPrefix(a.previousBlobPrefix)
      await deleteArtifactPoster(a.posterUrl)
    }
  } catch (err) {
    console.error("[artifacts] pulizia blob del lavoro fallita", id, err)
    return { ok: false, error: "Eliminazione dei file degli artefatti non riuscita: riprova." }
  }

  // Hard delete: il cascade dello schema elimina tag, stats, sezioni e voci
  await prisma.work.delete({ where: { id } })
  await deleteUnusedBlobs(collectWorkImages(work))

  revalidateWorks(work.slug)
  return { ok: true }
}

// ─── Lista ─────────────────────────────────────────────────────────────────

export async function reorderWorks(ids: string[]): Promise<SimpleResult> {
  await requireAdmin()
  const parsed = z.array(z.string().min(1)).min(1).max(200).safeParse(ids)
  if (!parsed.success) return { ok: false, error: "Ordine non valido" }

  const works = await prisma.work.findMany({ select: { id: true, slug: true } })
  const known = new Set(works.map((w) => w.id))
  if (parsed.data.length !== known.size || !parsed.data.every((id) => known.has(id)))
    return { ok: false, error: "La lista è cambiata: ricarica la pagina" }

  await prisma.$transaction(
    parsed.data.map((id, i) => prisma.work.update({ where: { id }, data: { order: i + 1 } })),
  )
  revalidateWorks(...works.map((w) => w.slug))
  return { ok: true }
}

export async function togglePublished(id: string, published: boolean): Promise<SimpleResult> {
  await requireAdmin()
  const parsed = z.object({ id: z.string().min(1), published: z.boolean() }).safeParse({ id, published })
  if (!parsed.success) return { ok: false, error: "Dati non validi" }

  const work = await prisma.work.update({
    where: { id: parsed.data.id },
    data: { published: parsed.data.published },
    select: { slug: true },
  })
  revalidateWorks(work.slug)
  return { ok: true }
}

// ─── Immagini ──────────────────────────────────────────────────────────────

/**
 * Scarta un'immagine caricata in questa sessione dell'editor e poi sostituita
 * o rimossa prima del salvataggio. Cancella solo blob non referenziati nel DB.
 */
export async function discardWorkImage(url: string): Promise<SimpleResult> {
  await requireAdmin()
  if (!isWorkBlobUrl(url)) return { ok: true } // path locale o blob esterno: mai cancellato
  await deleteUnusedBlobs([url]) // ricontrolla i riferimenti nel DB
  return { ok: true }
}

"use server"

import { randomBytes } from "node:crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { isAdminSession } from "@/lib/session"
import { hasBlobToken, isBlobUrl } from "@/lib/blob"
import {
  ARTIFACT_ASPECT_RATIOS,
  ARTIFACT_ENTRY,
  ARTIFACT_MAX_FILES,
  ARTIFACT_MAX_TOTAL_BYTES,
  ARTIFACT_POSTER_PATHNAME_RE,
  ARTIFACT_PREFIX_RE,
  artifactRootFor,
} from "@/lib/artifacts"
import { deleteArtifactBlobs, deleteArtifactPoster, deleteArtifactPrefix, statArtifactPrefix } from "@/lib/artifacts-server"

/**
 * Artefatti interattivi dei Works. I file vanno dal browser direttamente su Blob
 * (route /api/admin/works/upload); qui si riserva il prefix, si verifica
 * cosa è stato caricato e si salva il record.
 */

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string }

async function requireAdmin() {
  if (!(await isAdminSession())) redirect("/admin/login")
}

function revalidateArtifacts(work: { id: string; slug: string }) {
  revalidatePath(`/admin/works/${work.id}`)
  for (const locale of ["it", "en"]) revalidatePath(`/${locale}/works/${work.slug}`)
}

const id = z.string().min(1).max(40)
const optText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .transform((v) => v ?? null)

const posterUrl = z
  .string()
  .nullable()
  .optional()
  .transform((v) => v || null)
  .refine((v) => v === null || (isBlobUrl(v) && ARTIFACT_POSTER_PATHNAME_RE.test(new URL(v).pathname.slice(1))), {
    message: "Copertina non valida",
  })

const blobPrefix = z.string().regex(ARTIFACT_PREFIX_RE, "Prefix non valido")

/** Il prefix deve appartenere al lavoro (radice = id del lavoro, o e2e-<runId> per i test) */
function prefixBelongsTo(prefix: string, work: { id: string; slug: string }) {
  return prefix.startsWith(`${artifactRootFor(work)}/`)
}

/** Il poster deve stare accanto al prefix: artifacts/<blobPrefix>-poster.<ext> */
function posterMatchesPrefix(url: string | null, prefix: string) {
  return url === null || new URL(url).pathname.startsWith(`/artifacts/${prefix}-poster.`)
}

/**
 * Verifica su Blob cosa è stato davvero caricato: conteggio e dimensione
 * arrivano dalla lista, non dal client; deve esserci index.html alla radice.
 */
async function verifyUploaded(prefix: string): Promise<Result<{ fileCount: number; totalBytes: number }>> {
  const stat = await statArtifactPrefix(prefix)
  if (stat.fileCount === 0) return { ok: false, error: "Nessun file trovato su Blob per questo caricamento." }
  if (!stat.paths.has(ARTIFACT_ENTRY)) return { ok: false, error: `Manca ${ARTIFACT_ENTRY} alla radice dell'artefatto.` }
  if (stat.fileCount > ARTIFACT_MAX_FILES || stat.totalBytes > ARTIFACT_MAX_TOTAL_BYTES)
    return { ok: false, error: "L'artefatto supera i limiti (300 file, 250 MB)." }
  return { ok: true, fileCount: stat.fileCount, totalBytes: stat.totalBytes }
}

// ─── Upload ────────────────────────────────────────────────────────────────

/** Riserva un prefix nuovo per un caricamento: artifacts/<root>/<uploadId>/ */
export async function reserveArtifactUploadAction(workId: string): Promise<Result<{ blobPrefix: string }>> {
  await requireAdmin()
  if (!id.safeParse(workId).success) return { ok: false, error: "ID non valido" }
  if (!hasBlobToken()) return { ok: false, error: "Upload non configurato: manca BLOB_READ_WRITE_TOKEN" }
  const work = await prisma.work.findUnique({ where: { id: workId }, select: { id: true, slug: true } })
  if (!work) return { ok: false, error: "Lavoro non trovato" }
  const uploadId = randomBytes(10).toString("hex")
  return { ok: true, blobPrefix: `${artifactRootFor(work)}/${uploadId}` }
}

const createSchema = z.object({
  workId: id,
  titleIt: z.string().trim().min(1, "Titolo IT obbligatorio").max(200),
  titleEn: optText(200),
  captionIt: optText(2000),
  captionEn: optText(2000),
  aspectRatio: z.enum(ARTIFACT_ASPECT_RATIOS),
  blobPrefix,
  posterUrl,
})
export type CreateArtifactInput = z.input<typeof createSchema>

export async function createArtifactAction(input: CreateArtifactInput): Promise<Result<{ id: string }>> {
  await requireAdmin()
  const parsed = createSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dati non validi" }
  const d = parsed.data

  const work = await prisma.work.findUnique({ where: { id: d.workId }, select: { id: true, slug: true } })
  if (!work) return { ok: false, error: "Lavoro non trovato" }
  if (!prefixBelongsTo(d.blobPrefix, work) || !posterMatchesPrefix(d.posterUrl, d.blobPrefix))
    return { ok: false, error: "Prefix non valido per questo lavoro" }

  const check = await verifyUploaded(d.blobPrefix)
  if (!check.ok) return check

  const last = await prisma.workArtifact.aggregate({ where: { workId: work.id }, _max: { position: true } })
  const created = await prisma.workArtifact.create({
    data: {
      workId: work.id,
      titleIt: d.titleIt,
      titleEn: d.titleEn,
      captionIt: d.captionIt,
      captionEn: d.captionEn,
      aspectRatio: d.aspectRatio,
      blobPrefix: d.blobPrefix,
      entryPath: ARTIFACT_ENTRY,
      posterUrl: d.posterUrl,
      fileCount: check.fileCount,
      totalBytes: check.totalBytes,
      position: (last._max.position ?? -1) + 1,
      published: false,
    },
    select: { id: true },
  })
  revalidateArtifacts(work)
  return { ok: true, id: created.id }
}

const replaceSchema = z.object({ artifactId: id, blobPrefix, posterUrl })

/**
 * "Sostituisci zip": i file nuovi sono già sul prefix nuovo. Aggiorna il record
 * (l'URL pubblico /artifacts/<id> non cambia) con blobPrefix = nuovo e
 * previousBlobPrefix = quello appena sostituito, che resta su Blob: l'HTML in cache
 * CDN (fino a 5 min) ha ancora la <base> verso di lui. Si cancella solo la versione
 * di due sostituzioni fa (il previousBlobPrefix precedente).
 * Copertina: se ne arriva una nuova sostituisce la vecchia, altrimenti resta.
 */
export async function replaceArtifactFilesAction(input: z.input<typeof replaceSchema>): Promise<Result> {
  await requireAdmin()
  const parsed = replaceSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dati non validi" }
  const d = parsed.data

  const current = await prisma.workArtifact.findUnique({
    where: { id: d.artifactId },
    include: { work: { select: { id: true, slug: true } } },
  })
  if (!current) return { ok: false, error: "Artefatto non trovato" }
  if (d.blobPrefix === current.blobPrefix || d.blobPrefix === current.previousBlobPrefix)
    return { ok: false, error: "Prefix già in uso" }
  if (!prefixBelongsTo(d.blobPrefix, current.work) || !posterMatchesPrefix(d.posterUrl, d.blobPrefix))
    return { ok: false, error: "Prefix non valido per questo lavoro" }

  const check = await verifyUploaded(d.blobPrefix)
  if (!check.ok) return check

  await prisma.workArtifact.update({
    where: { id: current.id },
    data: {
      blobPrefix: d.blobPrefix,
      previousBlobPrefix: current.blobPrefix,
      fileCount: check.fileCount,
      totalBytes: check.totalBytes,
      ...(d.posterUrl && { posterUrl: d.posterUrl }),
    },
  })
  // Pagine pubbliche del lavoro (IT/EN) + admin: i nuovi dati (dimensione, copertina) subito
  revalidateArtifacts(current.work)
  // Solo la versione di due sostituzioni fa: quella appena sostituita può ancora servire alla cache
  if (current.previousBlobPrefix) await deleteArtifactBlobs({ blobPrefix: current.previousBlobPrefix })
  // La vecchia copertina non è referenziata dall'HTML dell'artefatto: la pagina pubblica è già rivalidata
  if (d.posterUrl && current.posterUrl) await deleteArtifactBlobs({ blobPrefix: current.blobPrefix, posterUrl: current.posterUrl, posterOnly: true })
  return { ok: true }
}

/**
 * Pulizia dopo un caricamento fallito: cancella file e copertina di un prefix
 * che NON è usato da nessun record.
 */
export async function deleteArtifactBlobsAction(prefix: string, posterUrl?: string | null): Promise<Result> {
  await requireAdmin()
  if (!ARTIFACT_PREFIX_RE.test(prefix)) return { ok: false, error: "Prefix non valido" }
  if (await prisma.workArtifact.count({ where: { OR: [{ blobPrefix: prefix }, { previousBlobPrefix: prefix }] } }))
    return { ok: false, error: "Prefix in uso da un artefatto" }
  const poster = posterUrl && posterMatchesPrefix(posterUrl, prefix) ? posterUrl : null
  await deleteArtifactBlobs({ blobPrefix: prefix, posterUrl: poster })
  return { ok: true }
}

// ─── Lista ─────────────────────────────────────────────────────────────────

export async function toggleArtifactPublishedAction(artifactId: string, published: boolean): Promise<Result> {
  await requireAdmin()
  const parsed = z.object({ artifactId: id, published: z.boolean() }).safeParse({ artifactId, published })
  if (!parsed.success) return { ok: false, error: "Dati non validi" }
  const a = await prisma.workArtifact.update({
    where: { id: parsed.data.artifactId },
    data: { published: parsed.data.published },
    select: { work: { select: { id: true, slug: true } } },
  })
  revalidateArtifacts(a.work)
  return { ok: true }
}

/** Sposta su/giù scambiando la posizione col vicino, poi rinumera 0..n-1 */
export async function moveArtifactAction(artifactId: string, direction: "up" | "down"): Promise<Result> {
  await requireAdmin()
  const parsed = z.object({ artifactId: id, direction: z.enum(["up", "down"]) }).safeParse({ artifactId, direction })
  if (!parsed.success) return { ok: false, error: "Dati non validi" }

  const current = await prisma.workArtifact.findUnique({
    where: { id: parsed.data.artifactId },
    select: { workId: true, work: { select: { id: true, slug: true } } },
  })
  if (!current) return { ok: false, error: "Artefatto non trovato" }

  const siblings = await prisma.workArtifact.findMany({
    where: { workId: current.workId },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  })
  const ids = siblings.map((s) => s.id)
  const i = ids.indexOf(parsed.data.artifactId)
  const j = parsed.data.direction === "up" ? i - 1 : i + 1
  if (j < 0 || j >= ids.length) return { ok: true }
  ;[ids[i], ids[j]] = [ids[j], ids[i]]

  await prisma.$transaction(ids.map((aid, position) => prisma.workArtifact.update({ where: { id: aid }, data: { position } })))
  revalidateArtifacts(current.work)
  return { ok: true }
}

export async function deleteArtifactAction(artifactId: string): Promise<Result> {
  await requireAdmin()
  if (!id.safeParse(artifactId).success) return { ok: false, error: "ID non valido" }
  const a = await prisma.workArtifact.findUnique({
    where: { id: artifactId },
    include: { work: { select: { id: true, slug: true } } },
  })
  if (!a) return { ok: false, error: "Artefatto non trovato" }

  // Prima i blob, poi il record: se la pulizia fallisce resta il record e si può riprovare
  try {
    await deleteArtifactPrefix(a.blobPrefix)
    if (a.previousBlobPrefix) await deleteArtifactPrefix(a.previousBlobPrefix)
    await deleteArtifactPoster(a.posterUrl)
  } catch (err) {
    console.error("[artifacts] eliminazione blob fallita", a.blobPrefix, err)
    return { ok: false, error: "Eliminazione dei file su Blob non riuscita: riprova." }
  }
  await prisma.workArtifact.delete({ where: { id: a.id } })
  revalidateArtifacts(a.work)
  return { ok: true }
}

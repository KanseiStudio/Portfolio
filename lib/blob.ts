import { del } from "@vercel/blob"
import { prisma } from "@/lib/prisma"

/** Host pubblici degli store Vercel Blob: <store-id>.public.blob.vercel-storage.com */
export const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com"

/** true solo per URL Vercel Blob — mai per path locali (/works/...) */
export function isBlobUrl(value: string | null | undefined): value is string {
  if (!value || !value.startsWith("https://")) return false
  try {
    return new URL(value).hostname.endsWith(BLOB_HOST_SUFFIX)
  } catch {
    return false
  }
}

/** Blob caricato dall'admin Works (pathname works/...): l'unico tipo che cancelliamo */
export function isWorkBlobUrl(value: string | null | undefined): value is string {
  return isBlobUrl(value) && new URL(value).pathname.startsWith("/works/")
}

export function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

type WorkImages = {
  heroImage: string
  sections: { image: string | null; items: { image: string | null }[] }[]
}

/** Tutti i riferimenti immagine di un lavoro (hero + sezioni + voci) */
export function collectWorkImages(work: WorkImages): Set<string> {
  const out = new Set<string>()
  if (work.heroImage) out.add(work.heroImage)
  for (const s of work.sections) {
    if (s.image) out.add(s.image)
    for (const it of s.items) if (it.image) out.add(it.image)
  }
  return out
}

/** Numero di record nel DB che usano ancora questo URL */
export async function countImageReferences(url: string) {
  const [works, sections, items] = await Promise.all([
    prisma.work.count({ where: { heroImage: url } }),
    prisma.workSection.count({ where: { image: url } }),
    prisma.workSectionItem.count({ where: { image: url } }),
  ])
  return works + sections + items
}

/**
 * Cancella da Vercel Blob gli URL candidati che non sono più referenziati
 * da nessun lavoro. Ignora i path locali. Non lancia: un errore di pulizia
 * non deve far fallire il salvataggio.
 */
export async function deleteUnusedBlobs(candidates: Iterable<string>) {
  const blobs = [...new Set(candidates)].filter(isWorkBlobUrl)
  if (blobs.length === 0) return
  if (!hasBlobToken()) {
    console.warn("[blob] BLOB_READ_WRITE_TOKEN mancante: pulizia saltata per", blobs)
    return
  }
  const unused: string[] = []
  for (const url of blobs) {
    if ((await countImageReferences(url)) === 0) unused.push(url)
  }
  if (unused.length === 0) return
  try {
    await del(unused)
  } catch (err) {
    console.error("[blob] cancellazione fallita", unused, err)
  }
}

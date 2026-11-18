import { del, list } from "@vercel/blob"
import { ARTIFACT_PREFIX_RE, ARTIFACT_POSTER_PATHNAME_RE } from "@/lib/artifacts"
import { hasBlobToken, isBlobUrl } from "@/lib/blob"

/**
 * Cancella tutti i blob sotto artifacts/<blobPrefix>/ (a pagine da 1000).
 * Il prefix è validato: mai cancellazioni fuori da un singolo artefatto.
 */
export async function deleteArtifactPrefix(blobPrefix: string) {
  if (!ARTIFACT_PREFIX_RE.test(blobPrefix)) throw new Error(`Prefix artefatto non valido: ${blobPrefix}`)
  if (!hasBlobToken()) {
    console.warn("[artifacts] BLOB_READ_WRITE_TOKEN mancante: pulizia saltata per", blobPrefix)
    return 0
  }
  const prefix = `artifacts/${blobPrefix}/`
  let cursor: string | undefined
  let deleted = 0
  do {
    const page = await list({ prefix, cursor, limit: 1000 })
    if (page.blobs.length) {
      await del(page.blobs.map((b) => b.url))
      deleted += page.blobs.length
    }
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return deleted
}

/** Cancella la copertina di un artefatto, solo se è un blob artifacts/…-poster.* */
export async function deleteArtifactPoster(posterUrl: string | null | undefined) {
  if (!isBlobUrl(posterUrl) || !hasBlobToken()) return
  if (!ARTIFACT_POSTER_PATHNAME_RE.test(new URL(posterUrl).pathname.slice(1))) return
  await del(posterUrl)
}

/**
 * Pulizia (file del prefix + copertina; con posterOnly solo la copertina).
 * Non lancia: logga e prosegue.
 */
export async function deleteArtifactBlobs(a: { blobPrefix: string; posterUrl?: string | null; posterOnly?: boolean }) {
  try {
    if (!a.posterOnly) await deleteArtifactPrefix(a.blobPrefix)
    await deleteArtifactPoster(a.posterUrl)
  } catch (err) {
    console.error("[artifacts] pulizia blob fallita", a.blobPrefix, err)
  }
}

/** Numero e dimensione dei file realmente presenti sotto il prefix */
export async function statArtifactPrefix(blobPrefix: string) {
  const prefix = `artifacts/${blobPrefix}/`
  let cursor: string | undefined
  let fileCount = 0
  let totalBytes = 0
  const paths = new Set<string>()
  do {
    const page = await list({ prefix, cursor, limit: 1000 })
    for (const b of page.blobs) {
      fileCount++
      totalBytes += b.size
      paths.add(b.pathname.slice(prefix.length))
    }
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return { fileCount, totalBytes, paths }
}

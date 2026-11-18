/**
 * Artefatti interattivi dei Works — costanti e funzioni pure condivise
 * tra browser (ArtifactUploader), route di upload e Server Actions.
 * Nessun import server-only qui.
 *
 * Layout su Vercel Blob:
 *   artifacts/<root>/<uploadId>/<relpath>          file dello zip (blobPrefix = "<root>/<uploadId>")
 *   artifacts/<root>/<uploadId>-poster.<ext>        copertina facoltativa (fuori dal prefix dei file)
 * dove <root> = id del Work, oppure "e2e-<runId>" per i lavori di test (slug "e2e-test-<runId>").
 */

export const ARTIFACT_MAX_FILES = 300
export const ARTIFACT_MAX_TOTAL_BYTES = 250 * 1024 * 1024
export const ARTIFACT_MAX_TOTAL_LABEL = "250 MB"
/** Oltre questa soglia il singolo file va in multipart */
export const ARTIFACT_MULTIPART_BYTES = 50 * 1024 * 1024
export const ARTIFACT_ENTRY = "index.html"
export const ARTIFACT_UPLOAD_CONCURRENCY = 4

export const ARTIFACT_ASPECT_RATIOS = ["16/9", "4/3", "1/1", "9/16"] as const
export type ArtifactAspectRatio = (typeof ARTIFACT_ASPECT_RATIOS)[number]

/** Estensione → content type. È anche la whitelist: altre estensioni non si caricano. */
export const ARTIFACT_CONTENT_TYPES: Record<string, string> = {
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  js: "text/javascript",
  mjs: "text/javascript",
  json: "application/json",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  wav: "audio/wav",
  woff: "font/woff",
  woff2: "font/woff2",
  glb: "model/gltf-binary",
  gltf: "model/gltf+json",
  bin: "application/octet-stream",
  wasm: "application/wasm",
  txt: "text/plain",
}

export const ARTIFACT_POSTER_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
}
export const ARTIFACT_POSTER_MAX_BYTES = 20 * 1024 * 1024

export function extensionOf(path: string) {
  const name = path.slice(path.lastIndexOf("/") + 1)
  const dot = name.lastIndexOf(".")
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : ""
}

export function artifactContentType(path: string): string | null {
  return ARTIFACT_CONTENT_TYPES[extensionOf(path)] ?? null
}

// ─── Path ──────────────────────────────────────────────────────────────────

const ROOT = String.raw`(?:[a-z0-9]{20,40}|e2e-[a-z0-9-]{1,60})`
const UPLOAD_ID = String.raw`[a-f0-9]{20}`
/** Un segmento: caratteri "da nome file", niente separatori, mai "." o ".." da soli */
const SEGMENT = String.raw`(?!\.{1,2}(?:/|$))[A-Za-z0-9._\-~ @()+,]{1,120}`

export const ARTIFACT_PREFIX_RE = new RegExp(`^${ROOT}/${UPLOAD_ID}$`)
export const ARTIFACT_FILE_PATHNAME_RE = new RegExp(`^artifacts/${ROOT}/${UPLOAD_ID}/(?:${SEGMENT}/){0,12}${SEGMENT}$`)
export const ARTIFACT_POSTER_PATHNAME_RE = new RegExp(`^artifacts/${ROOT}/${UPLOAD_ID}-poster\\.(?:jpg|png|webp|avif)$`)

/** Radice dei prefix di un lavoro: i lavori di test (e2e-test-<runId>) finiscono sotto e2e-<runId> */
export function artifactRootFor(work: { id: string; slug: string }) {
  const m = /^e2e-test-([a-z0-9-]{1,60})$/.exec(work.slug)
  return m ? `e2e-${m[1]}` : work.id
}

export function artifactFilePathname(blobPrefix: string, relPath: string) {
  return `artifacts/${blobPrefix}/${relPath}`
}

export function artifactPosterPathname(blobPrefix: string, posterType: string) {
  return `artifacts/${blobPrefix}-poster.${ARTIFACT_POSTER_TYPES[posterType]}`
}

// ─── Zip ───────────────────────────────────────────────────────────────────

export interface ZipEntryIn {
  path: string
  size: number
}

export type NormalizeResult<T extends ZipEntryIn> =
  | { ok: true; files: (T & { relPath: string; contentType: string })[]; totalBytes: number; strippedRoot: string | null }
  | { ok: false; error: string }

/** Residui di macOS/Windows da scartare senza errore */
function isJunk(path: string) {
  const parts = path.split("/")
  const name = parts[parts.length - 1]
  return parts.includes("__MACOSX") || name === ".DS_Store" || name === "Thumbs.db" || name.startsWith("._")
}

/**
 * Normalizza le voci di uno zip:
 * scarta __MACOSX/, .DS_Store e cartelle vuote; se tutti i file stanno sotto
 * un'unica cartella radice (es. "kbox/") la rimuove; poi valida.
 */
export function normalizeZipEntries<T extends ZipEntryIn>(entries: T[]): NormalizeResult<T> {
  const files = entries
    .map((e) => ({ ...e, path: e.path.replace(/\\/g, "/") }))
    .filter((e) => !e.path.endsWith("/") && !isJunk(e.path))

  if (files.length === 0) return { ok: false, error: "Lo zip è vuoto." }

  for (const f of files) {
    if (f.path.startsWith("/") || /^[A-Za-z]:/.test(f.path) || f.path.split("/").some((s) => s === ".." || s === "."))
      return { ok: false, error: `Percorso non valido nello zip: ${f.path}` }
  }

  // Cartella radice unica?
  let strippedRoot: string | null = null
  const firstSegs = new Set(files.map((f) => (f.path.includes("/") ? f.path.split("/")[0] : "")))
  if (firstSegs.size === 1 && !firstSegs.has("")) strippedRoot = [...firstSegs][0]

  const out = files.map((f) => {
    const relPath = strippedRoot ? f.path.slice(strippedRoot.length + 1) : f.path
    return { ...f, relPath, contentType: artifactContentType(relPath) ?? "" }
  })

  if (!out.some((f) => f.relPath === ARTIFACT_ENTRY))
    return {
      ok: false,
      error: `Manca ${ARTIFACT_ENTRY} alla radice dello zip${strippedRoot ? ` (né dentro "${strippedRoot}/")` : ""}.`,
    }

  if (out.length > ARTIFACT_MAX_FILES)
    return { ok: false, error: `Troppi file: ${out.length} (massimo ${ARTIFACT_MAX_FILES}).` }

  const totalBytes = out.reduce((n, f) => n + f.size, 0)
  if (totalBytes > ARTIFACT_MAX_TOTAL_BYTES)
    return { ok: false, error: `Zip troppo grande: ${formatBytes(totalBytes)} (massimo ${ARTIFACT_MAX_TOTAL_LABEL}).` }

  const unsupported = out.filter((f) => !f.contentType).map((f) => f.relPath)
  if (unsupported.length)
    return {
      ok: false,
      error: `Tipo di file non supportato: ${unsupported.slice(0, 5).join(", ")}${unsupported.length > 5 ? ` e altri ${unsupported.length - 5}` : ""}.`,
    }

  const badName = out.find((f) => !ARTIFACT_FILE_PATHNAME_RE.test(artifactFilePathname("e2e-x/" + "0".repeat(20), f.relPath)))
  if (badName) return { ok: false, error: `Nome di file non ammesso: ${badName.relPath} (usa lettere, numeri, . _ - spazi).` }

  return { ok: true, files: out, totalBytes, strippedRoot }
}

/** "16.5 MB" (unità decimali, come Finder ed Esplora risorse) */
export function formatBytes(bytes: number) {
  if (bytes < 1000) return `${bytes} B`
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1)} KB`
  if (bytes < 1_000_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  return `${(bytes / 1_000_000_000).toFixed(2)} GB`
}

import { prisma } from "@/lib/prisma"
import { isAdminSession } from "@/lib/session"
import { getBlobPublicBaseUrl } from "@/lib/blob-base-url"

/**
 * HTML entry di un artefatto interattivo.
 *
 * Vercel Blob serve i file con `content-disposition: attachment`, `CSP default-src 'none'`
 * e `X-Frame-Options: DENY`: l'HTML non si può incorporare direttamente da lì.
 * Questa route legge l'entry dal Blob e la serve dal dominio del sito, iniettando
 * `<base href="/artifact-files/<blobPrefix>/">`: tutti i percorsi relativi (video,
 * immagini, js) passano dal rewrite /artifact-files/* di next.config.ts e restano
 * same-origin, condizione necessaria per usare i video come texture WebGL senza `crossOrigin`.
 *
 * Fuori dal layout [locale] e dal proxy (matcher di proxy.ts): niente next-intl, niente nav.
 * Le bozze sono visibili solo con una sessione admin valida, altrimenti 404.
 */

export const dynamic = "force-dynamic"

const notFound = () =>
  new Response("Not found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  })

/** Inserisce `<base>` subito dopo il primo `<head>` (case-insensitive); se manca, lo antepone */
function injectBase(html: string, href: string) {
  const tag = `<base href="${href}">`
  const re = /<head(?:\s[^>]*)?>/i
  return re.test(html) ? html.replace(re, (m) => `${m}${tag}`) : `${tag}${html}`
}

export async function GET(_req: Request, { params }: { params: Promise<{ artifactId: string }> }) {
  const { artifactId } = await params
  if (!/^[a-z0-9]{1,40}$/.test(artifactId)) return notFound()

  const artifact = await prisma.workArtifact.findUnique({
    where: { id: artifactId },
    select: { blobPrefix: true, entryPath: true, published: true },
  })
  if (!artifact) return notFound()
  if (!artifact.published && !(await isAdminSession())) return notFound()

  const base = getBlobPublicBaseUrl()
  if (!base) {
    console.error("[artifacts] BLOB_PUBLIC_BASE_URL/BLOB_STORE_ID mancanti")
    return new Response("Artifact storage not configured", { status: 500 })
  }

  const upstream = await fetch(`${base}/artifacts/${artifact.blobPrefix}/${artifact.entryPath}`, { cache: "no-store" })
  if (!upstream.ok) {
    console.error("[artifacts] entry non leggibile", artifactId, upstream.status)
    return notFound()
  }
  const html = injectBase(await upstream.text(), `/artifact-files/${artifact.blobPrefix}/`)

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "frame-ancestors 'self'",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
      // Le bozze non devono MAI finire nella cache CDN (sarebbero servite anche agli anonimi)
      "Cache-Control": artifact.published ? "public, max-age=60, s-maxage=300" : "private, no-store",
    },
  })
}

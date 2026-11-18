/**
 * Host pubblico dello store Vercel Blob, senza slash finale.
 * 1. BLOB_PUBLIC_BASE_URL (es. https://abc123.public.blob.vercel-storage.com)
 * 2. fallback da BLOB_STORE_ID: "store_AbC123" → https://abc123.public.blob.vercel-storage.com
 * Nessuna dipendenza: lo importa anche next.config.ts (rewrite /artifact-files).
 */
export function getBlobPublicBaseUrl(): string | null {
  const explicit = process.env.BLOB_PUBLIC_BASE_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, "")
  const storeId = process.env.BLOB_STORE_ID?.trim().replace(/^store_/, "")
  if (storeId && /^[A-Za-z0-9]+$/.test(storeId)) return `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com`
  return null
}

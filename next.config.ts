import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { getBlobPublicBaseUrl } from "./lib/blob-base-url"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const blobBase = getBlobPublicBaseUrl()

const nextConfig: NextConfig = {
  /**
   * DEPRECATO — solo compatibilità: l'HTML degli artefatti ancora in cache CDN (fino a 5 min)
   * può avere la vecchia <base href="/artifact-files/…">. Dalla route
   * app/artifacts/[artifactId]/route.ts la <base> punta direttamente a Blob (URL assoluto):
   * via questo rewrite Safari iOS non riusciva a riprodurre i video (MediaError 4).
   */
  async rewrites() {
    if (!blobBase) {
      console.warn("[artifacts] BLOB_PUBLIC_BASE_URL/BLOB_STORE_ID mancanti: rewrite /artifact-files disattivato")
      return []
    }
    return [{ source: "/artifact-files/:path*", destination: `${blobBase}/artifacts/:path*` }]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        // Vercel Blob (immagini Works caricate dall'admin)
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
}

export default withNextIntl(nextConfig)

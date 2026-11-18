import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { getBlobPublicBaseUrl } from "./lib/blob-base-url"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const blobBase = getBlobPublicBaseUrl()

const nextConfig: NextConfig = {
  /**
   * Asset degli artefatti interattivi (video, immagini, js…) serviti dal dominio del sito:
   * il rewrite esterno fa da proxy verso Vercel Blob e inoltra l'header Range (risposte 206,
   * scrubbing dei video). Same-origin = i video si possono usare come texture WebGL.
   * L'HTML entry passa invece da app/artifacts/[artifactId]/route.ts.
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

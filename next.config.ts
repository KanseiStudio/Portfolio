import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
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
  experimental: {
    serverActions: {
      // Upload immagini Works: max 8 MB per file + overhead multipart
      bodySizeLimit: "9mb",
    },
  },
}

export default withNextIntl(nextConfig)

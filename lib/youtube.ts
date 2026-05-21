export function extractYouTubeId(url: string | null): string | null {
  if (!url) return null
  const re =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/
  return url.match(re)?.[1] ?? null
}

export function youTubeThumbnail(
  url: string | null,
  quality: "default" | "hq" | "maxres" = "maxres"
): string | null {
  const id = extractYouTubeId(url)
  if (!id) return null
  const qualityMap = { default: "default", hq: "hqdefault", maxres: "maxresdefault" }
  return `https://img.youtube.com/vi/${id}/${qualityMap[quality]}.jpg`
}

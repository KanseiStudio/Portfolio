"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { GenerativeVisual } from "@/components/atoms/GenerativeVisual"
import { extractYouTubeId } from "@/lib/youtube"

type AspectRatio = "video" | "square"

export interface VideoEmbedProps {
  videoUrl?: string | null
  posterUrl?: string | null
  aspectRatio?: AspectRatio
  caption?: string
  className?: string
}

export function VideoEmbed({
  videoUrl,
  posterUrl,
  aspectRatio = "video",
  caption,
  className,
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)
  const youtubeId = extractYouTubeId(videoUrl ?? null)

  const aspectClass = aspectRatio === "video" ? "aspect-video" : "aspect-square"

  return (
    <figure className={cn("w-full", className)}>
      <div className={cn("relative bg-ks-dark-bg overflow-hidden", aspectClass)}>
        {playing && youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={caption ?? "Video"}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterUrl}
                alt={caption ?? "Video poster"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <GenerativeVisual
                variant="wave-project"
                alt={caption ?? "Video poster"}
                className="absolute inset-0 w-full h-full"
                dark
              />
            )}

            {youtubeId && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center group focus-visible:outline focus-visible:outline-1 focus-visible:outline-ks-dark-fg focus-visible:outline-offset-4"
                aria-label="Play video"
              >
                <span
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full",
                    "border border-ks-dark-fg/40 bg-transparent",
                    "transition-colors duration-600 ease-kansei",
                    "group-hover:bg-ks-dark-fg group-hover:border-ks-dark-fg"
                  )}
                >
                  <Play
                    size={20}
                    strokeWidth={1.5}
                    className="text-ks-dark-fg transition-colors duration-600 ease-kansei group-hover:text-ks-dark-bg ml-1"
                    fill="currentColor"
                  />
                </span>
              </button>
            )}
          </>
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 text-eyebrow font-mono uppercase tracking-widest text-[#F5F4F0]/45">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

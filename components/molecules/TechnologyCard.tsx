import { cn } from "@/lib/utils"

export interface TechnologyCardData {
  number: string
  slug: string
  name: string
  videoUrl: string | null
  mainImage: string | null
  usageImage1: string | null
  usageImage2: string | null
  usageImage3: string | null
  description: string
  applications: string
}

interface Labels {
  descriptionLabel: string
  applicationsLabel: string
  usedInLabel: string
  videoLabel: string
}

interface TechnologyCardProps {
  tech: TechnologyCardData
  labels: Labels
}

export function TechnologyCard({ tech, labels }: TechnologyCardProps) {
  const usageImages = [tech.usageImage1, tech.usageImage2, tech.usageImage3].filter(Boolean) as string[]
  const hasUsageImages = usageImages.length > 0

  return (
    <article className="bg-[#0A0A0A] flex flex-col border border-[#F5F4F0]/10">

      {/* ── Header row ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#F5F4F0]/10">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5F4F0]/30">
          {tech.number}
        </span>
        <div className="flex items-center gap-3">
          <span className="font-n27 font-semibold text-base tracking-tight text-[#F5F4F0]">
            {tech.name}
          </span>
          {tech.videoUrl && (
            <a
              href={tech.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tech.name} — video`}
              className="flex items-center justify-center w-6 h-6 border border-[#F5F4F0]/25 text-[#F5F4F0]/50 hover:border-[#F5F4F0]/55 hover:text-[#F5F4F0]/90 transition-colors duration-300"
            >
              <span className="text-[11px] leading-none" aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* ── Main body: image left + text right ─────────────────── */}
      <div className="flex flex-col sm:flex-row flex-1">

        {/* Left: mainImage or placeholder */}
        <div className="sm:w-[42%] shrink-0 border-b sm:border-b-0 sm:border-r border-[#F5F4F0]/10">
          {tech.mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tech.mainImage}
              alt={tech.name}
              className="w-full h-full object-cover aspect-video sm:aspect-auto sm:min-h-[200px]"
            />
          ) : (
            <div
              className={cn(
                "w-full aspect-video sm:aspect-auto sm:h-full sm:min-h-[160px]",
                "bg-[#080808] flex flex-col items-center justify-center gap-2",
                "relative overflow-hidden"
              )}
            >
              {/* Subtle dot-grid pattern */}
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.04]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id={`dot-${tech.slug}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#dot-${tech.slug})`} />
              </svg>
              <span className="relative font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F4F0]/18">
                {tech.slug}
              </span>
            </div>
          )}
        </div>

        {/* Right: description + applications */}
        <div className="sm:flex-1 flex flex-col px-5 py-5 gap-4">

          {/* Description */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#F5F4F0]/30">
              {labels.descriptionLabel}
            </span>
            <p className="font-n27 font-light text-sm leading-relaxed text-[#F5F4F0]/70">
              {tech.description || <span className="opacity-30 italic">—</span>}
            </p>
          </div>

          {/* Hairline */}
          <div className="border-t border-[#F5F4F0]/10" />

          {/* Applications */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#F5F4F0]/30">
              {labels.applicationsLabel}
            </span>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#F5F4F0]/50 leading-relaxed">
              {tech.applications || <span className="opacity-30 italic">—</span>}
            </p>
          </div>

        </div>
      </div>

      {/* ── Usage images ───────────────────────────────────────── */}
      {hasUsageImages && (
        <>
          <div className="border-t border-[#F5F4F0]/10" />
          <div className="px-5 py-4 flex flex-col gap-3">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#F5F4F0]/30">
              {labels.usedInLabel}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[tech.usageImage1, tech.usageImage2, tech.usageImage3].map((img, i) =>
                img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div
                    key={i}
                    className="w-full aspect-video bg-[#111] border border-[#F5F4F0]/8"
                  />
                )
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Video URL bar ───────────────────────────────────────── */}
      {tech.videoUrl && (
        <>
          <div className="border-t border-[#F5F4F0]/10" />
          <div className="px-5 py-3 flex items-center gap-3">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#F5F4F0]/30 shrink-0">
              {labels.videoLabel}
            </span>
            <a
              href={tech.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[9px] text-[#F5F4F0]/40 hover:text-[#F5F4F0]/70 transition-colors duration-300 truncate"
            >
              {tech.videoUrl}
            </a>
            <span className="ml-auto font-mono text-[10px] text-[#F5F4F0]/30">↗</span>
          </div>
        </>
      )}

    </article>
  )
}

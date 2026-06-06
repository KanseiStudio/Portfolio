import { UsageGallery } from "@/components/technologies/UsageGallery"

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
  const usageImages = [tech.usageImage1, tech.usageImage2, tech.usageImage3]
  const hasUsage    = usageImages.some(Boolean)
  const hasLower    = hasUsage || Boolean(tech.videoUrl)

  return (
    <article className="bg-[#0A0A0A] border border-[#F5F4F0]/20 flex flex-col">

      {/* ── Header: "0N" left · ↗ right ──────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]
                         text-[#F5F4F0]/35 leading-none">
          {tech.number}
        </span>
        {tech.videoUrl ? (
          <a
            href={tech.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tech.name} — video`}
            className="text-[#F5F4F0]/45 hover:text-[#F5F4F0] transition-colors
                       duration-200 leading-none text-lg"
          >
            ↗
          </a>
        ) : (
          <span className="w-4" aria-hidden="true" />
        )}
      </div>

      {/* ── Upper body: mainImage (55%) | name + text (45%) ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[11fr_9fr]
                      border-t border-[#F5F4F0]/20">

        {/* Left: mainImage with uniform padding — image never touches card edge */}
        <div className="border-b lg:border-b-0 lg:border-r border-[#F5F4F0]/20 p-3">
          {tech.mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tech.mainImage}
              alt={tech.name}
              className="w-full object-cover border border-[#F5F4F0]/20"
              style={{ aspectRatio: "16 / 10", display: "block" }}
            />
          ) : (
            <div
              className="w-full bg-[#0D0D0D] border border-[#F5F4F0]/12 flex items-center justify-center"
              style={{ aspectRatio: "16 / 10" }}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.18em]
                               text-[#F5F4F0]/15">
                {tech.slug}
              </span>
            </div>
          )}
        </div>

        {/* Right: name (Fraunces) + DESCRIZIONE + APPLICAZIONI */}
        <div className="flex flex-col gap-5 px-6 py-5">

          <h2
            className="font-fraunces font-normal text-[#F5F4F0] leading-[0.95]
                       tracking-[-0.01em]"
            style={{ fontSize: "clamp(1.75rem, 2.5vw, 2.75rem)" }}
          >
            {tech.name}
          </h2>

          <div className="flex flex-col gap-[6px]">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em]
                             text-[#F5F4F0]/35">
              {labels.descriptionLabel}
            </span>
            <p className="font-n27 font-light text-sm leading-relaxed
                           text-[#F5F4F0]/70">
              {tech.description}
            </p>
          </div>

          <div className="flex flex-col gap-[6px]">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em]
                             text-[#F5F4F0]/35">
              {labels.applicationsLabel}
            </span>
            <p className="font-n27 font-light text-sm leading-relaxed
                           text-[#F5F4F0]/70">
              {tech.applications}
            </p>
          </div>

        </div>
      </div>

      {/* ── Lower body: usage thumbnails (55%) | video URL (45%) ──── */}
      {hasLower && (
        <div className="grid grid-cols-1 lg:grid-cols-[11fr_9fr]
                        border-t border-[#F5F4F0]/20">

          {/* Left: usage images */}
          <div className="px-5 py-4 flex flex-col gap-3
                          border-b lg:border-b-0 lg:border-r border-[#F5F4F0]/20">
            {hasUsage && (
              <>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em]
                                 text-[#F5F4F0]/35">
                  {labels.usedInLabel}
                </span>
                <UsageGallery
                  images={usageImages
                    .filter((src): src is string => src !== null)
                    .map(src => ({ src }))}
                />
              </>
            )}
          </div>

          {/* Right: video URL box */}
          <div className="px-5 py-4 flex flex-col gap-3">
            {tech.videoUrl && (
              <>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em]
                                 text-[#F5F4F0]/35">
                  {labels.videoLabel}
                </span>
                <a
                  href={tech.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3
                             border border-[#F5F4F0]/20
                             hover:border-[#F5F4F0]/40 transition-colors
                             duration-200 group"
                >
                  <span className="font-mono text-[9px] text-[#F5F4F0]/50
                                   group-hover:text-[#F5F4F0]/70 truncate
                                   transition-colors duration-200">
                    {tech.videoUrl}
                  </span>
                  <span className="shrink-0 text-[#F5F4F0]/40
                                   group-hover:text-[#F5F4F0]/70
                                   transition-colors duration-200 text-[11px]">
                    ↗
                  </span>
                </a>
              </>
            )}
          </div>

        </div>
      )}

    </article>
  )
}

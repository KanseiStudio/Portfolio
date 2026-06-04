import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"
import { VideoEmbed } from "@/components/molecules/VideoEmbed"

export interface ProjectHeaderData {
  title: string
  tagline: string | null
  client: string
  year: number
  format: string
  environment: string
  technologies: string
  notes: string | null
  videoUrl: string | null
  posterUrl: string | null
}

export async function ProjectDetailHeader({ data }: { data: ProjectHeaderData }) {
  const t = await getTranslations("Projects")

  const metadataRows = [
    { label: "Client",      value: data.client },
    { label: "Year",        value: String(data.year) },
    { label: "Format",      value: data.format },
    { label: "Environment", value: data.environment },
    { label: "Tech",        value: data.technologies },
    ...(data.notes ? [{ label: "Notes", value: data.notes }] : []),
  ]

  return (
    <Container as="section" className="pt-16 lg:pt-20 pb-16 lg:pb-24">
      <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* ── Left: eyebrow · title · tagline · metadata ───────── */}
        <div className="col-span-12 lg:col-span-5 flex flex-col order-2 lg:order-1">

          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F4F0]/35">
            {t("projectEyebrow")}
          </p>

          <h1 className="mt-3 font-display font-normal leading-[0.92] tracking-[-0.025em] text-[#F5F4F0] text-[clamp(1.9rem,3.5vw,3.5rem)]">
            {data.title}
          </h1>

          {data.tagline && (
            <p className="mt-5 font-n27 font-light text-base lg:text-lg leading-relaxed text-[#F5F4F0]/60 max-w-sm">
              {data.tagline}
            </p>
          )}

          {/* Metadata table */}
          <div className="mt-10 border-t border-[#F5F4F0]/10">
            {metadataRows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_2fr] border-b border-[#F5F4F0]/10 py-2.5 gap-4"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F5F4F0]/30 leading-relaxed">
                  {row.label}
                </span>
                <span className="font-n27 font-light text-sm text-[#F5F4F0]/70 leading-relaxed">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: video embed ───────────────────────────────── */}
        <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
          <VideoEmbed
            videoUrl={data.videoUrl}
            posterUrl={data.posterUrl}
            aspectRatio="video"
            caption={data.title}
          />
        </div>

      </div>
    </Container>
  )
}

import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"
import { MetadataTable } from "@/components/molecules/MetadataTable"
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
    { label: "Client", value: data.client },
    { label: "Year", value: String(data.year) },
    { label: "Format", value: data.format },
    { label: "Environment", value: data.environment },
    { label: "Technologies", value: data.technologies },
    ...(data.notes ? [{ label: "Notes", value: data.notes }] : []),
  ]

  return (
    <Container as="section" className="pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="grid grid-cols-12 gap-8 lg:gap-12">
        {/* Left: eyebrow + title + metadata */}
        <div className="col-span-12 lg:col-span-5 flex flex-col">
          <p className="text-eyebrow font-mono uppercase tracking-widest text-ks-fg opacity-60">
            {t("projectEyebrow")}
          </p>
          <h1 className="mt-4 font-display text-ks-h1 leading-[0.95] tracking-tight text-ks-fg">
            {data.title}
          </h1>
          {data.tagline && (
            <p className="mt-6 text-base font-body leading-relaxed text-ks-fg opacity-80">
              {data.tagline}
            </p>
          )}
          <div className="mt-12">
            <MetadataTable rows={metadataRows} />
          </div>
        </div>

        {/* Right: video embed */}
        <div className="col-span-12 lg:col-span-7">
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

import { cn } from "@/lib/utils"
import { Container } from "@/components/atoms/Container"
import { MetadataTable } from "@/components/molecules/MetadataTable"
import { VideoEmbed } from "@/components/molecules/VideoEmbed"
import { RevealText } from "@/components/molecules/RevealText"

interface ProjectHeaderProps {
  className?: string
}

export function ProjectHeader({ className }: ProjectHeaderProps) {
  return (
    <section id="project-header" className={cn("w-full", className)}>
      <Container className="pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="grid grid-cols-12 gap-8">

          {/* Left: eyebrow + title + metadata */}
          <div className="col-span-12 lg:col-span-5">
            <RevealText as="p" className="text-small font-body opacity-70">
              Project:
            </RevealText>

            <RevealText
              as="h1"
              delay={200}
              className="text-5xl lg:text-6xl font-display font-normal leading-[0.95] tracking-[-0.025em] mt-4"
            >
              Lumen Field System
            </RevealText>

            <RevealText as="div" delay={400} className="mt-12">
              <MetadataTable
                rows={[
                  { label: "Client", value: "Lumen Technologies" },
                  { label: "Year", value: "2024" },
                  { label: "Format", value: "Interactive Installation" },
                  { label: "Environment", value: "Stadium / Large Scale" },
                  {
                    label: "Technologies",
                    value:
                      "Three.js · WebGL · AI · TouchDesigner · Node.js · WebSocket · LED Systems",
                  },
                ]}
              />
            </RevealText>
          </div>

          {/* Right: video embed */}
          <div className="col-span-12 mt-8 lg:mt-0 lg:col-span-7">
            <RevealText as="div" delay={200}>
              <VideoEmbed />
            </RevealText>
          </div>

        </div>
      </Container>
    </section>
  )
}

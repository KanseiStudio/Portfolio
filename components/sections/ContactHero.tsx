import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"
import { MetadataTable } from "@/components/molecules/MetadataTable"
import { GenerativeVisual } from "@/components/atoms/GenerativeVisual"
import { RevealText } from "@/components/molecules/RevealText"

interface ContactHeroProps {
  studioName: string
  email: string
  location: string
  availability: string
  focus: string
}

export async function ContactHero({
  studioName,
  email,
  location,
  availability,
  focus,
}: ContactHeroProps) {
  const t = await getTranslations("Contact")

  const titleLines = t("heroTitle").split("\n")

  const studioInfo = [
    { label: t("studioLabel"), value: studioName },
    { label: t("locationLabel"), value: location },
    { label: t("availabilityLabel"), value: availability },
    { label: t("emailLabel"), value: email },
    { label: t("focusLabel"), value: focus },
  ]

  return (
    <Container as="section" className="pt-32 lg:pt-40 pb-16 lg:pb-24">
      <div className="grid grid-cols-12 gap-8 lg:gap-12">

        {/* Left: title + description + metadata */}
        <div className="col-span-12 lg:col-span-5">
          <RevealText
            as="h1"
            className="font-display text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight"
          >
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </RevealText>

          <RevealText
            as="p"
            delay={200}
            className="mt-8 text-body font-body leading-relaxed opacity-90 max-w-md"
          >
            {t("heroDescription")}
          </RevealText>

          <RevealText as="div" delay={400} className="mt-12">
            <MetadataTable rows={studioInfo} />
          </RevealText>
        </div>

        {/* Right: generative visual */}
        <div className="col-span-12 mt-10 lg:mt-0 lg:col-span-7">
          <GenerativeVisual
            variant="shell-contact"
            alt="Kansei Studio — Contact visual"
            className="w-full aspect-square lg:aspect-[4/5]"
            priority
          />
        </div>

      </div>
    </Container>
  )
}

import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import { Container } from "@/components/atoms/Container"
import { CirclePlusButton } from "@/components/atoms/CirclePlusButton"
import { GenerativeVisual } from "@/components/atoms/GenerativeVisual"
import { RevealText } from "@/components/molecules/RevealText"

interface AboutHeroProps {
  className?: string
}

export async function AboutHero({ className }: AboutHeroProps) {
  const t = await getTranslations("About")

  return (
    <section id="about-hero" className={cn("w-full", className)}>
      <Container className="pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="grid grid-cols-12 gap-8">

          {/* Left: text */}
          <div className="col-span-12 lg:col-span-5">
            <RevealText
              as="h1"
              className="text-[2.25rem] sm:text-5xl lg:text-6xl font-display font-normal leading-[0.95] tracking-[-0.025em] whitespace-pre-line"
            >
              {t("title")}
            </RevealText>

            <RevealText
              as="p"
              delay={200}
              className="text-base font-body mt-12 leading-relaxed opacity-90 max-w-md"
            >
              {t("description")}
            </RevealText>

            <RevealText as="div" delay={400} className="flex items-center gap-3 mt-12">
              <span className="text-small font-body font-medium text-ks-fg">
                {t("philosophyCta")}
              </span>
              <CirclePlusButton
                icon="plus"
                size="md"
                aria-label={t("philosophyCta")}
                href="#"
              />
            </RevealText>
          </div>

          {/* Right: visual */}
          <div className="col-span-12 mt-10 lg:mt-0 lg:col-span-7">
            <GenerativeVisual
              variant="tree-about"
              alt="Kansei Studio generative tree visualization — about"
            />
          </div>

        </div>
      </Container>
    </section>
  )
}

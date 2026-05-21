import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { NumberedFeatureCard } from "@/components/molecules/NumberedFeatureCard"
import { RevealText } from "@/components/molecules/RevealText"

interface ServicesGridProps {
  className?: string
}

const descriptions = [
  "We design immersive interfaces and AR/VR experiences that push the boundaries of human-computer interaction.",
  "Sensory systems for stadiums, museums, and events. Data-driven installations that respond to human presence.",
  "Intelligent environments and adaptive interfaces built on top of modern AI primitives.",
  "Experiences that span physical and digital — from shopping malls to large-scale stadium installations.",
]

export async function ServicesGrid({ className }: ServicesGridProps) {
  const t = await getTranslations("Services")

  const services = (["01", "02", "03", "04"] as const).map((key, i) => ({
    number: key,
    title: t(`${key}.title`),
    description: descriptions[i],
    items: t.raw(`${key}.items`) as string[],
  }))

  return (
    <section id="services" className={cn("w-full", className)}>
      <Container className="pt-0 pb-16 lg:pb-[120px]">
        <HairlineDivider className="mt-0 mb-0" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {services.map((svc, i) => (
            <RevealText
              key={svc.number}
              as="div"
              delay={i * 100}
              className={cn(
                "h-full py-10 lg:py-12",
                i === 0 && "lg:pr-6",
                i === 1 && "lg:px-6",
                i === 2 && "lg:px-6",
                i === 3 && "lg:pl-6",
                i > 0 && "border-t border-ks-hairline-active",
                i === 1 && "md:border-l md:border-t-0",
                i === 3 && "md:border-l",
                i > 0 && "lg:border-l lg:border-t-0",
              )}
            >
              <NumberedFeatureCard
                number={svc.number}
                title={svc.title}
                description={svc.description}
                items={svc.items}
              />
            </RevealText>
          ))}
        </div>
      </Container>
    </section>
  )
}

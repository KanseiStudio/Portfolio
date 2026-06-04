import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { NumberedFeatureCard } from "@/components/molecules/NumberedFeatureCard"
import { RevealText } from "@/components/molecules/RevealText"

export async function CompetenceGrid() {
  const t = await getTranslations("Services")

  const items = (["01", "02", "03", "04"] as const).map((key) => ({
    number: key,
    title: t(`${key}.title`),
    description: t(`${key}.description`),
    items: t.raw(`${key}.items`) as string[],
  }))

  return (
    <section id="competence" className="w-full dark-section">
      <Container className="pt-0 pb-16 lg:pb-[120px]">
        <HairlineDivider className="mt-0 mb-0" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {items.map((item, i) => (
            <RevealText
              key={item.number}
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
                number={item.number}
                title={item.title}
                description={item.description}
                items={item.items}
              />
            </RevealText>
          ))}
        </div>
      </Container>
    </section>
  )
}

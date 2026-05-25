import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"

interface Service {
  number: string
  title: string
  description: string
  bullets: string[]
}

export async function HomeServices() {
  const t = await getTranslations("HomeServices")

  const services: Service[] = [
    {
      number: t("service01.number"),
      title: t("service01.title"),
      description: t("service01.description"),
      bullets: t.raw("service01.bullets") as string[],
    },
    {
      number: t("service02.number"),
      title: t("service02.title"),
      description: t("service02.description"),
      bullets: t.raw("service02.bullets") as string[],
    },
    {
      number: t("service03.number"),
      title: t("service03.title"),
      description: t("service03.description"),
      bullets: t.raw("service03.bullets") as string[],
    },
    {
      number: t("service04.number"),
      title: t("service04.title"),
      description: t("service04.description"),
      bullets: t.raw("service04.bullets") as string[],
    },
  ]

  return (
    <Container as="section" className="py-8 lg:py-10 border-t border-ks-hairline-active">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
        {services.map((service) => (
          <article key={service.number} className="space-y-4">

            {/* Numero */}
            <p className="font-mono text-xs uppercase tracking-widest opacity-60">
              {service.number}
            </p>

            {/* Title */}
            <h3 className="font-n27 font-medium text-2xl leading-tight">
              {service.title}
            </h3>

            {/* Description */}
            <p className="font-n27 font-light text-sm leading-relaxed opacity-80">
              {service.description}
            </p>

            {/* Bullet list */}
            <ul className="space-y-2 pt-4 border-t border-ks-hairline-active">
              {service.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="font-n27 font-normal text-sm leading-snug opacity-70 flex gap-3"
                >
                  <span className="opacity-40">·</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

          </article>
        ))}
      </div>
    </Container>
  )
}

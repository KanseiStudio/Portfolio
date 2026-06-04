import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"

interface Capability {
  number: string
  title: string
  description: string
  bullets: string[]
}

export async function HomeServices() {
  const t = await getTranslations("HomeServices")

  const capabilities: Capability[] = [
    {
      number:      t("service01.number"),
      title:       t("service01.title"),
      description: t("service01.description"),
      bullets:     t.raw("service01.bullets") as string[],
    },
    {
      number:      t("service02.number"),
      title:       t("service02.title"),
      description: t("service02.description"),
      bullets:     t.raw("service02.bullets") as string[],
    },
    {
      number:      t("service03.number"),
      title:       t("service03.title"),
      description: t("service03.description"),
      bullets:     t.raw("service03.bullets") as string[],
    },
    {
      number:      t("service04.number"),
      title:       t("service04.title"),
      description: t("service04.description"),
      bullets:     t.raw("service04.bullets") as string[],
    },
  ]

  return (
    <section className="border-t border-[#F5F4F0]/10">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#F5F4F0]/8">
          {capabilities.map((cap) => (
            <article
              key={cap.number}
              className="bg-[#0A0A0A] p-6 lg:p-8 flex flex-col gap-4"
            >
              {/* Number */}
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5F4F0]/30">
                {cap.number}
              </span>

              {/* Title */}
              <h3 className="font-n27 font-semibold text-xl lg:text-2xl leading-tight text-[#F5F4F0]">
                {cap.title}
              </h3>

              {/* Description */}
              <p className="font-n27 font-light text-sm leading-relaxed text-[#F5F4F0]/60">
                {cap.description}
              </p>

              {/* Bullets */}
              <ul className="mt-auto pt-5 border-t border-[#F5F4F0]/10 space-y-2.5">
                {cap.bullets.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 font-mono text-[10px] uppercase tracking-wider text-[#F5F4F0]/45 leading-snug"
                  >
                    <span className="shrink-0 opacity-40 mt-px">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

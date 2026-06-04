import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"

export async function PhilosophySection() {
  const t = await getTranslations("Philosophy")

  const blocks = [
    { n: "01", title: t("block1Title"), body: t("block1Body") },
    { n: "02", title: t("block2Title"), body: t("block2Body") },
    { n: "03", title: t("block3Title"), body: t("block3Body") },
  ]

  return (
    <section
      id="filosofia"
      className="w-full scroll-mt-20 border-t border-[#F5F4F0]/10"
    >
      <Container className="pt-12 lg:pt-16 pb-16 lg:pb-[120px]">

        {/* Eyebrow */}
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F4F0]/35 mb-12 lg:mb-16">
          {t("eyebrow")}
        </p>

        {/* Three blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {blocks.map(({ n, title, body }, i) => (
            <div
              key={n}
              className={[
                "flex flex-col gap-5 py-8 lg:py-0",
                "border-t border-[#F5F4F0]/10 lg:border-t-0",
                i === 0 ? "border-t-0 pt-0" : "",
                i > 0 ? "lg:border-l lg:border-[#F5F4F0]/10 lg:pl-10" : "",
                i < 2 ? "lg:pr-10" : "",
              ].filter(Boolean).join(" ")}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5F4F0]/28">
                {n}
              </span>

              <h2 className="font-display font-normal leading-[1.05] tracking-[-0.02em] text-[#F5F4F0] text-[clamp(1.4rem,2.2vw,1.875rem)]">
                {title}
              </h2>

              <p className="font-n27 font-light text-base leading-relaxed text-[#F5F4F0]/60">
                {body}
              </p>
            </div>
          ))}
        </div>

      </Container>
    </section>
  )
}

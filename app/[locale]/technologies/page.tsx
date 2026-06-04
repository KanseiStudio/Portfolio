import { setRequestLocale, getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { TechnologyCard } from "@/components/molecules/TechnologyCard"
import type { TechnologyCardData } from "@/components/molecules/TechnologyCard"

export default async function TechnologiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("Technologies")

  const technologies = await prisma.technology.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: { translations: { where: { locale } } },
  })

  const shaped: TechnologyCardData[] = technologies.map((tech, index) => {
    const tr = tech.translations[0]
    return {
      number: String(index + 1).padStart(2, "0"),
      slug: tech.slug,
      name: tech.name,
      videoUrl: tech.videoUrl,
      mainImage: tech.mainImage,
      usageImage1: tech.usageImage1,
      usageImage2: tech.usageImage2,
      usageImage3: tech.usageImage3,
      description: tr?.description ?? "",
      applications: tr?.applications ?? "",
    }
  })

  const labels = {
    descriptionLabel:  t("descriptionLabel"),
    applicationsLabel: t("applicationsLabel"),
    usedInLabel:       t("usedInLabel"),
    videoLabel:        t("videoLabel"),
  }

  return (
    <main>

      {/* ── Page header — full-width, px matches HUD rail ─────── */}
      <section className="w-full px-6 lg:px-16 pt-16 lg:pt-24 pb-12 lg:pb-16">
        <div className="flex items-end justify-between gap-6">

          <div className="flex flex-col gap-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F4F0]/35">
              {t("sectionLabel")}
            </p>
            <h1 className="font-fraunces font-normal text-[#F5F4F0]"
                style={{ fontSize: "clamp(2.25rem, 3.8vw, 3.75rem)", lineHeight: "0.95", letterSpacing: "-0.015em" }}>
              {t("title")}
            </h1>
            <p className="font-n27 font-light text-base lg:text-lg leading-relaxed text-[#F5F4F0]/55 max-w-xl mt-2">
              {t("description")}
            </p>
          </div>

          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5F4F0]/25 shrink-0 pb-1">
            {String(technologies.length).padStart(2, "0")} / 04
          </span>

        </div>
      </section>

      <HairlineDivider className="my-0 border-[#F5F4F0]/20" />

      {/* ── 2×2 grid — contained (px-16), real gap, cards bordered ─ */}
      <div className="px-6 lg:px-16 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {shaped.map((tech) => (
            <TechnologyCard key={tech.slug} tech={tech} labels={labels} />
          ))}
        </div>
      </div>

    </main>
  )
}

export function generateStaticParams() {
  return [{ locale: "it" }, { locale: "en" }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Technologies" })
  return {
    title: `${t("title")} · Kansei Studio`,
    description: t("description"),
  }
}

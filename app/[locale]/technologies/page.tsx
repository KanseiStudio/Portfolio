import { setRequestLocale, getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/atoms/Container"
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

      {/* ── Page header ────────────────────────────────────────── */}
      <Container as="section" className="pt-16 lg:pt-24 pb-12 lg:pb-16">
        <div className="grid grid-cols-12 gap-6 items-end">

          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F4F0]/35">
              {t("sectionLabel")}
            </p>
            <h1 className="font-display font-normal leading-[0.92] tracking-[-0.025em] text-[#F5F4F0] text-[clamp(3rem,7vw,6rem)]">
              {t("title")}
            </h1>
            <p className="font-n27 font-light text-base lg:text-lg leading-relaxed text-[#F5F4F0]/55 max-w-xl mt-2">
              {t("description")}
            </p>
          </div>

          {/* Count badge */}
          <div className="col-span-12 lg:col-span-4 lg:text-right">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5F4F0]/25">
              {String(technologies.length).padStart(2, "0")} / 04
            </span>
          </div>

        </div>
      </Container>

      <HairlineDivider className="my-0 border-[#F5F4F0]/10" />

      {/* ── 2×2 grid ───────────────────────────────────────────── */}
      <Container className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#F5F4F0]/8">
          {shaped.map((tech) => (
            <TechnologyCard key={tech.slug} tech={tech} labels={labels} />
          ))}
        </div>
      </Container>

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

import { getTranslations } from "next-intl/server"
import { ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Container } from "@/components/atoms/Container"

export async function ProjectBackLink() {
  const t = await getTranslations("Projects")

  return (
    <Container as="section" className="py-16 lg:py-20">
      <Link
        href={"/projects" as never}
        className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[#F5F4F0]/40 hover:text-[#F5F4F0]/80 group transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#F5F4F0]/40 focus-visible:outline-offset-4"
      >
        <ArrowLeft
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-600 ease-kansei group-hover:-translate-x-1"
        />
        <span>{t("backToArchive")}</span>
      </Link>
    </Container>
  )
}

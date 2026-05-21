import { getTranslations } from "next-intl/server"
import { ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Container } from "@/components/atoms/Container"

export async function ProjectBackLink() {
  const t = await getTranslations("Projects")

  return (
    <Container as="section" className="py-16 lg:py-24">
      <Link
        href={"/projects" as never}
        className="inline-flex items-center gap-3 text-small font-medium text-ks-fg group focus-visible:outline focus-visible:outline-1 focus-visible:outline-ks-fg focus-visible:outline-offset-4"
      >
        <ArrowLeft
          size={16}
          strokeWidth={1.5}
          className="transition-transform duration-600 ease-kansei group-hover:-translate-x-1"
        />
        <span className="group-hover:underline underline-offset-4">
          {t("backToArchive")}
        </span>
      </Link>
    </Container>
  )
}

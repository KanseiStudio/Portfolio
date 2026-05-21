import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"

export async function ProjectProblemSolution({
  problem,
  solution,
}: {
  problem: string | null
  solution: string | null
}) {
  if (!problem && !solution) return null

  const t = await getTranslations("Projects")

  return (
    <Container as="section" className="py-16 lg:py-24">
      <div className="grid grid-cols-12 gap-8 lg:gap-12">
        {problem && (
          <div className="col-span-12 lg:col-span-6">
            <h2 className="font-display text-ks-h2 leading-tight tracking-tight text-ks-fg">
              {t("problemHeading")}
            </h2>
            <p className="mt-6 text-base font-body leading-relaxed text-ks-fg opacity-90 whitespace-pre-line">
              {problem}
            </p>
          </div>
        )}

        {solution && (
          <div className="col-span-12 lg:col-span-6">
            <h2 className="font-display text-ks-h2 leading-tight tracking-tight text-ks-fg">
              {t("solutionHeading")}
            </h2>
            <p className="mt-6 text-base font-body leading-relaxed text-ks-fg opacity-90 whitespace-pre-line">
              {solution}
            </p>
          </div>
        )}
      </div>
    </Container>
  )
}

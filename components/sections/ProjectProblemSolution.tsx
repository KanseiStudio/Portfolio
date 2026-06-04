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
      <div className="grid grid-cols-12 gap-x-8 gap-y-12 lg:gap-x-16">

        {problem && (
          <div className="col-span-12 lg:col-span-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F4F0]/35 mb-6">
              {t("problemHeading")}
            </p>
            <p className="font-n27 font-light text-base lg:text-lg leading-relaxed text-[#F5F4F0]/65 whitespace-pre-line">
              {problem}
            </p>
          </div>
        )}

        {solution && (
          <div className="col-span-12 lg:col-span-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F4F0]/35 mb-6">
              {t("solutionHeading")}
            </p>
            <p className="font-n27 font-light text-base lg:text-lg leading-relaxed text-[#F5F4F0]/65 whitespace-pre-line">
              {solution}
            </p>
          </div>
        )}

      </div>
    </Container>
  )
}

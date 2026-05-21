import { cn } from "@/lib/utils"
import { Container } from "@/components/atoms/Container"
import { RevealText } from "@/components/molecules/RevealText"

interface ProblemSolutionProps {
  className?: string
}

export function ProblemSolution({ className }: ProblemSolutionProps) {
  return (
    <section id="problem-solution" className={cn("w-full", className)}>
      <Container className="py-24 lg:py-32">
        <div className="grid grid-cols-12 gap-y-12 gap-x-8 lg:gap-x-16">

          {/* The Problem */}
          <div className="col-span-12 lg:col-span-6">
            <RevealText
              as="h2"
              className="text-3xl lg:text-4xl font-display font-normal leading-[1.05] tracking-[-0.02em]"
            >
              The Problem
            </RevealText>
            <RevealText
              as="p"
              delay={200}
              className="text-base font-body mt-6 leading-relaxed opacity-90 max-w-md"
            >
              Stadium environments are often disconnected from the emotional rhythm of events.
              Audiences want more than information — they want to feel part of a living atmosphere
              that reacts in real time.
            </RevealText>
          </div>

          {/* Technological Solution */}
          <div className="col-span-12 lg:col-span-6">
            <RevealText
              as="h2"
              delay={100}
              className="text-3xl lg:text-4xl font-display font-normal leading-[1.05] tracking-[-0.02em]"
            >
              Technological Solution
            </RevealText>
            <RevealText
              as="p"
              delay={300}
              className="text-base font-body mt-6 leading-relaxed opacity-90 max-w-md"
            >
              We developed Lumen Field System, an intelligent visualization platform that captures
              live data — crowd energy, sound, and motion — and transforms it into a synchronized
              light and visual experience across the stadium.
            </RevealText>
          </div>

        </div>
      </Container>
    </section>
  )
}

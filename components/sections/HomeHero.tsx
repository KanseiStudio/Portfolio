import { cn } from "@/lib/utils"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { GenerativeVisual } from "@/components/atoms/GenerativeVisual"
import { RevealText } from "@/components/molecules/RevealText"

interface HomeHeroProps {
  title: string
  tagline?: string
  description: string
  visualSrc: string
  visualAlt: string
  className?: string
}

export function HomeHero({
  title,
  tagline,
  description,
  visualAlt,
  className,
}: HomeHeroProps) {
  const taglineParts = tagline?.split("|").map((p) => p.trim()) ?? []

  return (
    <section id="home" className={cn("w-full", className)}>

      <HairlineDivider className="my-0" />

      {/* ── Hero grid ─────────────────────────────────────────── */}
      <Container className="pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="grid grid-cols-12 gap-8">

          {/* Left: text ── col-span-12 mobile, col-span-5 lg */}
          <div className="col-span-12 lg:col-span-5">
            <RevealText
              as="h1"
              className="text-[2.5rem] sm:text-[4rem] lg:text-[7rem] font-display font-normal leading-[0.9] tracking-[-0.03em] whitespace-pre-line"
            >
              {title}
            </RevealText>

            <HairlineDivider variant="half" className="my-8" />

            {taglineParts.length > 0 && (
              <RevealText
                as="p"
                delay={200}
                className="text-eyebrow font-mono uppercase tracking-widest opacity-60"
              >
                {taglineParts.map((part, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <span className="mx-2 opacity-50" aria-hidden="true">
                        │
                      </span>
                    )}
                    {part}
                  </span>
                ))}
              </RevealText>
            )}

            <RevealText
              as="p"
              delay={400}
              className="text-base font-body mt-10 leading-relaxed opacity-80 max-w-sm"
            >
              {description}
            </RevealText>
          </div>

          {/* Right: generative visual ── col-span-12 mobile, col-span-7 lg */}
          <div className="col-span-12 mt-10 lg:mt-0 lg:col-span-7">
            {/*
              visualSrc is reserved for when /public/visuals/tree-home.png exists (Task 09).
              GenerativeVisual shows a placeholder until that file is in place.
            */}
            <GenerativeVisual variant="tree-home" priority alt={visualAlt} />
          </div>

        </div>
      </Container>
    </section>
  )
}

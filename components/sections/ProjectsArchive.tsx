"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { SlidersHorizontal } from "lucide-react"
import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { ProjectCard } from "@/components/molecules/ProjectCard"
import { cn } from "@/lib/utils"

export interface ArchiveProject {
  id: number
  slug: string
  year: number
  title: string
  description: string
  tagline: string | null
  posterUrl: string | null
  videoUrl: string | null
  technologies: string
  categoryIds: number[]
  categoryNames: string[]
}

export interface ArchiveCategory {
  id: number
  slug: string
  name: string
}

export function ProjectsArchive({
  projects,
  categories,
}: {
  projects: ArchiveProject[]
  categories: ArchiveCategory[]
}) {
  const t = useTranslations("Projects")
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)

  const filteredProjects = useMemo(() => {
    if (activeCategoryId === null) return projects
    return projects.filter((p) => p.categoryIds.includes(activeCategoryId))
  }, [projects, activeCategoryId])

  return (
    <>
      {/* Filter Bar */}
      <Container as="section" className="py-8 lg:py-10">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Counter */}
          <div className="col-span-12 lg:col-span-3 flex items-center gap-3">
            <SlidersHorizontal
              size={16}
              strokeWidth={1.5}
              className="text-ks-fg opacity-60"
            />
            <span className="text-eyebrow font-mono text-ks-fg opacity-80">
              {t("counterFormat", {
                visible: filteredProjects.length,
                total: projects.length,
              })}
            </span>
          </div>

          {/* Filter pills */}
          <div className="col-span-12 lg:col-span-9 flex flex-wrap gap-2 lg:justify-end">
            <FilterPill
              active={activeCategoryId === null}
              onClick={() => setActiveCategoryId(null)}
            >
              {t("filterAll")}
            </FilterPill>
            {categories.map((cat) => (
              <FilterPill
                key={cat.id}
                active={activeCategoryId === cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
              >
                {cat.name}
              </FilterPill>
            ))}
          </div>
        </div>
      </Container>

      <HairlineDivider className="my-0" />

      {/* Project Grid */}
      <Container as="section" className="py-16 lg:py-24">
        {filteredProjects.length === 0 ? (
          <p className="text-base text-ks-fg opacity-60 py-24 text-center">
            {t("noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx + 1}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-small font-medium transition-colors duration-600 ease-kansei border",
        active
          ? "border-ks-fg bg-ks-fg text-ks-bg"
          : "border-ks-hairline-active text-ks-fg hover:border-ks-fg"
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

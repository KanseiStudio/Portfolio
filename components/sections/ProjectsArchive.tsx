"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { SlidersHorizontal, LayoutGrid } from "lucide-react"
import { Container } from "@/components/atoms/Container"
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

  const visibleStr  = filteredProjects.length.toString().padStart(2, "0")
  const totalStr    = projects.length.toString().padStart(2, "0")

  const chips = (
    <>
      <FilterChip
        active={activeCategoryId === null}
        onClick={() => setActiveCategoryId(null)}
      >
        {t("filterAll")}
      </FilterChip>
      {categories.map((cat) => (
        <FilterChip
          key={cat.id}
          active={activeCategoryId === cat.id}
          onClick={() => setActiveCategoryId(cat.id)}
        >
          {cat.name}
        </FilterChip>
      ))}
    </>
  )

  const icons = (
    <>
      <SlidersHorizontal
        size={13}
        strokeWidth={1.5}
        className="text-[#F5F4F0]/35 hover:text-[#F5F4F0]/70 cursor-pointer transition-colors duration-300"
      />
      <LayoutGrid
        size={13}
        strokeWidth={1.5}
        className="text-[#F5F4F0]/35 hover:text-[#F5F4F0]/70 cursor-pointer transition-colors duration-300"
      />
    </>
  )

  return (
    <>
      {/* ── Filter bar ──────────────────────────────────────────── */}
      <div className="border-t border-[#F5F4F0]/10">
        <Container className="py-4 lg:py-6">

          {/* Mobile: row-1 = counter + icons / row-2 = chips */}
          <div className="flex flex-col gap-3 lg:hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5F4F0]/35 tabular-nums">
                {visibleStr} / {totalStr}
              </span>
              <div className="flex items-center gap-3">{icons}</div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">{chips}</div>
          </div>

          {/* Desktop: single row — counter / chips / icons */}
          <div className="hidden lg:flex items-center gap-4 justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5F4F0]/35 tabular-nums shrink-0">
              {visibleStr} / {totalStr}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">{chips}</div>
            <div className="flex items-center gap-3 shrink-0">{icons}</div>
          </div>

        </Container>
      </div>

      {/* ── Project grid ────────────────────────────────────────── */}
      <Container as="section" className="pt-10 pb-16 lg:pb-24">
        {filteredProjects.length === 0 ? (
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#F5F4F0]/35 py-24 text-center">
            {t("noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-12 lg:gap-y-16">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx + 1} />
            ))}
          </div>
        )}
      </Container>
    </>
  )
}

function FilterChip({
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
        "px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.13em] border transition-colors duration-300",
        active
          ? "border-[#F5F4F0]/50 bg-[#F5F4F0]/8 text-[#F5F4F0]/90"
          : "border-[#F5F4F0]/14 text-[#F5F4F0]/40 hover:border-[#F5F4F0]/35 hover:text-[#F5F4F0]/70"
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

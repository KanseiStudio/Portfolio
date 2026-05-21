"use client"

import { Link } from "@/i18n/routing"
import { ArrowUpRight } from "lucide-react"
import { GenerativeVisual } from "@/components/atoms/GenerativeVisual"
import type { ArchiveProject } from "@/components/sections/ProjectsArchive"

export function ProjectCard({
  project,
  index,
}: {
  project: ArchiveProject
  index: number
}) {
  const indexLabel = String(index).padStart(2, "0")

  return (
    <Link
      href={`/projects/${project.slug}` as never}
      className="group block focus-visible:outline focus-visible:outline-1 focus-visible:outline-ks-fg focus-visible:outline-offset-4"
      aria-label={`Open project: ${project.title}`}
    >
      {/* Top row: index + arrow */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-eyebrow font-mono text-ks-fg opacity-70">{indexLabel}</span>
        <ArrowUpRight
          size={18}
          strokeWidth={1.5}
          className="text-ks-fg opacity-70 transition-transform duration-600 ease-kansei group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>

      {/* Poster / generative visual */}
      <div className="relative aspect-video bg-ks-dark-bg overflow-hidden">
        {project.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.posterUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-1200 ease-kansei group-hover:scale-[1.02]"
          />
        ) : (
          <GenerativeVisual
            variant="wave-project"
            alt={project.title}
            className="w-full h-full"
            dark
          />
        )}
      </div>

      {/* Title */}
      <h3 className="mt-6 font-display text-2xl lg:text-3xl leading-tight tracking-tight text-ks-fg">
        {project.title}
      </h3>

      {/* Tags row */}
      <p className="mt-3 text-eyebrow font-mono uppercase tracking-widest text-ks-fg opacity-60">
        {project.categoryNames.join(" · ")} · {project.year}
      </p>
    </Link>
  )
}

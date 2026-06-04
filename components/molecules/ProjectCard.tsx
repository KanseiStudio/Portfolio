"use client"

import { Link } from "@/i18n/routing"
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
      className="group block focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#F5F4F0]/50 focus-visible:outline-offset-4"
      aria-label={project.title}
    >
      {/* Index */}
      <div className="mb-2.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5F4F0]/28">
          {indexLabel}
        </span>
      </div>

      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-[#0D0D0D]">
        {project.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.posterUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(245,244,240,0.03) 0%, transparent 70%)",
            }}
          >
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#F5F4F0]/14">
              {project.slug}
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-4 font-display font-normal text-xl lg:text-[1.4rem] leading-[1.1] tracking-[-0.02em] text-[#F5F4F0] transition-opacity duration-300 group-hover:opacity-70">
        {project.title}
      </h3>

      {/* Year */}
      <p className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#F5F4F0]/35">
        · {project.year}
      </p>
    </Link>
  )
}

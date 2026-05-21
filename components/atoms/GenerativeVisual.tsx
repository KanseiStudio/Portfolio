"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export type VisualVariant = "tree-home" | "tree-about" | "shell-contact" | "wave-project"

interface GenerativeVisualProps {
  variant: VisualVariant
  className?: string
  priority?: boolean
  alt?: string
  /** Use light text / transparent border for dark backgrounds (e.g. VideoEmbed) */
  dark?: boolean
}

export function GenerativeVisual({
  variant,
  className,
  priority = false,
  alt,
  dark = false,
}: GenerativeVisualProps) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      role="img"
      aria-label={alt ?? `${variant} generative visual`}
      className={cn("relative w-full", className)}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReduced ? 0 : 1.2,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/*
        Placeholder until generative PNGs are created in Task 09.
        To activate: place /public/visuals/{variant}.png and replace this block
        with <Image src={`/visuals/${variant}.png`} alt={alt ?? ""} fill priority={priority}
                     sizes="(max-width: 1024px) 100vw, 58vw" className="object-contain" />
      */}
      <div
        className={cn(
          "w-full flex flex-col items-center justify-center gap-3 select-none border",
          dark
            ? "h-full border-[rgba(245,244,240,0.12)]"
            : "aspect-[4/5] border-ks-hairline-active"
        )}
      >
        <span
          className={cn(
            "text-mono-ks font-mono opacity-30",
            dark ? "text-ks-dark-fg" : "text-ks-fg"
          )}
        >
          placeholder · {variant}
        </span>
        <span
          className={cn(
            "text-micro font-mono opacity-20",
            dark ? "text-ks-dark-fg" : "text-ks-fg"
          )}
        >
          /public/visuals/{variant}.png
        </span>
      </div>
    </motion.div>
  )
}

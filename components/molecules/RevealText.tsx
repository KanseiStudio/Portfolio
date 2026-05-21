"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

type TagType = "h1" | "h2" | "h3" | "p" | "div" | "span"

const tagMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
  span: motion.span,
} as const

interface RevealTextProps {
  children: React.ReactNode
  as?: TagType
  delay?: number
  duration?: number
  className?: string
}

export function RevealText({
  children,
  as = "div",
  delay = 0,
  duration = 800,
  className,
}: RevealTextProps) {
  const prefersReduced = useReducedMotion()
  const Component = tagMap[as]

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: prefersReduced ? 0 : duration / 1000,
        delay: prefersReduced ? 0 : delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Component>
  )
}

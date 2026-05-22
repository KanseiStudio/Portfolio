"use client"

import { useMemo } from "react"
import { motion, useReducedMotion } from "motion/react"

function mulberry32(seed: number): () => number {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Branch {
  x1: number
  y1: number
  x2: number
  y2: number
  dotR: number
  id: string
}

function buildBranches(
  rand: () => number,
  branches: Branch[],
  x: number,
  y: number,
  angle: number,
  length: number,
  depth: number
): void {
  if (depth === 0) return

  const x2 = x + Math.cos(angle) * length
  const y2 = y + Math.sin(angle) * length
  const dotR = 1.5 + rand() * 2.5

  branches.push({ x1: x, y1: y, x2, y2, dotR, id: `b-${branches.length}` })

  const childCount = depth > 4 ? 2 : rand() < 0.3 ? 3 : 2
  const spreadBase = 0.35 + rand() * 0.2

  for (let i = 0; i < childCount; i++) {
    const spread = childCount === 2
      ? (i === 0 ? -spreadBase : spreadBase)
      : (i - 1) * spreadBase * 0.9
    const childAngle = angle + spread + (rand() - 0.5) * 0.15
    const childLength = length * (0.65 + rand() * 0.15)
    buildBranches(rand, branches, x2, y2, childAngle, childLength, depth - 1)
  }
}

export function TreeVisualDemo() {
  const shouldReduceMotion = useReducedMotion()

  const branches = useMemo(() => {
    const rand = mulberry32(42)
    const result: Branch[] = []
    buildBranches(rand, result, 300, 580, -Math.PI / 2, 90, 6)
    return result
  }, [])

  const dotAnimations = useMemo(() => {
    const rand = mulberry32(99)
    return branches.map(() => ({
      duration: 3 + rand() * 3,
      delay: rand() * 4,
    }))
  }, [branches])

  return (
    <svg
      viewBox="0 0 600 600"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <motion.g
        style={{ transformOrigin: "300px 300px" }}
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 180, repeat: Infinity, ease: "linear" }
        }
      >
        {branches.map((b) => (
          <line
            key={`line-${b.id}`}
            x1={b.x1}
            y1={b.y1}
            x2={b.x2}
            y2={b.y2}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}

        {branches.map((b, i) => (
          <motion.circle
            key={`dot-${b.id}`}
            cx={b.x2}
            cy={b.y2}
            r={b.dotR}
            fill="currentColor"
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: [0.4, 1, 0.4] }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: dotAnimations[i].duration,
                    delay: dotAnimations[i].delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{ opacity: 0.4 }}
          />
        ))}
      </motion.g>
    </svg>
  )
}

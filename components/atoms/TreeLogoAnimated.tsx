"use client"

import { useState, useEffect, useRef } from "react"

const CLASS_MAP: Record<string, string> = {
  ramo_sx_grande:    "branch-sx-grande",
  ramo_sx_medio_1:   "branch-sx-medio",
  ramo_sx_piccolo_1: "branch-sx-piccolo-1",
  ramo_sx_piccolo_2: "branch-sx-piccolo-2",
  ramo_dx_grande:    "branch-dx-grande",
  ramo_dx_medio_1:   "branch-dx-medio",
  ramo_dx_piccolo_1: "branch-dx-piccolo-1",
  ramo_dx_piccolo_2: "branch-dx-piccolo-2",
  foglie_fiori:      "leaves",
}

export function TreeLogoAnimated() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    let cancelled = false

    fetch("/logo_svg.svg")
      .then(res => res.text())
      .then(svgText => {
        if (cancelled || !containerRef.current) return

        containerRef.current.innerHTML = svgText

        const svg = containerRef.current.querySelector("svg")
        if (!svg) return

        svg.removeAttribute("width")
        svg.removeAttribute("height")
        svg.setAttribute("width", "100%")
        svg.setAttribute("height", "100%")
        svg.style.display = "block"

        for (const [id, cls] of Object.entries(CLASS_MAP)) {
          const el = svg.getElementById(id)
          if (el) el.classList.add(cls)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      role="img"
      aria-label="Kansei Studio — Logo"
    />
  )
}

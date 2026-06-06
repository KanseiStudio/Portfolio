"use client"

/**
 * LogoRipple — onde che si propagano dal centro del fiore su tutta la pagina.
 *
 * Anti-flicker rules:
 * - useMemo per i delay/duration casuali: calcolati ONCE al mount, mai a ogni render.
 * - Span statici (key=indice fisso), nessun state per-frame, nessun rAF/setInterval.
 * - Animazione pura CSS: transform:scale + opacity via @keyframes.
 * - fixed inset-0: bypassa overflow:hidden su qualsiasi antenato.
 * - Originate dal centro del fiore (~72%/42% del viewport).
 */

import { useEffect, useMemo, useState } from "react"

export function LogoRipple() {
  const [reduced, setReduced] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const h = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])

  // Valori casuali stabili — useMemo garantisce che non cambino tra re-render,
  // ma vengono usati SOLO dopo il mount (mounted=true) per evitare mismatch SSR/client.
  const rings = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        delay:    Math.random() * 7,
        duration: 7 + Math.random() * 4, // 7–11 s
      })),
    []
  )

  if (reduced) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-visible"
      aria-hidden="true"
    >
      {/* Origine ancorata al centro del fiore — lato destro della Home */}
      <div className="absolute" style={{ left: "72%", top: "42%" }}>
        {mounted && rings.map((r, i) => (
          <span
            key={i}
            className="absolute rounded-full border border-white/15"
            style={{
              width:          "420px",
              height:         "420px",
              animation:      `pageRipple ${r.duration}s linear infinite`,
              animationDelay: `${r.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pageRipple {
          0%   { transform: translate(-50%,-50%) scale(.15); opacity: 0;   }
          8%   {                                              opacity: .35; }
          100% { transform: translate(-50%,-50%) scale(6);   opacity: 0;   }
        }
      `}</style>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"

/*
  Hexagram geometry (center 250,250, viewBox 500×500)

  Outer hex R=195  – flat-top, 30° offset:
    30°→(348,81)  90°→(445,250)  150°→(348,419)
   210°→(152,419) 270°→(55,250)  330°→(152,81)

  Triangle-1 (up)  – 0°,120°,240°: (250,55)  (419,348)  (81,348)
  Triangle-2 (down)– 60°,180°,300°: (419,153) (250,445)  (81,153)

  Inner hex  R=113  – same 30° offset:
    30°→(307,152) 90°→(363,250) 150°→(307,348)
   210°→(193,348) 270°→(137,250) 330°→(193,152)

  Extended radials R=235 – compass 0°,60°,120°,180°,240°,300°:
    (250,15) (454,133) (454,367) (250,485) (46,367) (46,133)
*/

interface KanseiHexPatternProps {
  className?: string
}

export function KanseiHexPattern({ className }: KanseiHexPatternProps) {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])

  const animate = mounted && !reducedMotion

  return (
    /* Outer frame ─────────────────────────────────────────────────── */
    <div className={`relative border border-[#F5F4F0]/14 ${className ?? ""}`}>

      {/* Corner tick marks */}
      {(["top-0 left-0 border-t border-l",
         "top-0 right-0 border-t border-r",
         "bottom-0 left-0 border-b border-l",
         "bottom-0 right-0 border-b border-r"] as const).map((pos, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 border-[#F5F4F0]/35 ${pos}`}
          style={{ margin: -1 }}
        />
      ))}

      {/* SVG canvas ───────────────────────────────────────────────── */}
      <div className="relative w-full aspect-square px-6 py-8">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* ── Background rings ─────────────────────────────── */}
          <circle cx="250" cy="250" r="232" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
          <circle cx="250" cy="250" r="195" stroke="white" strokeOpacity="0.07" strokeWidth="0.5" strokeDasharray="3 9" />
          <circle cx="250" cy="250" r="155" stroke="white" strokeOpacity="0.05" strokeWidth="0.4" />
          <circle cx="250" cy="250" r="113" stroke="white" strokeOpacity="0.07" strokeWidth="0.4" strokeDasharray="2 7" />
          <circle cx="250" cy="250" r="68"  stroke="white" strokeOpacity="0.05" strokeWidth="0.4" />

          {/* ── Outer hexagon ────────────────────────────────── */}
          <polygon
            points="348,81 445,250 348,419 152,419 55,250 152,81"
            stroke="white" strokeOpacity="0.16" strokeWidth="0.7"
          />

          {/* ── Triangle 1 (pointing up) ─────────────────────── */}
          <polygon
            points="250,55 419,348 81,348"
            stroke="white" strokeOpacity="0.20" strokeWidth="0.8"
          />

          {/* ── Triangle 2 (pointing down) ───────────────────── */}
          <polygon
            points="419,153 250,445 81,153"
            stroke="white" strokeOpacity="0.20" strokeWidth="0.8"
          />

          {/* ── Inner hexagon (star intersection ring) ──────── */}
          <polygon
            points="307,152 363,250 307,348 193,348 137,250 193,152"
            stroke="white" strokeOpacity="0.30" strokeWidth="0.9"
          />

          {/* ── Radial spokes — center to outer vertices ────── */}
          {[
            [250,55],  [419,153], [419,348],
            [250,445], [81,348],  [81,153],
          ].map(([x,y], i) => (
            <line key={i}
              x1="250" y1="250" x2={x} y2={y}
              stroke="white" strokeOpacity="0.08" strokeWidth="0.5"
            />
          ))}

          {/* ── Extended radials beyond hexagram ────────────── */}
          {[
            [250,15],  [454,133], [454,367],
            [250,485], [46,367],  [46,133],
          ].map(([x,y,sx,sy], i) => {
            // from inner-hex vertex to extended point
            const inner = [[307,152],[363,250],[307,348],[193,348],[137,250],[193,152]]
            const [ix,iy] = inner[i]
            return (
              <line key={i}
                x1={ix} y1={iy} x2={x} y2={y}
                stroke="white" strokeOpacity="0.05" strokeWidth="0.4"
                strokeDasharray="3 6"
              />
            )
          })}

          {/* ── Outer hex vertex dots ────────────────────────── */}
          {[[348,81],[445,250],[348,419],[152,419],[55,250],[152,81]].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="white" fillOpacity="0.40" />
          ))}

          {/* ── Triangle vertex dots (star points) ──────────── */}
          {[[250,55],[419,348],[81,348],[419,153],[250,445],[81,153]].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.5" fill="white" fillOpacity="0.55" />
          ))}

          {/* ── Inner hex vertex dots ────────────────────────── */}
          {[[307,152],[363,250],[307,348],[193,348],[137,250],[193,152]].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2" fill="white" fillOpacity="0.35" />
          ))}

          {/* ── Center glow layers ───────────────────────────── */}
          <circle cx="250" cy="250" r="42"  fill="white" fillOpacity="0.04" />
          <circle cx="250" cy="250" r="24"  fill="white" fillOpacity="0.08" />
          <circle cx="250" cy="250" r="12"  fill="white" fillOpacity="0.18" />
          <circle cx="250" cy="250" r="5"   fill="white" fillOpacity="0.55" />
          <circle cx="250" cy="250" r="2.5" fill="white" fillOpacity="0.95" />

          {/* ── Animated pulse ring ──────────────────────────── */}
          {animate && (
            <motion.circle
              cx="250" cy="250" r="28"
              stroke="white" strokeWidth="0.8" fill="none"
              animate={{ opacity: [0.06, 0.18, 0.06], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ originX: "250px", originY: "250px" }}
            />
          )}

          {/* ── Tiny scattered dots (field particles) ────────── */}
          {[
            [320,105,1.2,0.28],[420,175,1,0.20],[460,290,1.2,0.22],
            [400,420,1,0.18],[290,470,1.2,0.22],[140,450,1,0.18],
            [70,350,1.2,0.24],[40,200,1,0.18],[130,100,1.2,0.24],
            [370,60,1,0.18],[460,120,0.8,0.14],[38,130,0.8,0.14],
          ].map(([cx,cy,r,o], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="white" fillOpacity={o} />
          ))}
        </svg>
      </div>

      {/* Bottom label row ─────────────────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#F5F4F0]/35">
            KANSEI PATTERN
          </span>
          <span className="font-mono text-[8px] text-[#F5F4F0]/20">/ 0.7</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.12em] text-[#F5F4F0]/28">
          <span className="opacity-60">‹</span>
          <span>00</span>
          <span className="opacity-40">—</span>
          <span>05</span>
          <span className="opacity-60">›</span>
        </div>
      </div>
    </div>
  )
}

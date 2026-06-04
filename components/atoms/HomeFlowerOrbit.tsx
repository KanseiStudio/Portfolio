"use client"

/* Static orbital reference rings + centred flower image.
   Expanding ripple circles are rendered by HomeRippleOverlay (fixed overlay).  */

export function HomeFlowerOrbit() {
  return (
    <div
      className="relative w-full aspect-square"
      aria-hidden="true"
    >
      {/* ── Static reference orbit lines ──────────────────────────── */}
      <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="250" cy="250" r="242" stroke="white" strokeOpacity="0.18" strokeWidth="0.8" />
        <circle cx="250" cy="250" r="192" stroke="white" strokeOpacity="0.12" strokeWidth="0.6" strokeDasharray="4 12" />
        <circle cx="250" cy="250" r="140" stroke="white" strokeOpacity="0.14" strokeWidth="0.6" />
        <circle cx="250" cy="250" r="88"  stroke="white" strokeOpacity="0.10" strokeWidth="0.5" strokeDasharray="2 8" />
        {/* Cardinal ticks */}
        <line x1="250" y1="4"   x2="250" y2="20"  stroke="white" strokeOpacity="0.20" strokeWidth="0.8" />
        <line x1="496" y1="250" x2="480" y2="250" stroke="white" strokeOpacity="0.20" strokeWidth="0.8" />
        <line x1="250" y1="496" x2="250" y2="480" stroke="white" strokeOpacity="0.20" strokeWidth="0.8" />
        <line x1="4"   y1="250" x2="20"  y2="250" stroke="white" strokeOpacity="0.20" strokeWidth="0.8" />
        <circle cx="250" cy="6"   r="1.5" fill="white" fillOpacity="0.24" />
        <circle cx="494" cy="250" r="1.5" fill="white" fillOpacity="0.24" />
        <circle cx="250" cy="494" r="1.5" fill="white" fillOpacity="0.24" />
        <circle cx="6"   cy="250" r="1.5" fill="white" fillOpacity="0.24" />
        {/* Crosshair */}
        <line x1="8"   y1="250" x2="492" y2="250" stroke="white" strokeOpacity="0.08" strokeWidth="0.5" strokeDasharray="3 9" />
        <line x1="250" y1="8"   x2="250" y2="492" stroke="white" strokeOpacity="0.08" strokeWidth="0.5" strokeDasharray="3 9" />
        {/* Particles */}
        <circle cx="340" cy="125" r="1.2" fill="white" fillOpacity="0.25" />
        <circle cx="415" cy="198" r="0.8" fill="white" fillOpacity="0.16" />
        <circle cx="388" cy="374" r="1.2" fill="white" fillOpacity="0.20" />
        <circle cx="155" cy="398" r="0.8" fill="white" fillOpacity="0.16" />
        <circle cx="96"  cy="175" r="1.2" fill="white" fillOpacity="0.25" />
        <circle cx="166" cy="97"  r="0.8" fill="white" fillOpacity="0.18" />
        <circle cx="440" cy="318" r="0.8" fill="white" fillOpacity="0.14" />
        <circle cx="68"  cy="316" r="1.2" fill="white" fillOpacity="0.20" />
      </svg>

      {/* ── Flower image ───────────────────────────────────────────── */}
      {/* public/images/home-flower.png should be a transparent PNG.
          mix-blend-mode:screen kept as a safe fallback for the dev copy
          (Logo_Kansei.png has a black bg — screen removes it).
          When the real transparent PNG is in place, the mask + blend
          are harmless and can stay.                                   */}
      <div className="absolute" style={{ inset: "5%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home-flower.png"
          alt=""
          loading="eager"
          className="w-full h-auto block"
          style={{
            mixBlendMode:    "screen",
            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 68%)",
            maskImage:       "linear-gradient(to bottom, black 60%, transparent 68%)",
          }}
        />
      </div>
    </div>
  )
}

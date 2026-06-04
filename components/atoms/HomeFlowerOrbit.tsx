/**
 * HomeFlowerOrbit — static orbit rings + centred flower image.
 * Server Component (no "use client") — zero JS shipped for this element.
 *
 * Orbit anatomy (viewBox 0 0 500 500, square):
 *   outer ring  r=242  opacity 0.20  solid
 *   ring 2      r=192  opacity 0.10  dashed
 *   ring 3      r=140  opacity 0.13  solid
 *   ring 4      r=88   opacity 0.08  dashed
 *   crosshair   opacity 0.09  dashed
 *   cardinal ticks + dots
 *   particle dots scattered
 *
 * Flower: /images/home-flower.png  mix-blend-mode:screen
 *   (transparent PNG → no blend needed; screen is harmless on transparent pixels)
 *   gradient mask hides wordmark at bottom of dev-placeholder image.
 */

export function HomeFlowerOrbit() {
  return (
    <div
      className="relative w-full aspect-square"
      aria-hidden="true"
    >
      {/* ── Orbit reference rings ──────────────────────────────────────── */}
      <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer solid ring — most prominent */}
        <circle cx="250" cy="250" r="242"
          stroke="white" strokeOpacity="0.20" strokeWidth="0.8" />

        {/* Mid dashed ring */}
        <circle cx="250" cy="250" r="192"
          stroke="white" strokeOpacity="0.10" strokeWidth="0.6"
          strokeDasharray="4 12" />

        {/* Inner solid ring */}
        <circle cx="250" cy="250" r="140"
          stroke="white" strokeOpacity="0.13" strokeWidth="0.6" />

        {/* Innermost dashed ring */}
        <circle cx="250" cy="250" r="88"
          stroke="white" strokeOpacity="0.08" strokeWidth="0.5"
          strokeDasharray="2 8" />

        {/* Full crosshair (horizontal + vertical), dashed */}
        <line x1="4"   y1="250" x2="496" y2="250"
          stroke="white" strokeOpacity="0.09" strokeWidth="0.5"
          strokeDasharray="3 9" />
        <line x1="250" y1="4"   x2="250" y2="496"
          stroke="white" strokeOpacity="0.09" strokeWidth="0.5"
          strokeDasharray="3 9" />

        {/* Cardinal tick marks */}
        <line x1="250" y1="4"   x2="250" y2="22"
          stroke="white" strokeOpacity="0.24" strokeWidth="0.8" />
        <line x1="496" y1="250" x2="478" y2="250"
          stroke="white" strokeOpacity="0.24" strokeWidth="0.8" />
        <line x1="250" y1="496" x2="250" y2="478"
          stroke="white" strokeOpacity="0.24" strokeWidth="0.8" />
        <line x1="4"   y1="250" x2="22"  y2="250"
          stroke="white" strokeOpacity="0.24" strokeWidth="0.8" />

        {/* Cardinal endpoint dots */}
        <circle cx="250" cy="4"   r="2" fill="white" fillOpacity="0.30" />
        <circle cx="496" cy="250" r="2" fill="white" fillOpacity="0.30" />
        <circle cx="250" cy="496" r="2" fill="white" fillOpacity="0.30" />
        <circle cx="4"   cy="250" r="2" fill="white" fillOpacity="0.30" />

        {/* 45° diagonal tick marks */}
        <line x1="421" y1="79"  x2="409" y2="91"
          stroke="white" strokeOpacity="0.12" strokeWidth="0.6" />
        <line x1="421" y1="421" x2="409" y2="409"
          stroke="white" strokeOpacity="0.12" strokeWidth="0.6" />
        <line x1="79"  y1="421" x2="91"  y2="409"
          stroke="white" strokeOpacity="0.12" strokeWidth="0.6" />
        <line x1="79"  y1="79"  x2="91"  y2="91"
          stroke="white" strokeOpacity="0.12" strokeWidth="0.6" />

        {/* Scattered particle dots */}
        <circle cx="340" cy="125" r="1.5" fill="white" fillOpacity="0.32" />
        <circle cx="415" cy="198" r="1.0" fill="white" fillOpacity="0.20" />
        <circle cx="388" cy="374" r="1.5" fill="white" fillOpacity="0.26" />
        <circle cx="155" cy="398" r="1.0" fill="white" fillOpacity="0.20" />
        <circle cx="96"  cy="175" r="1.5" fill="white" fillOpacity="0.32" />
        <circle cx="166" cy="97"  r="1.0" fill="white" fillOpacity="0.22" />
        <circle cx="440" cy="318" r="1.0" fill="white" fillOpacity="0.18" />
        <circle cx="68"  cy="316" r="1.5" fill="white" fillOpacity="0.26" />
        <circle cx="300" cy="55"  r="1.0" fill="white" fillOpacity="0.18" />
        <circle cx="460" cy="145" r="1.0" fill="white" fillOpacity="0.14" />
        <circle cx="45"  cy="140" r="1.0" fill="white" fillOpacity="0.14" />
        <circle cx="200" cy="462" r="1.0" fill="white" fillOpacity="0.16" />
        <circle cx="472" cy="330" r="0.8" fill="white" fillOpacity="0.12" />
        <circle cx="32"  cy="330" r="0.8" fill="white" fillOpacity="0.12" />
      </svg>

      {/* ── Flower image ──────────────────────────────────────────────── */}
      {/*
        /images/home-flower.png should be the transparent PNG provided by
        the user. mix-blend-mode:screen is kept so the dev placeholder
        (Logo_Kansei.png — black bg) renders correctly; it is harmless
        on actual transparent PNGs (screen of transparent = transparent).
        Gradient mask hides the wordmark at the bottom of the placeholder.
      */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home-flower.png"
          alt=""
          loading="eager"
          className="w-[90%] h-auto block"
          style={{
            mixBlendMode:    "screen",
            WebkitMaskImage: "radial-gradient(circle at center, black 52%, transparent 72%)",
            maskImage:       "radial-gradient(circle at center, black 52%, transparent 72%)",
          }}
        />
      </div>
    </div>
  )
}

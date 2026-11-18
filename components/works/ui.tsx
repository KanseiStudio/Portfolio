import Image from "next/image"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Token tipografici delle pagine Works (dalle anteprime approvate in
 * design/references/works). Testi su #0A0A0A: opacità minima 0.6 per
 * mantenere il contrasto ≥ 4.5:1.
 */
export const ws = {
  container: "mx-auto w-full max-w-[1280px] px-6 md:px-12",
  lbl: "font-mono text-[10px] uppercase tracking-[0.12em] leading-[1.6] text-[#F5F4F0]/60",
  body: "font-mono text-[13px] leading-[1.7] text-[#F5F4F0]/75",
  serif: "font-fraunces font-normal tracking-[-0.01em] text-[#F5F4F0]",
  num: "font-body font-extralight tracking-[-0.03em] leading-none text-[#F5F4F0]",
  h3: "font-body font-medium text-base text-[#F5F4F0]",
  hairline: "border-[#F5F4F0]/14",
  /** Pulsante outline delle anteprime (.cta), target ≥ 44px */
  cta:
    "inline-flex items-center gap-2.5 min-h-11 px-[18px] border border-[#F5F4F0]/30 font-mono text-[11px] uppercase tracking-[0.12em] text-[#F5F4F0] transition-colors duration-300 hover:bg-[#F5F4F0] hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#F5F4F0]",
} as const

/** Griglia "auto-fit": colonne di larghezza minima `min`, una sola colonna sotto */
export function autoGrid(min: number) {
  return { gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))` }
}

/**
 * Immagine Works via next/image: accetta path locali (/works/...) e URL Vercel Blob.
 * - `ratio` → contenitore a proporzione fissa con object-cover
 * - senza `ratio` → proporzione naturale dell'immagine (larghezza 100%)
 */
export function WorkImage({
  src,
  alt,
  sizes,
  ratio,
  position,
  eager,
  className,
}: {
  src: string
  alt: string
  sizes: string
  ratio?: string
  position?: string
  eager?: boolean
  className?: string
}) {
  const loading = eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {}
  if (ratio) {
    return (
      <div className={cn("relative w-full overflow-hidden bg-[#15161a]", className)} style={{ aspectRatio: ratio }}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: position }} {...loading} />
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={1000}
      sizes={sizes}
      className={cn("block w-full h-auto", className)}
      {...loading}
    />
  )
}

/** Intestazione di sezione: eyebrow numerata (dato salvato), titolo H2, testo */
export function SectionHeader({
  eyebrow,
  title,
  body,
  layout = "split",
  className,
}: {
  eyebrow: string | null
  title: string | null
  body: string | null
  layout?: "split" | "stacked"
  className?: string
}) {
  if (!eyebrow && !title && !body) return null
  const heading = (
    <div className="flex flex-col gap-3.5">
      {eyebrow && <span className={ws.lbl}>{eyebrow}</span>}
      {title && <h2 className={cn(ws.serif, "text-[32px] md:text-[44px] leading-[1.05]")}>{title}</h2>}
    </div>
  )
  const text = body && <p className={cn(ws.body, "whitespace-pre-line")}>{body}</p>

  if (layout === "stacked" || !body || (!eyebrow && !title)) {
    return (
      <div className={cn("flex flex-col gap-3.5 max-w-[760px]", className)}>
        {heading}
        {text}
      </div>
    )
  }
  return (
    <div className={cn("grid gap-10 items-end", className)} style={autoGrid(360)}>
      {heading}
      {text}
    </div>
  )
}

/** Celle con filetto superiore (label · titolo · testo) */
export function Cell({ label, title, body }: { label?: string | null; title?: string | null; body?: string | null }) {
  return (
    <div className={cn("flex flex-col gap-2.5 border-t pt-[18px]", ws.hairline)}>
      {label && <span className={ws.lbl}>{label}</span>}
      {title && <h3 className={ws.h3}>{title}</h3>}
      {body && <p className={cn(ws.body, "whitespace-pre-line")}>{body}</p>}
    </div>
  )
}

export function Arrow({ children = "↗" }: { children?: ReactNode }) {
  return <span aria-hidden="true">{children}</span>
}

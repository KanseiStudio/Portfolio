"use client"

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Maximize2, Minimize2, Play, SquareArrowOutUpRight, X } from "lucide-react"
import { formatBytes } from "@/lib/artifacts"
import type { LocalizedWorkArtifact } from "@/lib/works"
import { cn } from "@/lib/utils"
import { ws } from "./ui"

/**
 * Artefatto interattivo incorporato nella pagina di un lavoro.
 *
 * Click-to-load: l'iframe (three.js + decine di MB di video) si monta solo dopo
 * "Avvia esperienza"; "Chiudi" lo smonta e libera la GPU.
 *
 * Modello di fiducia: caricano artefatti solo gli admin. L'HTML è servito SAME-ORIGIN
 * da /artifacts/<id> (gli asset arrivano invece da Blob, con CORS `*`) e il sandbox
 * include `allow-same-origin` insieme ad `allow-scripts`: serve a storage, fullscreen
 * e fetch dell'artefatto, ma di fatto non lo isola dal sito. È accettabile SOLO perché
 * il contenuto è fidato.
 */

const noopSubscribe = () => () => {}

const SANDBOX = "allow-scripts allow-same-origin allow-pointer-lock allow-popups"
const frameBorder = "border border-[#F5F4F0]/15"

export function ArtifactEmbed({ artifact }: { artifact: LocalizedWorkArtifact }) {
  const t = useTranslations("Works")
  const wrapperRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [launched, setLaunched] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // iPhone Safari non supporta il fullscreen di un elemento: lì il pulsante non compare (false anche in SSR)
  const canFullscreen = useSyncExternalStore(
    noopSubscribe,
    () => Boolean(document.fullscreenEnabled),
    () => false,
  )
  const src = `/artifacts/${artifact.id}`

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === wrapperRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await wrapperRef.current?.requestFullscreen()
    } catch {
      /* rifiutato dal browser: nessuna azione */
    }
  }, [])

  const close = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => {})
    setLaunched(false)
  }, [])

  const telemetry = `${t("artifactTelemetry")} · ${formatBytes(artifact.totalBytes)}`

  return (
    <figure className="m-0 flex flex-col gap-4">
      <div
        ref={wrapperRef}
        role="region"
        aria-label={t("artifactRegion", { title: artifact.title })}
        className={cn("flex flex-col bg-[#0A0A0A]", isFullscreen && "h-screen w-screen")}
        data-testid="artifact-embed"
      >
        {/* Riquadro: proporzioni dal record su desktop, 3:4 e almeno 70vh sotto 768px
            (l'artefatto KBox ha pannelli position:fixed che in un 16:9 stretto si sovrappongono) */}
        <div
          className={cn(
            "relative w-full overflow-hidden bg-[#000]",
            frameBorder,
            isFullscreen
              ? "flex-1 border-0"
              : "aspect-[var(--artifact-ratio)] max-h-[82vh] max-md:aspect-[3/4] max-md:min-h-[70vh] max-md:max-h-none",
          )}
          style={{ "--artifact-ratio": artifact.aspectRatio } as React.CSSProperties}
        >
          {launched ? (
            <iframe
              ref={iframeRef}
              src={src}
              title={artifact.title}
              loading="lazy"
              allow="fullscreen; autoplay; xr-spatial-tracking"
              sandbox={SANDBOX}
              onLoad={() => iframeRef.current?.focus()}
              className="absolute inset-0 h-full w-full border-0 bg-[#000]"
              data-testid="artifact-iframe"
            />
          ) : (
            <ArtifactCover artifact={artifact} telemetry={telemetry} onLaunch={() => setLaunched(true)} label={t("artifactLaunch")} />
          )}
        </div>

        {launched && (
          <div className="flex flex-wrap items-center gap-1 border-x border-b border-[#F5F4F0]/15">
            {canFullscreen && (
              <BarButton onClick={toggleFullscreen} icon={isFullscreen ? Minimize2 : Maximize2}>
                {/* Sotto 640px solo icona: il testo resta per gli screen reader */}
                <span className="max-sm:sr-only">{isFullscreen ? t("artifactExitFullscreen") : t("artifactFullscreen")}</span>
              </BarButton>
            )}
            <a href={src} target="_blank" rel="noopener noreferrer" className={barCls}>
              <SquareArrowOutUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
              <span className="max-sm:sr-only">{t("artifactNewTab")}</span>
            </a>
            <BarButton onClick={close} icon={X} className="ml-auto">
              {t("artifactClose")}
            </BarButton>
          </div>
        )}
      </div>

      {artifact.caption && <figcaption className={cn(ws.body, "max-w-[760px] whitespace-pre-line")}>{artifact.caption}</figcaption>}
    </figure>
  )
}

const barCls =
  "inline-flex items-center gap-2 min-h-11 min-w-11 justify-center px-3 md:px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[#F5F4F0]/75 hover:text-[#F5F4F0] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-[#F5F4F0]"

function BarButton({
  onClick,
  icon: Icon,
  className,
  children,
}: {
  onClick: () => void
  icon: typeof X
  className?: string
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={onClick} className={cn(barCls, className)}>
      <Icon size={13} strokeWidth={1.5} aria-hidden="true" />
      {children}
    </button>
  )
}

/** Stato iniziale: copertina (o fondo nero con griglia HUD), titolo, telemetria, pulsante */
function ArtifactCover({
  artifact,
  telemetry,
  label,
  onLaunch,
}: {
  artifact: LocalizedWorkArtifact
  telemetry: string
  label: string
  onLaunch: () => void
}) {
  return (
    <div className="absolute inset-0" data-testid="artifact-cover">
      {artifact.posterUrl ? (
        <>
          <Image src={artifact.posterUrl} alt="" fill sizes="(min-width: 1280px) 1184px, 100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-[#0A0A0A]/55" />
        </>
      ) : (
        <HudGrid />
      )}
      {/* Angoli HUD come nelle figure dei Works */}
      <span aria-hidden="true" className="absolute top-2.5 left-2.5 size-3.5 border-t border-l border-[#F5F4F0]/60" />
      <span aria-hidden="true" className="absolute top-2.5 right-2.5 size-3.5 border-t border-r border-[#F5F4F0]/60" />
      <span aria-hidden="true" className="absolute bottom-2.5 left-2.5 size-3.5 border-b border-l border-[#F5F4F0]/60" />
      <span aria-hidden="true" className="absolute bottom-2.5 right-2.5 size-3.5 border-b border-r border-[#F5F4F0]/60" />

      <div className="relative flex h-full flex-col justify-between gap-6 p-6 md:p-10">
        <span className={cn(ws.lbl, "text-[#F5F4F0]/70")} data-testid="artifact-telemetry">
          {telemetry}
        </span>
        <div className="flex flex-col items-start gap-6">
          <h3 className={cn(ws.serif, "text-[30px] md:text-[48px] leading-[1.05] max-w-[18ch]")}>{artifact.title}</h3>
          <button type="button" onClick={onLaunch} className={cn(ws.cta, "bg-[#0A0A0A]/40")}>
            <Play size={13} strokeWidth={1.5} aria-hidden="true" />
            {label}
          </button>
        </div>
      </div>
    </div>
  )
}

/** Griglia HUD sottile: SVG a pattern (niente gradienti), linee #F5F4F0 al 7% */
function HudGrid() {
  const id = `artifact-hud-${useId().replace(/:/g, "")}`
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="#F5F4F0" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#F5F4F0" strokeOpacity="0.12" strokeDasharray="2 6" />
      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#F5F4F0" strokeOpacity="0.12" strokeDasharray="2 6" />
    </svg>
  )
}

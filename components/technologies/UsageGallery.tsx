"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface UsageImage {
  src: string
  alt?: string
}

interface UsageGalleryProps {
  images: UsageImage[]
}

export function UsageGallery({ images }: UsageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
            aria-label={`Ingrandisci immagine ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt ?? ""}
              className="w-full aspect-video object-cover border border-[#F5F4F0]/20"
            />
          </button>
        ))}
      </div>

      {mounted && openIndex !== null &&
        createPortal(
          <Lightbox
            src={images[openIndex].src}
            alt={images[openIndex].alt}
            onClose={() => setOpenIndex(null)}
          />,
          document.body
        )
      }
    </>
  )
}

interface LightboxProps {
  src: string
  alt?: string
  onClose: () => void
}

function Lightbox({ src, alt, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  // Focus sul pulsante chiudi all'apertura
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  // Escape + scroll lock (mount/unmount)
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Immagine ingrandita"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0,0,0,.88)",
        backdropFilter: "blur(4px)",
        animation: "ks-lb-fade 180ms ease-out",
      }}
    >
      {/* Backdrop — click chiude (NON sull'immagine) */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Cornice fissa 3:2 — stessa dimensione per tutte le foto */}
      <div
        className="relative z-10 border border-[#F5F4F0]/20 overflow-hidden"
        style={{
          width: "min(92vw, calc(88vh * 3 / 2))",
          aspectRatio: "3 / 2",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Pulsante chiudi */}
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute top-4 right-4 z-20 w-11 h-11 flex items-center justify-center
                   font-mono text-base text-[#F5F4F0]/60 hover:text-[#F5F4F0]
                   bg-transparent border-0 cursor-pointer transition-colors duration-150"
      >
        ✕
      </button>
    </div>
  )
}

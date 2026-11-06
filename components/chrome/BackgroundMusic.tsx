"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { RADIO_PLAY_EVENT, SND_PLAY_EVENT } from "@/lib/kansei-radio"

const STORAGE_KEY = "ks-sound-pref"
const TARGET_VOL  = 0.3
const FADE_IN_MS  = 1500
const FADE_OUT_MS = 700
const STEPS       = 30

export function BackgroundMusic({ musicUrl }: { musicUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const [playing, setPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const clearFade = useCallback(() => {
    if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null }
  }, [])

  useEffect(() => () => clearFade(), [clearFade])

  const fadeIn = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    clearFade()
    a.volume = 0
    a.play().catch(() => setPlaying(false))
    const step = TARGET_VOL / STEPS
    const tick = FADE_IN_MS / STEPS
    fadeRef.current = setInterval(() => {
      if (!audioRef.current) return clearFade()
      const next = Math.min(audioRef.current.volume + step, TARGET_VOL)
      audioRef.current.volume = next
      if (next >= TARGET_VOL) clearFade()
    }, tick)
  }, [clearFade])

  const fadeOut = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    clearFade()
    const startVol = a.volume || TARGET_VOL
    const step = startVol / STEPS
    const tick = FADE_OUT_MS / STEPS
    fadeRef.current = setInterval(() => {
      if (!audioRef.current) return clearFade()
      const next = Math.max(audioRef.current.volume - step, 0)
      audioRef.current.volume = next
      if (next <= 0) { audioRef.current.pause(); clearFade() }
    }, tick)
  }, [clearFade])

  const toggle = useCallback(() => {
    const next = !playing
    setPlaying(next)
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off")
    if (next) {
      window.dispatchEvent(new Event(SND_PLAY_EVENT)) // ferma Kansei Radio
      fadeIn()
    } else fadeOut()
  }, [playing, fadeIn, fadeOut])

  // Se parte Kansei Radio, la musica di sottofondo si spegne
  useEffect(() => {
    const onRadio = () => { setPlaying(false); fadeOut() }
    window.addEventListener(RADIO_PLAY_EVENT, onRadio)
    return () => window.removeEventListener(RADIO_PLAY_EVENT, onRadio)
  }, [fadeOut])

  if (!mounted) return null

  return (
    <>
      {/* Hidden audio element — persists across re-renders */}
      <audio ref={audioRef} src={musicUrl} loop preload="none" />

      {/* HUD toggle — fixed in the ticker bar zone, bottom-left */}
      <div
        className="max-md:hidden fixed bottom-0 left-[56px] lg:left-[72px] z-30 h-[40px] flex items-center"
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Disattiva audio di sottofondo" : "Attiva audio di sottofondo"}
          aria-pressed={playing}
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <span
            className={cn(
              "block w-[5px] h-[5px] rounded-full transition-all duration-500",
              playing
                ? "bg-[#F5F4F0]/65 shadow-[0_0_4px_rgba(245,244,240,0.35)]"
                : "border border-[#F5F4F0]/30 bg-transparent"
            )}
          />
          <span
            className={cn(
              "font-mono text-[8px] uppercase tracking-[0.14em] leading-none select-none",
              "transition-colors duration-300",
              playing
                ? "text-[#F5F4F0]/55 group-hover:text-[#F5F4F0]/80"
                : "text-[#F5F4F0]/28 group-hover:text-[#F5F4F0]/55"
            )}
          >
            SND {playing ? "ON" : "OFF"}
          </span>
        </button>
      </div>
    </>
  )
}

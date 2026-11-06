"use client"

import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import type { KanseiRadio } from "@/lib/kansei-radio"
import { cn } from "@/lib/utils"

/**
 * Voce "RADIO" del menu. Non naviga: accende/spegne Kansei Radio in diretta.
 * variant="desktop" → stile delle voci mono del header
 * variant="mobile"  → stile display del drawer mobile
 */
export function RadioNavButton({
  radio,
  variant = "desktop",
}: {
  radio: KanseiRadio
  variant?: "desktop" | "mobile"
}) {
  const t = useTranslations("Nav")
  const { playing, loading, error, title, toggle } = radio

  const aria = playing
    ? `${t("radioPause")}${title ? ` — ${title}` : ""}`
    : `${t("radioPlay")}${title ? ` — ${title}` : ""}`

  const dot = playing ? (
    <motion.span
      className="block w-1 h-1 rounded-full bg-[#F5F4F0] shrink-0"
      animate={{ opacity: [0.35, 1, 0.35] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    />
  ) : (
    <span className="block w-1 h-1 rounded-full border border-[#F5F4F0]/50 shrink-0" aria-hidden="true" />
  )

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-pressed={playing}
        aria-label={aria}
        className={cn(
          "flex items-center gap-3 text-left font-display text-[2.6rem] leading-tight tracking-tight text-[#F5F4F0]",
          "transition-opacity duration-300 disabled:opacity-40",
          playing ? "opacity-100" : "opacity-55 hover:opacity-90"
        )}
      >
        {t("radio")}
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest opacity-70">
          {dot}
          {error ? "OFF AIR" : playing ? (title ?? "ON AIR") : "ON AIR"}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={playing}
      aria-label={aria}
      title={title ? `Kansei Radio — ${title}` : "Kansei Radio"}
      className={cn(
        "flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest transition-opacity duration-300 cursor-pointer",
        "disabled:cursor-wait",
        playing ? "opacity-100" : "opacity-50 hover:opacity-90"
      )}
    >
      {dot}
      {t("radio")}
      {playing && title && (
        <span className="hidden lg:inline max-w-[160px] truncate text-[#F5F4F0]/55 normal-case tracking-wider">
          · {title}
        </span>
      )}
    </button>
  )
}

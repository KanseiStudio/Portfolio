"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useLocale, useTranslations } from "next-intl"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { routing } from "@/i18n/routing"
import { Logo } from "@/components/atoms/Logo"
import { cn } from "@/lib/utils"

type Locale = "it" | "en"

function stripLocalePrefix(pathname: string, locales: readonly string[]): string {
  for (const loc of locales) {
    if (pathname === `/${loc}`) return "/"
    if (pathname.startsWith(`/${loc}/`)) return pathname.slice(`/${loc}`.length)
  }
  return pathname
}

const NAV_HREFS = [
  "/about",
  "/projects",
  "/technologies",
  "/contact",
] as const

interface InstrumentFrameProps {
  children: React.ReactNode
  lat?: string
  lon?: string
  tz?: string
}

export function InstrumentFrame({
  children,
  lat = "41°54'N",
  lon = "12°24'E",
  tz  = "UTC+01 ROME",
}: InstrumentFrameProps) {
  const t        = useTranslations("Nav")
  const locale   = useLocale() as Locale
  const pathname = usePathname()
  const router   = useRouter()

  const nav = [
    { href: NAV_HREFS[0], label: t("about")        },
    { href: NAV_HREFS[1], label: t("projects")      },
    { href: NAV_HREFS[2], label: t("technologies")  },
    { href: NAV_HREFS[3], label: t("contact")       },
  ] as const

  const [mounted,    setMounted]    = useState(false)
  const [time,       setTime]       = useState("")
  const [cycles,     setCycles]     = useState(8316)
  const [seconds,    setSeconds]    = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)

  const seed = useMemo(() => {
    if (typeof window === "undefined") return "13F3"
    return Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0")
  }, [])

  useEffect(() => { setMounted(true) }, [])

  // Body scroll lock when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  // Esc to close mobile drawer
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [mobileOpen])

  // Live clock — Rome timezone
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false, timeZone: "Europe/Rome",
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Cycles counter (~30 ms cadence)
  useEffect(() => {
    if (!mounted) return
    const id = setInterval(() => setCycles(c => (c + 1) % 100000), 30)
    return () => clearInterval(id)
  }, [mounted])

  // Uptime (seconds since mount)
  useEffect(() => {
    if (!mounted) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [mounted])

  const hh         = String(Math.floor(seconds / 3600)).padStart(2, "0")
  const mm         = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
  const ss         = String(seconds % 60).padStart(2, "0")
  const uptime     = `${hh}:${mm}:${ss}`
  const cyclesStr  = String(cycles).padStart(5, "0")

  const switchLocale = (target: Locale) => {
    if (target === locale) return
    router.replace(stripLocalePrefix(pathname, routing.locales), { locale: target })
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#F5F4F0]">

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="fixed inset-x-0 top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-[6px]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-[52px] flex items-center justify-between gap-6">

          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Kansei Studio — Home"
            onClick={() => setMobileOpen(false)}
          >
            <Logo size={30} onDark className="shrink-0" />
            <span className="font-n27 font-bold text-[13px] tracking-tight uppercase text-[#F5F4F0]">
              Kansei Studio
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {nav.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-50 hover:opacity-90"
                  )}
                >
                  {isActive && (
                    <span className="block w-1 h-1 rounded-full bg-[#F5F4F0] shrink-0" aria-hidden="true" />
                  )}
                  {label}
                </Link>
              )
            })}

            {/* IT / EN pill toggle */}
            <div role="group" aria-label="Language selector" className="flex items-center gap-1">
              {(["it", "en"] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  aria-pressed={locale === loc}
                  aria-label={loc === "it" ? "Italiano" : "English"}
                  className={cn(
                    "w-[26px] h-[26px] flex items-center justify-center rounded-full border font-mono text-[10px] uppercase tracking-widest transition-colors duration-300",
                    locale === loc
                      ? "border-[#F5F4F0]/55 text-[#F5F4F0]"
                      : "border-transparent text-[#F5F4F0]/40 hover:text-[#F5F4F0]/70"
                  )}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
          </nav>

          {/* Mobile: lang + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <div role="group" aria-label="Language selector" className="flex items-center gap-1">
              {(["it", "en"] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  aria-pressed={locale === loc}
                  aria-label={loc === "it" ? "Italiano" : "English"}
                  className={cn(
                    "w-[22px] h-[22px] flex items-center justify-center rounded-full border font-mono text-[9px] uppercase tracking-widest transition-colors duration-300",
                    locale === loc
                      ? "border-[#F5F4F0]/55 text-[#F5F4F0]"
                      : "border-transparent text-[#F5F4F0]/40"
                  )}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(prev => !prev)}
              className="relative w-7 h-7 flex items-center justify-center -mr-0.5"
              aria-label={mobileOpen ? t("menuClose") : t("menuOpen")}
              aria-expanded={mobileOpen}
            >
              {([-5, 0, 5] as const).map((y, i) => (
                <motion.span
                  key={i}
                  className="absolute block h-px bg-[#F5F4F0]"
                  style={{ width: 20 }}
                  animate={
                    i === 0 ? (mobileOpen ? { rotate: 45,  y: 0 } : { rotate: 0, y })
                  : i === 1 ? { opacity: mobileOpen ? 0 : 1, y }
                  :            (mobileOpen ? { rotate: -45, y: 0 } : { rotate: 0, y })
                  }
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                />
              ))}
            </button>
          </div>
        </div>

        {/* Header hairline */}
        <div className="h-px bg-[#F5F4F0]/10" />
      </header>

      {/* ══ MOBILE DRAWER ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-[#0A0A0A] md:hidden"
          >
            <div className="h-[53px]" aria-hidden="true" />
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-5 px-6 pt-12"
            >
              {nav.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.36, delay: 0.06 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block font-display text-[2.6rem] leading-tight tracking-tight text-[#F5F4F0]",
                      pathname === href ? "opacity-100" : "opacity-55 hover:opacity-90",
                      "transition-opacity duration-300"
                    )}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ LEFT RAIL ═══════════════════════════════════════════════════════ */}
      <div
        className="fixed top-[53px] left-0 bottom-[40px] z-30 pointer-events-none hidden lg:block"
        aria-hidden="true"
      >
        {/* STATUS / ONLINE */}
        <div className="absolute top-4 left-4 xl:left-6 flex flex-col gap-[5px]">
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#F5F4F0]/35 leading-none">
            STATUS
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#F5F4F0]/70 leading-none flex items-center gap-1.5">
            {mounted && (
              <motion.span
                className="block w-[5px] h-[5px] rounded-full bg-[#4ADE80] shrink-0"
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            ONLINE
          </span>
        </div>

        {/* Dot at rail top */}
        <div
          className="absolute left-[18px] xl:left-[20px] w-[3px] h-[3px] rounded-full bg-[#F5F4F0]/30"
          style={{ top: 66 }}
        />

        {/* Vertical dashed line */}
        <div
          className="absolute left-[19px] xl:left-[21px] border-l border-dashed border-[#F5F4F0]/18"
          style={{ top: 70, bottom: 70 }}
        />

        {/* Ring at ~50% — small circle outline */}
        <div
          className="absolute w-[9px] h-[9px] rounded-full border border-[#F5F4F0]/22"
          style={{
            left: "calc(19px - 4px)",
            top: "calc(70px + 48%)",
            transform: "translateY(-50%)",
          }}
        />

        {/* Diagonal notch at ~65% */}
        <div
          className="absolute"
          style={{ left: "14px", top: "calc(70px + 65%)" }}
        >
          <div
            className="w-[9px] h-px bg-[#F5F4F0]/20"
            style={{ transform: "rotate(-35deg)", transformOrigin: "left center" }}
          />
        </div>

        {/* Dot at rail bottom */}
        <div
          className="absolute left-[18px] xl:left-[20px] w-[3px] h-[3px] rounded-full bg-[#F5F4F0]/20"
          style={{ bottom: 70 }}
        />

        {/* SEED */}
        <div className="absolute bottom-4 left-4 xl:left-6 flex flex-col gap-[3px]">
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#F5F4F0]/28 leading-none">
            SEED
          </span>
          {mounted && (
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#F5F4F0]/38 leading-none">
              K·0X{seed}
            </span>
          )}
        </div>
      </div>

      {/* ══ TOP-RIGHT COORDINATES ═══════════════════════════════════════════ */}
      <div
        className="fixed top-[63px] right-4 lg:right-8 xl:right-12 z-30 pointer-events-none hidden md:block text-right"
        aria-hidden="true"
      >
        {[
          `LAT  41.8934°N`,
          `LON  12.4827°E`,
          `UTC+1  ROME`,
        ].map((line) => (
          <div
            key={line}
            className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#F5F4F0]/32 leading-snug"
          >
            {line}
          </div>
        ))}
      </div>

      {/* ══ BOTTOM-RIGHT CYCLES + UPTIME ════════════════════════════════════ */}
      {mounted && (
        <div
          className="fixed bottom-[52px] right-4 lg:right-8 xl:right-12 z-30 pointer-events-none hidden lg:block text-right tabular-nums"
          aria-hidden="true"
        >
          <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#F5F4F0]/32 leading-snug">
            CYCLES {cyclesStr}/99999
          </div>
          <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#F5F4F0]/32 leading-snug">
            UPTIME {uptime}
          </div>
        </div>
      )}

      {/* ══ BOTTOM TICKER ═══════════════════════════════════════════════════ */}
      <div
        className="max-md:hidden fixed inset-x-0 bottom-0 h-[40px] z-30 pointer-events-none"
        aria-hidden="true"
      >
        {/* Top hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-[#F5F4F0]/14" />

        {/* Corner "+" crosshairs — four corners */}
        {(["top-[6px] left-4 lg:left-8", "top-[6px] right-4 lg:right-8",
           "bottom-[6px] left-4 lg:left-8", "bottom-[6px] right-4 lg:right-8"] as const
        ).map((pos) => (
          <span
            key={pos}
            className={`absolute font-mono text-[10px] leading-none text-[#F5F4F0]/30 select-none ${pos}`}
            style={{ transform: "translate(-35%, -35%)" }}
          >
            +
          </span>
        ))}

        {/* Segmented dashed lines flanking the clock */}
        <div className="absolute left-10 lg:left-14 right-[54%] top-1/2 -translate-y-1/2 border-t border-dashed border-[#F5F4F0]/12" />
        <div className="absolute left-[54%] right-10 lg:right-14 top-1/2 -translate-y-1/2 border-t border-dashed border-[#F5F4F0]/12" />

        {/* Clock — centred */}
        {time && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#F5F4F0]/55 tabular-nums select-none">
              [ {time} CET ]
            </span>
          </div>
        )}

        {/* · · · right of clock */}
        <div className="absolute right-5 lg:right-10 top-1/2 -translate-y-1/2">
          <span className="font-mono text-[9px] tracking-[0.35em] text-[#F5F4F0]/28 select-none">
            · · ·
          </span>
        </div>
      </div>

      {/* ══ CONTENT ═════════════════════════════════════════════════════════ */}
      <div className="pt-[53px] md:pb-[40px]">
        {children}
      </div>
    </div>
  )
}

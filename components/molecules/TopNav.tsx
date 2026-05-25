"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "motion/react"
import { Link, usePathname } from "@/i18n/routing"
import { Logo } from "@/components/atoms/Logo"
import { LanguageSwitcher } from "@/components/atoms/LanguageSwitcher"
import { cn } from "@/lib/utils"

export function TopNav() {
  const t = useTranslations("Nav")
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navLinks = [
    { href: "/about" as const, label: t("about") },
    { href: "/projects" as const, label: t("projects") },
    { href: "/contact" as const, label: t("contact") },
  ]

  // Body scroll lock when drawer open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  // Esc to close
  useEffect(() => {
    if (!isMobileOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isMobileOpen])

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-ks-bg/90 backdrop-blur-[8px]">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Kansei Studio — Home"
            onClick={() => setIsMobileOpen(false)}
          >
            <Logo size={28} className="shrink-0" />
            <span className="font-n27 font-bold text-base tracking-tight uppercase">
              Kansei Studio
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 text-small font-body font-medium text-ks-fg",
                    "underline-offset-4 hover:underline",
                    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-ks-fg focus-visible:outline-offset-4"
                  )}
                >
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-ks-accent shrink-0" aria-hidden="true" />
                  )}
                  {link.label}
                </Link>
              )
            })}
            <LanguageSwitcher />
            <span className="w-1 h-1 rounded-full bg-ks-accent" aria-hidden="true" />
          </nav>

          {/* Mobile: language switcher + hamburger/X */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setIsMobileOpen(prev => !prev)}
              className="relative flex items-center justify-center w-8 h-8 -mr-1"
              aria-label={isMobileOpen ? t("menuClose") : t("menuOpen")}
              aria-expanded={isMobileOpen}
            >
              <motion.span
                className="absolute block w-6 h-px bg-ks-fg"
                animate={isMobileOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute block w-6 h-px bg-ks-fg"
                animate={{ opacity: isMobileOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute block w-6 h-px bg-ks-fg"
                animate={isMobileOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ks-bg md:hidden"
          >
            {/* Spacer per il TopNav sticky */}
            <div className="h-[72px]" aria-hidden="true" />

            <div className="flex flex-col justify-between h-[calc(100vh-72px)] px-6 pt-12 pb-12">

              {/* Link list */}
              <nav aria-label="Mobile navigation" className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "block font-display text-4xl sm:text-5xl leading-tight tracking-tight",
                        pathname === link.href ? "opacity-100" : "opacity-80 hover:opacity-100",
                        "transition-opacity duration-300"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="h-px w-12 bg-ks-fg opacity-20" />
                <a
                  href="mailto:hello@kansei-studio.art"
                  className="block font-mono text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  hello@kansei-studio.art
                </a>
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">
                  Kansei Studio · 2026
                </p>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

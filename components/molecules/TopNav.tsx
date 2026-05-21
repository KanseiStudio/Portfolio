"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { Logo } from "@/components/atoms/Logo"
import { LanguageSwitcher } from "@/components/atoms/LanguageSwitcher"
import { cn } from "@/lib/utils"

export function TopNav() {
  const t = useTranslations("Nav")
  const pathname = usePathname()

  const navLinks = [
    { href: "/about" as const, label: t("about") },
    { href: "/projects" as const, label: t("projects") },
    { href: "/contact" as const, label: t("contact") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-ks-bg/90 backdrop-blur-[8px]">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="Kansei Studio — Home">
          <Logo size={28} className="shrink-0" />
          <span className="font-display text-base font-medium tracking-tight">
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

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Decorative trailing dot */}
          <span className="w-1 h-1 rounded-full bg-ks-accent" aria-hidden="true" />
        </nav>

        {/* Mobile: language switcher + hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button
            type="button"
            className="flex flex-col justify-center gap-[6px] w-8 h-8 -mr-1"
            aria-label={t("menuOpen")}
          >
            <span className="block w-6 h-px bg-ks-fg" aria-hidden="true" />
            <span className="block w-6 h-px bg-ks-fg" aria-hidden="true" />
            <span className="block w-4 h-px bg-ks-fg" aria-hidden="true" />
          </button>
        </div>

      </div>
    </header>
  )
}

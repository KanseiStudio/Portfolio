"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = (target: "it" | "en") => {
    if (target === locale) return
    router.replace(pathname, { locale: target })
  }

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="group"
      aria-label="Language selector"
    >
      <button
        onClick={() => switchTo("it")}
        className={cn(
          "text-eyebrow font-medium px-2.5 py-1 rounded-full border transition-colors duration-300",
          locale === "it"
            ? "border-ks-fg bg-ks-fg text-ks-bg"
            : "border-ks-hairline-active text-ks-fg hover:border-ks-fg"
        )}
        aria-pressed={locale === "it"}
        aria-label="Italiano"
      >
        IT
      </button>
      <button
        onClick={() => switchTo("en")}
        className={cn(
          "text-eyebrow font-medium px-2.5 py-1 rounded-full border transition-colors duration-300",
          locale === "en"
            ? "border-ks-fg bg-ks-fg text-ks-bg"
            : "border-ks-hairline-active text-ks-fg hover:border-ks-fg"
        )}
        aria-pressed={locale === "en"}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )
}

import { setRequestLocale } from "next-intl/server"

const swatches = [
  { label: "ks-bg", hex: "#F5F4F0", cls: "bg-ks-bg", border: true },
  { label: "ks-fg", hex: "#0A0A0A", cls: "bg-ks-fg" },
  { label: "ks-accent", hex: "#2563EB", cls: "bg-ks-accent" },
  { label: "ks-dark-bg", hex: "#0A0A0A", cls: "bg-ks-dark-bg" },
  { label: "ks-dark-fg", hex: "#F5F4F0", cls: "bg-ks-dark-fg", border: true },
  { label: "ks-hairline", hex: "rgba(10,10,10,0.12)", cls: "bg-ks-hairline", border: true },
]

const typeScale = [
  { token: "display", size: "7rem", cls: "text-display font-display font-normal", text: "Where technology becomes sensation." },
  { token: "ks-h1", size: "4.5rem", cls: "text-ks-h1 font-display font-normal", text: "Section Heading Primary" },
  { token: "ks-h2", size: "3rem", cls: "text-ks-h2 font-display font-normal", text: "Sub-heading Secondary" },
  { token: "ks-h3", size: "1.5rem", cls: "text-ks-h3 font-display font-normal", text: "Heading Tertiary" },
  { token: "eyebrow", size: "11px", cls: "text-eyebrow font-body font-medium uppercase tracking-widest", text: "01 SAMPLE EYEBROW" },
  { token: "body", size: "1rem", cls: "text-base font-body leading-relaxed", text: "Kansei Studio designs sensory systems and interactive installations — connecting technology and human emotion through rigorous spatial and typographic intelligence." },
  { token: "small", size: "13px", cls: "text-small font-body", text: "Caption text and metadata labels. Used for secondary information hierarchy." },
  { token: "mono", size: "12px", cls: "text-mono-ks font-mono", text: "0.123 / 2400×2400 / #2563EB" },
]

export default async function DevPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-ks-bg text-ks-fg">
      <div className="border-b border-ks-hairline px-12 py-6 flex items-baseline justify-between">
        <span className="text-eyebrow font-body uppercase tracking-widest">Design System — Task 01 Smoke Test</span>
        <span className="text-mono-ks font-mono opacity-50">/dev · non-production</span>
      </div>
      <div className="px-12 py-16 space-y-20 max-w-[1440px]">
        <section>
          <p className="text-eyebrow font-body uppercase tracking-widest mb-8 opacity-50">A — Palette</p>
          <div className="grid grid-cols-6 gap-8">
            {swatches.map((s) => (
              <div key={s.label}>
                <div className={`w-full aspect-square mb-3 ${s.cls} ${s.border ? "border border-ks-hairline" : ""}`} />
                <p className="text-mono-ks font-mono text-ks-fg">{s.label}</p>
                <p className="text-mono-ks font-mono opacity-40">{s.hex}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <p className="text-eyebrow font-body uppercase tracking-widest mb-8 opacity-50">B — Typography Scale</p>
          <div className="space-y-0">
            {typeScale.map((t) => (
              <div key={t.token} className="grid grid-cols-12 gap-8 border-t border-ks-hairline py-5 items-baseline">
                <div className="col-span-2 flex flex-col gap-0.5">
                  <span className="text-eyebrow font-mono uppercase tracking-widest opacity-50">{t.token}</span>
                  <span className="text-micro font-mono opacity-30">{t.size}</span>
                </div>
                <div className="col-span-10 overflow-hidden">
                  <span className={t.cls}>{t.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

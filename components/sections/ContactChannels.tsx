import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"
import { ContactCard } from "@/components/molecules/ContactCard"
import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ChannelData {
  id: number
  iconName: string
  handle: string
  url: string | null
  label: string
}

export async function ContactChannels({
  channels,
}: {
  channels: ChannelData[]
}) {
  const t = await getTranslations("Contact")

  if (channels.length === 0) return null

  return (
    <section className="border-t border-[#F5F4F0]/10">
      <Container className="pt-10 pb-16 lg:pb-24">

        {/* Eyebrow */}
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F4F0]/30 mb-8">
          {t("cardsSectionLabel")}
        </p>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#F5F4F0]/8">
          {channels.map((ch) => {
            const Icon =
              (Icons as unknown as Record<string, LucideIcon>)[ch.iconName] ??
              Icons.Link
            return (
              <ContactCard
                key={ch.id}
                icon={Icon}
                label={ch.label}
                value={ch.handle}
                href={ch.url ?? undefined}
                className="bg-[#0A0A0A]"
              />
            )
          })}
        </div>

      </Container>
    </section>
  )
}

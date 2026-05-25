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
    <Container as="section" className="py-20 lg:py-32">
      <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-12">
        {t("cardsSectionLabel")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            />
          )
        })}
      </div>
    </Container>
  )
}

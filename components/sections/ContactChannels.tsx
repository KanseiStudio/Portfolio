import { getTranslations } from "next-intl/server"
import { Mail, Link2, Camera, Code2, NotebookPen } from "lucide-react"
import { Container } from "@/components/atoms/Container"
import { ContactCard } from "@/components/molecules/ContactCard"

export async function ContactChannels() {
  const t = await getTranslations("Contact")

  const channels = [
    {
      icon: Mail,
      label: t("email"),
      value: t("emailHandle"),
      href: `mailto:${t("emailHandle")}`,
    },
    {
      icon: Link2,
      label: t("linkedin"),
      value: t("linkedinHandle"),
      href: `https://www.linkedin.com/company/${t("linkedinHandle")}`,
    },
    {
      icon: Camera,
      label: t("instagram"),
      value: t("instagramHandle"),
      href: `https://www.instagram.com/${t("instagramHandle").replace("@", "")}`,
    },
    {
      icon: Code2,
      label: t("github"),
      value: t("githubHandle"),
      href: `https://${t("githubHandle")}`,
    },
    {
      icon: NotebookPen,
      label: t("newsletter"),
      value: t("newsletterHandle"),
      // No href: newsletter not yet active — renders as non-interactive div
    },
  ]

  return (
    <Container as="section" className="py-20 lg:py-32">
      <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-12">
        {t("cardsSectionLabel")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <ContactCard
            key={ch.label}
            icon={ch.icon}
            label={ch.label}
            value={ch.value}
            href={"href" in ch ? ch.href : undefined}
          />
        ))}
      </div>
    </Container>
  )
}

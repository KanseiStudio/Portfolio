import { setRequestLocale } from "next-intl/server"
import { TrendingUp, Database, Zap, Activity, Mail, Link2, Camera } from "lucide-react"
import { VideoEmbed } from "@/components/molecules/VideoEmbed"
import { EyebrowLabel } from "@/components/atoms/EyebrowLabel"
import { Logo } from "@/components/atoms/Logo"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { CirclePlusButton } from "@/components/atoms/CirclePlusButton"
import { Container } from "@/components/atoms/Container"
import { GridSection } from "@/components/atoms/GridSection"
import { SectionLabel } from "@/components/atoms/SectionLabel"
import { NumberedFeatureCard } from "@/components/molecules/NumberedFeatureCard"
import { MetadataTable } from "@/components/molecules/MetadataTable"
import { KpiBadge } from "@/components/molecules/KpiBadge"
import { ContactCard } from "@/components/molecules/ContactCard"
import { ScrollIndicator } from "@/components/molecules/ScrollIndicator"
import { TopNav } from "@/components/molecules/TopNav"
import { RevealText } from "@/components/molecules/RevealText"

export default async function ComponentsGallery({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-ks-bg text-ks-fg overflow-x-clip">
      <TopNav />
      <ScrollIndicator total={4} current={2} />
      <div className="border-b border-ks-hairline-active px-6 md:px-12 py-6 flex items-baseline justify-between">
        <span className="text-eyebrow font-body uppercase tracking-widest">Component Gallery — Task 02 + 03</span>
        <span className="text-mono-ks font-mono opacity-50">/dev/components</span>
      </div>
      <div className="px-6 md:px-12 py-16 space-y-0">
        <section id="eyebrow" className="py-12">
          <EyebrowLabel number="A" className="mb-10 opacity-50">EyebrowLabel</EyebrowLabel>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="text-micro font-mono opacity-40 w-40 shrink-0">number + accent</span>
              <EyebrowLabel number="01" accent>Home</EyebrowLabel>
            </div>
          </div>
        </section>
        <HairlineDivider />
        <section id="circle-plus" className="py-12">
          <EyebrowLabel number="C" className="mb-10 opacity-50">CirclePlusButton</EyebrowLabel>
          <div className="space-y-8">
            {(["plus", "arrow", "close"] as const).map((icon) => (
              <div key={icon} className="flex items-center gap-6">
                <span className="text-micro font-mono opacity-40 w-16 shrink-0">{icon}</span>
                {(["sm", "md", "lg"] as const).map((size) => (
                  <CirclePlusButton key={size} icon={icon} size={size} aria-label={`${icon} ${size}`} />
                ))}
              </div>
            ))}
          </div>
        </section>
        <HairlineDivider />
        <section id="container" className="py-12">
          <EyebrowLabel number="D" className="mb-10 opacity-50">Container</EyebrowLabel>
          <div className="border border-ks-hairline-active -mx-6 md:-mx-12">
            <Container className="border-x border-ks-accent/30">
              <div className="bg-ks-hairline-active py-8 text-center">
                <span className="text-small font-mono opacity-60">Container content area</span>
              </div>
            </Container>
          </div>
        </section>
        <HairlineDivider />
      </div>
      <GridSection id="grid-light-demo" noPaddingY className="py-12 border-t border-ks-hairline-active">
        <div className="col-span-12">
          <span className="text-micro font-mono opacity-40 block mb-4">GridSection — light</span>
        </div>
        <div className="col-span-4 space-y-3">
          <HairlineDivider className="my-0" />
          <span className="text-small font-body">Hairline in light section</span>
        </div>
      </GridSection>
      <GridSection id="grid-dark-demo" dark noPaddingY className="py-12">
        <div className="col-span-12">
          <span className="text-micro font-mono opacity-40 block mb-4">GridSection dark</span>
        </div>
        <div className="col-span-4 space-y-3">
          <HairlineDivider className="my-0" />
          <span className="text-small font-body">Hairline in dark section</span>
        </div>
      </GridSection>
      <div className="px-6 md:px-12 py-12 border-t border-ks-hairline-active">
        <EyebrowLabel number="F" className="mb-10 opacity-50">SectionLabel</EyebrowLabel>
        <SectionLabel number="03" name="Projects" id="section-label-demo" />
      </div>
      <div className="px-6 md:px-12 py-12 border-t border-ks-hairline-active">
        <EyebrowLabel number="G" className="mb-10 opacity-50">NumberedFeatureCard</EyebrowLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-ks-hairline-active p-6">
            <NumberedFeatureCard number="01" title="Technological Innovation" description="We design immersive interfaces and AR/VR experiences." />
          </div>
          <div className="border border-ks-hairline-active p-6">
            <NumberedFeatureCard number="02" title="Experiential Formats" description="Sensory systems for stadiums, museums, and events." items={["Live data visualization", "Generative sound design"]} href="#" />
          </div>
        </div>
      </div>
      <div className="px-6 md:px-12 py-12 border-t border-ks-hairline-active">
        <EyebrowLabel number="H" className="mb-10 opacity-50">MetadataTable</EyebrowLabel>
        <MetadataTable rows={[
          { label: "Client", value: "Lumen Technologies" },
          { label: "Year", value: "2024" },
          { label: "Format", value: "Interactive Installation" },
        ]} />
      </div>
      <div className="px-6 md:px-12 py-12 border-t border-ks-hairline-active">
        <EyebrowLabel number="I" className="mb-10 opacity-50">KpiBadge</EyebrowLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <KpiBadge icon={TrendingUp} value="38%" label="Audience engagement" />
          <KpiBadge icon={Database} value="2.4M+" label="Live data events" />
          <KpiBadge icon={Zap} value="<90ms" label="Response latency" />
          <KpiBadge icon={Activity} value="24/7" label="Uptime" />
        </div>
      </div>
      <div className="px-6 md:px-12 py-12 border-t border-ks-hairline-active">
        <EyebrowLabel number="J" className="mb-10 opacity-50">ContactCard</EyebrowLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ContactCard icon={Mail} label="Email" value="hello@kansei.studio" href="mailto:hello@kansei.studio" />
          <ContactCard icon={Link2} label="LinkedIn" value="kansei-studio" href="https://linkedin.com/company/kansei-studio" />
          <ContactCard icon={Camera} label="Instagram" value="@kansei.studio" />
        </div>
      </div>
      <div className="px-6 md:px-12 py-12 border-t border-ks-hairline-active">
        <EyebrowLabel number="M" className="mb-10 opacity-50">RevealText</EyebrowLabel>
        <div className="space-y-12 border-t border-ks-hairline-active pt-8">
          <RevealText as="h2" delay={0} className="text-ks-h2 font-display">Where technology becomes sensation.</RevealText>
          <RevealText as="p" delay={200} className="text-body font-body opacity-80 max-w-xl leading-relaxed">Kansei Studio builds sensory digital systems.</RevealText>
        </div>
      </div>
      <div id="section-o" className="px-6 md:px-12 py-12 border-t border-ks-hairline-active">
        <EyebrowLabel number="O" className="mb-10 opacity-50">VideoEmbed</EyebrowLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VideoEmbed />
          <VideoEmbed caption="Lumen Field System — preview · 2024" />
        </div>
      </div>
      <div className="h-24" />
    </div>
  )
}

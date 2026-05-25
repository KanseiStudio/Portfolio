import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Container } from "@/components/atoms/Container"

export async function HomeHero() {
  const t = await getTranslations("Home")

  return (
    <Container as="section" className="pt-8 pb-12">
      <div className="grid grid-cols-12 gap-4 lg:gap-6 items-center">

        {/* COLONNA SINISTRA: Title + Eyebrow + Body */}
        <div className="col-span-12 lg:col-span-7">

          {/* Title gigante KANSEI / STUDIO */}
          <h1 className="font-n27 font-bold uppercase leading-[0.95] tracking-tight">
            <span className="block text-[clamp(4rem,12vw,11rem)]">
              {t("titleLine1")}
            </span>
            <span className="block text-[clamp(4rem,12vw,11rem)]">
              {t("titleLine2")}
            </span>
          </h1>

          {/* Eyebrow con underline hairline */}
          <div className="mt-3 lg:mt-4 pb-3 border-b border-ks-hairline-active inline-block">
            <p
              className="font-mono uppercase tracking-widest opacity-80"
              style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.5rem)" }}
            >
              {t("eyebrow")}{" "}
              <span className="opacity-40 mx-2">{t("eyebrowDivider")}</span>{" "}
              {t("eyebrowSecond")}
            </p>
          </div>

          {/* Body copy */}
          <div className="mt-4 lg:mt-6 max-w-2xl">
            <p className="font-n27 font-medium text-xl lg:text-2xl leading-tight mb-3">
              {t("bodyHeadline")}
            </p>
            <p className="font-n27 font-light text-base lg:text-lg leading-relaxed opacity-90">
              {t("bodyText")}
            </p>
          </div>
        </div>

        {/* COLONNA DESTRA: Logo PNG grande */}
        <div className="col-span-12 lg:col-span-5 mt-10 lg:mt-0">
          <div className="relative w-full aspect-square scale-110 lg:scale-125 origin-center">
            <Image
              src="/logo.png"
              alt="Kansei Studio — Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

      </div>
    </Container>
  )
}

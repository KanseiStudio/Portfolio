import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "../lib/generated/prisma/client"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // -------- Categories --------
  const categoriesData = [
    { slug: "ai", sortOrder: 1, it: "AI", en: "AI" },
    { slug: "digital-assistant", sortOrder: 2, it: "Digital Assistant", en: "Digital Assistant" },
    { slug: "smart-services", sortOrder: 3, it: "Smart Services", en: "Smart Services" },
    { slug: "webgl", sortOrder: 4, it: "WebGL", en: "WebGL" },
    { slug: "installation", sortOrder: 5, it: "Installazione", en: "Installation" },
    { slug: "spatial", sortOrder: 6, it: "Spaziale", en: "Spatial" },
    { slug: "ecommerce", sortOrder: 7, it: "E-commerce", en: "E-commerce" },
  ]

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        translations: {
          create: [
            { locale: "it", name: cat.it },
            { locale: "en", name: cat.en },
          ],
        },
      },
    })
  }

  console.log("✓ Categories seeded")

  // -------- Project: Mico --------
  const mico = await prisma.project.upsert({
    where: { slug: "mico-shopping-mall-ai" },
    update: {},
    create: {
      slug: "mico-shopping-mall-ai",
      year: 2024,
      client: "Mico",
      format: "AI Digital Assistant",
      environment: "Shopping Malls",
      technologies: "Unreal Engine 5.7 · Google Speech-to-Text · OpenAI · ElevenLabs · Face Recognition",
      notes: "Avatar in tempo reale sviluppato in Unreal Engine 5.7, conversazione naturale via voice-to-text, identificazione tramite face recognition, sintesi vocale empatica.",
      videoUrl: "https://www.youtube.com/watch?v=4V8V6M4bMjE",
      published: true,
      sortOrder: 1,
      translations: {
        create: [
          {
            locale: "it",
            title: "Mico — La prima AI progettata su misura per i centri commerciali",
            tagline: "AI Digital Assistant per la customer experience",
            description: "Un assistente virtuale evoluto che trasforma l'accoglienza nei centri commerciali in un'esperienza interattiva e personalizzata.",
            problem: "I visitatori di un centro commerciale cercano informazioni in modo rapido e naturale: dove si trova un negozio o un servizio, quali promozioni sono attive, che cosa è più adatto alle loro esigenze. Tuttavia, i punti informativi tradizionali e la segnaletica non sempre bastano, soprattutto nei momenti di affluenza, e l'esperienza rischia di diventare dispersiva e poco fluida. Il cliente ha quindi bisogno di una soluzione che accolga le persone in modo \"umano\", capace di capire richieste vocali in linguaggio naturale, orientare sulla mappa, suggerire opzioni personalizzate e migliorare l'engagement, riducendo tempi di ricerca e frustrazione.",
            solution: "Un assistente virtuale evoluto che trasforma l'accoglienza in un'esperienza interattiva e personalizzata: un avatar in tempo reale sviluppato in Unreal Engine 5.7, capace di dialogare con il pubblico in modo naturale e coinvolgente. La conversazione parte dalla voce grazie a Google Speech-to-Text, mentre l'identificazione del visitatore tramite Face Recognition abilita un'interazione più contestuale e su misura. Le risposte vengono generate e ottimizzate da OpenAI, permettendo all'assistente di comprendere intenzioni, richieste e bisogni (negozi, servizi, promozioni, percorsi) e di fornire indicazioni precise, anche con consigli utili. Infine, la voce viene resa credibile e piacevole con la sintesi vocale di ElevenLabs, per un dialogo fluido, empatico e immediato. Il risultato è un sistema che riduce l'attrito nella visita, aumenta la soddisfazione e porta nei centri commerciali un nuovo standard di customer experience: smart, scalabile e memorabile.",
          },
          {
            locale: "en",
            title: "Mico — The first AI designed for shopping malls",
            tagline: "AI Digital Assistant for customer experience",
            description: "An advanced virtual assistant that transforms shopping mall reception into an interactive and personalized experience.",
            problem: "Shopping mall visitors look for information quickly and naturally: where a store or service is located, which promotions are active, what best fits their needs. However, traditional info points and signage are often insufficient — especially during peak hours — and the experience risks becoming scattered and friction-heavy. Customers need a solution that welcomes people in a \"human\" way, capable of understanding natural-language voice requests, guiding them on the map, suggesting personalized options, and improving engagement by reducing search time and frustration.",
            solution: "An advanced virtual assistant that transforms the welcome experience into an interactive and personalized journey: a real-time avatar built with Unreal Engine 5.7, able to converse with visitors in a natural and engaging way. Conversations start with voice via Google Speech-to-Text, while visitor identification through Face Recognition enables more contextual interactions. Responses are generated and optimized by OpenAI, allowing the assistant to understand intent, requests, and needs (stores, services, promotions, paths) and to provide precise guidance with helpful suggestions. Finally, ElevenLabs voice synthesis makes the voice credible and pleasant, enabling fluid, empathetic, immediate dialogue. The result is a system that reduces friction during visits, increases satisfaction, and brings a new customer experience standard to shopping malls: smart, scalable, memorable.",
          },
        ],
      },
    },
  })

  console.log("✓ Project Mico seeded")

  // -------- Project ↔ Categories link --------
  const aiCat = await prisma.category.findUnique({ where: { slug: "ai" } })
  const digitalAssistantCat = await prisma.category.findUnique({ where: { slug: "digital-assistant" } })
  const smartServicesCat = await prisma.category.findUnique({ where: { slug: "smart-services" } })

  if (aiCat && digitalAssistantCat && smartServicesCat) {
    for (const catId of [aiCat.id, digitalAssistantCat.id, smartServicesCat.id]) {
      await prisma.projectCategory.upsert({
        where: { projectId_categoryId: { projectId: mico.id, categoryId: catId } },
        update: {},
        create: { projectId: mico.id, categoryId: catId },
      })
    }
  }

  console.log("✓ Project ↔ Categories linked")

  // -------- Contact Info (singleton) --------
  const existingInfo = await prisma.contactInfo.findFirst()
  const contactInfo = existingInfo
    ? existingInfo
    : await prisma.contactInfo.create({
        data: {
          studioName: "Kansei Studio",
          email: "hello@kansei-studio.art",
        },
      })

  await prisma.contactInfoTranslation.upsert({
    where: { contactInfoId_locale: { contactInfoId: contactInfo.id, locale: "it" } },
    create: {
      contactInfoId: contactInfo.id,
      locale: "it",
      location: "Italy / Remote",
      availability: "Aperti a collaborazioni selezionate",
      focus: "Immersive Web, AI Interfaces, Digital Installations",
    },
    update: {
      location: "Italy / Remote",
      availability: "Aperti a collaborazioni selezionate",
      focus: "Immersive Web, AI Interfaces, Digital Installations",
    },
  })

  await prisma.contactInfoTranslation.upsert({
    where: { contactInfoId_locale: { contactInfoId: contactInfo.id, locale: "en" } },
    create: {
      contactInfoId: contactInfo.id,
      locale: "en",
      location: "Italy / Remote",
      availability: "Open for selected collaborations",
      focus: "Immersive Web, AI Interfaces, Digital Installations",
    },
    update: {
      location: "Italy / Remote",
      availability: "Open for selected collaborations",
      focus: "Immersive Web, AI Interfaces, Digital Installations",
    },
  })

  console.log("✓ Contact info seeded")

  // -------- Contact Channels --------
  const channelsData = [
    {
      platform: "email",
      iconName: "Mail",
      handle: "hello@kansei-studio.art",
      url: "mailto:hello@kansei-studio.art",
      sortOrder: 1,
      labels: { it: "Email", en: "Email" },
    },
    {
      platform: "linkedin",
      iconName: "Linkedin",
      handle: "kansei-studio",
      url: "https://www.linkedin.com/company/kansei-studio",
      sortOrder: 2,
      labels: { it: "LinkedIn", en: "LinkedIn" },
    },
    {
      platform: "instagram",
      iconName: "Instagram",
      handle: "@kansei.studio",
      url: "https://www.instagram.com/kansei.studio",
      sortOrder: 3,
      labels: { it: "Instagram", en: "Instagram" },
    },
    {
      platform: "github",
      iconName: "Github",
      handle: "github.com/kansei-studio",
      url: "https://github.com/kansei-studio",
      sortOrder: 4,
      labels: { it: "GitHub / Portfolio", en: "GitHub / Portfolio" },
    },
    {
      platform: "newsletter",
      iconName: "NotebookPen",
      handle: "Design thinking & technical essays",
      url: null,
      sortOrder: 5,
      labels: { it: "Newsletter / Notes", en: "Newsletter / Notes" },
    },
  ]

  for (const ch of channelsData) {
    const existingChannel = await prisma.contactChannel.findFirst({
      where: { platform: ch.platform },
    })

    const channel = existingChannel
      ? await prisma.contactChannel.update({
          where: { id: existingChannel.id },
          data: {
            iconName: ch.iconName,
            handle: ch.handle,
            url: ch.url,
            sortOrder: ch.sortOrder,
            enabled: true,
          },
        })
      : await prisma.contactChannel.create({
          data: {
            platform: ch.platform,
            iconName: ch.iconName,
            handle: ch.handle,
            url: ch.url,
            sortOrder: ch.sortOrder,
            enabled: true,
          },
        })

    for (const [locale, label] of Object.entries(ch.labels)) {
      await prisma.contactChannelTranslation.upsert({
        where: { contactChannelId_locale: { contactChannelId: channel.id, locale } },
        create: { contactChannelId: channel.id, locale, label },
        update: { label },
      })
    }
  }

  console.log("✓ Contact channels seeded")

  // -------- Technologies --------
  const technologiesData = [
    {
      slug: "touchdesigner",
      name: "TouchDesigner",
      videoUrl: "https://vimeo.com/kansei/touchdesigner",
      sortOrder: 1,
      translations: {
        it: {
          description: "Piattaforma visuale per sistemi generativi, dati in tempo reale e ambienti audiovisivi reattivi.",
          applications: "Installazioni immersive, visual generativi, ledwall, data visualization.",
        },
        en: {
          description: "Visual platform for generative systems, real-time data and reactive audiovisual environments.",
          applications: "Immersive installations, generative visuals, LED walls, data visualization.",
        },
      },
    },
    {
      slug: "unreal",
      name: "Unreal Engine",
      videoUrl: "https://vimeo.com/kansei/unreal",
      sortOrder: 2,
      translations: {
        it: {
          description: "Motore real-time per ambienti 3D, digital human, simulazioni spaziali e interfacce immersive.",
          applications: "Experience 3D, musei interattivi, avatar AI, visualizzazione real-time.",
        },
        en: {
          description: "Real-time engine for 3D environments, digital humans, spatial simulations and immersive interfaces.",
          applications: "3D experiences, interactive museums, AI avatars, real-time visualization.",
        },
      },
    },
    {
      slug: "unity",
      name: "Unity",
      videoUrl: "https://vimeo.com/kansei/unity",
      sortOrder: 3,
      translations: {
        it: {
          description: "Framework per applicazioni interattive, touch systems e soluzioni cross-platform.",
          applications: "Totem touch, app interattive, control panel, esperienze mobile e desktop.",
        },
        en: {
          description: "Framework for interactive applications, touch systems and cross-platform solutions.",
          applications: "Touch totems, interactive apps, control panels, mobile and desktop experiences.",
        },
      },
    },
    {
      slug: "openai-systems",
      name: "OpenAI Systems",
      videoUrl: "https://vimeo.com/kansei/openai",
      sortOrder: 4,
      translations: {
        it: {
          description: "LLM, speech e agent orchestration per sistemi conversazionali e interfacce intelligenti.",
          applications: "Digital assistant, voice interaction, AI multi-agent, personalizzazione.",
        },
        en: {
          description: "LLM, speech and agent orchestration for conversational systems and intelligent interfaces.",
          applications: "Digital assistant, voice interaction, AI multi-agent, personalization.",
        },
      },
    },
  ]

  for (const tech of technologiesData) {
    const upserted = await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: {
        name: tech.name,
        videoUrl: tech.videoUrl,
        sortOrder: tech.sortOrder,
        published: true,
      },
      create: {
        slug: tech.slug,
        name: tech.name,
        videoUrl: tech.videoUrl,
        sortOrder: tech.sortOrder,
        published: true,
      },
    })

    for (const [locale, tr] of Object.entries(tech.translations)) {
      await prisma.technologyTranslation.upsert({
        where: { technologyId_locale: { technologyId: upserted.id, locale } },
        create: {
          technologyId: upserted.id,
          locale,
          description: tr.description,
          applications: tr.applications,
        },
        update: {
          description: tr.description,
          applications: tr.applications,
        },
      })
    }
  }

  console.log("✓ Technologies seeded")

  console.log("✅ Seeding complete")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

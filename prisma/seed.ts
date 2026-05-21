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

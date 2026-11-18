/**
 * Seed dei Works (KDoors, KBox, K-Avatar).
 * Non distruttivo: crea solo i lavori mancanti, quelli esistenti restano intatti.
 * Con --force riscrive tutto (upsert per slug + sostituzione completa di tag,
 * stats e sezioni) dopo aver stampato gli slug coinvolti.
 *
 *   npm run seed:works              # crea solo i mancanti
 *   npm run seed:works -- --force   # riscrive anche gli esistenti
 *
 * Testi IT presi testualmente dalle anteprime in design/references/works/.
 * Immagini: path locali in public/works/<slug>/.
 */
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient, type SectionKind, type HeroTone } from "../lib/generated/prisma/client"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

type T = [it: string, en: string]

interface SeedItem {
  label?: T
  title?: T
  body?: T
  extra?: T
  image?: string
  alt?: T
}
interface SeedSection {
  kind: SectionKind
  eyebrow?: T
  title?: T
  body?: T
  columns?: T
  image?: string
  alt?: T
  items?: SeedItem[]
}
interface SeedStat {
  value: string
  label: T
  cardLabel?: T
  onCard?: boolean
  onPage?: boolean
}
interface SeedWork {
  slug: string
  name: string
  order: number
  type: T
  typeShort?: T
  status: T
  tagline: T
  intro: T
  summary?: T
  closing?: T
  ctaLabel?: T
  heroImage: string
  heroAlt: T
  heroCaption?: string
  heroTone: HeroTone
  tags: T[]
  stats: SeedStat[]
  sections: SeedSection[]
}

// ─── KDoors ────────────────────────────────────────────────────────────────

const kdoors: SeedWork = {
  slug: "kdoors",
  name: "KDoors",
  order: 1,
  type: ["Installazione fisica · Motore AI", "Physical installation · AI engine"],
  typeShort: ["Installazione fisica · AI", "Physical installation · AI"],
  status: ["Disponibile", "Available"],
  tagline: ["Apri la porta. Dietro ci sei già tu.", "Open the door. You're already behind it."],
  intro: [
    "Una porta d'ingresso vera, con citofono e serratura, che si apre sulla vita futura di chi suona. Dietro la soglia il visitatore ritrova se stesso, la sua famiglia, i suoi amici, già dentro gli ambienti reali del progetto. Nessuno schermo in vista, nessun visore, nessuna spiegazione.",
    "A real front door, with intercom and lock, that opens onto the future life of whoever rings. Beyond the threshold, visitors find themselves, their family and their friends, already inside the real spaces of the project. No screens in sight, no headsets, no explanations.",
  ],
  summary: [
    "Una porta vera, con citofono e serratura, in mezzo al pubblico. Suoni, la serratura scatta, e dall'altra parte trovi la tua vita futura: tu e i tuoi, già dentro la casa, il prodotto, il mondo che il brand vuole raccontare.",
    "A real door, with intercom and lock, right in the middle of the crowd. You ring, the lock clicks, and on the other side you find your future life: you and your people, already inside the home, the product, the world the brand wants to tell.",
  ],
  closing: [
    "Una porta che non si apre su una stanza: si apre su una vita.",
    "A door that doesn't open onto a room: it opens onto a life.",
  ],
  ctaLabel: ["Richiedi la presentazione", "Request the presentation"],
  heroImage: "/works/kdoors/hero.jpg",
  heroAlt: [
    "Illustrazione: porta aperta su una casa illuminata, famiglia all'interno, una persona davanti al citofono",
    "Illustration: a door open onto a lit home, a family inside, a person standing at the intercom",
  ],
  heroCaption: "Ding-dong · Sei già a casa",
  heroTone: "LIGHT",
  tags: [
    ["Real estate", "Real estate"],
    ["Hospitality", "Hospitality"],
    ["Brand & retail", "Brand & retail"],
    ["Fiere ed eventi", "Trade fairs & events"],
  ],
  stats: [
    { value: "45–60″", label: ["per gruppo, nessuna coda percepita", "per group, no perceived queue"], cardLabel: ["per gruppo", "per group"], onCard: true },
    { value: "500+", label: ["porte aperte al giorno, un solo host", "doors opened a day, a single host"], cardLabel: ["porte al giorno", "doors a day"], onCard: true },
    { value: "×3", label: ["portata organica dalle condivisioni", "organic reach from shares"] },
    { value: "1:1", label: ["ogni immagine, un contatto profilato", "every image, a qualified lead"] },
    { value: "1,2×1 m", label: ["di ingombro a terra", "floor footprint"] },
    { value: "0", label: ["schermi in vista", "screens in sight"], onCard: true, onPage: false },
  ],
  sections: [
    {
      kind: "CARDS",
      eyebrow: ["01 — Il problema", "01 — The problem"],
      title: ["Informare non basta. Bisogna far desiderare.", "Informing isn't enough. You have to make people want it."],
      body: [
        "Raccontare un prodotto che il cliente non può ancora toccare, una casa sulla carta, un viaggio, un'esperienza, significa affidarsi a render, brochure e schermi. Funzionano per informare, non per far desiderare.",
        "Presenting a product the client can't touch yet — a home on paper, a journey, an experience — means relying on renders, brochures and screens. They work to inform, not to create desire.",
      ],
      items: [
        { label: ["01", "01"], title: ["I render si guardano", "Renders get looked at"], body: ["Belli, precisi, tutti uguali: mostrano uno spazio, non la vita che ci si farà dentro.", "Beautiful, precise, all alike: they show a space, not the life that will be lived in it."] },
        { label: ["02", "02"], title: ["Gli schermi sono ovunque", "Screens are everywhere"], body: ["Un totem in più non ferma nessuno: l'occhio lo riconosce come pubblicità e passa oltre.", "One more kiosk stops no one: the eye reads it as advertising and moves on."] },
        { label: ["03", "03"], title: ["Il cliente non si vede dentro", "Clients can't see themselves inside"], body: ["La decisione d'acquisto nasce quando ci si immagina lì. Nessun materiale lo fa al posto suo.", "The decision to buy starts when you picture yourself there. No material does that for you."] },
        { label: ["04", "04"], title: ["L'esperienza non resta", "The experience doesn't last"], body: ["Il visitatore se ne va senza un ricordo da condividere, e il brand senza un contatto da richiamare.", "Visitors leave with no memory to share, and the brand with no contact to follow up."] },
      ],
    },
    {
      kind: "IMAGE",
      eyebrow: ["02 — L'idea", "02 — The idea"],
      title: ["Una porta vera. La tua.", "A real door. Yours."],
      body: [
        "Ogni casa, ogni viaggio, ogni nuovo inizio comincia da una porta. Abbiamo preso quella promessa alla lettera: un'anta vera, con la sua maniglia, il suo peso, il suo suono. Accanto, un citofono in ottone. Dietro, la tua vita.",
        "Every home, every journey, every new beginning starts with a door. We took that promise literally: a real door leaf, with its handle, its weight, its sound. Beside it, a brass intercom. Behind it, your life.",
      ],
      image: "/works/kdoors/flow.jpg",
      alt: [
        "Sequenza: suoni il citofono, la porta si apre sulla famiglia in casa, l'immagine arriva sul telefono",
        "Sequence: you ring the intercom, the door opens onto the family at home, the image arrives on your phone",
      ],
    },
    {
      kind: "CARDS",
      items: [
        { label: ["Una porta", "A door"], title: ["Fisica, pesante, vera", "Physical, heavy, real"], body: ["La stessa porta del progetto, o una disegnata sul brand: maniglia, serratura, peso. Il corpo capisce prima della testa.", "The project's own door, or one designed around the brand: handle, lock, weight. The body understands before the mind does."] },
        { label: ["Un citofono", "An intercom"], title: ["Un gesto che vale come consenso", "A gesture that counts as consent"], body: ["Suonare è istintivo per tutti, dai bambini ai nonni. Nessun menù, nessuna app: si fotografa solo chi suona.", "Ringing comes naturally to everyone, from kids to grandparents. No menus, no apps: only those who ring are photographed."] },
        { label: ["La tua vita", "Your life"], title: ["Non un render: un ritratto del futuro", "Not a render: a portrait of the future"], body: ["Dietro la porta il visitatore e i suoi, già in cucina, sul divano, sul terrazzo. Un'immagine da portare via.", "Behind the door, visitors and their people, already in the kitchen, on the sofa, on the terrace. An image to take home."] },
      ],
    },
    {
      kind: "QUOTE",
      title: ["Il cambio di prospettiva", "The shift in perspective"],
      body: [
        "Il pubblico non guarda il prodotto. Lo abita. Un render mostra uno spazio vuoto; KDoors mostra la tua famiglia dentro quello spazio.",
        "The audience doesn't look at the product. They inhabit it. A render shows an empty space; KDoors shows your family inside that space.",
      ],
    },
    {
      kind: "TIMELINE",
      eyebrow: ["03 — L'esperienza", "03 — The experience"],
      title: ["Un minuto che si ricorda per anni.", "One minute remembered for years."],
      body: [
        "Sei momenti, un solo gesto naturale. L'attesa non è un tempo morto: è parte della storia. Dal ding-dong al contatto in un minuto.",
        "Six moments, one natural gesture. The wait isn't dead time: it's part of the story. From ding-dong to contact in one minute.",
      ],
      items: [
        { label: ["01", "01"], title: ["La soglia", "The threshold"], body: ["Ti fermi sulla pedana. Lo spioncino si illumina, il pulsante del citofono si accende: «suona per entrare».", "You stop on the platform. The peephole lights up, the intercom button glows: “ring to enter”."], extra: ["0″", "0″"] },
        { label: ["02", "02"], title: ["Suoni", "You ring"], body: ["Un gesto istintivo, che vale come consenso. Al ding-dong la fotocamera sopra lo stipite ti ritrae con chi è con te.", "An instinctive gesture that counts as consent. At the ding-dong, the camera above the frame captures you and whoever is with you."], extra: ["3″", "3″"] },
        { label: ["03", "03"], title: ["Qualcuno arriva", "Someone's coming"], body: ["Dietro la porta passi, una voce, la luce dello spioncino che cambia. Otto secondi che sembrano una storia, non un caricamento.", "Behind the door: footsteps, a voice, the peephole light shifting. Eight seconds that feel like a story, not a loading screen."], extra: ["3–12″", "3–12″"] },
        { label: ["04", "04"], title: ["La serratura scatta", "The lock clicks"], body: ["Un click meccanico, vero, che si sente nelle mani. La porta si sblocca solo quando la tua casa è pronta.", "A real mechanical click you can feel in your hands. The door unlocks only when your home is ready."], extra: ["12″", "12″"] },
        { label: ["05", "05"], title: ["Apri", "You open"], body: ["Dietro la porta, la scena: tu e i tuoi in cucina, sul divano, sul terrazzo. La vostra vita, lì.", "Behind the door, the scene: you and your people in the kitchen, on the sofa, on the terrace. Your life, right there."], extra: ["15″", "15″"] },
        { label: ["06", "06"], title: ["La porti via", "You take it with you"], body: ["Un QR consegna l'immagine sul telefono, con il progetto e un invito a visitarlo. Chiudi la porta: è pronta per il prossimo.", "A QR code delivers the image to your phone, with the project and an invitation to visit. Close the door: it's ready for the next guest."], extra: ["45–60″", "45–60″"] },
      ],
    },
    {
      kind: "CARDS",
      eyebrow: ["04 — Come funziona", "04 — How it works"],
      title: ["Tecnologia invisibile, casa fedele.", "Invisible technology, faithful home."],
      body: [
        "Nessuna stanza viene inventata dall'intelligenza artificiale: le persone fotografate entrano in tavole fotorealistiche degli ambienti veri del progetto, con posti liberi pronti ad accoglierle.",
        "No room is invented by artificial intelligence: the people photographed are placed into photorealistic plates of the project's real spaces, with empty spots ready to welcome them.",
      ],
      items: [
        { label: ["01 →", "01 →"], title: ["Citofono e camera", "Intercom and camera"], body: ["Pulsante in ottone, fotocamera sopra lo stipite: lo scatto parte solo al ding-dong.", "Brass button, camera above the frame: the shot fires only at the ding-dong."] },
        { label: ["02 →", "02 →"], title: ["Sensori porta", "Door sensors"], body: ["Campanello, apertura e serratura elettrica dialogano con la regia.", "Doorbell, opening and electric lock talk to the control system."] },
        { label: ["03 →", "03 →"], title: ["Regia", "Show control"], body: ["Luci, suoni, tempi e reset: l'attesa diventa racconto, il ciclo riparte da solo.", "Lights, sounds, timing and reset: the wait becomes a story, the cycle restarts on its own."] },
        { label: ["04 →", "04 →"], title: ["Motore AI", "AI engine"], body: ["Inserisce le persone nelle tavole degli ambienti veri, preparate in anticipo.", "Places people into plates of the real spaces, prepared in advance."] },
        { label: ["05", "05"], title: ["Schermo e QR", "Screen and QR"], body: ["Display verticale 75″ dietro la porta; QR verso immagine, progetto e contatto.", "75″ vertical display behind the door; QR to image, project and contact."] },
      ],
    },
    {
      kind: "CARDS",
      items: [
        { title: ["Tutto in loco, niente in cloud", "Everything on site, nothing in the cloud"], body: ["Il motore AI vive dentro l'installazione: le fotografie non escono mai dalla macchina.", "The AI engine lives inside the installation: photos never leave the machine."] },
        { title: ["Il consenso è il gesto", "The gesture is the consent"], body: ["Si fotografa solo chi suona. Nessun dato biometrico, immagini cancellate entro 24 ore.", "Only those who ring are photographed. No biometric data, images deleted within 24 hours."] },
        { title: ["Nessun errore in scena", "No errors on stage"], body: ["Se qualcosa non va, la porta si apre comunque su una stanza viva e il QR invita a riprovare.", "If something goes wrong, the door still opens onto a living room and the QR invites you to try again."] },
      ],
    },
    {
      kind: "SPECS",
      eyebrow: ["05 — Specifiche", "05 — Specifications"],
      title: ["Compatta, entra ovunque.", "Compact, fits anywhere."],
      body: [
        "Dal via alla prima porta aperta: 8–10 settimane. Valori indicativi, da confermare in base allo spazio e alle finiture.",
        "From kickoff to the first door opened: 8–10 weeks. Indicative values, to be confirmed based on space and finishes.",
      ],
      items: [
        { label: ["Struttura", "Structure"], body: ["Portale autoportante 1,2 × 2,3 m, profondità 1 m", "Freestanding portal 1.2 × 2.3 m, 1 m deep"] },
        { label: ["Porta", "Door"], body: ["Anta reale 80 × 210 cm, serratura elettrica, finitura su misura", "Real door leaf 80 × 210 cm, electric lock, custom finish"] },
        { label: ["Ripresa", "Capture"], body: ["Fotocamera sopra lo stipite, attivata solo dal campanello", "Camera above the frame, triggered only by the doorbell"] },
        { label: ["Schermo", "Screen"], body: ["Display verticale 75″ dietro la porta", "75″ vertical display behind the door"] },
        { label: ["Elaborazione", "Processing"], body: ["Computer con motore AI integrato, funzionamento offline", "Computer with built-in AI engine, runs offline"] },
        { label: ["Capacità", "Capacity"], body: ["Fino a 3 persone in scena; 45–60″ per gruppo", "Up to 3 people per scene; 45–60″ per group"] },
        { label: ["Privacy", "Privacy"], body: ["Nessun dato biometrico; immagini cancellate entro 24 ore", "No biometric data; images deleted within 24 hours"] },
      ],
    },
  ],
}

// ─── KBox ──────────────────────────────────────────────────────────────────

const kbox: SeedWork = {
  slug: "kbox",
  name: "KBox",
  order: 2,
  type: ["Display LED · Unreal Engine", "LED display · Unreal Engine"],
  typeShort: ["Display LED · Unreal Engine", "LED display · Unreal Engine"],
  status: ["Disponibile", "Available"],
  tagline: ["Una teca di luce che contiene un mondo intero.", "A showcase of light that holds an entire world."],
  intro: [
    "La colonna espositiva che sostituisce la vetrina fisica: un cubo LED ad alta risoluzione su cinque facce, posato su una base di un metro. Dentro prendono vita scenari costruiti in Unreal Engine, e al centro c'è sempre l'oggetto da promuovere. Un'automobile, un gioiello, un farmaco, un edificio non ancora costruito.",
    "The display column that replaces the physical showcase: a high-resolution LED cube on five faces, set on a one-metre base. Inside, scenes built in Unreal Engine come to life, and at their centre is always the object being promoted. A car, a jewel, a medicine, a building not yet built.",
  ],
  summary: [
    "Un cubo LED su cinque facce, posato su una base di un metro. Dentro, scenari costruiti in Unreal Engine; al centro, sempre il prodotto da raccontare. Non uno schermo appeso al muro: un volume da girare intorno, come un diorama vivo.",
    "An LED cube on five faces, set on a one-metre base. Inside, scenes built in Unreal Engine; at the centre, always the product to be told. Not a screen hung on a wall: a volume to walk around, like a living diorama.",
  ],
  closing: [
    "Il prodotto non viene esposto: viene raccontato, dentro il mondo che gli appartiene.",
    "The product isn't displayed: it's told, inside the world it belongs to.",
  ],
  ctaLabel: ["Richiedi la presentazione", "Request the presentation"],
  heroImage: "/works/kbox/hero.jpg",
  heroAlt: [
    "Colonna KBox con cubo LED che mostra una foresta lussureggiante",
    "KBox column with an LED cube showing a lush forest",
  ],
  heroCaption: "150 × 50 × 50 cm",
  heroTone: "DARK",
  tags: [
    ["Real estate", "Real estate"],
    ["Automotive", "Automotive"],
    ["Pharma", "Pharma"],
    ["Lusso", "Luxury"],
    ["Musei", "Museums"],
  ],
  stats: [
    { value: "150 cm", label: ["altezza totale della colonna", "total column height"], cardLabel: ["altezza colonna", "column height"], onCard: true },
    { value: "50 cm", label: ["lato del cubo LED", "LED cube side"] },
    { value: "5", label: ["facce luminose, quattro lati più il piano", "illuminated faces, four sides plus the top"], cardLabel: ["facce luminose", "illuminated faces"], onCard: true },
    { value: "1,9 mm", label: ["passo pixel, immagine fitta e nitida", "pixel pitch, dense and sharp image"], cardLabel: ["passo pixel", "pixel pitch"], onCard: true },
    { value: "∞", label: ["ambienti in cui collocare il prodotto", "settings to place the product in"] },
  ],
  sections: [
    {
      kind: "CARDS",
      eyebrow: ["01 — Il problema", "01 — The problem"],
      title: ["L'oggetto sta fermo. Lo schermo si confonde.", "The object stands still. The screen blends in."],
      body: [
        "Esporre un prodotto oggi significa scegliere tra due limiti: l'oggetto fisico, che non racconta, e lo schermo piatto, che racconta ma si confonde con tutti gli altri.",
        "Displaying a product today means choosing between two limits: the physical object, which tells nothing, and the flat screen, which tells a story but blends in with all the others.",
      ],
      items: [
        { label: ["01", "01"], title: ["L'oggetto da solo non parla", "The object alone doesn't speak"], body: ["Su un piedistallo mostra la forma, non il valore: il contesto che lo rende desiderabile resta fuori.", "On a pedestal it shows its form, not its value: the context that makes it desirable stays outside."] },
        { label: ["02", "02"], title: ["Gli schermi sono ovunque", "Screens are everywhere"], body: ["Un monitor in più non ferma nessuno. L'occhio lo riconosce come pubblicità e passa oltre.", "One more monitor stops no one. The eye reads it as advertising and moves on."] },
        { label: ["03", "03"], title: ["Non tutto si può esporre", "Not everything can be displayed"], body: ["Troppo grande, prezioso, fragile, o non ancora esistente: in sala non ci entra.", "Too big, precious, fragile, or not yet in existence: it won't fit in the room."] },
        { label: ["04", "04"], title: ["Ogni allestimento costa", "Every set-up costs"], body: ["Cambiare vetrina, stagione o campagna significa nuovi materiali, trasporti e montaggi.", "Changing showcase, season or campaign means new materials, shipping and installation."] },
      ],
    },
    {
      kind: "SPLIT",
      eyebrow: ["02 — L'idea", "02 — The idea"],
      title: ["L'oggetto dentro il suo mondo.", "The object inside its world."],
      body: [
        "Ogni prodotto ha un luogo in cui appare al suo meglio. KBox porta quel luogo dentro un cubo di cinquanta centimetri. Il pubblico gira intorno alla colonna per scoprire che cosa succede sull'altro lato: lo stesso gesto con cui si guarda un plastico, un acquario, una teca museale.",
        "Every product has a place where it looks its best. KBox brings that place inside a fifty-centimetre cube. People walk around the column to discover what's happening on the other side: the same gesture used to look at a scale model, an aquarium, a museum case.",
      ],
      image: "/works/kbox/anatomy.jpg",
      alt: [
        "Schema quotato della colonna: cubo 50 cm su base 100 cm, altezza totale 150 cm",
        "Dimensioned drawing of the column: 50 cm cube on a 100 cm base, 150 cm total height",
      ],
      items: [
        { label: ["Un oggetto", "An object"], title: ["Il prodotto, in digitale", "The product, in digital"], body: ["Ricostruito in 3D da CAD, scansione o fotografie, fedele in materiali, proporzioni e dettagli.", "Rebuilt in 3D from CAD, scans or photos, faithful in materials, proportions and details."] },
        { label: ["Un mondo", "A world"], title: ["Lo scenario che lo esalta", "The setting that elevates it"], body: ["Costruito in Unreal Engine: una foresta, una città, un laboratorio, un paesaggio che non esiste.", "Built in Unreal Engine: a forest, a city, a laboratory, a landscape that doesn't exist."] },
        { label: ["Una storia", "A story"], title: ["Il tempo che lo racconta", "The time that tells it"], body: ["Luce, stagioni, trasformazioni: la scena evolve e trattiene lo sguardo.", "Light, seasons, transformations: the scene evolves and holds the gaze."] },
      ],
    },
    {
      kind: "IMAGE",
      eyebrow: ["03 — Un esempio", "03 — An example"],
      title: ["Il cantiere che si costruisce da sé.", "The building site that builds itself."],
      body: [
        "Per un progetto residenziale in vendita, KBox mostra ciò che l'acquirente non può ancora vedere: l'edificio che nasce, piano dopo piano, dentro la sua teca. Trenta secondi, un ciclo completo.",
        "For a residential project on sale, KBox shows what buyers can't see yet: the building rising, floor by floor, inside its case. Thirty seconds, one full cycle.",
      ],
      image: "/works/kbox/pubblico.jpg",
      alt: [
        "Una famiglia osserva e indica il plastico illuminato dentro la teca",
        "A family looks at and points to the illuminated model inside the case",
      ],
    },
    {
      kind: "GALLERY",
      items: [
        { image: "/works/kbox/step-1.jpg", alt: ["Il lotto vuoto con le fondazioni", "The empty plot with the foundations"], label: ["01 · Le fondazioni", "01 · The foundations"], body: ["La platea del lotto, vuota: la storia parte da zero.", "The plot's slab, empty: the story starts from zero."] },
        { image: "/works/kbox/step-2.jpg", alt: ["Pilastri e solai che salgono", "Columns and floor slabs rising"], label: ["02 · La struttura", "02 · The structure"], body: ["Pilastri e solai salgono, la gru entra in scena.", "Columns and slabs rise, the crane enters the scene."] },
        { image: "/works/kbox/step-3.jpg", alt: ["Facciate con ponteggi e balconi", "Façades with scaffolding and balconies"], label: ["03 · Le facciate", "03 · The façades"], body: ["Ponteggi, tamponature, balconi: prende la forma reale.", "Scaffolding, infill walls, balconies: it takes on its real shape."] },
        { image: "/works/kbox/step-4.jpg", alt: ["Edificio finito, verde sui terrazzi e luci accese al tramonto", "Finished building, greenery on the terraces and lights on at sunset"], label: ["04 · Il risultato", "04 · The result"], body: ["Il verde sui terrazzi, le luci al tramonto: la casa è abitata.", "Greenery on the terraces, lights at sunset: the home is lived in."] },
      ],
    },
    {
      kind: "GALLERY",
      eyebrow: ["04 — Una colonna, infiniti mondi", "04 — One column, endless worlds"],
      title: ["Il prodotto non cambia. Cambia il mondo intorno.", "The product doesn't change. The world around it does."],
      body: [
        "Una scena per ogni pubblico, stagione o campagna, senza produrre un solo allestimento fisico. Loop d'atmosfera, racconto o palinsesto di campagne.",
        "A scene for every audience, season or campaign, without producing a single physical set-up. Ambient loop, narrative or campaign schedule.",
      ],
      items: [
        { image: "/works/kbox/world-sottobosco.jpg", alt: ["KBox con scenario sottobosco", "KBox with an undergrowth scene"], label: ["Sottobosco", "Undergrowth"] },
        { image: "/works/kbox/world-foresta.jpg", alt: ["KBox con scenario roccia e muschio", "KBox with a rock and moss scene"], label: ["Foresta", "Forest"] },
        { image: "/works/kbox/step-4.jpg", alt: ["KBox con plastico residenziale illuminato", "KBox with an illuminated residential model"], label: ["Residenziale", "Residential"] },
      ],
    },
    {
      kind: "SPECS",
      eyebrow: ["05 — Specifiche", "05 — Specifications"],
      title: ["Una presa di corrente. Nient'altro.", "One power socket. Nothing else."],
      body: [
        "Pensata per una hall, uno showroom o uno stand. La struttura resta, i contenuti si rinnovano. Valori indicativi, da confermare in base ai moduli LED e al player.",
        "Designed for a lobby, a showroom or a stand. The structure stays, the content is renewed. Indicative values, to be confirmed based on LED modules and player.",
      ],
      items: [
        { label: ["Dimensioni", "Dimensions"], body: ["150 × 50 × 50 cm", "150 × 50 × 50 cm"] },
        { label: ["Base", "Base"], body: ["Altezza 100 cm, nero opaco (personalizzabile)", "100 cm high, matte black (customisable)"] },
        { label: ["Cubo LED", "LED cube"], body: ["50 × 50 × 50 cm, cinque facce attive", "50 × 50 × 50 cm, five active faces"] },
        { label: ["Passo pixel", "Pixel pitch"], body: ["1,9 mm, tecnologia SMD per interni", "1.9 mm, indoor SMD technology"] },
        { label: ["Risoluzione", "Resolution"], body: ["≈ 256 × 256 px per faccia", "≈ 256 × 256 px per face"] },
        { label: ["Contenuti", "Content"], body: ["Video pre-renderizzati da Unreal Engine, mappati sulle cinque facce", "Pre-rendered Unreal Engine videos, mapped onto the five faces"] },
        { label: ["Riproduzione", "Playback"], body: ["Loop continuo o palinsesto programmato", "Continuous loop or scheduled programme"] },
        { label: ["Alimentazione", "Power"], body: ["Rete elettrica standard 230 V", "Standard 230 V mains"] },
      ],
    },
  ],
}

// ─── K-Avatar ──────────────────────────────────────────────────────────────

const kavatar: SeedWork = {
  slug: "k-avatar",
  name: "K-Avatar",
  order: 3,
  type: ["Assistente digitale · AI conversazionale", "Digital assistant · Conversational AI"],
  typeShort: ["Assistente digitale · AI", "Digital assistant · AI"],
  status: ["In esercizio", "In operation"],
  tagline: [
    "Un volto che ti vede, una voce che ti ascolta, una presenza che sa quando parlare e quando tacere.",
    "A face that sees you, a voice that listens, a presence that knows when to speak and when to stay silent.",
  ],
  intro: [
    "La piattaforma per assistenti digitali 3D fotorealistici che accolgono, informano e accompagnano le persone negli spazi reali: musei, hall, eventi, reception, strutture ricettive. Non un'interfaccia da toccare, ma un interlocutore con un volto, una voce e una conoscenza costruita sui contenuti del cliente.",
    "The platform for photorealistic 3D digital assistants that welcome, inform and guide people in real spaces: museums, lobbies, events, receptions, hospitality venues. Not an interface to touch, but a counterpart with a face, a voice and knowledge built on the client's own content.",
  ],
  summary: [
    "Assistenti digitali 3D fotorealistici che accolgono, informano e accompagnano le persone negli spazi reali. Una presenza che sa quando parlare e quando tacere, addestrata sui contenuti del cliente.",
    "Photorealistic 3D digital assistants that welcome, inform and guide people in real spaces. A presence that knows when to speak and when to stay silent, trained on the client's content.",
  ],
  closing: [
    "Il primo assistente progettato per sapere quando non parlare, e per imparare come parlare con ciascuno.",
    "The first assistant designed to know when not to speak, and to learn how to speak with each person.",
  ],
  ctaLabel: ["Richiedi una demo", "Request a demo"],
  heroImage: "/works/k-avatar/hero.jpg",
  heroAlt: [
    "Avatar fotorealistico MetaHuman: donna in abito scuro su fondo rosso",
    "Photorealistic MetaHuman avatar: woman in a dark suit on a red background",
  ],
  heroCaption: "Un volto, una persona",
  heroTone: "LIGHT",
  tags: [
    ["Musei", "Museums"],
    ["Fiere", "Trade fairs"],
    ["Hospitality", "Hospitality"],
    ["Reception", "Reception"],
    ["Centri sportivi", "Sports centres"],
  ],
  stats: [
    { value: "H24", label: ["operativo ogni giorno, senza operatore", "running every day, no operator needed"], cardLabel: ["senza operatore", "no operator"], onCard: true },
    { value: "0", label: ["immagini della camera che lasciano il dispositivo", "camera images leaving the device"], cardLabel: ["immagini in uscita", "images sent out"], onCard: true },
    { value: "24", label: ["espressioni: 6 famiglie × 4 intensità", "expressions: 6 families × 4 intensities"], cardLabel: ["espressioni", "expressions"], onCard: true },
    { value: "5", label: ["passaggi dal volto alla voce, in pochi secondi", "steps from face to voice, in a few seconds"] },
    { value: "∞", label: ["personaggi sulla stessa piattaforma", "characters on the same platform"] },
  ],
  sections: [
    {
      kind: "CARDS",
      eyebrow: ["01 — La visione · 感性", "01 — The vision · 感性"],
      title: ["Quando l'interazione smette di essere un'operazione.", "When interaction stops being an operation."],
      body: [
        "Kansei è la sensibilità che percepisce emozione e significato prima che la ragione parli. Quando la macchina guarda negli occhi, sorride nel momento giusto e risponde con una voce calda, diventa una conversazione.",
        "Kansei is the sensibility that perceives emotion and meaning before reason speaks. When the machine looks you in the eye, smiles at the right moment and answers with a warm voice, it becomes a conversation.",
      ],
      items: [
        { label: ["Un volto", "A face"], title: ["Fotorealismo MetaHuman", "MetaHuman photorealism"], body: ["Espressioni, sguardo, respiro: un viso credibile, mai statico. Gli occhi agganciano la persona e la seguono con movimenti morbidi.", "Expressions, gaze, breathing: a believable face, never static. The eyes lock on to the person and follow them with soft movements."] },
        { label: ["Una voce", "A voice"], title: ["Sintesi vocale naturale", "Natural speech synthesis"], body: ["Calda e riconoscibile, sincronizzata con le labbra in tempo reale, con precisione fonetica.", "Warm and recognisable, lip-synced in real time with phonetic precision."] },
        { label: ["Una mente", "A mind"], title: ["Un agente AI su misura", "A tailor-made AI agent"], body: ["Addestrato sui contenuti del cliente: prodotti, orari, servizi, regolamenti. Conversazione multilingua.", "Trained on the client's content: products, opening hours, services, rules. Multilingual conversation."] },
      ],
    },
    {
      kind: "TABLE",
      eyebrow: ["02 — Presenza", "02 — Presence"],
      title: ["Sapere quando non parlare.", "Knowing when not to speak."],
      body: [
        "Il primo assistente progettato per stare in uno spazio con le persone. Cinque stati di presenza, letti in locale, senza identificare nessuno.",
        "The first assistant designed to share a space with people. Five presence states, read locally, without identifying anyone.",
      ],
      columns: [
        "Stato | Che cosa percepisce | Che cosa fa l'avatar",
        "State | What it perceives | What the avatar does",
      ],
      items: [
        { label: ["Passante", "Passer-by"], body: ["Una persona attraversa lo spazio senza rallentare.", "A person crosses the space without slowing down."], extra: ["Non interviene: al massimo uno sguardo, un respiro.", "Doesn't step in: at most a glance, a breath."] },
        { label: ["Presente", "Present"], body: ["È nella stanza ma fa altro, o parla con qualcuno.", "In the room but busy, or talking to someone."], extra: ["Resta in ascolto, non prende la parola.", "Keeps listening, doesn't take the floor."] },
        { label: ["Ingaggiato", "Engaged"], body: ["Si volta, si avvicina, lo chiama per nome.", "Turns, comes closer, calls it by name."], extra: ["Un invito leggero: una frase breve, non un monologo.", "A light invitation: a short sentence, not a monologue."] },
        { label: ["Conversazione", "Conversation"], body: ["Voce e sguardo rivolti all'avatar.", "Voice and gaze directed at the avatar."], extra: ["Dialoga; il turno segue voce, sguardo e pause.", "Talks; turn-taking follows voice, gaze and pauses."] },
        { label: ["Congedo", "Farewell"], body: ["Si volta, si allontana o saluta.", "Turns away, walks off or says goodbye."], extra: ["Chiude la frase, saluta se opportuno, poi tace.", "Finishes the sentence, says goodbye if appropriate, then falls silent."] },
      ],
    },
    {
      kind: "QUOTE",
      title: ["«Ehi Lucy, che ne pensi?»", "“Hey Lucy, what do you think?”"],
      body: [
        "Si attiva con il nome, da qualunque punto della stanza. Segue l'interlocutore principale e non si fa distrarre dalle altre voci.",
        "It wakes up when called by name, from anywhere in the room. It follows the main speaker and isn't distracted by other voices.",
      ],
    },
    {
      kind: "GALLERY",
      eyebrow: ["03 — Una piattaforma, infinite persone", "03 — One platform, endless personas"],
      title: ["Ogni persona: un volto, una voce, un sapere.", "Every persona: a face, a voice, a body of knowledge."],
      body: [
        "Lo stesso motore dà vita a personaggi diversi, disegnati sull'identità del cliente. Ogni installazione si configura da remoto, senza interventi sul posto.",
        "The same engine brings different characters to life, designed around the client's identity. Every installation is configured remotely, with no on-site work.",
      ],
      items: [
        { image: "/works/k-avatar/persona-accoglienza.jpg", alt: ["Avatar per l'accoglienza: donna in abito scuro che saluta", "Welcome avatar: woman in a dark suit waving"], label: ["Accoglienza", "Welcome"] },
        { image: "/works/k-avatar/persona-sanita.jpg", alt: ["Avatar per la sanità: medico in camice", "Healthcare avatar: doctor in a white coat"], label: ["Sanità", "Healthcare"] },
        { image: "/works/k-avatar/persona-sicurezza.jpg", alt: ["Avatar per la sicurezza: addetto in divisa scura", "Security avatar: officer in a dark uniform"], label: ["Sicurezza", "Security"] },
        { image: "/works/k-avatar/persona-assistente.jpg", alt: ["Avatar assistente: uomo in maglietta bianca su fondo azzurro", "Assistant avatar: man in a white T-shirt on a light blue background"], label: ["Assistente", "Assistant"] },
      ],
    },
    {
      kind: "CARDS",
      eyebrow: ["04 — Privacy by design", "04 — Privacy by design"],
      title: ["Esprime emozioni. Non le analizza.", "It expresses emotions. It doesn't analyse them."],
      items: [
        { title: ["Percezione in locale", "Local perception"], body: ["Le immagini della camera non lasciano il dispositivo: al server arrivano solo stati di presenza.", "Camera images never leave the device: only presence states reach the server."] },
        { title: ["Riconoscimento su richiesta", "Recognition on request"], body: ["Attivo per singola installazione, con informativa e consenso; chi vuole può chiedere di essere dimenticato.", "Enabled per installation, with notice and consent; anyone can ask to be forgotten."] },
        { title: ["In linea con l'AI Act", "Aligned with the AI Act"], body: ["Nessuna lettura delle emozioni dal volto o dalla voce. Credenziali e chiavi restano lato server, mai nel totem.", "No emotion reading from face or voice. Credentials and keys stay server-side, never in the kiosk."] },
      ],
    },
    {
      kind: "SPECS",
      eyebrow: ["Dove vive K-Avatar", "Where K-Avatar lives"],
      items: [
        { label: ["Musei e aree espositive", "Museums and exhibition spaces"], body: ["Disponibile", "Available"] },
        { label: ["Fiere ed eventi", "Trade fairs and events"], body: ["Disponibile", "Available"] },
        { label: ["Residenziale premium e hospitality", "Premium residential and hospitality"], body: ["Pilota in sviluppo", "Pilot in development"] },
        { label: ["Centri sportivi e fitness", "Sports and fitness centres"], body: ["In progettazione", "In design"] },
        { label: ["Reception corporate", "Corporate reception"], body: ["In progettazione", "In design"] },
        { label: ["Sanità e ambiti educativi", "Healthcare and education"], body: ["In studio", "Under study"] },
      ],
    },
  ],
}

// ─── Scrittura ─────────────────────────────────────────────────────────────

const it = (t?: T) => t?.[0] ?? null
const en = (t?: T) => t?.[1] ?? null

async function seedWork(w: SeedWork) {
  const data = {
    name: w.name,
    order: w.order,
    published: true,
    typeIt: w.type[0], typeEn: w.type[1],
    typeShortIt: it(w.typeShort), typeShortEn: en(w.typeShort),
    statusIt: w.status[0], statusEn: w.status[1],
    taglineIt: w.tagline[0], taglineEn: w.tagline[1],
    introIt: w.intro[0], introEn: w.intro[1],
    summaryIt: it(w.summary), summaryEn: en(w.summary),
    closingIt: it(w.closing), closingEn: en(w.closing),
    ctaLabelIt: it(w.ctaLabel), ctaLabelEn: en(w.ctaLabel),
    heroImage: w.heroImage,
    heroAltIt: w.heroAlt[0], heroAltEn: w.heroAlt[1],
    heroCaption: w.heroCaption ?? null,
    heroTone: w.heroTone,
  }

  await prisma.$transaction(async (tx) => {
    const work = await tx.work.upsert({
      where: { slug: w.slug },
      create: { slug: w.slug, ...data },
      update: data,
    })
    await tx.workTag.deleteMany({ where: { workId: work.id } })
    await tx.workStat.deleteMany({ where: { workId: work.id } })
    await tx.workSection.deleteMany({ where: { workId: work.id } })

    await tx.workTag.createMany({
      data: w.tags.map(([labelIt, labelEn], order) => ({ workId: work.id, order, labelIt, labelEn })),
    })
    await tx.workStat.createMany({
      data: w.stats.map((s, order) => ({
        workId: work.id,
        order,
        value: s.value,
        labelIt: s.label[0],
        labelEn: s.label[1],
        cardLabelIt: it(s.cardLabel),
        cardLabelEn: en(s.cardLabel),
        onCard: s.onCard ?? false,
        onPage: s.onPage ?? true,
      })),
    })
    for (const [order, s] of w.sections.entries()) {
      await tx.workSection.create({
        data: {
          workId: work.id,
          order,
          kind: s.kind,
          eyebrowIt: it(s.eyebrow), eyebrowEn: en(s.eyebrow),
          titleIt: it(s.title), titleEn: en(s.title),
          bodyIt: it(s.body), bodyEn: en(s.body),
          columnsIt: it(s.columns), columnsEn: en(s.columns),
          image: s.image ?? null,
          imageAltIt: it(s.alt), imageAltEn: en(s.alt),
          items: {
            create: (s.items ?? []).map((item, j) => ({
              order: j,
              labelIt: it(item.label), labelEn: en(item.label),
              titleIt: it(item.title), titleEn: en(item.title),
              bodyIt: it(item.body), bodyEn: en(item.body),
              extraIt: it(item.extra), extraEn: en(item.extra),
              image: item.image ?? null,
              imageAltIt: it(item.alt), imageAltEn: en(item.alt),
            })),
          },
        },
      })
    }
  }, { timeout: 30_000 })

  console.log(`  ✓ ${w.name} (${w.sections.length} sezioni, ${w.stats.length} stats)`)
}

async function main() {
  const force = process.argv.includes("--force")
  const all = [kdoors, kbox, kavatar]
  const existing = new Set(
    (await prisma.work.findMany({ where: { slug: { in: all.map((w) => w.slug) } }, select: { slug: true } })).map(
      (w) => w.slug,
    ),
  )

  console.log(`🌱 Seeding works${force ? " (--force)" : ""}…`)

  if (force && existing.size > 0) {
    console.warn(
      [
        "",
        "⚠️  --force: verranno RISCRITTI completamente (campi, tag, stats, sezioni) i lavori già presenti:",
        ...all.filter((w) => existing.has(w.slug)).map((w) => `   - ${w.slug}`),
        "   Le modifiche fatte dall'admin su questi lavori andranno perse.",
        "",
      ].join("\n"),
    )
  }

  for (const w of all) {
    if (existing.has(w.slug) && !force) {
      console.log(`  · ${w.name}: esiste già, lasciato intatto (usa --force per riscriverlo)`)
      continue
    }
    await seedWork(w)
  }
  console.log("✅ Works seed completato")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

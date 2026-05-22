# Kansei Studio

## Cosa è
Sito vetrina per Kansei Studio, studio digitale italiano che crea sistemi 
sensoriali e installazioni interattive che connettono tecnologia ed emozione 
umana. Il nome viene dal giapponese 感性 — la risposta emotiva al design.

Servizi: design di interfacce immersive, esperienze AR/VR, sistemi AI, 
visualizzazioni dati live, installazioni per stadi, musei, eventi.

Pubblico: clienti enterprise sofisticati (brand, istituzioni culturali, 
sport venues), direttori creativi, agenzie partner. Persone abituate a 
giudicare il design prima del pitch.

## Obiettivo della landing
Far percepire immediatamente che Kansei opera a un livello altissimo. 
Il sito non vende — qualifica. Visitatore tipico: scorre, capisce il livello, 
clicca su Contact se è il cliente giusto. CTA primario: "hello@kansei.studio" 
o form di contatto qualificato. CTA secondario: vedere i Project.

## Struttura
4 sezioni principali, navigazione numerata 01–04:
- 01 HOME — hero con manifesto e overview servizi (4 colonne numerate)
- 02 ABOUT — manifesto esteso "Where technology becomes sensation" + 4 aree di competenza
- 03 PROJECT — case study (Lumen Field System come primo), con tabella metadata, video embed, problema/soluzione, KPI
- 04 CONTACT — scheda contatti con tabella, link social, newsletter

## Database

**Stack:** Neon PostgreSQL + Prisma ORM 7.x (TypeScript-first client)

**File chiave:**
- `prisma/schema.prisma` — schema completo (Project, Category, KPI + tabelle di traduzione)
- `prisma.config.ts` — configurazione CLI (URL, directUrl, seed command); legge `.env.local`
- `lib/prisma.ts` — singleton PrismaClient per Next.js (usa `@prisma/adapter-neon`)
- `prisma/seed.ts` — seed iniziale: 7 categorie + progetto Mico (IT + EN)
- `lib/generated/prisma/` — client TypeScript generato (non modificare, non committare)

**Import path:** `import { prisma } from "@/lib/prisma"` (in componenti Next.js)

**Nota Prisma 7:** In Prisma 7, l'URL di connessione NON va in `schema.prisma` ma in `prisma.config.ts`. Il client runtime usa `@prisma/adapter-neon` con `PrismaNeon({ connectionString })`.

**Comandi utili:**
```bash
npx prisma studio                          # UI per esplorare il DB (localhost:5555)
npx prisma migrate dev --name <nome>       # nuova migration
npx prisma db seed                         # ri-seedare (usa tsx --env-file=.env.local)
npx prisma generate                        # rigenera client dopo modifiche schema
```

**Tabelle DB:**
| Tabella | Descrizione |
|---|---|
| `projects` | Metadati progetto (slug, year, client, format, ...) |
| `project_translations` | Testo localizzato (title, tagline, description, problem, solution) |
| `categories` | Categorie progetto |
| `category_translations` | Nomi categoria localizzati |
| `project_categories` | Join M:N project ↔ category |
| `project_kpis` | KPI numerici (icon, value) |
| `project_kpi_translations` | Label KPI localizzata |

**Pagina smoke test:** `/dev/db-test` — mostra tutti i dati dal DB in formato JSON

**Data flow pattern (Server → Client):**
- Server Components fetchano da Prisma, fanno il "shape" dei dati in plain objects serializzabili, e li passano come props a Client Components.
- `posterUrl` può essere null → fallback automatico a YouTube thumbnail estratta da `videoUrl` via `lib/youtube.ts` → fallback a `GenerativeVisual variant="wave-project"`.
- File chiave: `lib/youtube.ts` — esporta `extractYouTubeId` e `youTubeThumbnail`.
- `next.config.ts` include `images.remotePatterns` per `img.youtube.com`.

**Campi opzionali DB — pattern condizionale:**
- Ogni sezione opzionale (notes, problem, solution, KPI) si renderizza SOLO se il dato è presente. Zero container vuoti.
- Esempio: `{hasProblemOrSolution && (<><HairlineDivider /><ProjectProblemSolution /></>)}`
- I componenti stessi verificano internamente (`if (!problem && !solution) return null`) come difesa in profondità.

**YouTube embed — on-demand:**
- Il VideoEmbed mostra poster + play button; l'iframe YouTube viene caricato SOLO al click (privacy + performance).
- Il `?autoplay=1` nell'URL iframe funziona perché si carica su user gesture.
- Se non c'è `youtubeId`, il play button non è renderizzato (progetto con solo immagine statica).

**generateStaticParams per pagine dinamiche:**
- Le pagine con parametri dinamici (locale × slug) esportano `generateStaticParams` che restituisce tutte le combinazioni valide.
- Per la pagina progetto: `projects.flatMap(p => [{ locale:"it", slug:p.slug }, { locale:"en", slug:p.slug }])`.

---

## Internazionalizzazione (i18n)

**Libreria:** next-intl 4.x (App Router)

**Lingue supportate:** IT (default) e EN

**Routing:** `localePrefix: "always"` — tutti i percorsi hanno prefisso locale
- `/it/*` — italiano (default redirect da `/`)
- `/en/*` — inglese

**File chiave:**
- `i18n/routing.ts` — `defineRouting` + `createNavigation` (esporta `Link`, `usePathname`, `useRouter`)
- `i18n/request.ts` — `getRequestConfig` con `requestLocale` (API v4)
- `proxy.ts` — proxy file (Next.js 16: era `middleware.ts`); gestisce admin auth + next-intl locale routing
- `messages/it.json` — traduzioni italiane
- `messages/en.json` — traduzioni inglesi

**Struttura pagine:** tutte le pagine stanno in `app/[locale]/`
- `app/layout.tsx` — ROOT layout: ha `<html>`, `<body>`, `NextIntlClientProvider`. Legge il locale con `getLocale()` (next-intl v4). Richiesto da Next 16+ (html/body DEVONO stare nel root layout).
- `app/[locale]/layout.tsx` — passthrough minimale: `generateStaticParams` per locales + `setRequestLocale(locale)`. NON ha html/body.

**Come usare le traduzioni:**

In server components (async):
```typescript
import { getTranslations } from "next-intl/server"
const t = await getTranslations("Namespace")
```

In client components:
```typescript
"use client"
import { useTranslations } from "next-intl"
const t = useTranslations("Namespace")
```

**Link e navigazione** — usare SEMPRE da `@/i18n/routing`, non da `next/link`:
```typescript
import { Link, usePathname, useRouter } from "@/i18n/routing"
```

**LanguageSwitcher:** `<LanguageSwitcher />` in `components/atoms/LanguageSwitcher.tsx` — già incluso in TopNav.

**Namespace traduzioni:**
| Namespace | Contenuto |
|---|---|
| `Nav` | about, projects, contact, menuOpen |
| `Home` | sectionLabel, title, tagline, description, scrollCta, viewProjects |
| `About` | sectionLabel, title, description, philosophyCta |
| `Services` | 01–04 con title e items[] |
| `Projects` | sectionLabel, viewProject |
| `Contact` | sectionLabel, heroTitle, heroDescription, studioInfo × 5, cardsSectionLabel, 5 canali (label + handle) |
| `Common` | learnMore, backToProjects |

**Pagine principali del sito:**
| Rotta | Sezione | File |
|---|---|---|
| `/` → `/it/` | 01 HOME | `app/[locale]/page.tsx` |
| `/about` | 02 ABOUT | `app/[locale]/about/page.tsx` |
| `/projects` | 03 PROJECT archivio | `app/[locale]/projects/page.tsx` |
| `/projects/[slug]` | 03 PROJECT dettaglio | `app/[locale]/projects/[slug]/page.tsx` |
| `/contact` | 04 CONTACT | `app/[locale]/contact/page.tsx` |

**Link esterni vs interni — pattern `ContactCard` (e in generale):**
```typescript
if (!href) return <div>...</div>                          // Non interattivo

if (href.startsWith("/")) return <Link href={...}>...</Link>  // Route interna: next-intl Link

// Esterno (https://) o mailto: usa <a> nativo
return (
  <a href={href}
    {...(href.startsWith("https://") && { target: "_blank", rel: "noopener noreferrer" })}>
    ...
  </a>
)
```
Regola: next-intl `Link` SOLO per route interne (iniziano con `/`). Per tutto il resto, `<a>` nativo.

---

## Stack tecnico
- Next.js 15 (App Router), TypeScript, Tailwind CSS
- shadcn/ui per componenti accessibili base
- Magic UI per micro-animazioni (text reveal, scroll-triggered fade, marquee discreto)
- motion (ex framer-motion) per animazioni custom — `import { motion } from "motion/react"`
- 21st.dev Magic come fallback per componenti composti complessi
- Lucide per icone (size piccolo, stroke 1.5px)
- Next/font per il caricamento delle font

## Identità visiva — modernismo editoriale × generative art

### Direzione
Modernismo svizzero editoriale che incontra la generative art monocroma.
Stesso DNA di: Refik Anadol, Field.io, Pentagram digital, Onformative, 
Lars Müller Publishers. Rigore tipografico + visual signature generativa B/W.

### Palette (uso esatto)
- Background primario: `#F5F4F0` (off-white caldo, tipo Japanese paper)
- Foreground / testo: `#0A0A0A` (near-black, mai #000 puro)
- Accent unico: `#2563EB` (blu elettrico) — usato SOLO in:
  - Puntini di stato/segnale (max 4–6px)
  - Numerazione delle eyebrow (`01 HOME` con puntino blu)
  - Indicatore di scroll/posizione
  - Mai per CTA grandi, mai per sfondi
- Inverso per sezioni dark (video embed, hero di case study):
  - Background: `#0A0A0A`
  - Foreground: `#F5F4F0`
- Hairline rules: `#0A0A0A` a opacity 12% (separatori orizzontali e verticali)
- NESSUN altro colore. Niente gradienti. Niente success-green o danger-red.

### Tipografia
- Display/Heading: **Editorial New** (Pangram Pangram) o **GT Sectra** o 
  in alternativa free: **Fraunces** (Google Fonts) con `font-optical-sizing: auto`
  - Hero: `text-7xl` o `text-8xl`, `font-weight: 400`, `tracking-tight`, 
    `line-height: 0.95`
  - Section heading: `text-5xl`/`text-6xl`, stessi attributi
- Body: **Söhne** o in alternativa free: **Geist Sans** (no Inter)
  - Body normale: `text-base`, `font-weight: 400`, `leading-relaxed`
  - Metadata/captions: `text-xs`, `tracking-wide`, opacity 70%
- Eyebrow labels (`01 HOME`, `02 ABOUT`): `text-xs`, `uppercase`, 
  `tracking-widest`, `font-weight: 500`
- Mono per technical metadata (codici, anni, KPI): **JetBrains Mono** o 
  **Geist Mono**, `text-xs`

### Griglia & spaziature
- Container: max-width 1440px, padding orizzontale 48px desktop / 24px mobile
- Griglia: 12 colonne, gap 32px
- Sezioni: padding verticale 120px desktop / 80px mobile
- Hairline rules orizzontali tra ogni sezione e tra ogni blocco di metadata
- Numerazione di sezione SEMPRE in alto a sinistra (`01 HOME`, `02 ABOUT`...)

### Pattern di componenti ricorrenti (riferimenti al mockup)

**Eyebrow numerata**

---

## Admin

Pannello di gestione progetti accessibile da `/admin`. NON internazionalizzato (solo italiano).

**Autenticazione:**
- Pattern: password singola via env var `ADMIN_PASSWORD`
- Session: cookie firmato e crittografato via `iron-session` v8 (env: `ADMIN_SESSION_SECRET`, min 32 char)
- Durata sessione: 7 giorni
- Logout: distrugge il cookie

**Struttura route:**
| Rotta | Visibilità |
|---|---|
| `/admin/login` | Pubblica |
| `/admin` | Protetta (dashboard) |
| `/admin/projects` | Protetta (Task 08b) |
| `/admin/categories` | Protetta (Task 08b) |

**File chiave:**
- `lib/env.ts` — validazione `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` a runtime
- `lib/session.ts` — `getAdminSession()` per Server Components e Server Actions
- `proxy.ts` — protezione route admin + next-intl (Next.js 16: usa `proxy` non `middleware`)
- `app/admin/_actions/auth.ts` — `loginAction`, `logoutAction` (Server Actions)
- `app/admin/layout.tsx` — layout nested (no html/body); imposta `robots: noindex`
- `app/admin/login/_components/LoginForm.tsx` — form client con `useActionState`

**Setup env (aggiungere a `.env.local`):**
```
ADMIN_PASSWORD="password-complessa"
ADMIN_SESSION_SECRET="stringa-random-64-hex-chars"
```
Per generare il secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**Note tecniche:**
- Il root layout (`app/layout.tsx`) carica next-intl con fallback a locale "it" per route senza contesto i18n (es. `/admin`). Non serve modificarlo.
- I link interni in `/admin` usano `next/link` standard (non `@/i18n/routing`) perché l'admin non è internazionalizzato.
- `proxy.ts` usa `unsealData` direttamente (non `getIronSession`) nel contesto Edge runtime per leggere la sessione senza scrivere cookie.

---

## Home Telemetry

Micro-elementi telemetrici animati sovrapposti alla HomeHero per dare
sensazione di "sistema vivo" minimalista. Stile: dashboard tech
sussurrata, ispirazione Field.io / Locomotive / Studio Hopo'o.

### Elementi
- SEED: hash hex random a reload (top-left)
- GPS Coordinates: lat/lon di Bitritto + UTC+1 (top-right)
- STATUS dot pulse: heartbeat 3s loop (bottom-left)
- PROCESS glitch: 12 parole che ruotano con glitch ogni 6s (bottom-left)
- CYCLES: counter 0-99999 loop (bottom-right)
- UPTIME: cronometro live dal mount (bottom-right)
- CLOCK: orario Europe/Rome live (bottom-center)

### File
- `components/sections/HomeTelemetry.tsx` (client component)
- Integrato in `app/[locale]/page.tsx` come overlay assoluto su HomeHero

### Pattern
- Tutti i valori dinamici inizializzati con stringa/numero vuoto,
  popolati in useEffect — evita warning di hydration
- `pointer-events-none` sul container = non interferisce con UX
- `tabular-nums` sui numeri per evitare salti visivi
- STATUS/PROCESS e CYCLES/UPTIME nascosti su mobile (`hidden md:block`);
  GPS nascosto su xs (`hidden sm:block`); SEED e CLOCK sempre visibili
- `wordIndexRef` (useRef) per evitare stale closure nel glitch di PROCESS
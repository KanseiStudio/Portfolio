# Kansei Studio — Inventario Componenti Atomici

> Questi sono i 15 componenti atomici riutilizzabili che costruiscono TUTTE e 4 le sezioni.  
> Ogni componente è classificato per libreria di provenienza.

---

## Legenda librerie

- **custom** — scritto da zero, nessuna dipendenza esterna
- **shadcn** — da shadcn/ui (accessibilità, form, dialog)
- **magic-ui** — da Magic UI (animazioni reveal, marquee, text effects)
- **motion** — `motion/react` per animazioni custom complesse

---

## Componenti

### 01 — `EyebrowLabel`
Etichetta numerata di sezione: `01 HOME`, `02 ABOUT`, con puntino accent blu a sinistra.  
**Libreria**: custom  
**Props**: `number` (string), `label` (string), `showDot?` (boolean, default true)

---

### 02 — `HairlineDivider`
Linea sottile a 1px, colore `#0A0A0A` opacity 12%. Variante orizzontale e verticale.  
**Libreria**: custom  
**Props**: `orientation?` ('horizontal' | 'vertical', default 'horizontal'), `className?`

---

### 03 — `SectionHeader`
Blocco heading di sezione: EyebrowLabel + titolo display serif + subtitle opzionale.  
**Libreria**: custom + motion  
**Props**: `eyebrow`, `title`, `subtitle?`, `align?` ('left' | 'center')

---

### 04 — `NumberedFeatureCard`
Scheda con numero ordinale in alto, icona opzionale, titolo h3, body text. Usata in HOME (4 colonne servizi) e ABOUT (4 competenze).  
**Libreria**: custom + motion  
**Props**: `number` (string), `title`, `body`, `icon?` (Lucide)

---

### 05 — `MetadataTable`
Tabella di coppie label/valore con hairline tra ogni riga. Font: label in Geist Sans micro uppercase, valore in Geist Mono o body.  
**Libreria**: custom  
**Props**: `rows: Array<{ label: string, value: string | ReactNode }>`, `mono?` (boolean per valori)

---

### 06 — `KpiBadge`
Badge metrico: valore grande in mono (es. `97%`, `2.4M+`), label sotto in small. Usato in PROJECT footer metrics.  
**Libreria**: custom  
**Props**: `value` (string), `label` (string), `suffix?` (string)

---

### 07 — `GenerativeVisual`
Wrapper per le illustrazioni B/W generative. In MVP: img/next-image con PNG statico. API predisposta per futura sostituzione con canvas animato.  
**Libreria**: custom  
**Props**: `src` (string), `alt` (string), `variant?` ('tree' | 'shell' | 'wave'), `className?`

---

### 08 — `NavBar`
Navigation bar fissa: logo "Kansei Studio" a sinistra, link numerati a destra, dot accent per sezione attiva.  
**Libreria**: custom + motion (per highlight attivo)  
**Props**: `activeSection?` (string)

---

### 09 — `ScrollIndicator`
Piccolo indicatore verticale di scroll posizione: linea sottile con dot blu che avanza. Bottom-right o left della viewport.  
**Libreria**: custom + motion  
**Props**: `progress` (number 0–1)

---

### 10 — `VideoEmbed`
Area video con sfondo dark (`#0A0A0A`), play button overlay centrato, thumbnail generativa come poster. Usata in PROJECT.  
**Libreria**: custom  
**Props**: `src` (string), `poster?` (string), `aspectRatio?` (default '16/9')

---

### 11 — `SocialLinkCard`
Card contatto/social: icona Lucide + label + valore cliccabile. Usata in CONTACT per email, LinkedIn, Instagram, GitHub, Vimeo, Medium.  
**Libreria**: custom + shadcn (per accessibilità focus)  
**Props**: `icon` (LucideIcon), `label` (string), `value` (string), `href` (string)

---

### 12 — `NewsletterForm`
Form email minimalista: input + submit. Solo due stati visibili: idle e success. Nessuno stile "form" visibile — aspetto da metadata row.  
**Libreria**: shadcn (Input, Button base) + custom styling  
**Props**: `onSubmit` (handler), `placeholder?`

---

### 13 — `RevealText`
Wrapper che anima un testo con reveal verticale su scroll (clip-path da bottom). Usato su heading di sezione.  
**Libreria**: magic-ui (`TextReveal`) o custom motion  
**Props**: `children`, `delay?` (ms), `className?`

---

### 14 — `ProjectCard`
Card compatta per archivio progetti: indice ordinale, thumbnail (YouTube poster o GenerativeVisual fallback), titolo display, tag categorie + anno.  
**Libreria**: custom  
**File**: `components/molecules/ProjectCard.tsx`  
**Props**: `project: ArchiveProject`, `index: number`

---

### 15 — `DarkSection`
Wrapper section con background `#0A0A0A` e foreground `#F5F4F0`. Gestisce inversione colori per tutta la sezione figli.  
**Libreria**: custom  
**Props**: `children`, `className?`

---

### 16 — `CirclePlusButton`
Cerchio outline 32px con icona `+` o `→` centrata. Usato come CTA secondario dentro `NumberedFeatureCard` e come link standalone (es. "Our philosophy" in ABOUT).  
**Libreria**: custom  
**Props**: `icon?` ('plus' | 'arrow', default 'plus'), `href?` (string), `onClick?`, `label?` (string, per aria-label), `size?` (number, default 32)

---

## Mappa utilizzo per sezione

| Componente | HOME | ABOUT | PROJECT | CONTACT |
|-----------|:----:|:-----:|:-------:|:-------:|
| EyebrowLabel | ✓ | ✓ | ✓ | ✓ |
| HairlineDivider | ✓ | ✓ | ✓ | ✓ |
| SectionHeader | ✓ | ✓ | ✓ | ✓ |
| NumberedFeatureCard | ✓ | ✓ | — | — |
| MetadataTable | — | — | ✓ | ✓ |
| KpiBadge | — | — | ✓ | — |
| GenerativeVisual | ✓ | ✓ | — | ✓ |
| NavBar | ✓ | ✓ | ✓ | ✓ |
| ScrollIndicator | ✓ | — | — | — |
| VideoEmbed | — | — | ✓ | — |
| SocialLinkCard | — | — | — | ✓ |
| NewsletterForm | — | — | — | ✓ |
| RevealText | ✓ | ✓ | ✓ | ✓ |
| DarkSection | — | — | ✓ | — |
| CirclePlusButton | ✓ | ✓ | — | — |

---

## Implementation Status — Task 02

| # | Componente | File | Galleria | Varianti implementate |
|---|-----------|------|----------|----------------------|
| 1 | `EyebrowLabel` | `components/atoms/EyebrowLabel.tsx` | `/dev/components#eyebrow` | no-number / with-number / number+accent / as-span |
| 2 | `HairlineDivider` | `components/atoms/HairlineDivider.tsx` | `/dev/components#hairline` | horizontal-full / horizontal-half / horizontal-labeled / vertical |
| 3 | `CirclePlusButton` | `components/atoms/CirclePlusButton.tsx` | `/dev/components#circle-plus` | plus/arrow/close × sm/md/lg + link + disabled |
| 4 | `Container` | `components/atoms/Container.tsx` | `/dev/components#container` | as div/section/article/main, padding responsive |
| 5 | `GridSection` | `components/atoms/GridSection.tsx` | `/dev/components#grid-section` | light / dark (.dark-section) / noPaddingY |
| 6 | `SectionLabel` | `components/atoms/SectionLabel.tsx` | `/dev/components#section-label` | standalone / in-grid col-span-2 |

Galleria completa: `app/dev/components/page.tsx` → `/dev/components`  
Tutti i componenti verificati con Playwright: 0 errori console, 3 viewport (375 / 768 / 1440).

---

## Implementation Status — Task 03

| # | Componente | File | Galleria | Note |
|---|-----------|------|----------|------|
| 1 | `NumberedFeatureCard` | `components/molecules/NumberedFeatureCard.tsx` | `/dev/components#numbered-feature-card` | Overlay link pattern (no `<a><button>` nesting); items opzionali; CirclePlusButton always interactive |
| 2 | `MetadataTable` | `components/molecules/MetadataTable.tsx` | `/dev/components#metadata-table` | `<table>` semantica; stack verticale mobile via `block sm:table-*`; variante compact |
| 3 | `KpiBadge` | `components/molecules/KpiBadge.tsx` | `/dev/components#kpi-badge` | Icon + value h3 mono + label; griglia interna 12-col |
| 4 | `ContactCard` | `components/molecules/ContactCard.tsx` | `/dev/components#contact-card` | Con href: hover invert (bg-fg + text-bg); senza href: statica |
| 5 | `ScrollIndicator` | `components/molecules/ScrollIndicator.tsx` | `/dev/components#scroll-indicator` | `fixed`; `hidden md:flex`; decorativo (reattivo in Task 08) |
| 6 | `TopNav` | `components/molecules/TopNav.tsx` | `/dev/components#top-nav` | `sticky top-0 z-50`; hamburger decorativo; logo SVG + Fraunces |
| 7 | `RevealText` | `components/molecules/RevealText.tsx` | `/dev/components#reveal-text` | `"use client"`; `whileInView`; `useReducedMotion`; tagMap statico evita `motion.create()` in render |

Galleria aggiornata: sezioni G–M (molecole) + TopNav sticky + ScrollIndicator fixed al top della gallery page.  
TypeScript strict: 0 errori, 0 `any`. Screenshot verificati a 375 / 768 / 1440px.

---

## Implementation Status — Task 04

### `atoms/` (nuovi)

| # | Componente | File | Note |
|---|-----------|------|------|
| 1 | `GenerativeVisual` | `components/atoms/GenerativeVisual.tsx` | `"use client"`; variant map → `/public/visuals/<variant>.png`; fallback placeholder fino a Task 09; motion opacity 0→1 scale 0.98→1 on mount (1200ms ease-kansei) |
| 2 | `Logo` | `components/atoms/Logo.tsx` | `next/image` con `/logo-white.png` (mark a colori su trasparenza); `onDark` = nessun filtro; `priority`; container `shrink-0 aspect-square` |

### `sections/` (nuovi)

| # | Componente | File | Note |
|---|-----------|------|------|
| 1 | `HomeHero` | `components/sections/HomeHero.tsx` | Props: sectionNumber, eyebrow, title (rispetta `\n`), tagline (split su `\|` → separator `│`), description, visualSrc, visualAlt; left col-span-5 / right col-span-7 a lg; RevealText stagger 0/200/400ms |
| 2 | `ServicesGrid` | `components/sections/ServicesGrid.tsx` | Props: items? (con default 4 card); gap-0 + hairlines verticali border-l; stagger RevealText 0/100/200/300ms; responsive 1→2→4 col |

### Route `/` aggiornata

`app/page.tsx` → TopNav + ScrollIndicator (fixed, 4 dots, current=1) + HomeHero + HairlineDivider + ServicesGrid.  
`components/sections/HomeSection.tsx` — rimosso (sostituito da HomeHero + ServicesGrid).  
TypeScript strict: 0 errori. Screenshot verificati a 375 / 768 / 1440px.

### Decisioni di design non specificate

| Decisione | Scelta | Motivazione |
|---|---|---|
| Padding hero top | `pt-12 lg:pt-20` | Equilibrio visivo tra section label e title — più ariosa di pt-8, meno pesante di pt-32 |
| Padding hero bottom | `pb-20 lg:pb-32` | Simmetria editoriale con il top |
| Placeholder aspect | `aspect-[4/5]` | Proporzione ritratto che rispecchia il tree generativo del mockup |
| Gap title→tagline | `HairlineDivider variant="half" my-8` | Half-hairline a 50% della colonna — marca la pausa senza interrompere il ritmo |
| Description max-width | `max-w-sm` | Limita la riga a ~384px per leggibilità editoriale ottimale |
| Visual mt mobile | `mt-10 lg:mt-0` | Respiro tra testo e visual a mobile, eliminato a desktop dove sono side-by-side |

---

## Implementation Status — Task 06c

### `molecules/` (nuovi)

| # | Componente | File | Note |
|---|-----------|------|------|
| 1 | `ProjectCard` | `components/molecules/ProjectCard.tsx` | `"use client"`; poster: YouTube thumb → GenerativeVisual fallback; ArrowUpRight hover translate; `Link` da `@/i18n/routing` |

### `sections/` (nuovi)

| # | Componente | File | Note |
|---|-----------|------|------|
| 1 | `ProjectsArchive` | `components/sections/ProjectsArchive.tsx` | `"use client"`; stato `activeCategoryId`; `useMemo` per filtro; FilterPill; griglia 1→2→3 col |

### `lib/` (nuovi)

| # | File | Note |
|---|------|------|
| 1 | `lib/youtube.ts` | `extractYouTubeId` + `youTubeThumbnail`; supporta watch/youtu.be/embed |

### Route `/[locale]/projects`

`app/[locale]/projects/page.tsx` — Server Component; fetcha projects + categories in `Promise.all`; filtra categorie senza progetti; passa dati shaped a `ProjectsArchive`.  
`next.config.ts` — `images.remotePatterns` aggiunto per `img.youtube.com`.  
TypeScript strict: 0 errori. Build pulita. Screenshot verificati a 375 / 768 / 1440px (IT + EN).

---

## Implementation Status — Task 06d

### `molecules/` (aggiornati/nuovi)

| # | Componente | File | Note |
|---|-----------|------|------|
| 1 | `VideoEmbed` | `components/molecules/VideoEmbed.tsx` | Refactored: `useState(playing)`; click play → iframe YouTube `?autoplay=1`; poster: `posterUrl` img → GenerativeVisual fallback; play button solo se `youtubeId` presente |
| 2 | `ProjectBackLink` | `components/molecules/ProjectBackLink.tsx` | Server component async; `getTranslations("Projects")`; `Link href="/projects"` da `@/i18n/routing`; ArrowLeft hover |

### `sections/` (nuovi)

| # | Componente | File | Note |
|---|-----------|------|------|
| 1 | `ProjectDetailHeader` | `components/sections/ProjectDetailHeader.tsx` | Async server; eyebrow + h1 + tagline opzionale + MetadataTable (notes condizionale) + VideoEmbed; grid 5/7 col |
| 2 | `ProjectProblemSolution` | `components/sections/ProjectProblemSolution.tsx` | Async server; `if (!problem && !solution) return null`; grid 6/6 col; `whitespace-pre-line` per paragrafi DB |
| 3 | `ProjectKpiStrip` | `components/sections/ProjectKpiStrip.tsx` | Client; `if (kpis.length === 0) return null`; ICON_MAP: 8 icone Lucide; griglia 1→2→4 col |

### Route `/[locale]/projects/[slug]`

`app/[locale]/projects/[slug]/page.tsx` — Server Component; `prisma.project.findUnique` con translations/categories/kpis; `notFound()` se slug non esiste o non tradotto; `generateStaticParams` × locale × slug; `generateMetadata` con title + description.  
`app/[locale]/projects/[slug]/not-found.tsx` — Custom 404 con TopNav + messaggio + back link.  
TypeScript strict: 0 errori. Build pulita. Screenshot verificati a 1440px (IT + EN).

---

## Implementation Status — Task 07

### `molecules/` (aggiornati)

| # | Componente | File | Note |
|---|-----------|------|------|
| 1 | `ContactCard` | `components/molecules/ContactCard.tsx` | Refactored: `href` interno (`/`) → `Link` di next-intl; `href` esterno (`https://`, `http://`) → `<a target="_blank" rel="noopener noreferrer">`; `mailto:` → `<a>` nativo senza `target`; niente `href` → `<div>` non interattivo, no hover |

### `sections/` (nuovi)

| # | Componente | File | Note |
|---|-----------|------|------|
| 1 | `ContactHero` | `components/sections/ContactHero.tsx` | Async server; h1 con split `\n` → `<span className="block">`; MetadataTable 5 righe (Studio, Location, Availability, Email, Focus); GenerativeVisual `shell-contact`; grid 5/7 col; RevealText stagger 0/200/400ms |
| 2 | `ContactChannels` | `components/sections/ContactChannels.tsx` | Async server; 5 ContactCard (Email, LinkedIn, Instagram, GitHub, Newsletter); Newsletter senza href → non cliccabile; griglia 1→2→3 col |

### Route `/[locale]/contact`

`app/[locale]/contact/page.tsx` — Server Component; `getTranslations("Contact")`; TopNav + SectionLabel "04" + ContactHero + HairlineDivider + ContactChannels; `generateStaticParams` (it + en); `generateMetadata` con title + description.  
TypeScript strict: 0 errori. Screenshot verificati a 375 / 768 / 1440px (IT + EN). Language switcher testato.

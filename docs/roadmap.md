# Kansei Studio — Roadmap di costruzione

> 10 task incrementali, ognuno completabile in ~1 sessione.  
> Ogni task produce qualcosa verificabile prima di passare al successivo.

---

## Task 01 — Fondamenta: config, font, token globali

**File toccati**:
- `tailwind.config.ts` — palette, font vars, spacing tokens custom, hairline
- `app/globals.css` — CSS custom properties, font-optical-sizing, base reset
- `app/layout.tsx` — caricamento font (Fraunces, Geist Sans, Geist Mono via next/font)
- `lib/fonts.ts` — configurazione font centralizzata

**Dipendenze**: nessuna

**Fatto quando**: 
- `npm run dev` avvia senza errori
- Browser mostra `body { background: #F5F4F0; color: #0A0A0A }` correttamente
- I font si caricano e sono visibili nell'inspector (Fraunces, Geist Sans, Geist Mono)
- Nessun warning in console

---

## Task 02 — Componenti atomici base (no animazioni)

**File toccati**:
- `components/ui/eyebrow-label.tsx`
- `components/ui/hairline-divider.tsx`
- `components/ui/metadata-table.tsx`
- `components/ui/kpi-badge.tsx`
- `components/ui/dark-section.tsx`

**Dipendenze**: Task 01 (token Tailwind disponibili)

**Fatto quando**:
- Ogni componente è esportato e funziona in isolamento
- Storybook-like: una pagina `/dev` mostra tutti i componenti in griglia
- Rendering corretto a 3 breakpoint (375px, 768px, 1440px)
- Console pulita, nessun TypeScript error

---

## Task 03 — NavBar + ScrollIndicator

**File toccati**:
- `components/layout/navbar.tsx`
- `components/layout/scroll-indicator.tsx`
- `app/layout.tsx` (integrazione NavBar globale)

**Dipendenze**: Task 01

**Fatto quando**:
- NavBar sticky in alto con logo e link di navigazione
- Link evidenzia la sezione attiva con dot `#2563EB`
- ScrollIndicator mostra posizione corretta
- Funziona su mobile (menu hamburger o link inline compatti)
- Nessun layout shift al caricamento

---

## Task 04 — Sezione 01 HOME (hero + feature cards)

**File toccati**:
- `app/page.tsx` (sezione HOME)
- `components/sections/home-hero.tsx`
- `components/ui/numbered-feature-card.tsx`
- `components/ui/generative-visual.tsx`
- `public/visuals/tree-home.png` (asset generativo placeholder)

**Dipendenze**: Task 01, 02, 03

**Fatto quando**:
- Hero con display type "Kansei Studio" + subtitle + visual a destra
- Griglia 4 colonne con NumberedFeatureCard (01–04 servizi)
- HairlineDivider tra hero e feature cards
- Asset generativo visibile (anche con placeholder SVG se PNG non ancora pronto)
- Layout responsive: single column su mobile, 4 col su desktop
- Rendering verificato a 375px, 768px, 1440px

---

## Task 05 — Sezione 02 ABOUT

**File toccati**:
- `components/sections/about.tsx`
- `public/visuals/tree-about.png` (variante dell'albero)

**Dipendenze**: Task 01, 02, 04 (componenti già esistenti)

**Fatto quando**:
- Heading "Where technology becomes sensation." con RevealText
- Body text paragrafo manifesto
- Visual generativo albero variante a destra
- 4 competenze come NumberedFeatureCard (riuso da Task 04)
- HairlineDivider tra ogni blocco
- Sezione allineata alla griglia 12 colonne

---

## Task 06 — Sezione 03 PROJECT (Lumen Field System)

**File toccati**:
- `components/sections/project.tsx`
- `components/ui/video-embed.tsx`
- `public/visuals/wave-project.png` (poster video)

**Dipendenze**: Task 01, 02, 05

**Fatto quando**:
- EyebrowLabel `01 PROJECT`
- Titolo "Project: Lumen Field System"
- MetadataTable sinistra: Client, Size, Partner, Environment, Technologies
- VideoEmbed centrale: dark background, play button, poster wave
- Sezione "The Problem" + "Technological Defense" a destra
- KPI row in basso: 97%, 2.4M+, +9hrs, 24/7
- DarkSection wrapper per l'area video
- Layout responsive verificato

---

## Task 07 — Sezione 04 CONTACT

**File toccati**:
- `components/sections/contact.tsx`
- `components/ui/social-link-card.tsx`
- `components/ui/newsletter-form.tsx`
- `public/visuals/shell-contact.png`

**Dipendenze**: Task 01, 02

**Fatto quando**:
- Heading "Let's build sensory software."
- MetadataTable: Studio, Year, Type, Email, Languages
- Visual shell/spirale a destra
- Griglia social link: Email, LinkedIn, Instagram, GitHub, Vimeo, Medium
- NewsletterForm in basso
- Link `hello@kansei.studio` funzionante (mailto:)
- Responsive verificato

---

## Task 08 — Animazioni reveal (scroll-triggered)

**File toccati**:
- `components/ui/reveal-text.tsx`
- `hooks/use-in-view.ts`
- Tutti i SectionHeader e feature card (aggiunta prop `animate`)

**Dipendenze**: Task 04, 05, 06, 07 (tutte le sezioni statiche complete)

**Fatto quando**:
- Heading di sezione con clip-path reveal su scroll
- Feature card con stagger 80ms tra cards
- Visual generativi con fade-in su scroll
- Tutto wrapped in `prefers-reduced-motion` media query (no animazioni se utente preferisce)
- Nessun jank visibile su Chrome/Safari/Firefox
- Performance: Lighthouse `Performance > 90` su desktop

---

## Task 09 — Asset generativi definitivi + polish visivo

**File toccati**:
- `public/visuals/tree-home.png` (PNG definitivo @2x)
- `public/visuals/tree-about.png`
- `public/visuals/shell-contact.png`
- `public/visuals/wave-project.png`
- Aggiustamenti minimi di spacing/colore post-visione asset reali

**Dipendenze**: Task 08 + asset generati (p5.js / Midjourney)

**Fatto quando**:
- Asset definitivi integrati e verificati su Retina display
- next/image con `sizes` e `priority` configurati correttamente
- Nessun layout shift (CLS < 0.1)
- Look fedele al mockup di riferimento

---

## Task 10 — SEO, accessibility, performance finale

**File toccati**:
- `app/layout.tsx` — metadata (title, description, og:image)
- `app/page.tsx` — structured data, landmark regions
- `public/og-image.png` — Open Graph image
- Audit generale a11y con axe DevTools

**Dipendenze**: Task 09 (sito visivamente completo)

**Fatto quando**:
- Lighthouse: Performance > 90, Accessibility > 95, SEO > 95 su desktop e mobile
- Nessun errore axe DevTools
- Open Graph corretto (verificato con og:debugger)
- Tutti i link hanno `aria-label` significativi
- Immagini decorative hanno `aria-hidden="true"`
- `alt` text significativi su immagini contenuto

---

## Dipendenze NPM aggiuntive necessarie

Da installare prima di Task 01:

```bash
npm install geist                    # Geist Sans + Mono (Vercel)
npm install motion                   # motion/react (ex framer-motion)
npm install lucide-react             # icone
```

shadcn/ui e Magic UI sono già configurati da setup iniziale (vedi CLAUDE.md).

---

## Ordine critico

```
01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10
```

Non saltare task. Ogni task produce componenti riutilizzati dai successivi.

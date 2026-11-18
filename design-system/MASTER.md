# Kansei Studio — Design System Master

> Modernismo editoriale svizzero × generative art monocroma.  
> Ogni token qui è DEFINITIVO. Nessuna deviazione senza revisione esplicita.

---

## 1. Palette

| Token | HEX | Uso |
|-------|-----|-----|
| `--color-bg` | `#F5F4F0` | Background primario — off-white caldo, tipo Japanese paper |
| `--color-fg` | `#0A0A0A` | Foreground / testo — near-black, mai #000 puro |
| `--color-accent` | `#2563EB` | Blu elettrico — SOLO puntini di stato, numerazione eyebrow, scroll indicator |
| `--color-dark-bg` | `#0A0A0A` | Background sezioni dark (video embed, hero case study) |
| `--color-dark-fg` | `#F5F4F0` | Testo su sfondo dark |
| `--color-hairline` | `#0A0A0A1F` | `#0A0A0A` a 12% opacity — separatori orizzontali e verticali |

**Regola rigida**: Nessun altro colore. Niente gradienti. Niente success-green, danger-red, sfumature warm/cool aggiuntive.  
L'accent `#2563EB` NON va mai usato su aree superiori a 6×6px.

---

## 2. Tipografia

### Famiglie scelte

#### Display / Heading — **Fraunces**
- Fonte: Google Fonts (gratuita, variable font con asse `opsz` e `wght`)
- Peso: **400** (regular) per il livello display/hero — mai bold, mai 300 a dimensioni display
- Peso 300 disponibile come variante opzionale solo per heading di taglia ks-h2/ks-h3 su sfondo dark, mai a 7rem
- Fallback: `"Georgia", serif`
- **Motivazione**: Fraunces è un serif ottico ad alto contrasto con un'asse `optical-size` che a grandi dimensioni genera quella tensione tipografica editoriale (colli sottili, aste marcate) identica a Editorial New o GT Sectra. È la scelta free più fedele al mockup.
- Config Next.js: `font-optical-sizing: auto` sempre attivo

#### Body / UI — **Geist Sans**
- Fonte: Vercel / pacchetto `geist` npm (gratuita)
- Peso: 400 (regular), 500 (medium)
- Fallback: `"Helvetica Neue", "Arial", sans-serif`
- **Motivazione**: Geist nasce come sistema di design system — ha la neutralità di un grotesque svizzero ma con proporzioni ottimizzate per schermi. Più carattere di Inter, meno opinionated di Söhne. Perfetto per metadati e body su off-white.

#### Mono — **Geist Mono**
- Fonte: Vercel / pacchetto `geist` npm (gratuita, stesso sistema di Geist Sans)
- Peso: 400
- Fallback: `"JetBrains Mono", "Courier New", monospace`
- Uso: codici tecnici, anni, KPI numerici, metadata table valori

---

### Scala tipografica

| Token | Size | Line-height | Letter-spacing | Weight | Font | Uso |
|-------|------|-------------|----------------|--------|------|-----|
| `display` | `7rem` (112px) | `0.93` | `-0.03em` | 400 | Fraunces | Hero principale |
| `h1` | `4.5rem` (72px) | `0.95` | `-0.025em` | 400 | Fraunces | Section heading primario |
| `h2` | `3rem` (48px) | `1.0` | `-0.02em` | 400 | Fraunces | Sub-heading, titoli card |
| `h3` | `1.5rem` (24px) | `1.2` | `-0.01em` | 400 | Fraunces | Heading terziario |
| `eyebrow` | `0.6875rem` (11px) | `1.0` | `0.15em` | 500 | Geist Sans | `01 HOME`, `02 ABOUT` — uppercase |
| `body` | `1rem` (16px) | `1.65` | `0` | 400 | Geist Sans | Corpo testo principale |
| `small` | `0.8125rem` (13px) | `1.5` | `0.01em` | 400 | Geist Sans | Captions, label metadata |
| `micro` | `0.6875rem` (11px) | `1.4` | `0.05em` | 400 | Geist Sans | Footnote, tag, helper |
| `mono` | `0.75rem` (12px) | `1.4` | `0.02em` | 400 | Geist Mono | Valori tecnici, KPI, anni |

---

## 3. Spaziature (token Tailwind)

```js
// tailwind.config.ts → theme.extend.spacing
{
  'section-v':      '120px',  // padding verticale sezioni — desktop
  'section-v-mob':  '80px',   // padding verticale sezioni — mobile
  'container-h':    '48px',   // padding orizzontale container — desktop
  'container-h-mob':'24px',   // padding orizzontale container — mobile
  'grid-gap':       '32px',   // gap colonne griglia
  'block-gap':      '80px',   // gap tra blocchi interni a una sezione
  'hairline-gap':   '32px',   // spazio sopra/sotto ogni hairline rule
}
```

Tailwind equivalenti approssimativi: `section-v` ≈ `py-28` desktop, `py-20` mobile.

---

## 4. Griglia

| Proprietà | Valore |
|-----------|--------|
| Colonne | 12 |
| Gap | 32px |
| Max-width container | 1440px |
| Padding orizzontale | 48px desktop / 24px mobile |
| Breakpoints | `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1440px` |

La griglia è realizzata con CSS Grid nativo (`grid-cols-12`), non con Flexbox, per mantenere allineamenti precisi tra sezioni diverse.

---

## 5. Animazioni

| Token | Valore | Uso |
|-------|--------|-----|
| `duration-reveal` | `700ms` | Text reveal, fade-in sezioni |
| `duration-micro` | `250ms` | Hover, toggle, stato UI |
| `duration-page` | `1000ms` | Transizioni di pagina/sezione |
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveal verticali — ease drastico |
| `ease-standard` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Micro-interazioni standard |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transizioni di stato |
| `stagger-children` | `80ms` | Delay tra elementi in lista |

Principio: le animazioni devono sembrare fisiche, non "flashy". Niente bounce. Niente spring esagerati. Solo ease-out pronunciati su reveal, tutto il resto quasi impercettibile.

---

## 6. Hairline Rules

| Proprietà | Valore |
|-----------|--------|
| Colore | `#0A0A0A` a `12%` opacity → `rgba(10,10,10,0.12)` |
| Spessore | `1px` |
| Posizione orizzontale | Tra ogni sezione, tra ogni blocco metadata, sopra/sotto header nav |
| Posizione verticale | Tra le 4 colonne dei servizi (HOME e ABOUT) |
| Border-style | `solid` — mai `dashed` o `dotted` |

In Tailwind: `border-[#0A0A0A]/12` o classe utility custom `hairline`.

---

## Note di implementazione

- Mai usare `#000000` o `#ffffff` puri — solo i token definiti sopra
- Fraunces: `next/font/google` con `subsets: ['latin']`, `variable: '--font-fraunces'`, `display: 'swap'`, `axes: ['opsz']`
- Geist Sans e Geist Mono: pacchetto npm `geist` (`GeistSans`, `GeistMono`) — CSS vars `--font-geist-sans` / `--font-geist-mono`
- `font-optical-sizing: auto` applicato globalmente su `html` in `@layer base`
- Tutte le animazioni wrapped in `@media (prefers-reduced-motion: reduce)` con azzeramento durate
- CSS custom properties Kansei definite in `@theme` (non-inline) in `globals.css` — disponibili sia come utility Tailwind sia come `var(--color-ks-*)` in vanilla CSS

---

## 7. Animation conventions (aggiunto Task 03)

Queste convenzioni si applicano a tutti i componenti con reveal animato (es. `RevealText`).

| Proprietà | Valore | Note |
|-----------|--------|------|
| Initial state | `opacity: 0, y: 24px` | Partenza sotto, invisibile |
| Animate-to | `opacity: 1, y: 0` | Reveal finale |
| Duration | `800ms` | `--duration-800` |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` | `--ease-kansei` |
| Trigger | `whileInView` (motion/react) | |
| Threshold | `amount: 0.2` | 20% dell'elemento visibile |
| Once | `true` | Non si riagita sullo scroll up |
| Stagger children | `80ms` tra elementi in lista | Delay incrementale |
| Reduced motion | `duration: 0, delay: 0` | Via `useReducedMotion()` |

Il CSS globale in `globals.css` azzera `animation-duration` e `transition-duration` sotto `prefers-reduced-motion`, ma le animazioni motion/react richiedono il controllo JS via `useReducedMotion()`.

---

## Implementation Notes — Task 01 (aggiunto post-build)

### Deviazione: nessun `tailwind.config.ts`
Il progetto usa **Tailwind CSS v4** (CSS-first config). Non esiste `tailwind.config.ts`. Tutti i token sono in `app/globals.css` via blocchi `@theme` e `@theme inline`.

### Font registrate
| Font | CSS variable | Classe Tailwind | File |
|------|-------------|-----------------|------|
| Fraunces (Google Fonts) | `--font-fraunces` | `font-display` | `app/layout.tsx` |
| Geist Sans (npm geist) | `--font-geist-sans` | `font-body`, `font-sans` | `app/layout.tsx` |
| Geist Mono (npm geist) | `--font-geist-mono` | `font-mono` | `app/layout.tsx` |

### Token Tailwind esposti (classi generate)
**Colori**: `bg-ks-bg`, `bg-ks-fg`, `bg-ks-accent`, `bg-ks-dark-bg`, `bg-ks-dark-fg`, `bg-ks-hairline` (e varianti `text-*`, `border-*`)  
**Font**: `font-display`, `font-body`  
**Testo**: `text-display`, `text-ks-h1`, `text-ks-h2`, `text-ks-h3`, `text-eyebrow`, `text-small`, `text-micro`, `text-mono-ks`  
**Spacing**: `p-section-v`, `px-container-h`, `gap-grid-gap`, ecc.  
**Easing**: `ease-kansei`, `ease-kansei-std`  
**Durations**: `duration-600`, `duration-800`, `duration-1200`

### Route smoke test
`app/_dev/` — **esclusa dal routing** da Next.js App Router (cartelle con `_` sono private).  
Route effettiva: `app/dev/page.tsx` → `/dev`. `robots.txt` disallowa `/_dev` (il percorso teorico).

### Pattern `cn()` per class merging
Tutti i componenti atoms usano `cn(...inputs)` da `lib/utils.ts` (clsx + tailwind-merge) per il merge sicuro delle classi. La prop `className` va sempre passata come ultimo argomento a `cn()` per garantire che l'override del consumer vinca.

### Token `hairline-active` e logica `.dark-section`
`--color-ks-hairline-active` è definito in `@theme` come valore di default (`rgba(10,10,10,0.12)`).  
La classe `.dark-section` (applicata da `GridSection dark={true}`) sovrascrive la variabile a `rgba(245,244,240,0.16)`.  
Tutti i `HairlineDivider` usano `border-ks-hairline-active` — cambiano colore automaticamente in contesti dark senza alcuna logica React.

### Convenzione atomic design
- `components/atoms/` — mattoni atomici (nessuna dipendenza da altri componenti Kansei, solo token)
- `components/molecules/` — composizioni di atoms (es. `SectionHeader`, `NumberedFeatureCard`)
- `components/sections/` — sezioni di pagina complete (Tasks 04–07)
- `components/layout/` — layout globali (NavBar, ScrollIndicator)

### Smoke test verificato (2026-05-20)
- Console: **0 errori, 0 warning**
- Font visivamente verificate: Fraunces a display 7rem ✓, Geist Sans body ✓, Geist Mono mono ✓
- Colori: `#F5F4F0` background ✓, `#0A0A0A` foreground ✓, `#2563EB` accent swatch ✓
- Dark section: inversione `#0A0A0A` / `#F5F4F0` ✓
- Hairline: 1px `rgba(10,10,10,0.12)` visibili ✓
- Mobile 375px: layout funzionale, display text scala correttamente (overflow atteso a 7rem)
- `next.config.ts`: vuoto, nessuna configurazione dev accidentale

---

## Works — dati e admin (aggiunto Task works-1)

Pagine prodotto (KDoors, KBox, K-Avatar…) gestite da `/admin/works`, separate dal modello `Project`.
Ogni pagina è composta da **sezioni a blocchi ordinabili**: un lavoro nuovo può avere una struttura diversa dagli altri.

### Modello (`prisma/schema.prisma`)
| Modello | Contenuto |
|---|---|
| `Work` (`works`) | slug, name (non tradotto), order, published, tipologia, stato, tagline, intro, testo scheda indice (`summary`, fallback intro), frase finale, etichetta CTA, hero (immagine, alt, didascalia, `heroTone`) |
| `WorkTag` | tag ordinati (IT/EN) |
| `WorkStat` | `value` + etichetta; `onPage` = fascia stats sotto l'hero; `onCard` = scheda dell'indice (**max 3**, con `cardLabel` breve opzionale) |
| `WorkSection` | `kind` + eyebrow/titolo/testo, intestazioni colonne (`columns`, solo TABLE), immagine + alt |
| `WorkSectionItem` | voci della sezione: label, titolo, testo, extra, immagine + alt |

- Campi bilingui = coppie di colonne `xxxIt` / `xxxEn`. Per `en`, un campo EN vuoto ricade sull'IT.
- `heroTone`: colore di angoli HUD e didascalia **sopra** l'immagine — `LIGHT` per immagini scure, `DARK` per immagini chiare.
- Tutti i figli hanno `onDelete: Cascade`: eliminare un `Work` pulisce tag, stats, sezioni e voci.
- L'eyebrow numerata ("03 — L'esperienza") è un dato salvato, non calcolato. Una sezione senza eyebrow prosegue visivamente la precedente.

### Tipi di sezione
Fonte unica: `SECTION_KIND_CONFIG` in `lib/validations/work.ts` (la usano editor, Server Actions e seed).

| Tipo | Quando usarlo | Campi sezione | Campi voce |
|---|---|---|---|
| `CARDS` | griglia di celle: problema, idea, come funziona, garanzie | eyebrow, titolo, testo | label, titolo, testo |
| `TIMELINE` | esperienza passo per passo con tempi | eyebrow, titolo, testo | label (numero), titolo, testo, extra (tempo) |
| `TABLE` | righe a 3 colonne con intestazione (stati di presenza) | eyebrow, titolo, testo, columns (`A \| B \| C`) | label, body, extra = colonne 1-2-3 |
| `SPECS` | specifiche tecniche, ambiti/stato | eyebrow, titolo, testo | label, body (valore) |
| `GALLERY` | immagini con didascalia (mondi, personaggi, step) | eyebrow, titolo, testo | immagine*, label (didascalia), testo opz. |
| `QUOTE` | citazione con barra rossa | titolo (etichetta), testo* | — |
| `IMAGE` | immagine a tutta colonna, intestazione opzionale | eyebrow, titolo, testo, immagine* | — |
| `SPLIT` | immagine a sinistra + celle a destra (anatomia) | eyebrow, titolo, testo, immagine* | label, titolo, testo |

`*` = obbligatorio. Cambiando tipo, i valori dei campi non pertinenti restano nel form ma il salvataggio li azzera.

### Admin
- `/admin/works`: lista con riordino (frecce), switch Pubblicato/Bozza, Modifica, Vedi sul sito, eliminazione con conferma dello slug.
- `/admin/works/new`, `/admin/works/[id]`: editor a schede **Generale · Hero · Stats · Sezioni · Chiusura**. Le schede sono solo visive: tutti i campi restano montati e si salva tutto in un colpo. IT ed EN sempre affiancati. Su errore l'editor salta alla prima scheda con errori (badge rossi) e apre le sezioni interessate.
- "Salva bozza" = `published: false`, "Salva e pubblica" = `published: true`, "Anteprima" = `/it/works/<slug>?preview=1` (la verifica della sessione admin è nella pagina pubblica, task 2).
- Server Actions in `app/admin/_actions/works.ts` (`createWork`, `updateWork`, `deleteWork`, `reorderWorks`, `togglePublished`, `uploadWorkImage`, `discardWorkImage`): `requireAdmin()` + Zod; figli sostituiti completamente in transazione; `revalidatePath` su `/{it,en}/works` e `/{it,en}/works/<slug>` (anche il vecchio slug).
- Query pubbliche localizzate: `lib/works.ts` → `getPublishedWorks(locale)`, `getWorkBySlug(slug, locale, { preview })`, `getPublishedWorkSlugs()`.

### Immagini — Vercel Blob
- Env: `BLOB_READ_WRITE_TOKEN`. Upload da Server Action con `put()` in `works/<slug>/<file>` (suffisso casuale), accesso public. Senza slug valido: `works/_draft/`.
- JPG, PNG, WebP, AVIF fino a 8 MB, validati lato client e server (`experimental.serverActions.bodySizeLimit: "9mb"`).
- I campi immagine accettano anche path locali (`/works/<slug>/…`, usati dal seed).
- Pulizia: quando un'immagine viene sostituita/rimossa o un lavoro eliminato, `del()` cancella i blob non più referenziati da nessun lavoro. Solo URL `*.public.blob.vercel-storage.com/works/…`; i path locali non vengono mai toccati. Un upload sostituito prima del salvataggio viene scartato subito.
- `next.config.ts` → `images.remotePatterns` include `*.public.blob.vercel-storage.com`.

### Comandi
```bash
npx prisma migrate dev --name <nome>   # migrazione (dev)
npx prisma migrate deploy              # migrazione su produzione
npm run seed:works                     # seed idempotente di KDoors, KBox, K-Avatar (upsert per slug)
npm run test:e2e                       # Playwright (usa .env.local; avvia/riusa `npm run dev`)
```
Il seed riscrive completamente tag, stats e sezioni dei 3 lavori: modifiche fatte dall'admin a quei lavori vengono sovrascritte.

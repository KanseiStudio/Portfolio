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
| `Work` (`works`) | slug, name (non tradotto), order, published, tipologia, tipologia breve (`typeShort`, solo tabella indice, fallback tipologia), stato, tagline, intro, testo scheda indice (`summary`, fallback intro), frase finale, etichetta CTA, hero (immagine, alt, didascalia, `heroTone`) |
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
- `/admin/works`: lista con riordino (frecce), switch Pubblicato/Bozza, Modifica, Vedi sul sito, eliminazione con conferma dello slug. Mentre lo switch salva compare «salvataggio…» e lasciare la pagina chiede conferma (`beforeunload`).
- `/admin/works/new`, `/admin/works/[id]`: editor a schede **Generale · Hero · Stats · Sezioni · Chiusura**. Le schede sono solo visive: tutti i campi restano montati e si salva tutto in un colpo. IT ed EN sempre affiancati. Su errore l'editor salta alla prima scheda con errori (badge rossi) e apre le sezioni interessate.
- "Salva bozza" = `published: false`, "Salva e pubblica" = `published: true`, "Anteprima" = `/it/works/<slug>?preview=1` (la verifica della sessione admin è nella pagina pubblica, task 2).
- Server Actions in `app/admin/_actions/works.ts` (`createWork`, `updateWork`, `deleteWork`, `reorderWorks`, `togglePublished`, `discardWorkImage`; l'upload passa dalla route `/api/admin/works/upload`): `requireAdmin()` + Zod; figli sostituiti completamente in transazione; `revalidatePath` su `/{it,en}/works` e `/{it,en}/works/<slug>` (anche il vecchio slug).
- Query pubbliche localizzate: `lib/works.ts` → `getPublishedWorks(locale)`, `getWorkBySlug(slug, locale, { preview })`, `getPublishedWorkSlugs()`.

### Immagini — Vercel Blob (client upload)
Le immagini vanno **dal browser direttamente a Vercel Blob**: il file non passa dalle Vercel Functions, che in produzione accettano al massimo 4,5 MB di body.

1. `ImageField` chiama `upload()` di `@vercel/blob/client` con `access: "public"` e `handleUploadUrl: "/api/admin/works/upload"`; l'avanzamento (`onUploadProgress`) è mostrato con una barra. Sopra 5 MB l'upload è multipart.
2. `app/api/admin/works/upload/route.ts` (`handleUpload`) rilascia un **token temporaneo** solo se:
   - c'è una sessione admin (`isAdminSession()`, stessa verifica di `requireAdmin()`): altrimenti **401**, senza redirect. Le route `/api` sono fuori dal matcher di `proxy.ts`, quindi la verifica sta nella route;
   - il pathname è `works/<slug>/<nome-file>.<ext>` (`WORK_BLOB_PATHNAME_RE`; `_draft` se il lavoro non ha ancora uno slug valido), altrimenti **400**. Il pathname lo sceglie il client (`workBlobPathname()`), la route lo valida;
   - il token limita `allowedContentTypes` a JPG, PNG, WebP, AVIF, `maximumSizeInBytes` a **20 MB**, e impone `addRandomSuffix: true`.
3. A upload finito l'URL finisce nel campo del form; lo salva l'editor con "Salva bozza" / "Salva e pubblica". Non usiamo `onUploadCompleted`.

- Env: `BLOB_READ_WRITE_TOKEN` **solo sul server** (route di upload e `del()`); al browser arriva solo il token temporaneo.
- Limiti ripetuti lato client (tipo e 20 MB) per un errore immediato; la garanzia è il token.
- I campi immagine accettano anche path locali (`/works/<slug>/…`, usati dal seed).
- Pulizia: quando un'immagine viene sostituita/rimossa o un lavoro eliminato, `del()` cancella — **lato server**, nelle action `updateWork` / `deleteWork` / `discardWorkImage` — i blob non più referenziati da nessun lavoro. Solo URL `*.public.blob.vercel-storage.com/works/…`; i path locali non vengono mai toccati. Un upload sostituito prima del salvataggio viene scartato subito.
- `next.config.ts` → `images.remotePatterns` include `*.public.blob.vercel-storage.com`. Nessun `serverActions.bodySizeLimit`: le Server Actions non trasportano più file.

### Comandi
```bash
npx prisma migrate dev --name <nome>   # migrazione (dev)
npx prisma migrate deploy              # migrazione su produzione
npm run seed:works                     # crea SOLO i lavori mancanti (KDoors, KBox, K-Avatar); quelli esistenti restano intatti
npm run seed:works -- --force          # riscrive TUTTO (campi, tag, stats, sezioni) dei 3 lavori; prima stampa gli slug coinvolti
npm run test:e2e                       # Playwright (usa .env.local; avvia/riusa `npm run dev`)
```
- Senza `--force` il seed è sicuro da rilanciare: non tocca mai un lavoro già presente, nemmeno se modificato dall'admin.
- `--force` sovrascrive le modifiche fatte dall'admin sui 3 lavori: usarlo solo per riallineare un DB ai contenuti del seed (es. dopo aver aggiunto un campo come `typeShort`).

## Works — pagine pubbliche (aggiunto Task works-2)

Le pagine Works seguono il tema scuro del sito (`#0A0A0A` / `#F5F4F0`, come Technologies) e le anteprime approvate in `design/references/works/`. Nessun contenuto è hardcoded: i dati arrivano da `lib/works.ts`, i testi UI ricorrenti dal namespace `Works` di `messages/{it,en}.json`.

### Route
| Rotta | File | Note |
|---|---|---|
| `/[locale]/works` | `app/[locale]/works/page.tsx` | page head + contatore, tabella indice, schede alternate immagine/testo (3 stats `onCard`), CTA verso Contatti |
| `/[locale]/works/[slug]` | `app/[locale]/works/[slug]/page.tsx` | `generateStaticParams` dai lavori pubblicati, `dynamicParams = true`, `notFound()` per slug sconosciuti o in bozza |

Struttura della pagina lavoro: breadcrumb `← Works / 0N — Nome` · hero (tipologia, H1 Fraunces, tagline Fraunces italic, intro, tag, immagine 4:5 con angoli HUD nel tono `heroTone`) · fascia stats (`onPage`) · sezioni · chiusura con CTA (→ `/contact`) e "Prossimo", che cicla per `order` tra i pubblicati (l'ultimo torna al primo).

`generateMetadata`: `"<Nome> · Works · Kansei Studio"`, description = tagline, OG image = hero.

### Componenti (`components/works/`)
| File | Ruolo |
|---|---|
| `ui.tsx` | token tipografici `ws.*` (lbl, body mono, serif, num, h3, cta ≥ 44px), `WorkImage` (next/image, path locali e Blob), `SectionHeader`, `Cell` |
| `WorkSections.tsx` | dispatcher `SectionKind → componente`; un tipo sconosciuto non renderizza nulla. Raggruppa le sezioni: una sezione **con eyebrow** apre un blocco numerato con filetto, quelle **senza eyebrow** lo proseguono (es. KDoors "L'idea" = IMAGE + CARDS + QUOTE) |
| `sections/CardsSection` | celle con filetto se le voci hanno etichetta; riquadri a hairline se non ce l'hanno (garanzie) |
| `sections/TimelineSection` | righe numero · titolo · testo · tempo; sotto 768px numero e tempo in alto |
| `sections/TableSection` | `<table>` con intestazioni da `columns`; sotto 768px scorre nel proprio box (focusabile, etichetta «Scorri la tabella») |
| `sections/SpecsSection` | `<dl>` etichetta/valore; con titolo → intestazione a sinistra, solo eyebrow → etichetta sopra |
| `sections/GallerySection` | formato dal contenuto: voci con testo → 16:10; 4+ senza testo → 3:5 dall'alto (personaggi); altrimenti 4:5 |
| `sections/QuoteSection` | citazione con barra rossa |
| `sections/ImageSection` | immagine a tutta colonna, proporzioni naturali |
| `sections/SplitSection` | immagine a sinistra, intestazione e celle a destra |
| `WorkDetail.tsx` / `WorksIndex.tsx` | breadcrumb, hero, stats, "Prossimo" / page head, tabella indice, schede, chiusura |

Il numero delle sezioni ("01 —") è quello salvato nell'eyebrow, mai calcolato. La posizione `0N` di breadcrumb, indice e "Prossimo" è invece l'ordine tra i lavori pubblicati.

### Accento rosso
Il rosso del logo `#E31E24` compare **solo** nella barra verticale di `QuoteSection`. Nessun altro uso: l'etichetta della citazione resta nel colore delle label. (Il verde `#4ADE80` resta solo sul pallino ONLINE della rail.)

### Anteprima bozze
1. L'admin clicca "Anteprima" nell'editor (o "Vedi sul sito" su una bozza) → `/it/works/<slug>?preview=1`.
2. La pagina verifica la sessione admin (`getAdminSession().isAdmin`). Senza sessione `?preview=1` viene ignorato → 404 per le bozze.
3. Con sessione: la bozza viene renderizzata con badge HUD "Bozza · anteprima" e `robots: noindex, nofollow`. Nell'anteprima la posizione e il "Prossimo" includono la bozza; per i visitatori le bozze sono escluse da indice, contatore e "Prossimo".

### Nav
Ordine, desktop e mobile, IT ed EN: **About · Technologies · Works · Contatti · Radio** (`Nav.works`, `Nav.radio`). Una voce è attiva sulla sua rotta e sulle sottopagine (`/works/*`) tramite `isNavActive()` in `InstrumentFrame`, sia nel nav desktop sia nel drawer mobile (`aria-current="page"`).

### Tabella indice
Colonna Tipologia = `typeShort` (es. "Installazione fisica · AI"); se vuota, `type`. Le schede e la pagina lavoro usano sempre `type` completo.

### Immagini
`next/image` ovunque, con `alt` dal DB e `sizes` per colonna. Le hero sono ritratti verticali: in hero e schede il fuoco è in alto (`object-position: center top`) per non tagliare i volti.

## Artefatti di progetto (aggiunto Task artifacts)

Ogni lavoro (`Work`) può avere uno o più **artefatti**: mini-siti HTML autonomi e interattivi (HTML + JS + asset con percorsi relativi, es. la colonna LED 3D di KBox in three.js con due video) mostrati nella sezione **«Esplora» / «Explore»** della pagina pubblica, subito dopo hero e fascia stats.

### Architettura
| Pezzo | File | Ruolo |
|---|---|---|
| Modello | `prisma/schema.prisma` → `WorkArtifact` | `workId` → `Work` (`onDelete: Cascade`), titolo/didascalia IT-EN, `blobPrefix`, `previousBlobPrefix`, `entryPath` (`index.html`), `aspectRatio` (16/9, 4/3, 1/1, 9/16), `posterUrl`, `fileCount`, `totalBytes`, `position`, `published` |
| Storage | Vercel Blob (store pubblico) | file in `artifacts/<blobPrefix>/<relpath>`, `blobPrefix = <root>/<uploadId>`; copertina in `artifacts/<blobPrefix>-poster.<ext>` |
| Upload | `ArtifactUploader` + `/api/admin/works/upload` | dal browser direttamente a Blob (`upload()` di `@vercel/blob/client`), niente file nelle Functions |
| Azioni | `app/admin/_actions/artifacts.ts` | riserva prefix, crea, sostituisci, pubblica, riordina, elimina, pulizia dopo errore |
| HTML entry | `app/artifacts/[artifactId]/route.ts` | legge `index.html` da Blob, inietta `<base href="/artifact-files/<blobPrefix>/">` subito dopo `<head>`, risponde `text/html` dal dominio del sito |
| Asset | rewrite in `next.config.ts` | `/artifact-files/:path*` → `<BLOB_PUBLIC_BASE_URL>/artifacts/:path*`; proxy esterno che inoltra `Range` (206, scrubbing video) |
| Embed | `components/works/ArtifactEmbed.tsx` | click-to-load dell'iframe nella pagina del lavoro |

- **Perché la route HTML:** Blob serve l'HTML con `content-disposition: attachment`, `CSP default-src 'none'` e `X-Frame-Options: DENY`: non si può incorporare direttamente.
- **Perché lo stesso origin:** gli artefatti usano i video come `VideoTexture` WebGL **senza** `crossOrigin`. Una texture da un altro origin "sporca" il canvas e WebGL va in errore. Con `<base>` + rewrite, HTML e video arrivano entrambi dal dominio del sito.
- `/artifacts` e `/artifact-files` sono esclusi dal matcher di `proxy.ts` (niente redirect di lingua, niente auth) e stanno fuori dal layout `[locale]` (niente nav né telemetria).
- **Env:** `BLOB_READ_WRITE_TOKEN` (solo server) e `BLOB_PUBLIC_BASE_URL` (`https://<id>.public.blob.vercel-storage.com`). Fallback di `lib/blob-base-url.ts`: `BLOB_STORE_ID` `store_AbC123` → `https://abc123.public.blob.vercel-storage.com`. Senza nessuno dei due il rewrite viene disattivato (avviso nel log).

### Upload e validazione
1. Zip scelto in admin, decompresso nel browser con `fflate` (`unzipSync`). Scartati `__MACOSX/`, `.DS_Store`, `._*`, `Thumbs.db` e cartelle vuote. Se tutti i file stanno sotto un'unica cartella radice (es. `kbox/`) viene rimossa.
2. Validazione (`normalizeZipEntries` in `lib/artifacts.ts`): `index.html` alla radice, niente `..` né path assoluti, massimo **300 file** e **250 MB**, solo estensioni in whitelist (`ARTIFACT_CONTENT_TYPES`: html, css, js/mjs, json, immagini, mp4/webm, mp3/ogg/wav, woff/woff2, glb/gltf/bin, wasm, txt).
3. `reserveArtifactUploadAction` restituisce il prefix, deciso dal server: `<workId>/<uploadId>`, oppure `e2e-<runId>/<uploadId>` per i lavori di test `e2e-test-<runId>`.
4. Upload con concorrenza 4, multipart oltre 50 MB, barra complessiva + stato per file. La route rilascia il token solo con sessione admin, pathname valido (`ARTIFACT_FILE_PATHNAME_RE`) e content type = quello dell'estensione; `addRandomSuffix: false` (i percorsi relativi dell'HTML devono restare identici), `allowOverwrite: true`. Le immagini Works (`works/…`) mantengono il loro filtro.
5. `createArtifactAction` (Zod) conta file e byte **leggendo Blob** (non dal client), verifica `index.html` e salva il record **in bozza**. Se un upload fallisce: niente record, `deleteArtifactBlobsAction` pulisce il prefix.
6. In admin la sezione artefatti sta **fuori** dal `<form>` di `WorkForm`: ogni azione salva subito («Le modifiche agli artefatti si salvano subito, indipendentemente dal lavoro.»).

### Sostituzione, eliminazione, cache
| Risposta | `Cache-Control` |
|---|---|
| `/artifacts/<id>` pubblicato | `public, max-age=60, s-maxage=300` |
| `/artifacts/<id>` in bozza (solo con sessione admin, altrimenti 404) | `private, no-store`: una bozza non deve mai finire nella cache CDN |
| 404 | `no-store` |

Altri header della route: `Content-Security-Policy: frame-ancestors 'self'`, `X-Content-Type-Options: nosniff`, `X-Robots-Tag: noindex`.

- **«Sostituisci zip»:** carica su un prefix nuovo, poi `blobPrefix = nuovo`, `previousBlobPrefix = quello appena sostituito`. L'URL `/artifacts/<id>` non cambia. La versione appena sostituita **resta su Blob per una sostituzione**: l'HTML in cache CDN (fino a 5 min) ha ancora la `<base>` verso di lei, e cancellarla subito manderebbe i video in 404. Si cancella solo il `previousBlobPrefix` precedente (due versioni fa). Poi `revalidatePath` delle pagine pubbliche IT/EN e dell'admin.
- **Elimina artefatto** (conferma digitando il titolo) ed **elimina lavoro:** cancellano `blobPrefix`, `previousBlobPrefix` e copertina **prima** del record. Il cascade di Prisma elimina i record ma non i blob.
- Gli asset da `/artifact-files/*` mantengono la cache di Blob (`max-age=2592000`): è sicuro perché ogni versione ha un prefix nuovo.

### Sandbox e modello di fiducia
`sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"`, `allow="fullscreen; autoplay; xr-spatial-tracking"`.
L'iframe è same-origin (serve per le texture video) e ha sia `allow-scripts` sia `allow-same-origin`: **non è isolato dal sito** (Chrome lo segnala in console, è voluto). È accettabile solo perché **caricano artefatti esclusivamente gli admin**: un artefatto va trattato come codice del sito. Il commento è in `ArtifactEmbed.tsx`.

### `ArtifactEmbed` — specifiche visive
- **Click-to-load:** nessun iframe finché non si clicca «Avvia esperienza» / «Launch experience» (KBox scarica three.js e ~16 MB di video). «Chiudi» smonta l'iframe e libera la GPU.
- **Stato iniziale:** riquadro con `aspect-ratio` dal record; copertina (velata `#0A0A0A` al 55%) oppure fondo `#000` con griglia HUD in SVG (linee `#F5F4F0` al 7%, assi tratteggiati al 12%, niente gradienti); angoli HUD come le figure Works; telemetria in **Geist Mono** `ARTEFATTO · INTERATTIVO · 16.5 MB` / `ARTIFACT · INTERACTIVE · 16.5 MB` (da `totalBytes`, unità decimali); titolo in **Fraunces**; pulsante `ws.cta`.
- **Bordo:** `1px` `#F5F4F0` al **15%** su riquadro, iframe e barra. **Angoli vivi** (nessun `rounded`), come il resto delle pagine Works.
- **Barra comandi** sotto l'iframe, Geist Mono 11px uppercase, target ≥ 44px: «Schermo intero» (`requestFullscreen` sul wrapper; nascosto dove non supportato, es. iPhone Safari), «Apri in nuova scheda», «Chiudi». Sotto 640px i primi due mostrano solo l'icona (testo `sr-only`).
- **Dimensioni:** desktop a larghezza piena del contenuto, `max-height: 82vh`. Sotto 768px: `aspect-ratio: 3/4` e `min-height: 70vh`. Sotto 768px la sezione Esplora lascia almeno **15vh** di spazio dopo l'ultima didascalia, così la pagina resta scorrevole anche se il canvas cattura il dito (`touch-action: none`).
- **Didascalia** IT/EN sotto il riquadro (`ws.body`). Etichette dal namespace `Works` (`exploreLabel`, `artifactTelemetry`, `artifactLaunch`, `artifactFullscreen`, `artifactExitFullscreen`, `artifactNewTab`, `artifactClose`, `artifactRegion`).
- **Accessibilità:** pulsanti veri con focus visibile, wrapper `role="region"` con `aria-label`, focus nell'iframe al caricamento, `Esc` in fullscreen gestito dal browser. Nessun uso di `#3DDC84`.

### Limiti noti
- La `<base>` vale solo per l'**HTML entry**: link a pagine HTML secondarie dentro l'artefatto non sono supportati (verrebbero scaricate come allegato da Blob). Un artefatto = una pagina.
- **Gli artefatti devono gestire da soli il layout sotto i 760px.** L'embed fornisce un riquadro 3:4 alto almeno il 70% dello schermo, ma pannelli e barre interni (es. i comandi di KBox) vanno resi responsive nell'HTML dell'artefatto, con le sue media query.
- Gli header CSP di Blob arrivano anche tramite il rewrite: non contano per i file caricati dalla pagina (immagini, script, video), ma un Web Worker caricato da `/artifact-files/` ne sarebbe limitato.
- L'anteprima di un lavoro (`?preview=1`) mostra solo gli artefatti pubblicati; un artefatto in bozza si apre dal pulsante «Anteprima» dell'admin.

### Test
`tests/e2e/artifacts.spec.ts` (store Blob reale): file sotto `artifacts/e2e-<runId>/`, lavoro `e2e-test-<runId>` sempre in bozza, pulizia in `afterAll` anche se un test fallisce e, all'avvio, dei residui `e2e-*` più vecchi di 24 h. Fixture in `tests/fixtures/` (`artifact-min.zip`, `artifact-min-v2.zip`, `artifact-no-index.zip`).

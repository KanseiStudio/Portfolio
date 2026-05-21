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

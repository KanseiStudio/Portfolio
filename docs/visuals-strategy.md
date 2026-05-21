# Kansei Studio — Strategia Visual Generativi

---

## Il problema

Il mockup mostra 3 illustrazioni B/W generative che NON sono stock photography né clipart:

1. **Albero di particelle** — struttura frattale di rami con particelle/punti dispersi. Appare in HOME (versione frontale) e ABOUT (variante leggermente diversa).
2. **Shell/spirale** — nautilus matematico costruito con centinaia di linee sottili radiali. Appare in CONTACT.
3. **Campo di onde dark** — flow field con particelle in movimento su sfondo nero. Appare come thumbnail/poster del video embed in PROJECT.

---

## 3 approcci a confronto

### Opzione A — PNG/SVG statici (asset pre-generati)

**Come**: Genero gli asset offline con p5.js, Processing, o Houdini. Li esporto come PNG ad alta risoluzione (2x/3x per Retina) o SVG. Li importo con `next/image`.

**Pro**:
- Zero impatto sulle performance runtime
- Nessuna dipendenza JS aggiuntiva nel bundle
- Caricamento istantaneo (preloadable)
- Controllabilità totale del look finale

**Contro**:
- Non animati (static)
- Richiedono rigenerazione se si vuole cambiare variante
- File PNG 2x possono pesare 500KB–2MB

---

### Opzione B — Lottie / JSON animazioni vettoriali

**Come**: Esporto le illustrazioni da After Effects o da un tool come Rive come file `.lottie` o `.json`. Uso `@lottiefiles/react-lottie-player` per il playback.

**Pro**:
- Animati ma vettoriali (leggeri se ben ottimizzati)
- Loop fluido, controllabile con scroll trigger

**Contro**:
- Richiede After Effects o Rive per creazione — toolchain complessa
- File `.json` Lottie complessi possono superare 1MB
- Dipendenza JS aggiuntiva nel bundle
- Difficile modificare il look post-export

---

### Opzione C — Canvas live con react-three-fiber / p5.js runtime

**Come**: Calcolo la geometria generativa direttamente in browser con Three.js (react-three-fiber) o p5.js. Le illustrazioni sono generate a runtime, potenzialmente reagendo al movimento del mouse o allo scroll.

**Pro**:
- Interattività reale (mouse parallax, scroll-driven)
- Ogni caricamento è unico
- Massima impressione tecnica

**Contro**:
- Bundle size: Three.js aggiunge ~600KB gzip; p5.js ~800KB
- CPU usage significativa su mobile
- Rischio di jank su hardware debole
- Complessità di implementazione alta — richiede sessione dedicata
- WebGL non disponibile su tutti i dispositivi

---

## Scelta per l'MVP

**Opzione A — PNG statici**, con architettura predisposta per upgrade futuro.

**Motivazione**:
Il valore del sito è nel rigore editoriale, non nell'interattività tecnica. Un'illustrazione B/W ad alta risoluzione, ben posizionata, con una sottile animazione di fade-in su scroll (motion/react, 0KB aggiuntivi) dà il 90% dell'impatto visivo con il 10% della complessità. L'utente target giudica la qualità del *cosa*, non del *come è fatto*.

Il componente `GenerativeVisual` avrà un'API generica (`variant`, `src`) che permette di sostituire il PNG con un canvas animato in una sessione futura senza toccare le sezioni.

---

## Asset necessari e posizionamento

| Asset | Variante | Sezione | Posizione nel layout |
|-------|----------|---------|---------------------|
| `tree-home.png` | Albero frattale, frontale, leggero | HOME hero | Colonna destra, ~50% viewport height |
| `tree-about.png` | Albero frattale, rotazione ~15°, leggermente più denso | ABOUT hero | Colonna destra, stessa altezza |
| `shell-contact.png` | Spirale nautilus, linee fini radiali | CONTACT | Colonna destra, circa 60% viewport height |
| `wave-project.png` | Campo di onde su sfondo #0A0A0A, particelle luminose | PROJECT | Poster del video embed (dark background) |

Dimensioni di esportazione: `1200×1200px` @2x per tree e shell (PNG con canale alpha), `1600×900px` per wave (PNG senza alpha, sfondo dark incluso).

---

## Generazione asset — p5.js sketches

Tutti i visual generativi sono prodotti tramite sketch p5.js scritti ad hoc, NON tramite AI image generation. Vantaggi: controllo totale dei parametri, iterazione deterministica, output autenticamente plotter-style, costo zero, riproducibile.

Workflow:
- Codice di ogni sketch versionato in `scripts/visuals/<nome>.js`
- Eseguiti in headless via node-canvas o tramite p5.js + jsdom
- Output: PNG a 2400×2400px (retina-ready, ridimensionato responsabilmente con next/image nelle sezioni)
- Palette dello sketch: solo `#0A0A0A` su trasparente (o su `#F5F4F0` per varianti light, `#0A0A0A` per varianti dark)
- Stile target: Aaron Penne, Tyler Hobbs, plotter art monocromo

I 4 sketch necessari:
- `tree-home.js` — albero frattale recursivo, ~6 livelli di ricorsione, particelle ai nodi, leggera asimmetria
- `tree-about.js` — stessa logica, parametri di densità maggiori (+30% rami), rotazione 15°
- `shell-contact.js` — spirale di Lissajous/nautilus, ~200–400 punti, linee fini radiali
- `wave-project.js` — campo di onde sinusoidali su sfondo dark, particelle luminose lungo le curve

Per ogni sketch dovrà essere definito uno schema di parametri (`seed`, `density`, `rotation`, `lineWidth`) così la rigenerazione sarà deterministica e iterabile.

---

## Note per implementazione

- Tutti gli asset vanno in `public/visuals/`
- Caricare con `next/image` e `priority` per gli asset above-the-fold (tree-home)
- Gli altri asset usano lazy loading standard
- Alt text sempre significativo per accessibilità
- Aggiungere `aria-hidden="true"` se puramente decorativi

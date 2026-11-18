import { z } from "zod"

// ─── Tipi di sezione ───────────────────────────────────────────────────────

export const SECTION_KINDS = [
  "CARDS",
  "TIMELINE",
  "TABLE",
  "SPECS",
  "GALLERY",
  "QUOTE",
  "IMAGE",
  "SPLIT",
] as const
export type SectionKindValue = (typeof SECTION_KINDS)[number]

export const HERO_TONES = ["DARK", "LIGHT"] as const

type SectionField = "eyebrow" | "title" | "body" | "columns" | "image"
type ItemField = "label" | "title" | "body" | "extra" | "image"

export interface SectionKindConfig {
  label: string
  description: string
  /** Campi della sezione pertinenti al tipo, con etichetta da mostrare in admin */
  fields: Partial<Record<SectionField, string>>
  /** Campi delle voci (null = il tipo non ha voci) */
  items: { noun: string; fields: Partial<Record<ItemField, string>> } | null
}

/**
 * Unica fonte di verità su quali campi usa ogni tipo di sezione.
 * La usano l'editor admin (mostra solo i campi pertinenti), le Server Actions
 * (azzerano i campi non pertinenti) e la documentazione in MASTER.md.
 */
export const SECTION_KIND_CONFIG: Record<SectionKindValue, SectionKindConfig> = {
  CARDS: {
    label: "Celle",
    description: "Griglia di celle con etichetta, titolo e testo (problema, idea, come funziona)",
    fields: { eyebrow: "Eyebrow", title: "Titolo", body: "Testo introduttivo" },
    items: { noun: "cella", fields: { label: "Etichetta", title: "Titolo", body: "Testo" } },
  },
  TIMELINE: {
    label: "Timeline",
    description: "Righe numerate con il tempo a destra (esperienza passo per passo)",
    fields: { eyebrow: "Eyebrow", title: "Titolo", body: "Testo introduttivo" },
    items: {
      noun: "momento",
      fields: { label: "Numero", title: "Titolo", body: "Descrizione", extra: "Tempo" },
    },
  },
  TABLE: {
    label: "Tabella",
    description: "Righe a 3 colonne con intestazione (es. stati di presenza)",
    fields: {
      eyebrow: "Eyebrow",
      title: "Titolo",
      body: "Testo introduttivo",
      columns: "Intestazioni (separate da |)",
    },
    items: {
      noun: "riga",
      fields: { label: "Colonna 1", body: "Colonna 2", extra: "Colonna 3" },
    },
  },
  SPECS: {
    label: "Specifiche",
    description: "Tabella etichetta / valore (specifiche tecniche, ambiti e stato)",
    fields: { eyebrow: "Eyebrow", title: "Titolo", body: "Testo introduttivo" },
    items: { noun: "riga", fields: { label: "Etichetta", body: "Valore" } },
  },
  GALLERY: {
    label: "Galleria",
    description: "Immagini con didascalia (mondi, personaggi, step)",
    fields: { eyebrow: "Eyebrow", title: "Titolo", body: "Testo introduttivo" },
    items: {
      noun: "immagine",
      fields: { image: "Immagine", label: "Didascalia", body: "Testo (opzionale)" },
    },
  },
  QUOTE: {
    label: "Citazione",
    description: "Box citazione con barra verticale rossa",
    fields: { title: "Etichetta / citazione breve", body: "Testo" },
    items: null,
  },
  IMAGE: {
    label: "Immagine",
    description: "Immagine larga a tutta colonna, con intestazione opzionale",
    fields: { eyebrow: "Eyebrow", title: "Titolo", body: "Testo introduttivo", image: "Immagine" },
    items: null,
  },
  SPLIT: {
    label: "Split",
    description: "Immagine a sinistra, testo e celle a destra (anatomia)",
    fields: { eyebrow: "Eyebrow", title: "Titolo", body: "Testo introduttivo", image: "Immagine" },
    items: { noun: "cella", fields: { label: "Etichetta", title: "Titolo", body: "Testo" } },
  },
}

// ─── Schema ────────────────────────────────────────────────────────────────

const text = (max: number) => z.string().trim().max(max, `Massimo ${max} caratteri`)
const req = (label: string, max: number) =>
  z.string().trim().min(1, `${label} obbligatorio`).max(max, `Massimo ${max} caratteri`)

/** URL https (es. Vercel Blob) o path locale sotto /public (es. /works/kbox/hero.jpg) */
const imageRef = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\/\S+$/.test(v), {
    message: "Usa un URL https:// o un path locale che inizia con /",
  })

export const workTagSchema = z.object({
  labelIt: req("Tag IT", 80),
  labelEn: req("Tag EN", 80),
})

export const workStatSchema = z.object({
  value: req("Valore", 40),
  labelIt: req("Etichetta IT", 200),
  labelEn: req("Etichetta EN", 200),
  cardLabelIt: text(80),
  cardLabelEn: text(80),
  onCard: z.boolean(),
  onPage: z.boolean(),
})

export const workSectionItemSchema = z.object({
  labelIt: text(160),
  labelEn: text(160),
  titleIt: text(300),
  titleEn: text(300),
  bodyIt: text(5000),
  bodyEn: text(5000),
  extraIt: text(300),
  extraEn: text(300),
  image: imageRef,
  imageAltIt: text(300),
  imageAltEn: text(300),
})

export const workSectionSchema = z
  .object({
    kind: z.enum(SECTION_KINDS),
    eyebrowIt: text(160),
    eyebrowEn: text(160),
    titleIt: text(300),
    titleEn: text(300),
    bodyIt: text(10000),
    bodyEn: text(10000),
    columnsIt: text(300),
    columnsEn: text(300),
    image: imageRef,
    imageAltIt: text(300),
    imageAltEn: text(300),
    items: z.array(workSectionItemSchema).max(40),
  })
  .superRefine((s, ctx) => {
    const cfg = SECTION_KIND_CONFIG[s.kind]
    if (cfg.fields.image && !s.image)
      ctx.addIssue({ code: "custom", path: ["image"], message: "Immagine obbligatoria per questo tipo" })
    if (s.kind === "QUOTE" && !s.bodyIt)
      ctx.addIssue({ code: "custom", path: ["bodyIt"], message: "Testo della citazione obbligatorio" })
    if (cfg.items?.fields.image)
      s.items.forEach((it, i) => {
        if (!it.image)
          ctx.addIssue({ code: "custom", path: ["items", i, "image"], message: "Immagine obbligatoria" })
      })
  })

export const workFormSchema = z.object({
  name: req("Nome", 120),
  slug: z
    .string()
    .trim()
    .min(1, "Lo slug è obbligatorio")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Solo lettere minuscole, numeri e trattini"),
  published: z.boolean(),
  typeIt: req("Tipologia IT", 180),
  typeEn: req("Tipologia EN", 180),
  typeShortIt: text(120),
  typeShortEn: text(120),
  statusIt: req("Stato IT", 80),
  statusEn: req("Stato EN", 80),
  taglineIt: req("Tagline IT", 300),
  taglineEn: req("Tagline EN", 300),
  introIt: req("Intro IT", 5000),
  introEn: req("Intro EN", 5000),
  summaryIt: text(2000),
  summaryEn: text(2000),
  closingIt: text(1000),
  closingEn: text(1000),
  ctaLabelIt: text(120),
  ctaLabelEn: text(120),
  heroImage: imageRef.refine((v) => v !== "", { message: "Immagine hero obbligatoria" }),
  heroAltIt: req("Alt IT", 300),
  heroAltEn: req("Alt EN", 300),
  heroCaption: text(160),
  heroTone: z.enum(HERO_TONES),
  tags: z.array(workTagSchema).max(12),
  stats: z
    .array(workStatSchema)
    .max(12)
    .refine((stats) => stats.filter((s) => s.onCard).length <= 3, {
      message: "Massimo 3 stats nella scheda indice",
    }),
  sections: z.array(workSectionSchema).max(30),
})

export type WorkFormValues = z.infer<typeof workFormSchema>
export type WorkSectionFormValues = z.infer<typeof workSectionSchema>
export type WorkSectionItemFormValues = z.infer<typeof workSectionItemSchema>
export type WorkStatFormValues = z.infer<typeof workStatSchema>

// ─── Valori vuoti ──────────────────────────────────────────────────────────

export const emptyWorkItem: WorkSectionItemFormValues = {
  labelIt: "", labelEn: "", titleIt: "", titleEn: "", bodyIt: "", bodyEn: "",
  extraIt: "", extraEn: "", image: "", imageAltIt: "", imageAltEn: "",
}

export function emptyWorkSection(kind: SectionKindValue = "CARDS"): WorkSectionFormValues {
  return {
    kind,
    eyebrowIt: "", eyebrowEn: "", titleIt: "", titleEn: "", bodyIt: "", bodyEn: "",
    columnsIt: "", columnsEn: "", image: "", imageAltIt: "", imageAltEn: "",
    items: [],
  }
}

export const emptyWorkStat: WorkStatFormValues = {
  value: "", labelIt: "", labelEn: "", cardLabelIt: "", cardLabelEn: "", onCard: false, onPage: true,
}

export const emptyWorkForm: WorkFormValues = {
  name: "", slug: "", published: false,
  typeIt: "", typeEn: "", typeShortIt: "", typeShortEn: "", statusIt: "", statusEn: "",
  taglineIt: "", taglineEn: "", introIt: "", introEn: "",
  summaryIt: "", summaryEn: "", closingIt: "", closingEn: "",
  ctaLabelIt: "", ctaLabelEn: "",
  heroImage: "", heroAltIt: "", heroAltEn: "", heroCaption: "", heroTone: "DARK",
  tags: [], stats: [], sections: [],
}

// ─── Upload immagini ───────────────────────────────────────────────────────

// Client upload diretto su Vercel Blob (il file non passa dalle Functions,
// quindi niente limite di 4,5 MB sul body): vedi app/api/admin/works/upload.
export const WORK_IMAGE_MAX_BYTES = 20 * 1024 * 1024
export const WORK_IMAGE_MAX_LABEL = "20 MB"
export const WORK_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const
export type WorkImageType = (typeof WORK_IMAGE_TYPES)[number]

const WORK_IMAGE_EXT: Record<WorkImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
}

export function isWorkImageType(type: string): type is WorkImageType {
  return (WORK_IMAGE_TYPES as readonly string[]).includes(type)
}

/** Cartella blob di un lavoro: lo slug se valido, altrimenti `_draft` (lavoro non ancora salvato) */
export function workBlobFolder(slug: string | null | undefined) {
  return slug && /^[a-z0-9-]+$/.test(slug) ? slug : "_draft"
}

/** Pathname blob `works/<slug>/<nome-file>.<ext>` con nome normalizzato (minuscole, trattini) */
export function workBlobPathname(slug: string | null | undefined, fileName: string, type: WorkImageType) {
  const dot = fileName.lastIndexOf(".")
  const base =
    (dot > 0 ? fileName.slice(0, dot) : fileName)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  return `works/${workBlobFolder(slug)}/${base}.${WORK_IMAGE_EXT[type]}`
}

/** Solo pathname prodotti da workBlobPathname sono accettati dalla route di upload */
export const WORK_BLOB_PATHNAME_RE = /^works\/(?:[a-z0-9-]+|_draft)\/[a-z0-9-]{1,60}\.(?:jpg|png|webp|avif)$/

import { prisma } from "@/lib/prisma"
import type { SectionKindValue } from "@/lib/validations/work"

/**
 * Query pubbliche dei Works. Restituiscono oggetti già localizzati
 * (campi senza suffisso It/En) e serializzabili, pronti per i Client Components.
 * Per "en", un campo EN vuoto ricade sul valore IT.
 */

export type WorkLocale = "it" | "en"

export interface LocalizedWorkStat {
  value: string
  label: string
  /** Etichetta breve per la scheda dell'indice (fallback: label) */
  cardLabel: string
  onCard: boolean
  onPage: boolean
}

export interface LocalizedWorkSectionItem {
  id: string
  label: string | null
  title: string | null
  body: string | null
  extra: string | null
  image: string | null
  imageAlt: string
}

export interface LocalizedWorkSection {
  id: string
  kind: SectionKindValue
  eyebrow: string | null
  title: string | null
  body: string | null
  /** Intestazioni colonne (TABLE) */
  columns: string[]
  image: string | null
  imageAlt: string
  items: LocalizedWorkSectionItem[]
}

export interface LocalizedWorkSummary {
  id: string
  slug: string
  name: string
  order: number
  /** Posizione 1-based tra i lavori pubblicati ("01", "02"…) */
  position: number
  published: boolean
  type: string
  /** Tipologia breve per la tabella indice (fallback: type) */
  typeShort: string
  status: string
  tagline: string
  intro: string
  /** Testo della scheda nell'indice (fallback: intro) */
  summary: string
  hero: { image: string; alt: string; caption: string | null; tone: "DARK" | "LIGHT" }
  tags: string[]
  /** Stats della scheda indice (onCard, max 3) */
  cardStats: LocalizedWorkStat[]
}

export interface LocalizedWork extends LocalizedWorkSummary {
  closing: string | null
  ctaLabel: string | null
  /** Stats della fascia in pagina (onPage) */
  stats: LocalizedWorkStat[]
  sections: LocalizedWorkSection[]
  /** Lavoro pubblicato successivo per order (l'ultimo torna al primo); null se è l'unico */
  next: { slug: string; name: string; position: number } | null
  updatedAt: string
}

type Pair = { it: string | null | undefined; en: string | null | undefined }
function pick(locale: WorkLocale, { it, en }: Pair): string | null {
  const v = locale === "en" ? en || it : it
  return v ? v : null
}

const ORDER = [{ order: "asc" as const }, { createdAt: "asc" as const }]

const include = {
  tags: { orderBy: { order: "asc" as const } },
  stats: { orderBy: { order: "asc" as const } },
}

type WorkRow = NonNullable<Awaited<ReturnType<typeof findWorkRow>>>
function findWorkRow(where: { slug: string; published?: boolean }) {
  return prisma.work.findFirst({
    where,
    include: {
      ...include,
      sections: {
        orderBy: { order: "asc" },
        include: { items: { orderBy: { order: "asc" } } },
      },
    },
  })
}

function localizeStat(locale: WorkLocale, s: WorkRow["stats"][number]): LocalizedWorkStat {
  const label = pick(locale, { it: s.labelIt, en: s.labelEn }) ?? ""
  return {
    value: s.value,
    label,
    cardLabel: pick(locale, { it: s.cardLabelIt, en: s.cardLabelEn }) ?? label,
    onCard: s.onCard,
    onPage: s.onPage,
  }
}

function localizeSummary(
  locale: WorkLocale,
  w: Omit<WorkRow, "sections">,
  position: number,
): LocalizedWorkSummary {
  const intro = pick(locale, { it: w.introIt, en: w.introEn }) ?? ""
  const type = pick(locale, { it: w.typeIt, en: w.typeEn }) ?? ""
  return {
    id: w.id,
    slug: w.slug,
    name: w.name,
    order: w.order,
    position,
    published: w.published,
    type,
    typeShort: pick(locale, { it: w.typeShortIt, en: w.typeShortEn }) ?? type,
    status: pick(locale, { it: w.statusIt, en: w.statusEn }) ?? "",
    tagline: pick(locale, { it: w.taglineIt, en: w.taglineEn }) ?? "",
    intro,
    summary: pick(locale, { it: w.summaryIt, en: w.summaryEn }) ?? intro,
    hero: {
      image: w.heroImage,
      alt: pick(locale, { it: w.heroAltIt, en: w.heroAltEn }) ?? "",
      caption: w.heroCaption,
      tone: w.heroTone,
    },
    tags: w.tags.map((t) => pick(locale, { it: t.labelIt, en: t.labelEn }) ?? "").filter(Boolean),
    cardStats: w.stats
      .filter((s) => s.onCard)
      .slice(0, 3)
      .map((s) => localizeStat(locale, s)),
  }
}

/** Lavori pubblicati, ordinati per `order` */
export async function getPublishedWorks(locale: WorkLocale): Promise<LocalizedWorkSummary[]> {
  const rows = await prisma.work.findMany({ where: { published: true }, orderBy: ORDER, include })
  return rows.map((w, i) => localizeSummary(locale, w, i + 1))
}

/** Slug dei lavori pubblicati (per generateStaticParams) */
export async function getPublishedWorkSlugs(): Promise<string[]> {
  const rows = await prisma.work.findMany({
    where: { published: true },
    orderBy: ORDER,
    select: { slug: true },
  })
  return rows.map((r) => r.slug)
}

/**
 * Singolo lavoro localizzato. Senza `preview` restituisce solo lavori pubblicati;
 * con `preview: true` anche le bozze (il chiamante deve aver verificato la sessione admin).
 */
export async function getWorkBySlug(
  slug: string,
  locale: WorkLocale,
  { preview = false }: { preview?: boolean } = {},
): Promise<LocalizedWork | null> {
  const w = await findWorkRow(preview ? { slug } : { slug, published: true })
  if (!w) return null

  // Sequenza pubblicata (+ la bozza stessa in anteprima) per posizione e "Prossimo"
  const published = await prisma.work.findMany({
    where: { published: true },
    orderBy: ORDER,
    select: { id: true, slug: true, name: true, order: true, createdAt: true },
  })
  const sequence = published.some((p) => p.id === w.id)
    ? published
    : [...published, { id: w.id, slug: w.slug, name: w.name, order: w.order, createdAt: w.createdAt }].sort(
        (a, b) => a.order - b.order || a.createdAt.getTime() - b.createdAt.getTime(),
      )
  const index = sequence.findIndex((p) => p.id === w.id)
  const nextRow = sequence.length > 1 ? sequence[(index + 1) % sequence.length] : null

  return {
    ...localizeSummary(locale, w, index + 1),
    closing: pick(locale, { it: w.closingIt, en: w.closingEn }),
    ctaLabel: pick(locale, { it: w.ctaLabelIt, en: w.ctaLabelEn }),
    stats: w.stats.filter((s) => s.onPage).map((s) => localizeStat(locale, s)),
    sections: w.sections.map((s) => ({
      id: s.id,
      kind: s.kind,
      eyebrow: pick(locale, { it: s.eyebrowIt, en: s.eyebrowEn }),
      title: pick(locale, { it: s.titleIt, en: s.titleEn }),
      body: pick(locale, { it: s.bodyIt, en: s.bodyEn }),
      columns: (pick(locale, { it: s.columnsIt, en: s.columnsEn }) ?? "")
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean),
      image: s.image,
      imageAlt: pick(locale, { it: s.imageAltIt, en: s.imageAltEn }) ?? "",
      items: s.items.map((it) => ({
        id: it.id,
        label: pick(locale, { it: it.labelIt, en: it.labelEn }),
        title: pick(locale, { it: it.titleIt, en: it.titleEn }),
        body: pick(locale, { it: it.bodyIt, en: it.bodyEn }),
        extra: pick(locale, { it: it.extraIt, en: it.extraEn }),
        image: it.image,
        imageAlt: pick(locale, { it: it.imageAltIt, en: it.imageAltEn }) ?? "",
      })),
    })),
    next: nextRow
      ? { slug: nextRow.slug, name: nextRow.name, position: sequence.indexOf(nextRow) + 1 }
      : null,
    updatedAt: w.updatedAt.toISOString(),
  }
}

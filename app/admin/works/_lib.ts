import type { Prisma } from "@/lib/generated/prisma/client"
import type { WorkFormValues } from "@/lib/validations/work"

export const workEditorInclude = {
  tags: { orderBy: { order: "asc" } },
  stats: { orderBy: { order: "asc" } },
  sections: { orderBy: { order: "asc" }, include: { items: { orderBy: { order: "asc" } } } },
} satisfies Prisma.WorkInclude

type WorkWithChildren = Prisma.WorkGetPayload<{ include: typeof workEditorInclude }>

const s = (v: string | null | undefined) => v ?? ""

/** Record Prisma → valori del form dell'editor (stringhe vuote al posto di null) */
export function workToFormValues(w: WorkWithChildren): WorkFormValues {
  return {
    name: w.name,
    slug: w.slug,
    published: w.published,
    typeIt: w.typeIt, typeEn: w.typeEn,
    statusIt: w.statusIt, statusEn: w.statusEn,
    taglineIt: w.taglineIt, taglineEn: w.taglineEn,
    introIt: w.introIt, introEn: w.introEn,
    summaryIt: s(w.summaryIt), summaryEn: s(w.summaryEn),
    closingIt: s(w.closingIt), closingEn: s(w.closingEn),
    ctaLabelIt: s(w.ctaLabelIt), ctaLabelEn: s(w.ctaLabelEn),
    heroImage: w.heroImage,
    heroAltIt: w.heroAltIt, heroAltEn: w.heroAltEn,
    heroCaption: s(w.heroCaption),
    heroTone: w.heroTone,
    tags: w.tags.map((t) => ({ labelIt: t.labelIt, labelEn: t.labelEn })),
    stats: w.stats.map((st) => ({
      value: st.value,
      labelIt: st.labelIt, labelEn: st.labelEn,
      cardLabelIt: s(st.cardLabelIt), cardLabelEn: s(st.cardLabelEn),
      onCard: st.onCard, onPage: st.onPage,
    })),
    sections: w.sections.map((sec) => ({
      kind: sec.kind,
      eyebrowIt: s(sec.eyebrowIt), eyebrowEn: s(sec.eyebrowEn),
      titleIt: s(sec.titleIt), titleEn: s(sec.titleEn),
      bodyIt: s(sec.bodyIt), bodyEn: s(sec.bodyEn),
      columnsIt: s(sec.columnsIt), columnsEn: s(sec.columnsEn),
      image: s(sec.image),
      imageAltIt: s(sec.imageAltIt), imageAltEn: s(sec.imageAltEn),
      items: sec.items.map((it) => ({
        labelIt: s(it.labelIt), labelEn: s(it.labelEn),
        titleIt: s(it.titleIt), titleEn: s(it.titleEn),
        bodyIt: s(it.bodyIt), bodyEn: s(it.bodyEn),
        extraIt: s(it.extraIt), extraEn: s(it.extraEn),
        image: s(it.image),
        imageAltIt: s(it.imageAltIt), imageAltEn: s(it.imageAltEn),
      })),
    })),
  }
}

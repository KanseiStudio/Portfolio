"use client"

import { useState } from "react"
import { get, useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import {
  SECTION_KINDS,
  SECTION_KIND_CONFIG,
  emptyWorkItem,
  emptyWorkSection,
  type SectionKindValue,
  type WorkFormValues,
} from "@/lib/validations/work"
import { AddButton, BiField, RowControls, eyebrowCls, inputCls } from "./fields"
import { ImageField } from "./ImageField"

export function SectionsEditor() {
  const { control } = useFormContext<WorkFormValues>()
  const { fields, append, remove, move } = useFieldArray({ control, name: "sections" })
  // Le sezioni già salvate partono chiuse, quelle aggiunte ora aperte
  const [initialIds] = useState(() => new Set(fields.map((f) => f.id)))
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const isOpen = (id: string) => open[id] ?? !initialIds.has(id)

  return (
    <div className="space-y-4">
      {fields.length > 1 && (
        <div className="flex justify-end gap-3 text-xs font-mono uppercase tracking-widest">
          <button
            type="button"
            className="opacity-60 hover:opacity-100"
            onClick={() => setOpen(Object.fromEntries(fields.map((f) => [f.id, true])))}
          >
            Espandi tutte
          </button>
          <button
            type="button"
            className="opacity-60 hover:opacity-100"
            onClick={() => setOpen(Object.fromEntries(fields.map((f) => [f.id, false])))}
          >
            Comprimi tutte
          </button>
        </div>
      )}
      {fields.length === 0 && (
        <p className="text-small opacity-60">Nessuna sezione. Aggiungi la prima.</p>
      )}
      {fields.map((field, i) => (
        <SectionCard
          key={field.id}
          index={i}
          count={fields.length}
          open={isOpen(field.id)}
          onToggle={() => setOpen((o) => ({ ...o, [field.id]: !isOpen(field.id) }))}
          onMove={move}
          onRemove={() => remove(i)}
        />
      ))}
      <AddSection onAdd={(kind) => append(emptyWorkSection(kind))} />
    </div>
  )
}

function AddSection({ onAdd }: { onAdd: (kind: SectionKindValue) => void }) {
  const [kind, setKind] = useState<SectionKindValue>("CARDS")
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <select
        value={kind}
        onChange={(e) => setKind(e.target.value as SectionKindValue)}
        aria-label="Tipo della nuova sezione"
        className={`${inputCls(false)} w-auto`}
      >
        {SECTION_KINDS.map((k) => (
          <option key={k} value={k}>
            {SECTION_KIND_CONFIG[k].label} — {SECTION_KIND_CONFIG[k].description}
          </option>
        ))}
      </select>
      <AddButton onClick={() => onAdd(kind)}>
        <Plus size={14} strokeWidth={1.5} /> Aggiungi sezione
      </AddButton>
    </div>
  )
}

function SectionCard({
  index,
  count,
  open,
  onToggle,
  onMove,
  onRemove,
}: {
  index: number
  count: number
  open: boolean
  onToggle: () => void
  onMove: (from: number, to: number) => void
  onRemove: () => void
}) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<WorkFormValues>()
  const base = `sections.${index}` as const
  const kind = useWatch({ control, name: `${base}.kind` })
  const eyebrow = useWatch({ control, name: `${base}.eyebrowIt` })
  const title = useWatch({ control, name: `${base}.titleIt` })
  const cfg = SECTION_KIND_CONFIG[kind] ?? SECTION_KIND_CONFIG.CARDS
  const hasError = Boolean(get(errors, base))
  // Una sezione con errori resta sempre aperta, così l'errore è visibile
  const expanded = open || hasError
  const bodyId = `section-body-${index}`

  return (
    <div
      className={`border ${hasError ? "border-red-300" : "border-ks-hairline-active"}`}
      data-testid={`section-${index}`}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={bodyId}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
        >
          {expanded ? <ChevronDown size={16} strokeWidth={1.5} /> : <ChevronRight size={16} strokeWidth={1.5} />}
          <span className="font-mono text-xs opacity-50 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-ks-hairline-active">
            {cfg.label}
          </span>
          <span className="truncate text-small">
            {eyebrow && <span className="opacity-50 mr-2">{eyebrow}</span>}
            {title || <span className="opacity-40 italic">senza titolo</span>}
          </span>
        </button>
        <RowControls index={index} count={count} onMove={onMove} onRemove={onRemove} noun="sezione" />
      </div>

      <div id={bodyId} className={expanded ? "border-t border-ks-hairline-active p-5 space-y-5" : "hidden"}>
        <div>
          <label className="block mb-1.5" htmlFor={`${bodyId}-kind`}>
            <span className={eyebrowCls}>Tipo di sezione</span>
          </label>
          <select id={`${bodyId}-kind`} {...register(`${base}.kind`)} className={`${inputCls(false)} max-w-md`}>
            {SECTION_KINDS.map((k) => (
              <option key={k} value={k}>
                {SECTION_KIND_CONFIG[k].label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs opacity-50">{cfg.description}</p>
        </div>

        {cfg.fields.eyebrow && (
          <BiField label={cfg.fields.eyebrow} base={`${base}.eyebrow`} hint="es. 03 — L'esperienza" />
        )}
        {cfg.fields.title && <BiField label={cfg.fields.title} base={`${base}.title`} />}
        {cfg.fields.body && (
          <BiField label={cfg.fields.body} base={`${base}.body`} multiline required={kind === "QUOTE"} />
        )}
        {cfg.fields.columns && (
          <BiField label={cfg.fields.columns} base={`${base}.columns`} hint="Stato | Che cosa percepisce | …" />
        )}
        {cfg.fields.image && (
          <ImageField label={cfg.fields.image} name={`${base}.image`} altBase={`${base}.imageAlt`} required />
        )}

        {cfg.items && <ItemsEditor sectionIndex={index} kind={kind} />}
      </div>
    </div>
  )
}

function ItemsEditor({ sectionIndex, kind }: { sectionIndex: number; kind: SectionKindValue }) {
  const { control } = useFormContext<WorkFormValues>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.items`,
  })
  const cfg = SECTION_KIND_CONFIG[kind].items!
  const f = cfg.fields

  return (
    <div className="pt-2">
      <p className={`${eyebrowCls} mb-3`}>
        Voci · {fields.length}
      </p>
      <div className="space-y-3">
        {fields.map((field, j) => {
          const base = `sections.${sectionIndex}.items.${j}`
          return (
            <div key={field.id} className="border border-ks-hairline-active p-4 space-y-4 bg-ks-fg/[0.015]">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs opacity-50 tabular-nums">
                  {cfg.noun} {String(j + 1).padStart(2, "0")}
                </span>
                <RowControls index={j} count={fields.length} onMove={move} onRemove={() => remove(j)} noun={cfg.noun} />
              </div>
              {f.image && <ImageField label={f.image} name={`${base}.image`} altBase={`${base}.imageAlt`} required />}
              {f.label && <BiField label={f.label} base={`${base}.label`} />}
              {f.title && <BiField label={f.title} base={`${base}.title`} />}
              {f.body && <BiField label={f.body} base={`${base}.body`} multiline rows="sm" />}
              {f.extra && <BiField label={f.extra} base={`${base}.extra`} />}
            </div>
          )
        })}
      </div>
      <div className="mt-3">
        <AddButton onClick={() => append({ ...emptyWorkItem })}>
          <Plus size={14} strokeWidth={1.5} /> Aggiungi {cfg.noun}
        </AddButton>
      </div>
    </div>
  )
}

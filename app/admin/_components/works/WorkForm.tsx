"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FormProvider, useFieldArray, useForm, useFormContext, useWatch, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ExternalLink, Plus } from "lucide-react"
import {
  emptyWorkForm,
  emptyWorkStat,
  workFormSchema,
  type WorkFormValues,
} from "@/lib/validations/work"
import { createWork, updateWork } from "@/app/admin/_actions/works"
import { AddButton, BiField, Field, RowControls, eyebrowCls, inputCls } from "./fields"
import { ImageField, WorkImageContext } from "./ImageField"
import { SectionsEditor } from "./SectionsEditor"

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// ─── Schede ────────────────────────────────────────────────────────────────

const TABS = [
  { key: "general", label: "Generale" },
  { key: "hero", label: "Hero" },
  { key: "stats", label: "Stats" },
  { key: "sections", label: "Sezioni" },
  { key: "closing", label: "Chiusura" },
] as const
type TabKey = (typeof TABS)[number]["key"]

/** A quale scheda appartiene ogni campo di primo livello (per badge errori e salto automatico) */
const FIELD_TAB: Record<keyof WorkFormValues, TabKey> = {
  name: "general", slug: "general", published: "general",
  typeIt: "general", typeEn: "general", statusIt: "general", statusEn: "general",
  taglineIt: "general", taglineEn: "general", introIt: "general", introEn: "general",
  summaryIt: "general", summaryEn: "general", tags: "general",
  heroImage: "hero", heroAltIt: "hero", heroAltEn: "hero", heroCaption: "hero", heroTone: "hero",
  stats: "stats",
  sections: "sections",
  closingIt: "closing", closingEn: "closing", ctaLabelIt: "closing", ctaLabelEn: "closing",
}

function countLeafErrors(node: unknown): number {
  if (!node || typeof node !== "object") return 0
  if ("message" in node && typeof (node as { message?: unknown }).message === "string") return 1
  return Object.entries(node as Record<string, unknown>)
    .filter(([k]) => k !== "ref")
    .reduce((n, [, v]) => n + countLeafErrors(v), 0)
}

function errorsByTab(errors: FieldErrors<WorkFormValues>) {
  const out: Record<TabKey, number> = { general: 0, hero: 0, stats: 0, sections: 0, closing: 0 }
  for (const key of Object.keys(errors) as (keyof WorkFormValues)[]) {
    const tab = FIELD_TAB[key]
    if (tab) out[tab] += countLeafErrors(errors[key])
  }
  return out
}

// ─── Form ──────────────────────────────────────────────────────────────────

interface WorkFormProps {
  workId?: string
  initialValues?: WorkFormValues
  justCreated?: boolean
}

export function WorkForm({ workId, initialValues, justCreated }: WorkFormProps) {
  const router = useRouter()
  const isEditing = Boolean(workId)
  const [tab, setTab] = useState<TabKey>("general")
  const [banner, setBanner] = useState<{ kind: "error" | "success"; text: string } | null>(
    justCreated ? { kind: "success", text: "Lavoro creato." } : null,
  )
  const [isPending, startTransition] = useTransition()
  const [savedSlug, setSavedSlug] = useState(initialValues?.slug ?? "")

  const methods = useForm<WorkFormValues>({
    resolver: zodResolver(workFormSchema),
    defaultValues: initialValues ?? emptyWorkForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  })
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    getValues,
    formState: { errors, isDirty, dirtyFields },
  } = methods

  // Slug automatico dal nome finché non viene modificato a mano (solo in creazione)
  const name = useWatch({ control, name: "name" })
  const slug = useWatch({ control, name: "slug" })
  const published = useWatch({ control, name: "published" })
  useEffect(() => {
    if (!isEditing && !dirtyFields.slug) setValue("slug", slugify(name ?? ""))
  }, [name, isEditing, dirtyFields.slug, setValue])

  // Contesto immagini: slug per la cartella blob + upload della sessione
  const slugRef = useRef(slug)
  const sessionUploads = useRef(new Set<string>())
  useEffect(() => {
    slugRef.current = savedSlug || slug
  }, [slug, savedSlug])
  const imageCtx = useMemo(() => ({ slugRef, sessionUploads }), [])

  // Avviso di uscita con modifiche non salvate
  const guardRef = useRef(false)
  useEffect(() => {
    guardRef.current = isDirty && !isPending
  }, [isDirty, isPending])
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!guardRef.current) return
      e.preventDefault()
      e.returnValue = ""
    }
    const onClick = (e: MouseEvent) => {
      if (!guardRef.current || e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!a || a.target === "_blank") return
      if (!window.confirm("Hai modifiche non salvate. Uscire comunque?")) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    document.addEventListener("click", onClick, true)
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload)
      document.removeEventListener("click", onClick, true)
    }
  }, [])

  const tabErrors = errorsByTab(errors)

  function save(publish: boolean) {
    return handleSubmit(
      (data) => {
        const payload = { ...data, published: publish }
        setBanner(null)
        startTransition(async () => {
          try {
            const res = isEditing ? await updateWork(workId!, payload) : await createWork(payload)
            // createWork reindirizza all'editor; qui arrivano errori o l'esito di updateWork
            if (!res) return
            if (!res.ok) {
              if (res.field === "slug") {
                setError("slug", { type: "server", message: res.error })
                setTab("general")
              }
              setBanner({ kind: "error", text: res.error })
              return
            }
            sessionUploads.current.clear()
            reset(payload)
            setSavedSlug(res.slug)
            setBanner({
              kind: "success",
              text: publish ? "Salvato e pubblicato." : "Bozza salvata.",
            })
            router.refresh()
          } catch (err) {
            // Il redirect di createWork arriva come eccezione gestita da Next: non è un errore
            if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT"))
              throw err
            setBanner({ kind: "error", text: "Errore di rete o del server. Riprova." })
          }
        })
      },
      (formErrors) => {
        const byTab = errorsByTab(formErrors)
        const first = TABS.find((t) => byTab[t.key] > 0)
        if (first) setTab(first.key)
        const total = Object.values(byTab).reduce((a, b) => a + b, 0)
        setBanner({
          kind: "error",
          text: `Ci sono ${total} ${total === 1 ? "campo da correggere" : "campi da correggere"}: controlla le schede segnate in rosso.`,
        })
      },
    )()
  }

  const previewHref = savedSlug ? `/it/works/${savedSlug}?preview=1` : null

  return (
    <FormProvider {...methods}>
      <WorkImageContext.Provider value={imageCtx}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            save(getValues("published"))
          }}
          className="pb-40"
          noValidate
        >
          {banner && (
            <div
              role={banner.kind === "error" ? "alert" : "status"}
              className={`mb-8 border p-4 text-small flex items-start gap-2 ${
                banner.kind === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-ks-hairline-active bg-ks-fg/5"
              }`}
            >
              {banner.kind === "success" && <Check size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />}
              <span>{banner.text}</span>
            </div>
          )}

          {/* Schede (solo visive: tutti i pannelli restano montati) */}
          <div role="tablist" aria-label="Sezioni dell'editor" className="flex flex-wrap border-b border-ks-hairline-active mb-10">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={tab === t.key}
                aria-controls={`panel-${t.key}`}
                onClick={() => setTab(t.key)}
                className={`relative -mb-px px-5 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-colors ${
                  tab === t.key ? "border-ks-fg opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                } ${tabErrors[t.key] ? "text-red-700" : ""}`}
              >
                {t.label}
                {tabErrors[t.key] > 0 && (
                  <span className="ml-2 inline-flex min-w-4 h-4 px-1 items-center justify-center rounded-full bg-red-600 text-white text-[10px]">
                    {tabErrors[t.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <Panel id="general" active={tab}>
            <GeneralPanel isEditing={isEditing} />
          </Panel>
          <Panel id="hero" active={tab}>
            <HeroPanel />
          </Panel>
          <Panel id="stats" active={tab}>
            <StatsPanel />
          </Panel>
          <Panel id="sections" active={tab}>
            <SectionsEditor />
          </Panel>
          <Panel id="closing" active={tab}>
            <div className="space-y-6 max-w-5xl">
              <BiField label="Frase finale" base="closing" multiline rows="sm" hint="prima del blocco «Prossimo»" />
              <BiField
                label="Etichetta CTA"
                base="ctaLabel"
                hint="es. Richiedi una demo — porta ai Contatti"
                placeholder={{ it: "Richiedi la presentazione", en: "Request the presentation" }}
              />
            </div>
          </Panel>

          {/* Barra azioni fissa */}
          <div className="fixed bottom-0 inset-x-0 z-40 border-t border-ks-hairline-active bg-ks-bg/95 backdrop-blur-[8px]">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-4 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest opacity-60 mr-auto">
                {published ? "● Pubblicato" : "○ Bozza"}
                {isDirty && <span className="ml-3 text-red-700 opacity-100">· modifiche non salvate</span>}
              </span>
              {previewHref ? (
                <a
                  href={previewHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-ks-hairline-active text-small hover:bg-ks-fg/5 transition-colors"
                >
                  <ExternalLink size={14} strokeWidth={1.5} /> Anteprima
                </a>
              ) : (
                <span
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-ks-hairline-active text-small opacity-40"
                  title="Salva il lavoro per vedere l'anteprima"
                >
                  <ExternalLink size={14} strokeWidth={1.5} /> Anteprima
                </span>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() => save(false)}
                className="px-5 py-2.5 border border-ks-fg text-small font-medium hover:bg-ks-fg/5 transition-colors disabled:opacity-50"
              >
                {isPending ? "Salvataggio…" : "Salva bozza"}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => save(true)}
                className="px-5 py-2.5 bg-ks-fg text-ks-bg text-small font-medium hover:bg-ks-fg/90 transition-colors disabled:opacity-50"
              >
                {isPending ? "Salvataggio…" : "Salva e pubblica"}
              </button>
            </div>
          </div>
        </form>
      </WorkImageContext.Provider>
    </FormProvider>
  )
}

function Panel({ id, active, children }: { id: TabKey; active: TabKey; children: React.ReactNode }) {
  return (
    <section
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={active === id ? "block" : "hidden"}
    >
      {children}
    </section>
  )
}

// ─── Pannelli ──────────────────────────────────────────────────────────────

function GeneralPanel({ isEditing }: { isEditing: boolean }) {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nome" name="name" required placeholder="K-Avatar" hint="non si traduce" />
        <Field
          label="Slug"
          name="slug"
          required
          mono
          placeholder="k-avatar"
          hint={isEditing ? "cambiarlo modifica l'URL pubblico" : "generato dal nome, modificabile"}
        />
      </div>
      <BiField label="Tipologia" base="type" required placeholder={{ it: "Assistente digitale · AI conversazionale" }} />
      <BiField label="Stato" base="status" required placeholder={{ it: "Disponibile", en: "Available" }} />
      <BiField label="Tagline" base="tagline" required multiline rows="sm" />
      <BiField label="Intro" base="intro" required multiline />
      <BiField
        label="Testo scheda indice"
        base="summary"
        multiline
        rows="sm"
        hint="opzionale — se vuoto, nell'indice si usa l'intro"
      />
      <TagsEditor />
    </div>
  )
}

function TagsEditor() {
  const { control } = useFormContext<WorkFormValues>()
  const { fields, append, remove, move } = useFieldArray({ control, name: "tags" })
  return (
    <div>
      <p className={`${eyebrowCls} mb-3`}>Tag · {fields.length}</p>
      <div className="space-y-3">
        {fields.map((f, i) => (
          <div key={f.id} className="flex items-start gap-3">
            <BiField label={`Tag ${i + 1}`} base={`tags.${i}.label`} className="flex-1" />
            <div className="pt-6">
              <RowControls index={i} count={fields.length} onMove={move} onRemove={() => remove(i)} noun="tag" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <AddButton onClick={() => append({ labelIt: "", labelEn: "" })}>
          <Plus size={14} strokeWidth={1.5} /> Aggiungi tag
        </AddButton>
      </div>
    </div>
  )
}

function HeroPanel() {
  const { register } = useFormContext<WorkFormValues>()
  return (
    <div className="space-y-6 max-w-5xl">
      <ImageField label="Immagine hero" name="heroImage" altBase="heroAlt" required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Didascalia" name="heroCaption" placeholder="150 × 50 × 50 cm" hint="non si traduce" />
        <div>
          <label htmlFor="f-heroTone" className="block mb-1.5">
            <span className={eyebrowCls}>Tono di angoli e didascalia</span>
          </label>
          <select id="f-heroTone" {...register("heroTone")} className={inputCls(false)}>
            <option value="LIGHT">Chiaro — per immagini scure</option>
            <option value="DARK">Scuro — per immagini chiare</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function StatsPanel() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<WorkFormValues>()
  const { fields, append, remove, move } = useFieldArray({ control, name: "stats" })
  const stats = useWatch({ control, name: "stats" }) ?? []
  const onCardCount = stats.filter((s) => s?.onCard).length
  const arrayError =
    (errors.stats as { message?: string; root?: { message?: string } } | undefined)?.message ??
    (errors.stats as { root?: { message?: string } } | undefined)?.root?.message

  return (
    <div className="space-y-4">
      <p className="text-small opacity-60 max-w-2xl">
        «In pagina» = nella fascia stats sotto l&apos;hero. «In scheda indice» = nella scheda di /works (massimo 3),
        con un&apos;etichetta breve opzionale.
      </p>
      <p className="font-mono text-xs uppercase tracking-widest" aria-live="polite">
        In scheda indice: <span className={onCardCount > 3 ? "text-red-700" : ""}>{onCardCount} / 3</span>
      </p>
      {arrayError && (
        <p role="alert" className="text-small text-red-600">
          {arrayError}
        </p>
      )}
      {fields.map((f, i) => {
        const checked = Boolean(stats[i]?.onCard)
        const cardFull = onCardCount >= 3 && !checked
        return (
          <div key={f.id} className="border border-ks-hairline-active p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs opacity-50 tabular-nums">stat {String(i + 1).padStart(2, "0")}</span>
              <RowControls index={i} count={fields.length} onMove={move} onRemove={() => remove(i)} noun="stat" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4">
              <Field label="Valore" name={`stats.${i}.value`} required placeholder="45–60″" mono />
              <BiField label="Etichetta" base={`stats.${i}.label`} required />
            </div>
            <BiField
              label="Etichetta breve scheda"
              base={`stats.${i}.cardLabel`}
              hint="opzionale — se vuota usa l'etichetta"
            />
            <div className="flex flex-wrap gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer text-small">
                <input type="checkbox" {...register(`stats.${i}.onPage`)} className="w-4 h-4 accent-ks-fg" />
                In pagina
              </label>
              <label
                className={`inline-flex items-center gap-2 text-small ${cardFull ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                title={cardFull ? "Hai già 3 stats nella scheda indice" : undefined}
              >
                <input
                  type="checkbox"
                  {...register(`stats.${i}.onCard`)}
                  aria-disabled={cardFull}
                  onClick={(e) => {
                    if (cardFull) e.preventDefault()
                  }}
                  className="w-4 h-4 accent-ks-fg"
                />
                In scheda indice
              </label>
            </div>
          </div>
        )
      })}
      <AddButton onClick={() => append({ ...emptyWorkStat })}>
        <Plus size={14} strokeWidth={1.5} /> Aggiungi stat
      </AddButton>
    </div>
  )
}

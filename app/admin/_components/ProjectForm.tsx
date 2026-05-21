"use client"

import { useState, useTransition } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  projectFormSchema,
  emptyProjectForm,
  KPI_ICONS,
  type ProjectFormValues,
} from "@/lib/validations/project"
import { createProjectAction, updateProjectAction } from "@/app/admin/_actions/projects"

interface Category {
  id: number
  nameIt: string
}

interface ProjectFormProps {
  initialValues?: Partial<ProjectFormValues>
  projectId?: number
  categories: Category[]
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[àáâã]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõ]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// Flattens react-hook-form error tree into readable bullet lines
function collectFieldErrors(errors: Record<string, unknown>, prefix = ""): string[] {
  const result: string[] = []
  for (const key in errors) {
    const e = errors[key] as { message?: string } | Record<string, unknown> | undefined
    if (!e) continue
    if (typeof e === "object" && "message" in e && typeof e.message === "string") {
      result.push(`• ${prefix}${key}: ${e.message}`)
    } else if (typeof e === "object") {
      result.push(...collectFieldErrors(e as Record<string, unknown>, `${prefix}${key}.`))
    }
  }
  return result
}

type Tab = "it" | "en"

export function ProjectForm({ initialValues, projectId, categories }: ProjectFormProps) {
  const [tab, setTab] = useState<Tab>("it")
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isEditing = Boolean(projectId)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { ...emptyProjectForm, ...initialValues },
  })

  const { fields: kpiFields, append: appendKpi, remove: removeKpi } = useFieldArray({
    control,
    name: "kpis",
  })

  const titleIt = watch("translations.0.title")

  function autoSlug() {
    if (!isEditing && titleIt) {
      setValue("slug", slugify(titleIt), { shouldValidate: true })
    }
  }

  function onSubmit(data: ProjectFormValues) {
    console.log("[ProjectForm] onSubmit invoked with data:", data)
    setServerError(null)
    startTransition(async () => {
      try {
        const result = isEditing
          ? await updateProjectAction(projectId!, data)
          : await createProjectAction(data)
        console.log("[ProjectForm] action result:", result)
        if (result?.error) {
          setServerError(result.error)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      } catch (err) {
        console.error("[ProjectForm] caught error:", err)
        setServerError("Errore di rete. Riprova.")
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }

  function onInvalid(formErrors: Record<string, unknown>) {
    console.warn("[ProjectForm] validation failed:", formErrors)
    const fieldErrors = collectFieldErrors(formErrors)
    setServerError(
      `Compila tutti i campi obbligatori:\n${fieldErrors.join("\n")}`
    )
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function prefillTestData() {
    reset({
      slug: `test-${Date.now()}`,
      year: 2024,
      client: "Test Client",
      format: "Test Format",
      environment: "Test Environment",
      technologies: "Test Tech 1 · Test Tech 2",
      notes: "",
      videoUrl: "",
      posterUrl: "",
      coverUrl: "",
      published: false,
      sortOrder: 99,
      translations: [
        {
          locale: "it",
          title: "Progetto di test",
          tagline: "",
          description: "Descrizione di test per validare il flow di creazione progetti.",
          problem: "",
          solution: "",
        },
        {
          locale: "en",
          title: "Test project",
          tagline: "",
          description: "Test description to validate the project creation flow.",
          problem: "",
          solution: "",
        },
      ],
      categoryIds: [],
      kpis: [],
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-12 pb-32">
      {serverError && (
        <div className="border border-red-200 bg-red-50 p-4 text-small text-red-700 whitespace-pre-line">
          {serverError}
        </div>
      )}

      {/* Meta fields */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">
            Metadati
          </p>
          {!isEditing && (
            <button
              type="button"
              onClick={prefillTestData}
              className="text-small opacity-50 hover:opacity-100 hover:underline underline-offset-4 transition-opacity"
            >
              🧪 Pre-compila con dati di test
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Slug" error={errors.slug?.message} required>
            <div className="flex gap-2">
              <input
                {...register("slug")}
                placeholder="es. lumen-field"
                className={inputCls(!!errors.slug)}
              />
              {!isEditing && (
                <button
                  type="button"
                  onClick={autoSlug}
                  className="px-3 border border-ks-hairline-active text-eyebrow font-mono uppercase tracking-widest text-xs hover:bg-ks-fg/5 transition-colors whitespace-nowrap"
                >
                  Auto
                </button>
              )}
            </div>
          </Field>

          <Field label="Anno" error={errors.year?.message} required>
            <input
              {...register("year", { valueAsNumber: true })}
              type="number"
              min={2000}
              max={2100}
              className={inputCls(!!errors.year)}
            />
          </Field>

          <Field label="Ordine" error={errors.sortOrder?.message}>
            <input
              {...register("sortOrder", { valueAsNumber: true })}
              type="number"
              className={inputCls(!!errors.sortOrder)}
            />
          </Field>

          <Field label="Cliente" error={errors.client?.message} required>
            <input {...register("client")} className={inputCls(!!errors.client)} />
          </Field>

          <Field label="Formato" error={errors.format?.message} required>
            <input
              {...register("format")}
              placeholder="es. Permanent Installation"
              className={inputCls(!!errors.format)}
            />
          </Field>

          <Field label="Ambiente" error={errors.environment?.message} required>
            <input
              {...register("environment")}
              placeholder="es. Stadium · Seattle, WA"
              className={inputCls(!!errors.environment)}
            />
          </Field>

          <Field
            label="Tecnologie"
            error={errors.technologies?.message}
            required
            className="md:col-span-2 lg:col-span-3"
          >
            <input
              {...register("technologies")}
              placeholder="es. Computer Vision, NVIDIA, LED 4K…"
              className={inputCls(!!errors.technologies)}
            />
          </Field>

          <Field
            label="Video URL"
            error={errors.videoUrl?.message}
            className="md:col-span-2 lg:col-span-3"
          >
            <input
              {...register("videoUrl")}
              placeholder="https://youtube.com/watch?v=…"
              className={inputCls(!!errors.videoUrl)}
            />
          </Field>

          <Field label="Poster URL" error={errors.posterUrl?.message}>
            <input
              {...register("posterUrl")}
              placeholder="https://…"
              className={inputCls(!!errors.posterUrl)}
            />
          </Field>

          <Field label="Cover URL" error={errors.coverUrl?.message}>
            <input
              {...register("coverUrl")}
              placeholder="https://…"
              className={inputCls(!!errors.coverUrl)}
            />
          </Field>

          <Field label="Note interne" error={errors.notes?.message}>
            <input {...register("notes")} className={inputCls(!!errors.notes)} />
          </Field>
        </div>

        {/* Published */}
        <label className="inline-flex items-center gap-3 mt-6 cursor-pointer">
          <Controller
            control={control}
            name="published"
            render={({ field }) => (
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="w-4 h-4 accent-ks-fg"
              />
            )}
          />
          <span className="text-small font-medium">Pubblicato</span>
        </label>
      </section>

      {/* Categories */}
      <section>
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-4">
          Categorie
        </p>
        <Controller
          control={control}
          name="categoryIds"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const selected = field.value.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (selected) {
                        field.onChange(field.value.filter((id) => id !== cat.id))
                      } else {
                        field.onChange([...field.value, cat.id])
                      }
                    }}
                    className={`px-3 py-1.5 text-eyebrow font-mono uppercase tracking-widest text-xs border transition-colors ${
                      selected
                        ? "bg-ks-fg text-ks-bg border-ks-fg"
                        : "border-ks-hairline-active hover:bg-ks-fg/5"
                    }`}
                  >
                    {cat.nameIt}
                  </button>
                )
              })}
            </div>
          )}
        />
      </section>

      {/* Translations — both locales always mounted, inactive hidden via CSS */}
      <section>
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-4">
          Contenuti
        </p>

        {/* Tab selector */}
        <div className="flex border-b border-ks-hairline-active mb-6">
          {(["it", "en"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-eyebrow font-mono uppercase tracking-widest text-xs transition-colors border-b-2 -mb-[2px] ${
                tab === t
                  ? "border-ks-fg opacity-100"
                  : "border-transparent opacity-40 hover:opacity-70"
              }`}
            >
              {t === "it" ? "Italiano" : "English"}
            </button>
          ))}
        </div>

        {([0, 1] as const).map((idx) => {
          const locale = (idx === 0 ? "it" : "en") as Tab

          return (
            <div
              key={locale}
              className={cn("space-y-4", tab !== locale && "hidden")}
            >
              {/* Hidden locale field — always registered, never unmounted */}
              <input
                type="hidden"
                {...register(`translations.${idx}.locale`)}
                defaultValue={locale}
              />

              <Field
                label="Titolo"
                error={errors.translations?.[idx]?.title?.message}
                required
              >
                <input
                  {...register(`translations.${idx}.title`)}
                  onBlur={locale === "it" ? autoSlug : undefined}
                  className={inputCls(!!errors.translations?.[idx]?.title)}
                />
              </Field>

              <Field
                label="Tagline"
                error={errors.translations?.[idx]?.tagline?.message}
              >
                <input
                  {...register(`translations.${idx}.tagline`)}
                  className={inputCls(!!errors.translations?.[idx]?.tagline)}
                />
              </Field>

              <Field
                label="Descrizione"
                error={errors.translations?.[idx]?.description?.message}
                required
              >
                <textarea
                  {...register(`translations.${idx}.description`)}
                  rows={4}
                  className={inputCls(!!errors.translations?.[idx]?.description)}
                />
              </Field>

              <Field
                label="Problema"
                error={errors.translations?.[idx]?.problem?.message}
              >
                <textarea
                  {...register(`translations.${idx}.problem`)}
                  rows={3}
                  className={inputCls(!!errors.translations?.[idx]?.problem)}
                />
              </Field>

              <Field
                label="Soluzione"
                error={errors.translations?.[idx]?.solution?.message}
              >
                <textarea
                  {...register(`translations.${idx}.solution`)}
                  rows={3}
                  className={inputCls(!!errors.translations?.[idx]?.solution)}
                />
              </Field>
            </div>
          )
        })}
      </section>

      {/* KPIs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">KPI</p>
          <button
            type="button"
            onClick={() =>
              appendKpi({
                icon: "zap",
                value: "",
                labelIt: "",
                labelEn: "",
                sortOrder: kpiFields.length,
              })
            }
            className="inline-flex items-center gap-2 text-small font-medium border border-ks-hairline-active px-3 py-1.5 hover:bg-ks-fg/5 transition-colors"
          >
            <Plus size={14} strokeWidth={1.5} />
            Aggiungi KPI
          </button>
        </div>

        {kpiFields.length === 0 && (
          <p className="text-small opacity-50">Nessun KPI. Aggiungine uno.</p>
        )}

        <div className="space-y-4">
          {kpiFields.map((kpi, i) => (
            <div
              key={kpi.id}
              className="border border-ks-hairline-active p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 relative"
            >
              <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-20">
                <GripVertical size={14} />
              </div>

              <Field label="Icona" error={errors.kpis?.[i]?.icon?.message} required>
                <select
                  {...register(`kpis.${i}.icon`)}
                  className={inputCls(!!errors.kpis?.[i]?.icon)}
                >
                  {KPI_ICONS.map((ico) => (
                    <option key={ico} value={ico}>
                      {ico}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Valore" error={errors.kpis?.[i]?.value?.message} required>
                <input
                  {...register(`kpis.${i}.value`)}
                  placeholder="es. +40%"
                  className={inputCls(!!errors.kpis?.[i]?.value)}
                />
              </Field>

              <Field label="Label IT" error={errors.kpis?.[i]?.labelIt?.message} required>
                <input
                  {...register(`kpis.${i}.labelIt`)}
                  placeholder="es. Aumento spettatori"
                  className={inputCls(!!errors.kpis?.[i]?.labelIt)}
                />
              </Field>

              <Field label="Label EN" error={errors.kpis?.[i]?.labelEn?.message} required>
                <input
                  {...register(`kpis.${i}.labelEn`)}
                  placeholder="es. Audience increase"
                  className={inputCls(!!errors.kpis?.[i]?.labelEn)}
                />
              </Field>

              <button
                type="button"
                onClick={() => removeKpi(i)}
                className="absolute right-2 top-2 p-1 opacity-30 hover:opacity-80 hover:text-red-700 transition-all"
                title="Rimuovi KPI"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4 border-t border-ks-hairline-active">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-ks-fg text-ks-bg text-small font-medium hover:bg-ks-fg/90 transition-colors disabled:opacity-50"
        >
          {isPending
            ? "Salvataggio…"
            : isEditing
              ? "Salva modifiche"
              : "Crea progetto"}
        </button>

        <a
          href="/admin/projects"
          className="text-small font-medium opacity-60 hover:opacity-100 hover:underline underline-offset-4 transition-opacity"
        >
          Annulla
        </a>
      </div>
    </form>
  )
}

// --- helpers ---

function inputCls(hasError: boolean) {
  return `w-full border ${hasError ? "border-red-400" : "border-ks-hairline-active"} bg-transparent px-3 py-2 text-small font-body focus:outline-none focus:border-ks-fg/40 transition-colors`
}

function Field({
  label,
  error,
  required,
  children,
  className,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-eyebrow font-mono uppercase tracking-widest text-xs opacity-60 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

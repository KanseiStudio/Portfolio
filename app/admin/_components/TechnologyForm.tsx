"use client"

import { useState, useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  technologyFormSchema,
  emptyTechnologyForm,
  type TechnologyFormValues,
} from "@/lib/validations/technology"
import {
  createTechnologyAction,
  updateTechnologyAction,
} from "@/app/admin/_actions/technologies"

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

const inputCls = (hasErr: boolean) =>
  `w-full border bg-transparent px-3 py-2 text-small font-body focus:outline-none transition-colors ${
    hasErr
      ? "border-red-400 focus:border-red-600"
      : "border-ks-hairline-active focus:border-ks-fg/40"
  }`

const textareaCls = (hasErr: boolean) =>
  `w-full border bg-transparent px-3 py-2 text-small font-body focus:outline-none transition-colors resize-y min-h-[120px] ${
    hasErr
      ? "border-red-400 focus:border-red-600"
      : "border-ks-hairline-active focus:border-ks-fg/40"
  }`

function Field({
  label,
  error,
  required,
  className,
  hint,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  className?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label className="block mb-1.5">
        <span className="font-mono text-eyebrow uppercase tracking-widest opacity-60 text-xs">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {hint && (
          <span className="ml-2 text-eyebrow opacity-40 normal-case tracking-normal">
            {hint}
          </span>
        )}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

type Tab = "it" | "en"

interface TechnologyFormProps {
  initialValues?: Partial<TechnologyFormValues>
  technologyId?: number
}

export function TechnologyForm({ initialValues, technologyId }: TechnologyFormProps) {
  const [tab, setTab]             = useState<Tab>("it")
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition]  = useTransition()

  const isEditing = Boolean(technologyId)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologyFormSchema),
    defaultValues: { ...emptyTechnologyForm, ...initialValues },
  })

  const nameValue = watch("name")

  function autoSlug() {
    if (!isEditing && nameValue) {
      setValue("slug", slugify(nameValue), { shouldValidate: true })
    }
  }

  function onSubmit(data: TechnologyFormValues) {
    setServerError(null)
    startTransition(async () => {
      try {
        const result = isEditing
          ? await updateTechnologyAction(technologyId!, data)
          : await createTechnologyAction(data)
        if (result?.error) {
          setServerError(result.error)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      } catch {
        setServerError("Errore di rete. Riprova.")
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }

  function onInvalid(formErrors: Record<string, unknown>) {
    const lines = collectFieldErrors(formErrors)
    setServerError(`Compila tutti i campi obbligatori:\n${lines.join("\n")}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-12 pb-32">

      {serverError && (
        <div className="border border-red-200 bg-red-50 p-4 text-small text-red-700 whitespace-pre-line">
          {serverError}
        </div>
      )}

      {/* ── Metadati ─────────────────────────────────────────────── */}
      <section>
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-6">
          Metadati
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <Field label="Nome" error={errors.name?.message} required>
            <input
              {...register("name")}
              placeholder="es. TouchDesigner"
              className={inputCls(!!errors.name)}
              onBlur={autoSlug}
            />
          </Field>

          <Field label="Slug" error={errors.slug?.message} required>
            <div className="flex gap-2">
              <input
                {...register("slug")}
                placeholder="es. touchdesigner"
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

          <Field label="Ordine" error={errors.sortOrder?.message}>
            <input
              {...register("sortOrder", { valueAsNumber: true })}
              type="number"
              className={inputCls(!!errors.sortOrder)}
            />
          </Field>

        </div>

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
          <span className="text-small font-medium">Pubblicata</span>
        </label>
      </section>

      {/* ── Immagini ─────────────────────────────────────────────── */}
      <section>
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-6">
          Immagini
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field
            label="Foto tecnologia"
            hint="(mainImage)"
            error={errors.mainImage?.message}
            className="md:col-span-2"
          >
            <div className="flex gap-3 items-start">
              <input
                {...register("mainImage")}
                placeholder="https://…"
                className={inputCls(!!errors.mainImage)}
              />
              {watch("mainImage") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={watch("mainImage") ?? ""}
                  alt=""
                  className="w-24 h-16 object-cover shrink-0 border border-ks-hairline-active"
                />
              )}
            </div>
          </Field>

          <Field
            label="Foto progetto 1"
            hint="(usageImage1)"
            error={errors.usageImage1?.message}
          >
            <div className="flex gap-3 items-start">
              <input
                {...register("usageImage1")}
                placeholder="https://…"
                className={inputCls(!!errors.usageImage1)}
              />
              {watch("usageImage1") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={watch("usageImage1") ?? ""}
                  alt=""
                  className="w-20 h-12 object-cover shrink-0 border border-ks-hairline-active"
                />
              )}
            </div>
          </Field>

          <Field
            label="Foto progetto 2"
            hint="(usageImage2)"
            error={errors.usageImage2?.message}
          >
            <div className="flex gap-3 items-start">
              <input
                {...register("usageImage2")}
                placeholder="https://…"
                className={inputCls(!!errors.usageImage2)}
              />
              {watch("usageImage2") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={watch("usageImage2") ?? ""}
                  alt=""
                  className="w-20 h-12 object-cover shrink-0 border border-ks-hairline-active"
                />
              )}
            </div>
          </Field>

          <Field
            label="Foto progetto 3"
            hint="(usageImage3)"
            error={errors.usageImage3?.message}
          >
            <div className="flex gap-3 items-start">
              <input
                {...register("usageImage3")}
                placeholder="https://…"
                className={inputCls(!!errors.usageImage3)}
              />
              {watch("usageImage3") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={watch("usageImage3") ?? ""}
                  alt=""
                  className="w-20 h-12 object-cover shrink-0 border border-ks-hairline-active"
                />
              )}
            </div>
          </Field>

        </div>
      </section>

      {/* ── Link video ───────────────────────────────────────────── */}
      <section>
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-6">
          Link video
        </p>
        <Field
          label="Video URL"
          hint="(opzionale — Vimeo, YouTube, ecc.)"
          error={errors.videoUrl?.message}
        >
          <input
            {...register("videoUrl")}
            placeholder="https://vimeo.com/…"
            className={inputCls(!!errors.videoUrl)}
          />
        </Field>
      </section>

      {/* ── Traduzioni ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">
            Contenuti tradotti
          </p>
          <div className="flex border border-ks-hairline-active">
            {(["it", "en"] as Tab[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setTab(l)}
                className={`px-4 py-1.5 text-eyebrow font-mono uppercase tracking-widest text-xs transition-colors ${
                  tab === l ? "bg-ks-fg text-ks-bg" : "hover:bg-ks-fg/5"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* IT tab */}
        <div className={tab !== "it" ? "hidden" : "grid gap-4"}>
          <Field label="Descrizione" error={errors.translations?.[0]?.description?.message} required>
            <textarea
              {...register("translations.0.description")}
              placeholder="Descrizione della tecnologia…"
              className={textareaCls(!!errors.translations?.[0]?.description)}
            />
          </Field>
          <Field label="Applicazioni / Utilizzo" error={errors.translations?.[0]?.applications?.message} required>
            <textarea
              {...register("translations.0.applications")}
              placeholder="Installazioni immersive, visual generativi…"
              className={textareaCls(!!errors.translations?.[0]?.applications)}
            />
          </Field>
        </div>

        {/* EN tab */}
        <div className={tab !== "en" ? "hidden" : "grid gap-4"}>
          <Field label="Description" error={errors.translations?.[1]?.description?.message} required>
            <textarea
              {...register("translations.1.description")}
              placeholder="Technology description…"
              className={textareaCls(!!errors.translations?.[1]?.description)}
            />
          </Field>
          <Field label="Applications / Usage" error={errors.translations?.[1]?.applications?.message} required>
            <textarea
              {...register("translations.1.applications")}
              placeholder="Immersive installations, generative visuals…"
              className={textareaCls(!!errors.translations?.[1]?.applications)}
            />
          </Field>
        </div>
      </section>

      {/* ── Submit ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-ks-fg text-ks-bg text-small font-medium hover:bg-ks-fg/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? isEditing ? "Salvataggio…" : "Creazione…"
            : isEditing ? "Salva modifiche" : "Crea tecnologia"}
        </button>
      </div>

    </form>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateContactInfoAction } from "@/app/admin/_actions/contact"
import { Save, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const schema = z.object({
  studioName: z.string().min(1).max(120),
  email: z.string().email("Email non valida"),
  translations: z.object({
    it: z.object({
      location: z.string().min(1),
      availability: z.string().min(1),
      focus: z.string().min(1),
    }),
    en: z.object({
      location: z.string().min(1),
      availability: z.string().min(1),
      focus: z.string().min(1),
    }),
  }),
})

type FormData = z.infer<typeof schema>

interface Props {
  initialData: FormData
}

export function ContactInfoForm({ initialData }: Props) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [activeLocale, setActiveLocale] = useState<"it" | "en">("it")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  })

  async function onSubmit(data: FormData) {
    setServerError(null)
    setSuccessMsg(null)
    setIsPending(true)

    try {
      const result = await updateContactInfoAction(data)
      if (result.ok) {
        setSuccessMsg("Informazioni salvate con successo")
        router.refresh()
        setTimeout(() => setSuccessMsg(null), 3000)
      } else {
        setServerError(result.error)
      }
    } catch (err) {
      console.error(err)
      setServerError("Errore di rete. Riprova.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 border border-ks-hairline-active p-6 lg:p-8"
    >
      {serverError && (
        <div className="border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle size={18} strokeWidth={1.5} className="text-red-700 shrink-0 mt-0.5" />
          <p className="text-small text-red-900">{serverError}</p>
        </div>
      )}

      {successMsg && (
        <div className="border border-green-200 bg-green-50 p-4 flex items-start gap-3">
          <CheckCircle size={18} strokeWidth={1.5} className="text-green-700 shrink-0 mt-0.5" />
          <p className="text-small text-green-900">{successMsg}</p>
        </div>
      )}

      <Field label="Studio name" error={errors.studioName?.message}>
        <input type="text" {...register("studioName")} className={fieldCls} />
      </Field>

      <Field label="Email" error={errors.email?.message}>
        <input type="email" {...register("email")} className={fieldCls} />
      </Field>

      {/* Tabs IT / EN */}
      <div className="pt-4">
        <div className="flex gap-2 mb-6 border-b border-ks-hairline-active">
          {(["it", "en"] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setActiveLocale(loc)}
              className={cn(
                "px-4 py-2 text-small font-medium border-b-2 -mb-px transition-colors",
                activeLocale === loc
                  ? "border-ks-fg"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>

        {(["it", "en"] as const).map((locale) => (
          <div
            key={locale}
            className={cn("space-y-4", locale !== activeLocale && "hidden")}
          >
            <Field
              label={`Location (${locale.toUpperCase()})`}
              error={errors.translations?.[locale]?.location?.message}
            >
              <input
                type="text"
                {...register(`translations.${locale}.location`)}
                className={fieldCls}
              />
            </Field>

            <Field
              label={`Availability (${locale.toUpperCase()})`}
              error={errors.translations?.[locale]?.availability?.message}
            >
              <input
                type="text"
                {...register(`translations.${locale}.availability`)}
                className={fieldCls}
              />
            </Field>

            <Field
              label={`Focus (${locale.toUpperCase()})`}
              error={errors.translations?.[locale]?.focus?.message}
              hint="Aree di competenza, separate da virgole"
            >
              <input
                type="text"
                {...register(`translations.${locale}.focus`)}
                className={fieldCls}
              />
            </Field>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 border border-ks-fg bg-ks-fg text-ks-bg px-4 py-2 text-small font-medium hover:bg-ks-bg hover:text-ks-fg transition-colors duration-300 disabled:opacity-50"
        >
          <Save size={14} strokeWidth={1.5} />
          {isPending ? "Salvataggio…" : "Salva informazioni"}
        </button>
      </div>
    </form>
  )
}

const fieldCls =
  "w-full border border-ks-hairline-active px-3 py-2 bg-ks-bg text-ks-fg text-small focus:outline-none focus:border-ks-fg/40 transition-colors"

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-small font-medium mb-2">{label}</label>
      {children}
      {hint && !error && (
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mt-2">
          {hint}
        </p>
      )}
      {error && <p className="text-small text-red-700 mt-2">{error}</p>}
    </div>
  )
}

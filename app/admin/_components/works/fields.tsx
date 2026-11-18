"use client"

import type { ReactNode } from "react"
import { get, useFormContext } from "react-hook-form"
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react"
import type { WorkFormValues } from "@/lib/validations/work"

export const inputCls = (hasErr: boolean) =>
  `w-full border bg-transparent px-3 py-2 text-small font-body focus:outline-none transition-colors ${
    hasErr ? "border-red-400 focus:border-red-600" : "border-ks-hairline-active focus:border-ks-fg/40"
  }`

export const textareaCls = (hasErr: boolean, rows: "sm" | "md" = "md") =>
  `${inputCls(hasErr)} resize-y ${rows === "sm" ? "min-h-[72px]" : "min-h-[120px]"}`

export const eyebrowCls = "font-mono text-eyebrow uppercase tracking-widest opacity-60 text-xs"

export function useFieldError(path: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext<WorkFormValues>()
  return (get(errors, path) as { message?: string } | undefined)?.message
}

function LabelRow({
  label,
  required,
  hint,
  htmlFor,
}: {
  label: string
  required?: boolean
  hint?: string
  htmlFor?: string
}) {
  return (
    <label htmlFor={htmlFor} className="block mb-1.5">
      <span className={eyebrowCls}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {hint && <span className="ml-2 text-xs opacity-40">{hint}</span>}
    </label>
  )
}

/** Campo singolo (non tradotto) */
export function Field({
  label,
  name,
  required,
  hint,
  placeholder,
  className,
  mono,
}: {
  label: string
  name: string
  required?: boolean
  hint?: string
  placeholder?: string
  className?: string
  mono?: boolean
}) {
  const { register } = useFormContext()
  const error = useFieldError(name)
  const id = `f-${name.replace(/\./g, "-")}`
  return (
    <div className={className}>
      <LabelRow label={label} required={required} hint={hint} htmlFor={id} />
      <input
        id={id}
        {...register(name)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`${inputCls(!!error)} ${mono ? "font-mono" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

/**
 * Coppia IT / EN affiancata. Registra `${base}It` e `${base}En`.
 * Entrambi gli input restano sempre montati nel DOM.
 */
export function BiField({
  label,
  base,
  required,
  multiline,
  rows,
  hint,
  placeholder,
  className,
}: {
  label: string
  base: string
  required?: boolean
  multiline?: boolean
  rows?: "sm" | "md"
  hint?: string
  placeholder?: { it?: string; en?: string }
  className?: string
}) {
  const { register } = useFormContext()
  const errIt = useFieldError(`${base}It`)
  const errEn = useFieldError(`${base}En`)
  const id = `f-${base.replace(/\./g, "-")}`

  const control = (lang: "It" | "En", err?: string) => {
    const common = {
      id: `${id}${lang}`,
      ...register(`${base}${lang}`),
      "aria-label": `${label} ${lang.toUpperCase()}`,
      "aria-invalid": !!err,
      placeholder: lang === "It" ? placeholder?.it : placeholder?.en,
    }
    return multiline ? (
      <textarea {...common} className={textareaCls(!!err, rows)} />
    ) : (
      <input {...common} className={inputCls(!!err)} />
    )
  }

  return (
    <div className={className}>
      <LabelRow label={label} required={required} hint={hint} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(["It", "En"] as const).map((lang) => {
          const err = lang === "It" ? errIt : errEn
          return (
            <div key={lang} className="relative">
              <span
                aria-hidden="true"
                className="absolute right-2 top-2 font-mono text-[10px] tracking-widest opacity-35 pointer-events-none"
              >
                {lang.toUpperCase()}
              </span>
              {control(lang, err)}
              {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Pulsanti su / giù / elimina per righe ripetibili */
export function RowControls({
  index,
  count,
  onMove,
  onRemove,
  noun,
}: {
  index: number
  count: number
  onMove: (from: number, to: number) => void
  onRemove: () => void
  noun: string
}) {
  const btn =
    "p-1.5 border border-ks-hairline-active hover:bg-ks-fg/5 transition-colors disabled:opacity-25 disabled:pointer-events-none"
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        className={btn}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        aria-label={`Sposta ${noun} ${index + 1} in alto`}
      >
        <ArrowUp size={13} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        className={btn}
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
        aria-label={`Sposta ${noun} ${index + 1} in basso`}
      >
        <ArrowDown size={13} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        className={`${btn} text-red-700`}
        onClick={onRemove}
        aria-label={`Rimuovi ${noun} ${index + 1}`}
      >
        <Trash2 size={13} strokeWidth={1.5} />
      </button>
    </div>
  )
}

export function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-ks-fg/30 text-small hover:bg-ks-fg/5 transition-colors"
    >
      {children}
    </button>
  )
}

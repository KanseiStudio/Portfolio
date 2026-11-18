"use client"

import { createContext, useContext, useId, useRef, useState, type RefObject } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { ImageIcon, Loader2, Upload, X } from "lucide-react"
import { upload } from "@vercel/blob/client"
import { discardWorkImage } from "@/app/admin/_actions/works"
import {
  WORK_IMAGE_MAX_BYTES,
  WORK_IMAGE_MAX_LABEL,
  WORK_IMAGE_TYPES,
  isWorkImageType,
  workBlobPathname,
} from "@/lib/validations/work"
import { BiField, eyebrowCls, inputCls, useFieldError } from "./fields"

/**
 * Contesto dell'editor: slug corrente (cartella blob) e upload fatti in questa
 * sessione, così un'immagine caricata e poi sostituita prima del salvataggio
 * viene cancellata subito invece di restare orfana.
 */
interface WorkImageContextValue {
  slugRef: RefObject<string>
  sessionUploads: RefObject<Set<string>>
}
export const WorkImageContext = createContext<WorkImageContextValue | null>(null)

export function ImageField({
  label,
  name,
  altBase,
  required,
}: {
  label: string
  /** Path del campo URL (es. "heroImage", "sections.0.image") */
  name: string
  /** Base dei campi alt (es. "heroAlt" → heroAltIt / heroAltEn) */
  altBase?: string
  required?: boolean
}) {
  const ctx = useContext(WorkImageContext)
  const { register, setValue, control } = useFormContext()
  const value = (useWatch({ control, name }) as string | undefined) ?? ""
  const error = useFieldError(name)
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputId = useId()

  function discardIfSessionUpload(url: string) {
    if (url && ctx?.sessionUploads.current.has(url)) {
      ctx.sessionUploads.current.delete(url)
      void discardWorkImage(url)
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    const type = file.type
    if (!isWorkImageType(type)) {
      setUploadError("Formato non supportato: usa JPG, PNG, WebP o AVIF")
      return
    }
    if (file.size > WORK_IMAGE_MAX_BYTES) {
      setUploadError(`File troppo grande: massimo ${WORK_IMAGE_MAX_LABEL}`)
      return
    }
    setBusy(true)
    setProgress(0)
    try {
      // Client upload: il file va dal browser direttamente a Vercel Blob,
      // la route /api/admin/works/upload rilascia solo un token temporaneo
      const blob = await upload(workBlobPathname(ctx?.slugRef.current, file.name, type), file, {
        access: "public",
        handleUploadUrl: "/api/admin/works/upload",
        contentType: type,
        multipart: file.size > 5 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      })
      const previous = value
      ctx?.sessionUploads.current.add(blob.url)
      setValue(name, blob.url, { shouldDirty: true, shouldValidate: true })
      discardIfSessionUpload(previous)
    } catch (err) {
      // Il client di @vercel/blob non espone lo status della route del token:
      // distinguiamo i casi dal messaggio dell'errore
      const msg = err instanceof Error ? err.message : ""
      setUploadError(
        /client token/i.test(msg)
          ? "Upload non autorizzato: la sessione potrebbe essere scaduta (ricarica e accedi di nuovo) oppure manca BLOB_READ_WRITE_TOKEN sul server."
          : /too large|size/i.test(msg)
            ? `File troppo grande: massimo ${WORK_IMAGE_MAX_LABEL}`
            : /content.?type/i.test(msg)
              ? "Formato non supportato: usa JPG, PNG, WebP o AVIF"
              : "Upload fallito. Riprova.",
      )
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  function remove() {
    const previous = value
    setValue(name, "", { shouldDirty: true, shouldValidate: true })
    discardIfSessionUpload(previous)
  }

  const btn =
    "inline-flex items-center gap-1.5 px-3 py-1.5 border border-ks-hairline-active text-xs font-mono uppercase tracking-widest hover:bg-ks-fg/5 transition-colors disabled:opacity-40"

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={inputId} className="block mb-1.5">
          <span className={eyebrowCls}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
        <div className="flex gap-4 items-start">
          <div className="w-40 h-28 shrink-0 border border-ks-hairline-active bg-ks-fg/5 flex items-center justify-center overflow-hidden">
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={20} strokeWidth={1.5} className="opacity-30" />
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btn} disabled={busy} onClick={() => fileRef.current?.click()}>
                {busy ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} strokeWidth={1.5} />}
                {busy ? `Caricamento… ${progress}%` : value ? "Sostituisci" : "Carica"}
              </button>
              {value && (
                <button type="button" className={btn} disabled={busy} onClick={remove}>
                  <X size={12} strokeWidth={1.5} />
                  Rimuovi
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={WORK_IMAGE_TYPES.join(",")}
              className="hidden"
              aria-label={`File ${label}`}
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <input
              id={inputId}
              {...register(name)}
              placeholder="/works/slug/file.jpg oppure https://…"
              aria-invalid={!!error}
              className={`${inputCls(!!error)} font-mono text-xs`}
            />
            {busy && (
              <div
                role="progressbar"
                aria-label={`Caricamento ${label}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-1 w-full bg-ks-fg/10 overflow-hidden"
              >
                <div className="h-full bg-ks-fg transition-[width] duration-200" style={{ width: `${progress}%` }} />
              </div>
            )}
            <p className="text-xs opacity-40">
              JPG, PNG, WebP o AVIF · max {WORK_IMAGE_MAX_LABEL} · accetta anche path locali /works/…
            </p>
            {(uploadError || error) && <p className="text-xs text-red-600">{uploadError ?? error}</p>}
          </div>
        </div>
      </div>
      {altBase && <BiField label="Testo alternativo" base={altBase} required={required} />}
    </div>
  )
}

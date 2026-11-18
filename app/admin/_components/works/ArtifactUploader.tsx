"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { upload } from "@vercel/blob/client"
import { unzipSync } from "fflate"
import { Check, Loader2, Upload, X } from "lucide-react"
import {
  ARTIFACT_ASPECT_RATIOS,
  ARTIFACT_MULTIPART_BYTES,
  ARTIFACT_POSTER_MAX_BYTES,
  ARTIFACT_POSTER_TYPES,
  ARTIFACT_UPLOAD_CONCURRENCY,
  artifactFilePathname,
  artifactPosterPathname,
  formatBytes,
  normalizeZipEntries,
  type ArtifactAspectRatio,
} from "@/lib/artifacts"
import {
  createArtifactAction,
  deleteArtifactBlobsAction,
  replaceArtifactFilesAction,
  reserveArtifactUploadAction,
} from "@/app/admin/_actions/artifacts"
import { eyebrowCls, inputCls, textareaCls } from "./fields"

const UPLOAD_URL = "/api/admin/works/upload"

type FileStatus = "pending" | "uploading" | "done" | "error"
interface PreparedFile {
  relPath: string
  size: number
  contentType: string
  data: Uint8Array
}
interface Prepared {
  zipName: string
  files: PreparedFile[]
  totalBytes: number
  strippedRoot: string | null
}

type Props =
  | { mode: "create"; workId: string; onDone?: () => void }
  | { mode: "replace"; workId: string; artifactId: string; artifactTitle: string; onDone?: () => void }

/** Esegue `tasks` con al massimo `limit` in parallelo; si ferma al primo errore */
async function runPool(count: number, limit: number, task: (i: number) => Promise<void>, signal: AbortSignal) {
  let next = 0
  const worker = async () => {
    while (next < count && !signal.aborted) await task(next++)
  }
  await Promise.all(Array.from({ length: Math.min(limit, count) }, worker))
}

export function ArtifactUploader(props: Props) {
  const router = useRouter()
  const uid = useId()
  const zipInput = useRef<HTMLInputElement>(null)
  const posterInput = useRef<HTMLInputElement>(null)

  const [prepared, setPrepared] = useState<Prepared | null>(null)
  const [zipFileName, setZipFileName] = useState<string | null>(null)
  const [poster, setPoster] = useState<File | null>(null)
  const [titleIt, setTitleIt] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [captionIt, setCaptionIt] = useState("")
  const [captionEn, setCaptionEn] = useState("")
  const [aspectRatio, setAspectRatio] = useState<ArtifactAspectRatio>("16/9")

  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [phase, setPhase] = useState<string | null>(null)
  const [statuses, setStatuses] = useState<FileStatus[]>([])
  const [loaded, setLoaded] = useState<number[]>([])
  const [success, setSuccess] = useState<string | null>(null)

  // Durante il caricamento, lasciare la pagina chiede conferma
  useEffect(() => {
    if (!busy) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [busy])

  async function onZipChange(file: File | undefined) {
    setError(null)
    setSuccess(null)
    setPrepared(null)
    setStatuses([])
    setLoaded([])
    setZipFileName(file?.name ?? null)
    if (!file) return
    if (!/\.zip$/i.test(file.name)) {
      setError("Seleziona un file .zip.")
      return
    }
    setPhase("Decompressione…")
    try {
      const raw = unzipSync(new Uint8Array(await file.arrayBuffer()))
      const entries = Object.entries(raw).map(([path, data]) => ({ path, size: data.length, data }))
      const res = normalizeZipEntries(entries)
      if (!res.ok) {
        setError(res.error)
        return
      }
      const files = res.files
        .map((f) => ({ relPath: f.relPath, size: f.size, contentType: f.contentType, data: f.data }))
        // index.html per primo, poi il resto in ordine alfabetico
        .sort((a, b) => (a.relPath === "index.html" ? -1 : b.relPath === "index.html" ? 1 : a.relPath.localeCompare(b.relPath)))
      setPrepared({ zipName: file.name, files, totalBytes: res.totalBytes, strippedRoot: res.strippedRoot })
      setStatuses(files.map(() => "pending"))
      setLoaded(files.map(() => 0))
    } catch (err) {
      console.error("[artifacts] unzip fallito", err)
      setError("Impossibile leggere lo zip: il file è danneggiato o non è uno zip.")
    } finally {
      setPhase(null)
    }
  }

  function onPosterChange(file: File | undefined) {
    setError(null)
    if (!file) return setPoster(null)
    if (!ARTIFACT_POSTER_TYPES[file.type]) {
      setPoster(null)
      if (posterInput.current) posterInput.current.value = ""
      return setError("Copertina: usa JPG, PNG, WebP o AVIF.")
    }
    if (file.size > ARTIFACT_POSTER_MAX_BYTES) {
      setPoster(null)
      if (posterInput.current) posterInput.current.value = ""
      return setError("Copertina troppo grande (massimo 20 MB).")
    }
    setPoster(file)
  }

  function reset() {
    setPrepared(null)
    setZipFileName(null)
    setPoster(null)
    setStatuses([])
    setLoaded([])
    setTitleIt("")
    setTitleEn("")
    setCaptionIt("")
    setCaptionEn("")
    setAspectRatio("16/9")
    if (zipInput.current) zipInput.current.value = ""
    if (posterInput.current) posterInput.current.value = ""
  }

  async function submit() {
    if (!prepared || busy) return
    if (props.mode === "create" && !titleIt.trim()) {
      setError("Il titolo IT è obbligatorio.")
      return
    }
    setError(null)
    setSuccess(null)
    setBusy(true)
    setStatuses(prepared.files.map(() => "pending"))
    setLoaded(prepared.files.map(() => 0))

    const controller = new AbortController()
    let blobPrefix: string | null = null
    let posterUrl: string | null = null

    try {
      setPhase("Preparazione…")
      const reserved = await reserveArtifactUploadAction(props.workId)
      if (!reserved.ok) throw new Error(reserved.error)
      blobPrefix = reserved.blobPrefix
      const prefix = blobPrefix

      setPhase("Caricamento…")
      await runPool(
        prepared.files.length,
        ARTIFACT_UPLOAD_CONCURRENCY,
        async (i) => {
          const f = prepared.files[i]
          setStatuses((s) => s.map((v, k) => (k === i ? "uploading" : v)))
          try {
            await upload(artifactFilePathname(prefix, f.relPath), new Blob([f.data as BlobPart], { type: f.contentType }), {
              access: "public",
              handleUploadUrl: UPLOAD_URL,
              contentType: f.contentType,
              multipart: f.size > ARTIFACT_MULTIPART_BYTES,
              abortSignal: controller.signal,
              onUploadProgress: ({ loaded: l }) => setLoaded((arr) => arr.map((v, k) => (k === i ? l : v))),
            })
            setLoaded((arr) => arr.map((v, k) => (k === i ? f.size : v)))
            setStatuses((s) => s.map((v, k) => (k === i ? "done" : v)))
          } catch (err) {
            setStatuses((s) => s.map((v, k) => (k === i ? "error" : v)))
            controller.abort()
            throw new Error(`Caricamento di ${f.relPath} non riuscito${err instanceof Error ? `: ${err.message}` : ""}`)
          }
        },
        controller.signal,
      )

      if (poster) {
        setPhase("Copertina…")
        const blob = await upload(artifactPosterPathname(prefix, poster.type), poster, {
          access: "public",
          handleUploadUrl: UPLOAD_URL,
          contentType: poster.type,
        })
        posterUrl = blob.url
      }

      setPhase("Salvataggio…")
      const saved =
        props.mode === "create"
          ? await createArtifactAction({
              workId: props.workId,
              titleIt,
              titleEn,
              captionIt,
              captionEn,
              aspectRatio,
              blobPrefix: prefix,
              posterUrl,
            })
          : await replaceArtifactFilesAction({ artifactId: props.artifactId, blobPrefix: prefix, posterUrl })
      if (!saved.ok) throw new Error(saved.error)

      setSuccess(
        props.mode === "create"
          ? `Artefatto caricato: ${prepared.files.length} file, ${formatBytes(prepared.totalBytes)}. È in bozza: attivalo dalla lista.`
          : `File sostituiti: ${prepared.files.length} file, ${formatBytes(prepared.totalBytes)}.`,
      )
      reset()
      router.refresh()
      props.onDone?.()
    } catch (err) {
      controller.abort()
      setError(err instanceof Error ? err.message : "Caricamento non riuscito.")
      // Nessun record: pulisci quello che è arrivato su Blob
      if (blobPrefix) {
        setPhase("Pulizia dei file caricati…")
        await deleteArtifactBlobsAction(blobPrefix, posterUrl).catch(() => {})
      }
    } finally {
      setBusy(false)
      setPhase(null)
    }
  }

  const total = prepared?.totalBytes ?? 0
  const sent = loaded.reduce((n, v) => n + v, 0)
  const pct = total ? Math.min(100, Math.round((sent / total) * 100)) : 0
  const doneCount = statuses.filter((s) => s === "done").length
  const showProgress = busy || statuses.some((s) => s !== "pending")
  const f = (name: string) => `${uid}-${name}`

  return (
    <div className="border border-ks-hairline-active p-6 space-y-6" data-testid={`artifact-uploader-${props.mode}`}>
      {props.mode === "replace" && (
        <p className="text-small opacity-70">
          Sostituisci i file di <span className="font-medium opacity-100">{props.artifactTitle}</span>. L&apos;indirizzo
          dell&apos;artefatto non cambia. La versione appena sostituita resta su Blob finché non la sostituisci di nuovo
          (serve alle pagine ancora in cache), poi viene cancellata.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor={f("zip")} className={`${eyebrowCls} block mb-1.5`}>
            Zip dell&apos;artefatto<span className="text-red-500 ml-1">*</span>
          </label>
          <FilePicker
            id={f("zip")}
            inputRef={zipInput}
            accept=".zip,application/zip"
            disabled={busy}
            fileName={zipFileName}
            onChange={onZipChange}
          />
          <p className="mt-1.5 text-xs opacity-50">
            Con <code>index.html</code> alla radice (una cartella radice unica viene rimossa). Massimo 300 file, 250 MB.
          </p>
        </div>
        <div>
          <label htmlFor={f("poster")} className={`${eyebrowCls} block mb-1.5`}>
            Copertina <span className="ml-1 normal-case tracking-normal opacity-60">facoltativa</span>
          </label>
          <FilePicker
            id={f("poster")}
            inputRef={posterInput}
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={busy}
            fileName={poster?.name ?? null}
            onChange={onPosterChange}
          />
          <p className="mt-1.5 text-xs opacity-50">
            {props.mode === "replace" ? "Se vuota resta la copertina attuale." : "Senza copertina: fondo nero con griglia HUD."}
          </p>
        </div>
      </div>

      {props.mode === "create" && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor={f("titleIt")} className={`${eyebrowCls} block mb-1.5`}>
                Titolo IT<span className="text-red-500 ml-1">*</span>
              </label>
              <input id={f("titleIt")} value={titleIt} onChange={(e) => setTitleIt(e.target.value)} disabled={busy} maxLength={200} className={inputCls(false)} />
            </div>
            <div>
              <label htmlFor={f("titleEn")} className={`${eyebrowCls} block mb-1.5`}>
                Titolo EN
              </label>
              <input id={f("titleEn")} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} disabled={busy} maxLength={200} className={inputCls(false)} />
            </div>
            <div>
              <label htmlFor={f("captionIt")} className={`${eyebrowCls} block mb-1.5`}>
                Didascalia IT
              </label>
              <textarea id={f("captionIt")} value={captionIt} onChange={(e) => setCaptionIt(e.target.value)} disabled={busy} maxLength={2000} className={textareaCls(false, "sm")} />
            </div>
            <div>
              <label htmlFor={f("captionEn")} className={`${eyebrowCls} block mb-1.5`}>
                Didascalia EN
              </label>
              <textarea id={f("captionEn")} value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} disabled={busy} maxLength={2000} className={textareaCls(false, "sm")} />
            </div>
          </div>
          <div className="max-w-xs">
            <label htmlFor={f("ratio")} className={`${eyebrowCls} block mb-1.5`}>
              Proporzioni
            </label>
            <select
              id={f("ratio")}
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as ArtifactAspectRatio)}
              disabled={busy}
              className={`${inputCls(false)} font-mono`}
            >
              {ARTIFACT_ASPECT_RATIOS.map((r) => (
                <option key={r} value={r}>
                  {r.replace("/", ":")}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {prepared && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono text-xs uppercase tracking-widest opacity-70" data-testid="artifact-summary">
              {prepared.files.length} file · {formatBytes(prepared.totalBytes)}
              {prepared.strippedRoot && <> · cartella radice «{prepared.strippedRoot}/» rimossa</>}
            </p>
            {showProgress && (
              <p className="font-mono text-xs tabular-nums opacity-70" role="status" aria-live="polite">
                {doneCount}/{prepared.files.length} · {formatBytes(sent)} / {formatBytes(total)} · {pct}%
              </p>
            )}
          </div>

          {showProgress && (
            <div
              role="progressbar"
              aria-label="Avanzamento complessivo"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              className="h-1 w-full bg-ks-fg/10"
              data-testid="artifact-progress"
            >
              <div className="h-full bg-ks-fg transition-[width] duration-200" style={{ width: `${pct}%` }} />
            </div>
          )}

          <ul className="max-h-64 overflow-y-auto border border-ks-hairline-active divide-y divide-ks-hairline-active" data-testid="artifact-files">
            {prepared.files.map((file, i) => {
              const s = statuses[i] ?? "pending"
              const p = file.size ? Math.round(((loaded[i] ?? 0) / file.size) * 100) : 100
              return (
                <li key={file.relPath} className="flex items-center gap-3 px-3 py-2 text-xs">
                  <span className="w-4 shrink-0" aria-hidden="true">
                    {s === "done" && <Check size={13} strokeWidth={1.5} />}
                    {s === "uploading" && <Loader2 size={13} strokeWidth={1.5} className="animate-spin" />}
                    {s === "error" && <X size={13} strokeWidth={1.5} className="text-red-700" />}
                  </span>
                  <span className="font-mono truncate flex-1" title={file.relPath}>
                    {file.relPath}
                  </span>
                  <span className="font-mono tabular-nums opacity-50 shrink-0">{formatBytes(file.size)}</span>
                  <span className="font-mono tabular-nums w-24 text-right shrink-0 opacity-70">
                    {s === "pending" && "in attesa"}
                    {s === "uploading" && `${p}%`}
                    {s === "done" && "caricato"}
                    {s === "error" && <span className="text-red-700">errore</span>}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {phase && (
        <p className="font-mono text-xs opacity-60" role="status">
          {phase}
        </p>
      )}
      {error && (
        <p role="alert" className="text-small text-red-700" data-testid="artifact-error">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-small" data-testid="artifact-success">
          {success}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={!prepared || busy}
          className="inline-flex items-center gap-2 px-4 py-2 text-small bg-ks-fg text-ks-bg hover:bg-ks-fg/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2"
        >
          {busy ? <Loader2 size={14} strokeWidth={1.5} className="animate-spin" /> : <Upload size={14} strokeWidth={1.5} />}
          {props.mode === "create" ? "Carica artefatto" : "Sostituisci file"}
        </button>
        {props.mode === "replace" && props.onDone && (
          <button
            type="button"
            onClick={props.onDone}
            disabled={busy}
            className="px-4 py-2 text-small border border-ks-hairline-active hover:bg-ks-fg/5 transition-colors disabled:opacity-40"
          >
            Annulla
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Selettore file in italiano: l'input nativo resta nel DOM (nascosto, per form
 * e test) e viene aperto da un pulsante vero, con il nome del file accanto.
 */
function FilePicker({
  id,
  inputRef,
  accept,
  disabled,
  fileName,
  onChange,
}: {
  id: string
  inputRef: React.RefObject<HTMLInputElement | null>
  accept: string
  disabled: boolean
  fileName: string | null
  onChange: (file: File | undefined) => void
}) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => onChange(e.target.files?.[0])}
      />
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        aria-describedby={`${id}-name`}
        className="shrink-0 border border-ks-hairline-active px-3 py-2 font-mono text-xs uppercase tracking-widest hover:bg-ks-fg/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2"
      >
        Scegli file
      </button>
      <span id={`${id}-name`} className={`font-mono text-xs truncate ${fileName ? "" : "opacity-50"}`} title={fileName ?? undefined}>
        {fileName ?? "Nessun file scelto"}
      </span>
    </div>
  )
}

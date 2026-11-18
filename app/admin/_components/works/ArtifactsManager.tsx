"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Dialog } from "radix-ui"
import { AlertTriangle, ArrowDown, ArrowUp, ExternalLink, RefreshCw, Trash2, X } from "lucide-react"
import { formatBytes } from "@/lib/artifacts"
import {
  deleteArtifactAction,
  moveArtifactAction,
  toggleArtifactPublishedAction,
} from "@/app/admin/_actions/artifacts"
import { ArtifactUploader } from "./ArtifactUploader"

export interface ArtifactRow {
  id: string
  titleIt: string
  aspectRatio: string
  fileCount: number
  totalBytes: number
  published: boolean
  hasPoster: boolean
}

const th = "text-left p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal"
const iconBtn = "p-1.5 hover:bg-ks-fg/10 transition-colors disabled:opacity-20 focus-visible:outline focus-visible:outline-1"

export function ArtifactsManager({ workId, artifacts }: { workId: string; artifacts: ArtifactRow[] }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [replacing, setReplacing] = useState<string | null>(null)

  function run(fn: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (!res.ok) setError(res.error)
      router.refresh()
    })
  }

  return (
    <div className="space-y-10">
      {artifacts.length > 0 && (
        <div aria-busy={isPending}>
          {error && (
            <p role="alert" className="mb-4 text-small text-red-700">
              {error}
            </p>
          )}
          <div className="border border-ks-hairline-active overflow-x-auto">
            <table className="w-full text-small" data-testid="artifacts-table">
              <thead>
                <tr className="border-b border-ks-hairline-active">
                  <th className={`${th} w-28`}>Ordine</th>
                  <th className={th}>Titolo</th>
                  <th className={th}>File</th>
                  <th className={th}>Stato</th>
                  <th className={`${th} text-right`}>Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ks-hairline-active">
                {artifacts.map((a, i) => (
                  <ArtifactTableRow
                    key={a.id}
                    a={a}
                    index={i}
                    count={artifacts.length}
                    disabled={isPending}
                    replacing={replacing === a.id}
                    onMove={(dir) => run(() => moveArtifactAction(a.id, dir))}
                    onToggle={() => run(() => toggleArtifactPublishedAction(a.id, !a.published))}
                    onReplace={() => setReplacing(replacing === a.id ? null : a.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {replacing && (
            <div className="mt-6">
              <ArtifactUploader
                key={replacing}
                mode="replace"
                workId={workId}
                artifactId={replacing}
                artifactTitle={artifacts.find((a) => a.id === replacing)?.titleIt ?? ""}
                onDone={() => setReplacing(null)}
              />
            </div>
          )}
        </div>
      )}

      <div>
        <p className="font-mono text-eyebrow uppercase tracking-widest opacity-60 mb-4">Nuovo artefatto</p>
        <ArtifactUploader mode="create" workId={workId} />
      </div>
    </div>
  )
}

function ArtifactTableRow({
  a,
  index,
  count,
  disabled,
  replacing,
  onMove,
  onToggle,
  onReplace,
}: {
  a: ArtifactRow
  index: number
  count: number
  disabled: boolean
  replacing: boolean
  onMove: (dir: "up" | "down") => void
  onToggle: () => void
  onReplace: () => void
}) {
  return (
    <tr className="hover:bg-ks-fg/3 transition-colors" data-testid={`artifact-row-${a.id}`}>
      <td className="p-4">
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs tabular-nums opacity-60 w-6">{String(index + 1).padStart(2, "0")}</span>
          <button type="button" onClick={() => onMove("up")} disabled={index === 0 || disabled} aria-label={`Sposta ${a.titleIt} in alto`} className={iconBtn}>
            <ArrowUp size={13} strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => onMove("down")} disabled={index === count - 1 || disabled} aria-label={`Sposta ${a.titleIt} in basso`} className={iconBtn}>
            <ArrowDown size={13} strokeWidth={1.5} />
          </button>
        </div>
      </td>
      <td className="p-4">
        <p className="font-medium">{a.titleIt}</p>
        <p className="font-mono text-eyebrow opacity-50 mt-0.5">
          {a.aspectRatio.replace("/", ":")}
          {a.hasPoster && " · copertina"}
        </p>
      </td>
      <td className="p-4 font-mono text-xs tabular-nums whitespace-nowrap" data-testid="artifact-meta">
        {formatBytes(a.totalBytes)} · {a.fileCount} file
      </td>
      <td className="p-4">
        <button
          type="button"
          role="switch"
          aria-checked={a.published}
          aria-label={`Pubblicato: ${a.titleIt}`}
          onClick={onToggle}
          disabled={disabled}
          className="inline-flex items-center gap-2 disabled:opacity-60"
        >
          <span className={`relative inline-block w-8 h-[18px] rounded-full border transition-colors ${a.published ? "bg-ks-fg border-ks-fg" : "bg-transparent border-ks-fg/30"}`}>
            <span className={`absolute top-[2px] w-3 h-3 rounded-full transition-all ${a.published ? "left-[16px] bg-ks-bg" : "left-[2px] bg-ks-fg/40"}`} />
          </span>
          <span className="font-mono text-xs uppercase tracking-widest" data-testid="artifact-status">
            {a.published ? "Pubblicato" : "Bozza"}
          </span>
        </button>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-1">
          <a href={`/artifacts/${a.id}`} target="_blank" rel="noopener noreferrer" className={`${iconBtn} inline-flex items-center gap-1.5 text-xs`} title="Anteprima in una nuova scheda">
            <ExternalLink size={14} strokeWidth={1.5} />
            Anteprima
          </a>
          <button type="button" onClick={onReplace} disabled={disabled} aria-pressed={replacing} className={`${iconBtn} inline-flex items-center gap-1.5 text-xs`}>
            <RefreshCw size={14} strokeWidth={1.5} />
            Sostituisci zip
          </button>
          <DeleteArtifactDialog artifact={a} />
        </div>
      </td>
    </tr>
  )
}

function DeleteArtifactDialog({ artifact }: { artifact: ArtifactRow }) {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const canDelete = confirm === artifact.titleIt

  function handleOpenChange(next: boolean) {
    if (isPending) return
    setOpen(next)
    if (!next) {
      setConfirm("")
      setError(null)
    }
  }

  function handleDelete() {
    if (!canDelete) return
    setError(null)
    startTransition(async () => {
      const res = await deleteArtifactAction(artifact.id)
      if (!res.ok) return setError(res.error)
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button className="p-1.5 hover:bg-red-50 text-red-700 transition-colors opacity-60 hover:opacity-100" title="Elimina definitivamente" aria-label={`Elimina ${artifact.titleIt}`}>
          <Trash2 size={14} strokeWidth={1.5} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-32px)] max-w-md bg-[#F5F4F0] text-[#0A0A0A] border border-ks-hairline-active p-8 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
          aria-describedby={undefined}
        >
          <Dialog.Close asChild>
            <button disabled={isPending} className="absolute top-4 right-4 p-1 opacity-40 hover:opacity-100 transition-opacity disabled:pointer-events-none" aria-label="Chiudi">
              <X size={16} strokeWidth={1.5} />
            </button>
          </Dialog.Close>
          <Dialog.Title className="font-display text-xl font-medium mb-2">Elimina artefatto</Dialog.Title>
          <p className="text-small opacity-70 mb-6">
            Stai per eliminare <span className="font-medium text-ks-fg opacity-100">{artifact.titleIt}</span>.
          </p>
          <div className="flex gap-3 bg-red-50 border border-red-200 p-4 mb-6">
            <AlertTriangle size={16} className="text-red-700 shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-small text-red-800">
              <strong>Attenzione:</strong> azione irreversibile. Vengono cancellati da Blob tutti i {artifact.fileCount} file
              ({formatBytes(artifact.totalBytes)}) e la copertina.
            </p>
          </div>
          <label className="block mb-6">
            <span className="font-mono text-eyebrow uppercase tracking-widest opacity-60 block mb-2">
              Digita <code className="opacity-100 bg-ks-fg/5 px-1 normal-case tracking-normal">{artifact.titleIt}</code> per confermare
            </span>
            <input
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleDelete()
              }}
              disabled={isPending}
              autoComplete="off"
              spellCheck={false}
              aria-label="Titolo di conferma"
              className="w-full border border-ks-hairline-active bg-transparent px-3 py-2 text-small focus:outline-none focus:border-ks-fg/40 disabled:opacity-50"
              placeholder={artifact.titleIt}
            />
          </label>
          {error && <p className="text-small text-red-700 mb-4">{error}</p>}
          <div className="flex items-center justify-end gap-3">
            <Dialog.Close asChild>
              <button disabled={isPending} className="px-4 py-2 text-small border border-ks-hairline-active hover:bg-ks-fg/5 transition-colors disabled:opacity-50">
                Annulla
              </button>
            </Dialog.Close>
            <button onClick={handleDelete} disabled={!canDelete || isPending} className="px-4 py-2 text-small bg-red-700 text-white hover:bg-red-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {isPending ? "Eliminazione…" : "Elimina definitivamente"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

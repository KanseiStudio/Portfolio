"use client"

import { useState, useTransition } from "react"
import { Dialog } from "radix-ui"
import { AlertTriangle, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { deleteWork } from "@/app/admin/_actions/works"

export function DeleteWorkDialog({ work }: { work: { id: string; slug: string; name: string } }) {
  const [open, setOpen] = useState(false)
  const [slugInput, setSlugInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const canDelete = slugInput === work.slug

  function handleOpenChange(next: boolean) {
    if (isPending) return
    setOpen(next)
    if (!next) {
      setSlugInput("")
      setError(null)
    }
  }

  function handleDelete() {
    if (!canDelete) return
    setError(null)
    startTransition(async () => {
      const result = await deleteWork(work.id)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          className="p-1.5 hover:bg-red-50 text-red-700 rounded transition-colors opacity-60 hover:opacity-100"
          title="Elimina definitivamente"
          aria-label={`Elimina ${work.name}`}
        >
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
            <button
              disabled={isPending}
              className="absolute top-4 right-4 p-1 opacity-40 hover:opacity-100 transition-opacity disabled:pointer-events-none"
              aria-label="Chiudi"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </Dialog.Close>

          <Dialog.Title className="font-display text-xl font-medium mb-2">Elimina lavoro</Dialog.Title>

          <p className="text-small opacity-70 mb-6">
            Stai per eliminare <span className="font-medium text-ks-fg opacity-100">{work.name}</span>.
          </p>

          <div className="flex gap-3 bg-red-50 border border-red-200 p-4 mb-6">
            <AlertTriangle size={16} className="text-red-700 shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-small text-red-800">
              <strong>Attenzione:</strong> questa azione è irreversibile. Verranno eliminati anche tag, stats, sezioni
              e le immagini caricate su Blob non usate altrove.
            </p>
          </div>

          <label className="block mb-6">
            <span className="font-mono text-eyebrow uppercase tracking-widest opacity-60 block mb-2">
              Digita <code className="opacity-100 bg-ks-fg/5 px-1">{work.slug}</code> per confermare
            </span>
            <input
              type="text"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleDelete()
              }}
              disabled={isPending}
              autoComplete="off"
              spellCheck={false}
              aria-label="Slug di conferma"
              className="w-full border border-ks-hairline-active bg-transparent px-3 py-2 font-mono text-small focus:outline-none focus:border-ks-fg/40 disabled:opacity-50"
              placeholder={work.slug}
            />
          </label>

          {error && <p className="text-small text-red-700 mb-4">{error}</p>}

          <div className="flex items-center justify-end gap-3">
            <Dialog.Close asChild>
              <button
                disabled={isPending}
                className="px-4 py-2 text-small border border-ks-hairline-active hover:bg-ks-fg/5 transition-colors disabled:opacity-50"
              >
                Annulla
              </button>
            </Dialog.Close>
            <button
              onClick={handleDelete}
              disabled={!canDelete || isPending}
              className="px-4 py-2 text-small bg-red-700 text-white hover:bg-red-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "Eliminazione…" : "Elimina definitivamente"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

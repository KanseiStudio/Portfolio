"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, ExternalLink, Pencil } from "lucide-react"
import { reorderWorks, togglePublished } from "@/app/admin/_actions/works"
import { DeleteWorkDialog } from "./DeleteWorkDialog"

export interface WorkRow {
  id: string
  slug: string
  name: string
  type: string
  published: boolean
  updatedAt: string
}

const th = "text-left p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal"

export function WorksTable({ works }: { works: WorkRow[] }) {
  const [rows, setRows] = useState(works)
  const [prevWorks, setPrevWorks] = useState(works)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [savingId, setSavingId] = useState<string | null>(null)
  const router = useRouter()

  // Mentre un salvataggio è in corso, lasciare la pagina chiede conferma
  useEffect(() => {
    if (!isPending) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [isPending])

  // Riallinea lo stato locale quando il server invia dati nuovi
  if (works !== prevWorks) {
    setPrevWorks(works)
    setRows(works)
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= rows.length) return
    const next = [...rows]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    const previous = rows
    setRows(next) // ottimistico
    setError(null)
    startTransition(async () => {
      const res = await reorderWorks(next.map((r) => r.id))
      if (!res.ok) {
        setRows(previous)
        setError(res.error)
      }
      router.refresh()
    })
  }

  function toggle(row: WorkRow) {
    const previous = rows
    setRows(rows.map((r) => (r.id === row.id ? { ...r, published: !r.published } : r)))
    setError(null)
    setSavingId(row.id)
    startTransition(async () => {
      try {
        const res = await togglePublished(row.id, !row.published)
        if (!res.ok) {
          setRows(previous)
          setError(res.error)
        }
        router.refresh()
      } finally {
        setSavingId(null)
      }
    })
  }

  if (rows.length === 0) {
    return (
      <p className="text-base opacity-60 py-8">
        Nessun lavoro.{" "}
        <Link href="/admin/works/new" className="underline underline-offset-4">
          Crea il primo.
        </Link>
      </p>
    )
  }

  return (
    <div aria-busy={isPending}>
      {error && (
        <p role="alert" className="mb-4 text-small text-red-700">
          {error}
        </p>
      )}
      <div className="border border-ks-hairline-active overflow-x-auto">
        <table className="w-full text-small">
          <thead>
            <tr className="border-b border-ks-hairline-active">
              <th className={`${th} w-28`}>Ordine</th>
              <th className={th}>Nome</th>
              <th className={`${th} hidden lg:table-cell`}>Tipologia</th>
              <th className={th}>Stato</th>
              <th className={`${th} hidden md:table-cell`}>Ultima modifica</th>
              <th className={`${th} text-right`}>Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ks-hairline-active">
            {rows.map((w, i) => (
              <tr key={w.id} className="hover:bg-ks-fg/3 transition-colors" data-testid={`work-row-${w.slug}`}>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs tabular-nums opacity-60 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      disabled={i === 0 || isPending}
                      aria-label={`Sposta ${w.name} in alto`}
                      className="p-1 hover:bg-ks-fg/10 transition-colors disabled:opacity-20"
                    >
                      <ArrowUp size={13} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      disabled={i === rows.length - 1 || isPending}
                      aria-label={`Sposta ${w.name} in basso`}
                      className="p-1 hover:bg-ks-fg/10 transition-colors disabled:opacity-20"
                    >
                      <ArrowDown size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <Link href={`/admin/works/${w.id}`} className="font-medium hover:underline underline-offset-4">
                    {w.name}
                  </Link>
                  <p className="font-mono text-eyebrow opacity-50 mt-0.5">{w.slug}</p>
                </td>
                <td className="p-4 opacity-70 hidden lg:table-cell">{w.type}</td>
                <td className="p-4">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={w.published}
                    aria-label={`Pubblicato: ${w.name}`}
                    onClick={() => toggle(w)}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    <span
                      className={`relative inline-block w-8 h-[18px] rounded-full border transition-colors ${
                        w.published ? "bg-ks-fg border-ks-fg" : "bg-transparent border-ks-fg/30"
                      }`}
                    >
                      <span
                        className={`absolute top-[2px] w-3 h-3 rounded-full transition-all ${
                          w.published ? "left-[16px] bg-ks-bg" : "left-[2px] bg-ks-fg/40"
                        }`}
                      />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest" data-testid="work-status">
                      {w.published ? "Pubblicato" : "Bozza"}
                    </span>
                    {savingId === w.id && (
                      <span className="font-mono text-xs opacity-60" role="status" data-testid="work-saving">
                        salvataggio…
                      </span>
                    )}
                  </button>
                </td>
                <td className="p-4 opacity-60 font-mono text-eyebrow hidden md:table-cell whitespace-nowrap">
                  {w.updatedAt}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/works/${w.id}`}
                      aria-label={`Modifica ${w.name}`}
                      className="inline-flex items-center gap-1.5 px-2 py-1.5 hover:bg-ks-fg/10 rounded transition-colors"
                    >
                      <Pencil size={14} strokeWidth={1.5} />
                      <span className="hidden xl:inline">Modifica</span>
                    </Link>
                    <a
                      href={`/it/works/${w.slug}${w.published ? "" : "?preview=1"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Vedi ${w.name} sul sito`}
                      className="inline-flex items-center gap-1.5 px-2 py-1.5 hover:bg-ks-fg/10 rounded transition-colors"
                    >
                      <ExternalLink size={14} strokeWidth={1.5} />
                      <span className="hidden xl:inline">Vedi sul sito</span>
                    </a>
                    <DeleteWorkDialog work={{ id: w.id, slug: w.slug, name: w.name }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

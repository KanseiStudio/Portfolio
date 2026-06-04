"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Pencil, RotateCcw, EyeOff, Eye } from "lucide-react"
import {
  softDeleteTechnologyAction,
  restoreTechnologyAction,
} from "@/app/admin/_actions/technologies"
import { DeleteTechnologyDialog } from "@/app/admin/_components/DeleteTechnologyDialog"

interface TechnologyRow {
  id: number
  slug: string
  name: string
  published: boolean
  mainImage: string | null
  updatedAt: Date
}

type Filter = "all" | "published" | "draft"

export function TechnologiesTable({ technologies }: { technologies: TechnologyRow[] }) {
  const [filter, setFilter]   = useState<Filter>("all")
  const [search, setSearch]   = useState("")
  const [isPending, startTransition] = useTransition()

  const filtered = technologies.filter((t) => {
    if (filter === "published" && !t.published) return false
    if (filter === "draft"     &&  t.published) return false
    if (search) {
      const q = search.toLowerCase()
      return t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)
    }
    return true
  })

  function handleSoftDelete(id: number) {
    if (!confirm("Mettere in bozza questa tecnologia?")) return
    startTransition(async () => { await softDeleteTechnologyAction(id) })
  }

  function handleRestore(id: number) {
    startTransition(async () => { await restoreTechnologyAction(id) })
  }

  return (
    <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="search"
          placeholder="Cerca per nome, slug…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-ks-hairline-active bg-transparent px-3 py-2 text-small font-body placeholder:opacity-40 focus:outline-none focus:border-ks-fg/40 w-64"
        />

        <div className="flex items-center border border-ks-hairline-active">
          {(["all", "published", "draft"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-eyebrow font-mono uppercase tracking-widest text-xs transition-colors ${
                filter === f ? "bg-ks-fg text-ks-bg" : "hover:bg-ks-fg/5"
              }`}
            >
              {f === "all" ? "Tutti" : f === "published" ? "Pubblicati" : "Bozze"}
            </button>
          ))}
        </div>

        <span className="text-small opacity-50 ml-auto">
          {filtered.length} tecnologi{filtered.length === 1 ? "a" : "e"}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-base opacity-60 py-8">
          Nessuna tecnologia trovata.{" "}
          <Link href="/admin/technologies/new" className="underline underline-offset-4">
            Crea la prima.
          </Link>
        </p>
      ) : (
        <div className="border border-ks-hairline-active">
          <table className="w-full text-small">
            <thead>
              <tr className="border-b border-ks-hairline-active">
                <th className="text-left p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal w-16">
                  Img
                </th>
                <th className="text-left p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal">
                  Nome
                </th>
                <th className="text-left p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal">
                  Stato
                </th>
                <th className="text-left p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal hidden md:table-cell">
                  Aggiornato
                </th>
                <th className="text-right p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ks-hairline-active">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-ks-fg/3 transition-colors group">

                  {/* Thumbnail */}
                  <td className="p-3">
                    {t.mainImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.mainImage}
                        alt=""
                        className="w-12 h-8 object-cover border border-ks-hairline-active"
                      />
                    ) : (
                      <div className="w-12 h-8 bg-ks-fg/5 border border-ks-hairline-active" />
                    )}
                  </td>

                  {/* Name + slug */}
                  <td className="p-4">
                    <p className="font-medium">{t.name}</p>
                    <p className="font-mono text-eyebrow opacity-50 mt-0.5">{t.slug}</p>
                  </td>

                  {/* Published */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 text-eyebrow font-mono uppercase tracking-widest text-xs ${
                      t.published ? "opacity-70" : "opacity-40"
                    }`}>
                      {t.published
                        ? <Eye size={12} strokeWidth={1.5} />
                        : <EyeOff size={12} strokeWidth={1.5} />}
                      {t.published ? "Pubblicata" : "Bozza"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="p-4 opacity-60 font-mono text-eyebrow hidden md:table-cell">
                    {t.updatedAt.toLocaleDateString("it-IT")}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/technologies/${t.id}/edit`}
                        className="p-1.5 hover:bg-ks-fg/10 rounded transition-colors"
                        title="Modifica"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </Link>

                      {t.published ? (
                        <button
                          onClick={() => handleSoftDelete(t.id)}
                          className="p-1.5 hover:bg-ks-fg/10 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Metti in bozza"
                        >
                          <EyeOff size={14} strokeWidth={1.5} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(t.id)}
                          className="p-1.5 hover:bg-ks-fg/10 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Ripubblica"
                        >
                          <RotateCcw size={14} strokeWidth={1.5} />
                        </button>
                      )}

                      <DeleteTechnologyDialog
                        technology={{ id: t.id, slug: t.slug, name: t.name }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

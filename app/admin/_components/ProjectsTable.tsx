"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Pencil, Trash2, RotateCcw, EyeOff, Eye } from "lucide-react"
import {
  softDeleteProjectAction,
  hardDeleteProjectAction,
  restoreProjectAction,
} from "@/app/admin/_actions/projects"

interface ProjectRow {
  id: number
  slug: string
  client: string
  year: number
  published: boolean
  title: string
  categories: string[]
  updatedAt: Date
}

interface ProjectsTableProps {
  projects: ProjectRow[]
}

type Filter = "all" | "published" | "draft"

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()

  const filtered = projects.filter((p) => {
    if (filter === "published" && !p.published) return false
    if (filter === "draft" && p.published) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      )
    }
    return true
  })

  function handleSoftDelete(id: number) {
    if (!confirm("Mettere in bozza questo progetto?")) return
    startTransition(async () => { await softDeleteProjectAction(id) })
  }

  function handleRestore(id: number) {
    startTransition(async () => { await restoreProjectAction(id) })
  }

  function handleHardDelete(id: number) {
    if (!confirm("Eliminare definitivamente questo progetto? L'azione è irreversibile.")) return
    startTransition(async () => { await hardDeleteProjectAction(id) })
  }

  return (
    <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="search"
          placeholder="Cerca per titolo, cliente, slug…"
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
          {filtered.length} progett{filtered.length === 1 ? "o" : "i"}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-base opacity-60 py-8">
          Nessun progetto trovato.{" "}
          <Link href="/admin/projects/new" className="underline underline-offset-4">
            Crea il primo.
          </Link>
        </p>
      ) : (
        <div className="border border-ks-hairline-active">
          <table className="w-full text-small">
            <thead>
              <tr className="border-b border-ks-hairline-active">
                <th className="text-left p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal">
                  Titolo
                </th>
                <th className="text-left p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal hidden md:table-cell">
                  Cliente
                </th>
                <th className="text-left p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal hidden lg:table-cell">
                  Anno
                </th>
                <th className="text-left p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal">
                  Stato
                </th>
                <th className="text-right p-4 font-mono text-eyebrow uppercase tracking-widest opacity-60 font-normal">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ks-hairline-active">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-ks-fg/3 transition-colors group">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="font-mono text-eyebrow opacity-50 mt-0.5">{p.slug}</p>
                    </div>
                  </td>
                  <td className="p-4 opacity-70 hidden md:table-cell">{p.client}</td>
                  <td className="p-4 opacity-70 font-mono hidden lg:table-cell">{p.year}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-eyebrow font-mono uppercase tracking-widest text-xs ${
                        p.published ? "opacity-70" : "opacity-40"
                      }`}
                    >
                      {p.published ? (
                        <Eye size={12} strokeWidth={1.5} />
                      ) : (
                        <EyeOff size={12} strokeWidth={1.5} />
                      )}
                      {p.published ? "Pubblicato" : "Bozza"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="p-1.5 hover:bg-ks-fg/10 rounded transition-colors"
                        title="Modifica"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </Link>

                      {p.published ? (
                        <button
                          onClick={() => handleSoftDelete(p.id)}
                          className="p-1.5 hover:bg-ks-fg/10 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Metti in bozza"
                        >
                          <EyeOff size={14} strokeWidth={1.5} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(p.id)}
                          className="p-1.5 hover:bg-ks-fg/10 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Ripubblica"
                        >
                          <RotateCcw size={14} strokeWidth={1.5} />
                        </button>
                      )}

                      <button
                        onClick={() => handleHardDelete(p.id)}
                        className="p-1.5 hover:bg-red-50 text-red-700 rounded transition-colors opacity-0 group-hover:opacity-60 hover:!opacity-100"
                        title="Elimina definitivamente"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
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

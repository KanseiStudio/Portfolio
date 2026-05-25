"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Pencil, Save, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  createContactChannelAction,
  updateContactChannelAction,
  deleteContactChannelAction,
} from "@/app/admin/_actions/contact"

interface Channel {
  id: number
  platform: string
  iconName: string
  handle: string
  url: string | null
  enabled: boolean
  sortOrder: number
  labels: { it: string; en: string }
}

const AVAILABLE_ICONS = [
  "Mail",
  "Linkedin",
  "Instagram",
  "Github",
  "Twitter",
  "Youtube",
  "NotebookPen",
  "Globe",
  "Send",
  "MessageCircle",
  "Phone",
  "Link",
  "Link2",
  "Camera",
  "Code2",
]

export function ContactChannelsManager({ channels }: { channels: Channel[] }) {
  const router = useRouter()
  const [showNew, setShowNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-small text-red-900">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-small opacity-60">
          {channels.length} canali totali,{" "}
          {channels.filter((c) => c.enabled).length} attivi
        </p>
        {!showNew && (
          <button
            onClick={() => {
              setShowNew(true)
              setEditingId(null)
            }}
            className="inline-flex items-center gap-2 border border-ks-fg bg-ks-fg text-ks-bg px-3 py-2 text-small font-medium hover:bg-ks-bg hover:text-ks-fg transition-colors"
          >
            <Plus size={14} strokeWidth={1.5} />
            Nuovo canale
          </button>
        )}
      </div>

      {showNew && (
        <ChannelForm
          mode="create"
          onCancel={() => setShowNew(false)}
          onSuccess={() => {
            setShowNew(false)
            setError(null)
            router.refresh()
          }}
          onError={setError}
        />
      )}

      <div className="border border-ks-hairline-active divide-y divide-ks-hairline-active">
        {channels.length === 0 ? (
          <p className="p-8 text-center text-small opacity-60">
            Nessun canale di contatto. Aggiungine uno.
          </p>
        ) : (
          channels.map((ch) => (
            <div key={ch.id} className="p-4">
              {editingId === ch.id ? (
                <ChannelForm
                  mode="edit"
                  channelId={ch.id}
                  initial={ch}
                  onCancel={() => setEditingId(null)}
                  onSuccess={() => {
                    setEditingId(null)
                    setError(null)
                    router.refresh()
                  }}
                  onError={setError}
                />
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-small font-medium">
                        {ch.labels.it}{" "}
                        <span className="opacity-60">/ {ch.labels.en}</span>
                      </p>
                      {!ch.enabled && (
                        <span className="text-eyebrow font-mono uppercase tracking-widest opacity-60 px-2 py-0.5 border border-ks-hairline-active">
                          Disabilitato
                        </span>
                      )}
                    </div>
                    <p className="text-small opacity-70 mt-1">{ch.handle}</p>
                    <p className="text-eyebrow font-mono uppercase tracking-widest opacity-50 mt-1">
                      icon: {ch.iconName} · platform: {ch.platform} · sort:{" "}
                      {ch.sortOrder}
                      {ch.url && (
                        <>
                          {" "}
                          ·{" "}
                          <a
                            href={ch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline inline-flex items-center gap-1"
                          >
                            URL{" "}
                            <ExternalLink
                              size={9}
                              strokeWidth={1.5}
                              className="inline"
                            />
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-4 shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(ch.id)
                        setShowNew(false)
                      }}
                      className="inline-flex items-center gap-1 text-small font-medium hover:underline underline-offset-4 opacity-70 hover:opacity-100"
                    >
                      <Pencil size={12} strokeWidth={1.5} />
                      Modifica
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          !window.confirm(
                            `Eliminare il canale "${ch.labels.it}"?`
                          )
                        )
                          return
                        const result = await deleteContactChannelAction(ch.id)
                        if (result.ok) {
                          setError(null)
                          router.refresh()
                        } else {
                          setError(result.error ?? "Errore")
                        }
                      }}
                      className="inline-flex items-center gap-1 text-small text-red-700 hover:underline underline-offset-4"
                    >
                      <Trash2 size={12} strokeWidth={1.5} />
                      Elimina
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ChannelForm({
  mode,
  channelId,
  initial,
  onCancel,
  onSuccess,
  onError,
}: {
  mode: "create" | "edit"
  channelId?: number
  initial?: Channel
  onCancel: () => void
  onSuccess: () => void
  onError: (msg: string) => void
}) {
  const [platform, setPlatform] = useState(initial?.platform ?? "")
  const [iconName, setIconName] = useState(initial?.iconName ?? "Mail")
  const [handle, setHandle] = useState(initial?.handle ?? "")
  const [url, setUrl] = useState(initial?.url ?? "")
  const [enabled, setEnabled] = useState(initial?.enabled ?? true)
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0)
  const [labelIt, setLabelIt] = useState(initial?.labels.it ?? "")
  const [labelEn, setLabelEn] = useState(initial?.labels.en ?? "")
  const [pending, setPending] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)
    setPending(true)

    const data = {
      platform,
      iconName,
      handle,
      url: url || null,
      enabled,
      sortOrder,
      labels: { it: labelIt, en: labelEn },
    }

    const result =
      mode === "create"
        ? await createContactChannelAction(data)
        : await updateContactChannelAction(channelId!, data)

    setPending(false)
    if (result.ok) {
      onSuccess()
    } else {
      const msg = result.error ?? "Errore"
      setLocalError(msg)
      onError(msg)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 border border-ks-hairline-active p-4 bg-ks-fg/[0.02]"
    >
      {localError && (
        <p className="text-small text-red-700">{localError}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Platform (slug)</label>
          <input
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="es. email, linkedin, twitter"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Icon (Lucide)</label>
          <select
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            className={inputCls}
          >
            {AVAILABLE_ICONS.map((ic) => (
              <option key={ic} value={ic}>
                {ic}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Label IT</label>
          <input
            type="text"
            value={labelIt}
            onChange={(e) => setLabelIt(e.target.value)}
            placeholder="es. LinkedIn"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Label EN</label>
          <input
            type="text"
            value={labelEn}
            onChange={(e) => setLabelEn(e.target.value)}
            placeholder="es. LinkedIn"
            required
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Handle (testo visibile)</label>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="es. @kansei.studio o hello@kansei-studio.art"
          required
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>
          URL (opzionale — lascia vuoto per non rendere cliccabile)
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="es. https://www.instagram.com/kansei.studio o mailto:hello@..."
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <label className={labelCls}>Sort order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            className={inputCls}
          />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <input
            type="checkbox"
            id={`enabled-${channelId ?? "new"}`}
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4 h-4"
          />
          <label
            htmlFor={`enabled-${channelId ?? "new"}`}
            className="text-small cursor-pointer"
          >
            Visibile sul sito pubblico
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-ks-hairline-active">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className={cn(
            "inline-flex items-center gap-1 text-small font-medium opacity-60 hover:opacity-100 hover:underline underline-offset-4 disabled:opacity-30"
          )}
        >
          <X size={12} strokeWidth={1.5} />
          Annulla
        </button>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 border border-ks-fg bg-ks-fg text-ks-bg px-3 py-1.5 text-small font-medium hover:bg-ks-bg hover:text-ks-fg transition-colors disabled:opacity-50"
        >
          <Save size={12} strokeWidth={1.5} />
          {pending ? "Salvataggio…" : "Salva"}
        </button>
      </div>
    </form>
  )
}

const labelCls =
  "block text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-1"

const inputCls =
  "w-full border border-ks-hairline-active px-3 py-2 bg-ks-bg text-small focus:outline-none focus:border-ks-fg/40 transition-colors"

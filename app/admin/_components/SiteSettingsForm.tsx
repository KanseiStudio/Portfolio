"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateSiteSettingsAction } from "@/app/admin/_actions/settings"
import { Save, AlertCircle, CheckCircle, Music } from "lucide-react"
import { cn } from "@/lib/utils"

const schema = z.object({
  musicUrl: z.string().max(500).optional(),
  musicEnabled: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface Props {
  initialData: {
    musicUrl: string | null
    musicEnabled: boolean
  }
}

export function SiteSettingsForm({ initialData }: Props) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg]   = useState<string | null>(null)
  const [isPending, setIsPending]     = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      musicUrl:     initialData.musicUrl ?? "",
      musicEnabled: initialData.musicEnabled,
    },
  })

  const musicEnabled = watch("musicEnabled")

  async function onSubmit(data: FormData) {
    setServerError(null)
    setSuccessMsg(null)
    setIsPending(true)

    try {
      const result = await updateSiteSettingsAction({
        musicUrl:     data.musicUrl?.trim() || null,
        musicEnabled: data.musicEnabled,
      })
      if (result.ok) {
        setSuccessMsg("Impostazioni salvate")
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

      {/* musicUrl */}
      <div>
        <label className="block text-small font-medium mb-2">
          URL file audio (mp3 / ogg / wav)
        </label>
        <input
          type="url"
          placeholder="https://example.com/ambient.mp3"
          {...register("musicUrl")}
          className="w-full border border-ks-hairline-active px-3 py-2 bg-ks-bg text-ks-fg text-small focus:outline-none focus:border-ks-fg/40 transition-colors"
        />
        {errors.musicUrl && (
          <p className="text-small text-red-700 mt-2">{errors.musicUrl.message}</p>
        )}
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mt-2">
          URL diretto al file audio. Lascia vuoto per rimuovere.
        </p>
      </div>

      {/* musicEnabled toggle */}
      <div className="flex items-center justify-between border border-ks-hairline-active p-4">
        <div>
          <p className="text-small font-medium">Abilita audio</p>
          <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mt-1">
            Il toggle SND apparirà nel frame del sito. La riproduzione richiede sempre il click dell&apos;utente.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={musicEnabled}
          onClick={() => setValue("musicEnabled", !musicEnabled, { shouldDirty: true })}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none",
            musicEnabled ? "bg-ks-fg" : "bg-ks-fg/20"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-ks-bg shadow-lg ring-0 transition-transform duration-300",
              musicEnabled ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* Preview note */}
      {musicEnabled && (
        <div className="flex items-start gap-3 border border-ks-hairline-active p-4 opacity-70">
          <Music size={16} strokeWidth={1.5} className="shrink-0 mt-0.5" />
          <p className="text-small">
            Il toggle <span className="font-mono">SND ON/OFF</span> comparirà nella barra inferiore del sito (solo desktop). La musica parte al click dell&apos;utente, mai in automatico.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 border border-ks-fg bg-ks-fg text-ks-bg px-4 py-2 text-small font-medium hover:bg-ks-bg hover:text-ks-fg transition-colors duration-300 disabled:opacity-50"
        >
          <Save size={14} strokeWidth={1.5} />
          {isPending ? "Salvataggio…" : "Salva impostazioni"}
        </button>
      </div>
    </form>
  )
}

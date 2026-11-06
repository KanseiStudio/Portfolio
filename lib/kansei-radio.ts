"use client"

/**
 * Kansei Radio — motore di riproduzione sincronizzata.
 *
 * Legge playlist.json da radio.kansei-studio.art e, dall'ora attuale, calcola
 * quale brano è in onda e da che secondo: tutti gli ascoltatori sentono la
 * stessa cosa nello stesso momento. Nessun server di streaming.
 *
 * L'elemento audio è creato al primo play. Usare l'hook UNA sola volta (in InstrumentFrame, che vive nel layout
 * [locale] e non viene rimontato al cambio pagina) e passare lo stato ai
 * pulsanti, così l'audio non si interrompe navigando.
 *
 * Coordinamento con BackgroundMusic (SND): quando la radio parte emette
 * RADIO_PLAY_EVENT; quando parte SND emette SND_PLAY_EVENT e la radio si ferma.
 */

import { useCallback, useEffect, useRef, useState } from "react"

export const RADIO_BASE        = "https://radio.kansei-studio.art"
export const RADIO_PLAY_EVENT  = "ks:radio-play"
export const SND_PLAY_EVENT    = "ks:snd-play"

const TARGET_VOL = 0.6

type Track    = { file: string; title: string; artist?: string; info?: string; duration: number }
type Playlist = { name: string; epoch: string; tracks: Track[] }

/** Rifiuta se la promessa non si risolve entro ms (evita attese infinite). */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("timeout")), ms)
    p.then((v) => { clearTimeout(id); resolve(v) }, (e) => { clearTimeout(id); reject(e) })
  })
}

/** Dall'ora attuale ricava indice del brano e secondo di partenza. */
function whereAreWe(p: Playlist) {
  const total   = p.tracks.reduce((s, t) => s + t.duration, 0)
  const epochMs = Date.parse(p.epoch)
  let t = ((((Date.now() - epochMs) / 1000) % total) + total) % total
  for (let i = 0; i < p.tracks.length; i++) {
    if (t < p.tracks[i].duration) return { index: i, offset: t }
    t -= p.tracks[i].duration
  }
  return { index: 0, offset: 0 }
}

export type KanseiRadio = {
  playing: boolean
  loading: boolean
  error:   boolean
  title:   string | null
  toggle:  () => void
}

export function useKanseiRadio(): KanseiRadio {
  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const playlistRef = useRef<Playlist | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(false)
  const [title,   setTitle]   = useState<string | null>(null)
  const onEndedRef = useRef<() => void>(() => {})

  /** Un solo elemento audio, creato al primo play (niente <audio> nel DOM). */
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio()
      a.preload = "auto"
      a.addEventListener("ended", () => onEndedRef.current())
      audioRef.current = a
    }
    return audioRef.current
  }, [])

  const loadPlaylist = useCallback(async () => {
    const r = await fetch(`${RADIO_BASE}/playlist.json`, { cache: "no-cache" })
    if (!r.ok) throw new Error("playlist")
    const p = (await r.json()) as Playlist
    if (!p.tracks?.length) throw new Error("playlist vuota")
    playlistRef.current = p
    return p
  }, [])

  /**
   * Carica il brano in onda nel punto giusto e lo fa partire.
   * play() viene chiamato subito (dentro il gesto dell'utente, richiesto da
   * Safari/iOS); il punto di partenza è passato come media fragment (#t=)
   * e corretto appena arrivano i metadati.
   */
  const tuneIn = useCallback(async () => {
    const audio = getAudio()
    const p = playlistRef.current ?? (await withTimeout(loadPlaylist(), 10_000))
    const { index, offset } = whereAreWe(p)
    const tr = p.tracks[index]
    setTitle(tr.title)
    const startedAt = Date.now()
    const seek = () => {
      const target = offset + (Date.now() - startedAt) / 1000
      if (Math.abs(audio.currentTime - target) > 1.5) audio.currentTime = target
    }
    audio.addEventListener("loadedmetadata", seek, { once: true })
    audio.src = `${RADIO_BASE}/${tr.file}#t=${offset.toFixed(1)}`
    audio.volume = TARGET_VOL
    await withTimeout(audio.play(), 20_000)
  }, [loadPlaylist, getAudio])

  const stop = useCallback(() => {
    audioRef.current?.pause()
    setPlaying(false)
  }, [])

  // Titolo in onda già visibile prima del play (tooltip / aria)
  useEffect(() => {
    loadPlaylist()
      .then((p) => setTitle(p.tracks[whereAreWe(p).index].title))
      .catch(() => setError(true))
  }, [loadPlaylist])

  // Fine brano → si riallinea alla diretta (ricarica la playlist: può essere cambiata)
  useEffect(() => {
    onEndedRef.current = async () => {
      playlistRef.current = null
      try { await tuneIn() } catch { setPlaying(false); setError(true) }
    }
  }, [tuneIn])

  // Smontaggio (non avviene navigando, solo uscendo dal layout pubblico)
  useEffect(() => () => {
    audioRef.current?.pause()
    audioRef.current = null
  }, [])

  // Se parte la musica di sottofondo (SND), la radio si ferma
  useEffect(() => {
    window.addEventListener(SND_PLAY_EVENT, stop)
    return () => window.removeEventListener(SND_PLAY_EVENT, stop)
  }, [stop])

  const toggle = useCallback(async () => {
    if (playing) return stop()
    setLoading(true)
    try {
      window.dispatchEvent(new Event(RADIO_PLAY_EVENT))
      await tuneIn() // ogni play si riallinea alla diretta
      setPlaying(true)
      setError(false)
    } catch (e) {
      console.warn("[Kansei Radio] avvio non riuscito:", e)
      audioRef.current?.pause()
      setError(true)
      setPlaying(false)
    } finally {
      setLoading(false)
    }
  }, [playing, stop, tuneIn])

  return { playing, loading, error, title, toggle }
}

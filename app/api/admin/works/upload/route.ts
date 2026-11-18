import { NextResponse } from "next/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { hasBlobToken } from "@/lib/blob"
import { isAdminSession } from "@/lib/session"
import {
  WORK_BLOB_PATHNAME_RE,
  WORK_IMAGE_MAX_BYTES,
  WORK_IMAGE_TYPES,
} from "@/lib/validations/work"
import {
  ARTIFACT_FILE_PATHNAME_RE,
  ARTIFACT_MAX_TOTAL_BYTES,
  ARTIFACT_POSTER_MAX_BYTES,
  ARTIFACT_POSTER_PATHNAME_RE,
  ARTIFACT_POSTER_TYPES,
  artifactContentType,
} from "@/lib/artifacts"

/**
 * Client upload delle immagini Works su Vercel Blob.
 *
 * Il browser chiede qui un token temporaneo e poi carica il file DIRETTAMENTE
 * su Blob: il file non passa dalle Vercel Functions (limite body 4,5 MB).
 * `BLOB_READ_WRITE_TOKEN` resta solo sul server; al client arriva soltanto
 * il token temporaneo, limitato a tipo, dimensione e pathname.
 *
 * Due famiglie di pathname, con regole separate:
 * - `works/<slug>/<file>.<ext>`: immagini Works (JPG/PNG/WebP/AVIF, 20 MB, suffisso casuale);
 * - `artifacts/<root>/<uploadId>/<relpath>` e `artifacts/<root>/<uploadId>-poster.<ext>`:
 *   file degli artefatti interattivi. Content type = SOLO quello dell'estensione del pathname
 *   (whitelist in lib/artifacts.ts), nessun suffisso casuale perché i percorsi relativi
 *   dell'HTML devono restare identici, sovrascrittura ammessa.
 *
 * Non usiamo `onUploadCompleted`: l'URL viene salvato dal form dell'editor,
 * e la pulizia dei blob orfani resta nelle Server Actions di salvataggio ed eliminazione.
 */

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export async function POST(request: Request) {
  // Fuori dall'auth del proxy (il matcher esclude /api): verifica qui, senza redirect
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }
  if (!hasBlobToken()) {
    return NextResponse.json({ error: "Upload non configurato: manca BLOB_READ_WRITE_TOKEN" }, { status: 500 })
  }

  let body: HandleUploadBody
  try {
    body = (await request.json()) as HandleUploadBody
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 })
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Difesa in profondità: la sessione può scadere tra le due richieste
        if (!(await isAdminSession())) throw new HttpError(401, "Non autorizzato")
        if (pathname.startsWith("artifacts/")) return artifactTokenOptions(pathname)
        // Il pathname lo sceglie il client: accettiamo solo works/<slug>/<nome-file>.<ext>
        if (!WORK_BLOB_PATHNAME_RE.test(pathname)) {
          throw new HttpError(400, "Percorso di upload non valido")
        }
        return {
          allowedContentTypes: [...WORK_IMAGE_TYPES],
          maximumSizeInBytes: WORK_IMAGE_MAX_BYTES,
          addRandomSuffix: true,
        }
      },
    })
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof HttpError) return NextResponse.json({ error: err.message }, { status: err.status })
    console.error("[blob] handleUpload fallito", err)
    return NextResponse.json({ error: "Upload non riuscito" }, { status: 400 })
  }
}

/** Opzioni del token per i file degli artefatti (vedi commento in testa) */
function artifactTokenOptions(pathname: string) {
  if (ARTIFACT_POSTER_PATHNAME_RE.test(pathname)) {
    const ext = pathname.slice(pathname.lastIndexOf(".") + 1)
    const type = Object.entries(ARTIFACT_POSTER_TYPES).find(([, e]) => e === ext)?.[0]
    if (!type) throw new HttpError(400, "Percorso di upload non valido")
    return {
      allowedContentTypes: [type],
      maximumSizeInBytes: ARTIFACT_POSTER_MAX_BYTES,
      addRandomSuffix: false,
      allowOverwrite: true,
    }
  }
  const type = artifactContentType(pathname)
  if (!ARTIFACT_FILE_PATHNAME_RE.test(pathname) || !type) throw new HttpError(400, "Percorso di upload non valido")
  return {
    allowedContentTypes: [type],
    maximumSizeInBytes: ARTIFACT_MAX_TOTAL_BYTES,
    addRandomSuffix: false,
    allowOverwrite: true,
  }
}

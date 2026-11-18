import { NextResponse } from "next/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { hasBlobToken } from "@/lib/blob"
import { isAdminSession } from "@/lib/session"
import {
  WORK_BLOB_PATHNAME_RE,
  WORK_IMAGE_MAX_BYTES,
  WORK_IMAGE_TYPES,
} from "@/lib/validations/work"

/**
 * Client upload delle immagini Works su Vercel Blob.
 *
 * Il browser chiede qui un token temporaneo e poi carica il file DIRETTAMENTE
 * su Blob: il file non passa dalle Vercel Functions (limite body 4,5 MB).
 * `BLOB_READ_WRITE_TOKEN` resta solo sul server; al client arriva soltanto
 * il token temporaneo, limitato a tipo, dimensione e pathname.
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

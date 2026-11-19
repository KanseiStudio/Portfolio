import { randomBytes } from "node:crypto"
import { expect, test, type APIRequestContext, type Page } from "@playwright/test"
import { del, list } from "@vercel/blob"
import { getBlobPublicBaseUrl } from "../../lib/blob-base-url"
import { TEST_SLUG_PREFIX, loginAsAdmin, testDb } from "./helpers"

/**
 * Artefatti interattivi: upload admin → Blob reale → /artifacts/<id> → embed pubblico.
 *
 * Vincoli:
 * - store Blob reale, tutti i file sotto artifacts/e2e-<runId>/ (il lavoro di test ha slug
 *   e2e-test-<runId>, e artifactRootFor() lo mappa su e2e-<runId>): la <base> punta a Blob,
 *   quindi Range/206 e CORS sono verificati sulla CDN vera;
 * - il lavoro di test resta SEMPRE in bozza e viene cancellato in afterAll, come i suoi blob,
 *   anche se un test fallisce; all'avvio si eliminano i residui e2e-* più vecchi di 24 h;
 * - non si tocca nessun altro lavoro né il modello Project (Mico).
 */

const sql = testDb()
const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
const DAY_MS = 24 * 60 * 60 * 1000
const BLOB_BASE = getBlobPublicBaseUrl()
/** <base> attesa: URL assoluto Blob (gli asset non passano più dal rewrite /artifact-files/) */
const baseHref = (prefix: string) => `${BLOB_BASE}/artifacts/${prefix}/`
const UPLOAD = "/api/admin/works/upload"

const runId = `${Date.now().toString(36)}${randomBytes(3).toString("hex")}`
const SLUG = `${TEST_SLUG_PREFIX}${runId}`
const WORK_ID = `e2etest${runId}`
const BLOB_ROOT = `artifacts/e2e-${runId}/`
const TITLE = `E2E artefatto ${runId}`

const FIXTURE = "tests/fixtures/artifact-min.zip"
const FIXTURE_V2 = "tests/fixtures/artifact-min-v2.zip"
const FIXTURE_NO_INDEX = "tests/fixtures/artifact-no-index.zip"

// ─── Helper Blob / DB ──────────────────────────────────────────────────────

async function listAll(prefix: string) {
  const out: { url: string; pathname: string; uploadedAt: Date }[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix, cursor, limit: 1000 })
    out.push(...page.blobs)
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return out
}

async function deletePrefix(prefix: string) {
  const blobs = await listAll(prefix)
  for (let i = 0; i < blobs.length; i += 500) await del(blobs.slice(i, i + 500).map((b) => b.url))
  return blobs.length
}

/** Residui di run interrotti: cartelle artifacts/e2e-* il cui file più recente ha più di 24 h */
async function sweepStaleE2eBlobs() {
  const blobs = await listAll("artifacts/e2e-")
  const newest = new Map<string, number>()
  for (const b of blobs) {
    const root = b.pathname.split("/")[1]
    newest.set(root, Math.max(newest.get(root) ?? 0, new Date(b.uploadedAt).getTime()))
  }
  const stale = [...newest].filter(([, t]) => Date.now() - t > DAY_MS).map(([root]) => root)
  for (const root of stale) await deletePrefix(`artifacts/${root}/`)
  if (stale.length) console.log(`[artifacts.spec] residui eliminati: ${stale.join(", ")}`)
}

async function artifactRows() {
  return (await sql`
    select id, blob_prefix, previous_blob_prefix, file_count, total_bytes, published, title_it
    from work_artifacts where work_id = ${WORK_ID} order by position
  `) as {
    id: string
    blob_prefix: string
    previous_blob_prefix: string | null
    file_count: number
    total_bytes: number
    published: boolean
    title_it: string
  }[]
}

async function pathsUnder(prefix: string) {
  return (await listAll(`artifacts/${prefix}/`)).map((b) => b.pathname.slice(`artifacts/${prefix}/`.length)).sort()
}

// ─── Helper UI ─────────────────────────────────────────────────────────────

async function openAdminWork(page: Page) {
  await page.goto(`/admin/works/${WORK_ID}`)
  await expect(page.getByTestId("artifacts-section")).toBeVisible()
}

async function chooseZip(page: Page, scope: "create" | "replace", file: string) {
  const up = page.getByTestId(`artifact-uploader-${scope}`)
  await up.locator('input[type="file"]').first().setInputFiles(file)
  return up
}

async function setArtifactPublished(page: Page, want: boolean) {
  const sw = page.getByRole("switch", { name: `Pubblicato: ${TITLE}` })
  if ((await sw.getAttribute("aria-checked")) !== String(want)) await sw.click()
  await expect(sw).toHaveAttribute("aria-checked", String(want))
  await expect.poll(async () => (await artifactRows())[0]?.published).toBe(want)
}

async function anonStatus(request: APIRequestContext, path: string) {
  return (await request.get(path, { maxRedirects: 0 })).status()
}

// ─── Setup / teardown ──────────────────────────────────────────────────────

test.describe.serial("artefatti interattivi", () => {
  test.skip(!hasToken, "BLOB_READ_WRITE_TOKEN mancante in .env.local")

  let page: Page

  test.beforeAll(async ({ browser }) => {
    await sweepStaleE2eBlobs()
    // Lavori di test rimasti da run interrotti (> 24 h): il cascade elimina anche i loro artefatti
    await sql`delete from works where slug like ${TEST_SLUG_PREFIX + "%"} and created_at < now() - interval '24 hours'`

    // Lavoro di test minimo, SEMPRE in bozza (published = false)
    await sql`
      insert into works (id, slug, name, published, type_it, type_en, status_it, status_en,
        tagline_it, tagline_en, intro_it, intro_en, hero_image, hero_alt_it, hero_alt_en, updated_at)
      values (${WORK_ID}, ${SLUG}, ${"E2E " + runId}, false, 'Test', 'Test', 'Test', 'Test',
        'Tagline di prova.', 'Test tagline.', 'Intro di prova.', 'Test intro.',
        '/works/kbox/hero.jpg', 'Alt', 'Alt', now())
    `
    page = await browser.newPage()
    await loginAsAdmin(page)
  })

  test.afterAll(async () => {
    await page?.close()
    await sql`delete from works where id = ${WORK_ID}` // cascade → work_artifacts
    const n = await deletePrefix(BLOB_ROOT)
    console.log(`[artifacts.spec] pulizia: lavoro ${SLUG} eliminato, ${n} blob cancellati sotto ${BLOB_ROOT}`)
  })

  // ─── Upload: autorizzazione ───────────────────────────────────────────────

  test("senza sessione il token di upload per artifacts/ risponde 401", async ({ request }) => {
    const res = await request.post(UPLOAD, {
      data: {
        type: "blob.generate-client-token",
        payload: { pathname: `${BLOB_ROOT}${"0".repeat(20)}/index.html`, clientPayload: null, multipart: false },
      },
    })
    expect(res.status()).toBe(401)
  })

  test("con sessione, un pathname artifacts/ non valido viene rifiutato", async () => {
    for (const pathname of [
      `${BLOB_ROOT}${"0".repeat(20)}/../escape.html`,
      `${BLOB_ROOT}${"0".repeat(20)}/malware.exe`,
      `artifacts/not-a-root!/x/index.html`,
    ]) {
      const res = await page.request.post(UPLOAD, {
        data: { type: "blob.generate-client-token", payload: { pathname, clientPayload: null, multipart: false } },
      })
      expect(res.status(), pathname).toBe(400)
    }
  })

  // ─── Upload: validazione zip ──────────────────────────────────────────────

  test("zip senza index.html → errore chiaro e nessun record", async () => {
    await openAdminWork(page)
    const up = await chooseZip(page, "create", FIXTURE_NO_INDEX)
    await expect(up.getByTestId("artifact-error")).toContainText("Manca index.html alla radice dello zip")
    await expect(up.getByRole("button", { name: "Carica artefatto" })).toBeDisabled()
    expect(await artifactRows()).toHaveLength(0)
    expect(await listAll(BLOB_ROOT)).toHaveLength(0)
  })

  // ─── Upload riuscito ──────────────────────────────────────────────────────

  test("upload: cartella radice rimossa, record creato in bozza, file sotto artifacts/e2e-<runId>/", async () => {
    await openAdminWork(page)
    const up = await chooseZip(page, "create", FIXTURE)
    await expect(up.getByTestId("artifact-summary")).toContainText("3 file")
    await expect(up.getByTestId("artifact-summary")).toContainText("cartella radice «wrapper/» rimossa")
    await expect(up.getByTestId("artifact-files")).not.toContainText("__MACOSX")
    await expect(up.getByTestId("artifact-files")).not.toContainText(".DS_Store")

    await up.getByLabel("Titolo IT").fill(TITLE)
    await up.getByLabel("Didascalia IT").fill("Didascalia di prova.")
    await up.getByLabel("Didascalia EN").fill("Test caption.")
    await up.getByRole("button", { name: "Carica artefatto" }).click()
    await expect(up.getByTestId("artifact-success")).toBeVisible({ timeout: 60_000 })

    const [row] = await artifactRows()
    expect(row).toMatchObject({ file_count: 3, published: false, title_it: TITLE, previous_blob_prefix: null })
    expect(row.blob_prefix).toMatch(new RegExp(`^e2e-${runId}/[a-f0-9]{20}$`))
    // Niente "wrapper/" nei pathname: la radice unica è stata rimossa
    expect(await pathsUnder(row.blob_prefix)).toEqual(["img/a.png", "index.html", "video/clip.mp4"])

    await expect(page.getByTestId(`artifact-row-${row.id}`).getByTestId("artifact-meta")).toContainText("3 file")
  })

  test("/artifacts/<id>: bozza → 404 da anonimo, 200 text/html con <base> per l'admin", async ({ request }) => {
    const [row] = await artifactRows()
    expect(await anonStatus(request, `/artifacts/${row.id}`)).toBe(404)

    const res = await page.request.get(`/artifacts/${row.id}`)
    expect(res.status()).toBe(200)
    const h = res.headers()
    expect(h["content-type"]).toBe("text/html; charset=utf-8")
    expect(h["content-security-policy"]).toBe("frame-ancestors 'self'")
    expect(h["x-content-type-options"]).toBe("nosniff")
    expect(h["x-robots-tag"]).toBe("noindex")
    expect(h["cache-control"]).toBe("private, no-store") // bozza: mai in cache CDN
    const html = await res.text()
    expect(html).toContain(`<head><base href="${baseHref(row.blob_prefix)}">`)
    expect(html).toContain("artifact-min v1")
  })

  test("la <base> punta a BLOB_PUBLIC_BASE_URL; gli asset Blob rispondono con CORS e Range (206)", async ({ request }) => {
    expect(BLOB_BASE, "BLOB_PUBLIC_BASE_URL (o BLOB_STORE_ID) deve essere impostata").toMatch(
      /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com$/,
    )
    const [row] = await artifactRows()
    const html = await (await page.request.get(`/artifacts/${row.id}`)).text()
    const href = html.match(/<base href="([^"]+)">/)?.[1]
    expect(href).toBe(baseHref(row.blob_prefix))
    expect(href).not.toContain("/artifact-files/")

    // Gli asset relativi si risolvono sulla <base> → URL Blob, cross-origin rispetto al sito
    const origin = new URL(page.url()).origin
    const png = await request.get(new URL("img/a.png", href).href, { headers: { Origin: origin } })
    expect(png.status()).toBe(200)
    expect(png.headers()["content-type"]).toBe("image/png")
    expect(png.headers()["access-control-allow-origin"]).toBe("*")

    // Video: Range → 206 dalla CDN Blob (quello che serve a Safari iOS), sempre con CORS
    const mp4 = await request.get(new URL("video/clip.mp4", href).href, {
      headers: { Origin: origin, Range: "bytes=0-1023" },
    })
    expect(mp4.status()).toBe(206)
    expect(mp4.headers()["content-type"]).toBe("video/mp4")
    expect(mp4.headers()["content-range"]).toBe("bytes 0-1023/4096")
    expect(mp4.headers()["access-control-allow-origin"]).toBe("*")
    expect((await mp4.body()).length).toBe(1024)
  })

  // ─── Pagina pubblica ──────────────────────────────────────────────────────

  test("il lavoro di test resta in bozza: escluso dalla lista Works e 404 da anonimo", async ({ request }) => {
    const [work] = await sql`select published from works where id = ${WORK_ID}`
    expect(work.published).toBe(false)
    for (const locale of ["it", "en"]) {
      const list = await request.get(`/${locale}/works`)
      expect(list.status()).toBe(200)
      expect(await list.text()).not.toContain(SLUG)
      expect(await anonStatus(request, `/${locale}/works/${SLUG}`)).toBe(404)
    }
  })

  test("artefatto pubblicato: sezione Esplora, iframe solo dopo il click, Chiudi lo smonta", async ({ request }) => {
    await openAdminWork(page)
    await setArtifactPublished(page, true)
    const [row] = await artifactRows()

    // Pubblicato → visibile anche da anonimo, con cache pubblica
    const anon = await request.get(`/artifacts/${row.id}`)
    expect(anon.status()).toBe(200)
    expect(anon.headers()["cache-control"]).toBe("public, max-age=60, s-maxage=300")

    // Il lavoro è in bozza: la pagina si vede solo nell'anteprima admin
    await page.goto(`/it/works/${SLUG}?preview=1`)
    const explore = page.getByTestId("works-explore")
    await expect(explore.getByRole("heading", { name: "Esplora" })).toBeVisible()
    await expect(explore.getByTestId("artifact-telemetry")).toHaveText(/^Artefatto · Interattivo · \d+(\.\d)? KB$/i)
    await expect(explore.getByText("Didascalia di prova.")).toBeVisible()
    await expect(page.getByTestId("artifact-iframe")).toHaveCount(0)

    await explore.getByRole("button", { name: "Avvia esperienza" }).click()
    const iframe = page.getByTestId("artifact-iframe")
    await expect(iframe).toHaveAttribute("src", `/artifacts/${row.id}`)
    await expect(iframe).toHaveAttribute("sandbox", "allow-scripts allow-same-origin allow-pointer-lock allow-popups")
    const frame = page.frameLocator('[data-testid="artifact-iframe"]')
    await expect(frame.locator("#marker")).toHaveText("artifact-min v1")
    // L'immagine relativa passa dalla <base> e dal rewrite: caricata davvero
    await expect.poll(() => frame.locator("#img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(1)

    await explore.getByRole("button", { name: "Chiudi" }).click()
    await expect(iframe).toHaveCount(0)
    await expect(explore.getByRole("button", { name: "Avvia esperienza" })).toBeVisible()

    // EN: etichette e didascalia localizzate
    await page.goto(`/en/works/${SLUG}?preview=1`)
    await expect(page.getByTestId("works-explore").getByRole("heading", { name: "Explore" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Launch experience" })).toBeVisible()
    await expect(page.getByText("Test caption.")).toBeVisible()
  })

  // ─── Sostituzione ─────────────────────────────────────────────────────────

  test("Sostituisci zip: stesso id, <base> sul prefix nuovo, il vecchio resta come previousBlobPrefix", async () => {
    const [before] = await artifactRows()

    await openAdminWork(page)
    await page.getByTestId(`artifact-row-${before.id}`).getByRole("button", { name: "Sostituisci zip" }).click()
    const up = await chooseZip(page, "replace", FIXTURE_V2)
    await up.getByRole("button", { name: "Sostituisci file" }).click()
    await expect.poll(async () => (await artifactRows())[0].blob_prefix, { timeout: 60_000 }).not.toBe(before.blob_prefix)

    const [after] = await artifactRows()
    expect(after.id).toBe(before.id)
    expect(after.previous_blob_prefix).toBe(before.blob_prefix)
    expect(await pathsUnder(before.blob_prefix)).toHaveLength(3) // versione appena sostituita: ancora su Blob
    expect(await pathsUnder(after.blob_prefix)).toHaveLength(3)

    const html = await (await page.request.get(`/artifacts/${after.id}`)).text()
    expect(html).toContain(`<base href="${baseHref(after.blob_prefix)}">`)
    expect(html).toContain("artifact-min v2")

    // Seconda sostituzione: si cancella solo la versione di due sostituzioni fa
    await openAdminWork(page)
    await page.getByTestId(`artifact-row-${after.id}`).getByRole("button", { name: "Sostituisci zip" }).click()
    await (await chooseZip(page, "replace", FIXTURE)).getByRole("button", { name: "Sostituisci file" }).click()
    await expect.poll(async () => (await artifactRows())[0].blob_prefix, { timeout: 60_000 }).not.toBe(after.blob_prefix)

    const [third] = await artifactRows()
    expect(third.previous_blob_prefix).toBe(after.blob_prefix)
    await expect.poll(() => pathsUnder(before.blob_prefix)).toHaveLength(0)
    expect(await pathsUnder(after.blob_prefix)).toHaveLength(3)
  })

  // ─── Bozza ed eliminazione ────────────────────────────────────────────────

  test("rimesso in bozza → 404 da anonimo", async ({ request }) => {
    await openAdminWork(page)
    await setArtifactPublished(page, false)
    const [row] = await artifactRows()
    expect(await anonStatus(request, `/artifacts/${row.id}`)).toBe(404)
    expect(await anonStatus(request, `/artifacts/inesistente0000`)).toBe(404)
  })

  test("Elimina con conferma del titolo: record e blob di entrambi i prefix cancellati", async () => {
    const [row] = await artifactRows()
    await openAdminWork(page)
    await page.getByRole("button", { name: `Elimina ${TITLE}` }).click()
    const dialog = page.getByRole("dialog")
    const confirm = dialog.getByRole("button", { name: "Elimina definitivamente" })
    await expect(confirm).toBeDisabled()
    await dialog.getByLabel("Titolo di conferma").fill(TITLE)
    await confirm.click()
    await expect(dialog).toBeHidden()

    expect(await artifactRows()).toHaveLength(0)
    expect(await pathsUnder(row.blob_prefix)).toHaveLength(0)
    expect(await pathsUnder(row.previous_blob_prefix!)).toHaveLength(0)
  })
})

import { randomBytes } from "node:crypto"
import { statSync } from "node:fs"
import { expect, test } from "@playwright/test"
import sharp from "sharp"
import { del, head } from "@vercel/blob"
import { TEST_SLUG_PREFIX, fillRequired, loginAsAdmin, testDb } from "./helpers"

const sql = testDb()
const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
const BLOB_HOST = ".public.blob.vercel-storage.com"
const UPLOAD = "/api/admin/works/upload"

/** JPEG di rumore: comprime poco, quindi 2300×1600 ≈ 6 MB (sopra il limite di 4,5 MB delle Functions) */
async function noiseJpeg(path: string, width: number, height: number) {
  const raw = randomBytes(width * height * 3)
  await sharp(raw, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(path)
  return statSync(path).size
}

async function blobExists(url: string) {
  try {
    await head(url)
    return true
  } catch {
    return false
  }
}

const tokenRequest = {
  type: "blob.generate-client-token",
  payload: { pathname: "works/kdoors/test.jpg", clientPayload: null, multipart: false },
}

test("senza sessione admin POST /api/admin/works/upload risponde 401", async ({ request }) => {
  const res = await request.post(UPLOAD, { data: tokenRequest })
  expect(res.status()).toBe(401)
  expect(await res.json()).toEqual({ error: "Non autorizzato" })
})

test.describe("upload reale su Vercel Blob", () => {
  test.skip(!hasToken, "BLOB_READ_WRITE_TOKEN mancante in .env.local: test di upload reale non eseguibile")

  const slug = `${TEST_SLUG_PREFIX}upload-${Date.now().toString(36)}`
  const uploaded: string[] = []

  test.afterAll(async () => {
    await sql`DELETE FROM works WHERE slug = ${slug}`
    const left = []
    for (const url of uploaded) if (await blobExists(url)) left.push(url)
    if (left.length) await del(left)
  })

  test("con sessione admin, un pathname fuori da works/<slug>/ viene rifiutato", async ({ page }) => {
    await loginAsAdmin(page)
    const res = await page.request.post(UPLOAD, {
      data: { ...tokenRequest, payload: { ...tokenRequest.payload, pathname: "altro/file.jpg" } },
    })
    expect(res.status()).toBe(400)
  })

  test("immagine da ~6 MB: salvata, visibile sul sito; sostituita ed eliminata → blob cancellati", async ({
    page,
  }, testInfo) => {
    test.setTimeout(240_000)
    page.on("dialog", (d) => d.accept())

    const big = testInfo.outputPath("hero-6mb.jpg")
    const size = await noiseJpeg(big, 2300, 1600)
    expect(size).toBeGreaterThan(5.5 * 1024 * 1024)
    const small = testInfo.outputPath("hero-small.jpg")
    await noiseJpeg(small, 400, 300)

    await loginAsAdmin(page)
    await page.goto("/admin/works/new")
    await fillRequired(page, { name: "E2E upload", slug })

    // 1. Upload diretto browser → Blob
    const urlInput = page.getByPlaceholder("/works/slug/file.jpg oppure https://…")
    await page.getByLabel("File Immagine hero").setInputFiles(big)
    await expect(urlInput).toHaveValue(new RegExp(`${BLOB_HOST.replace(/\./g, "\\.")}/works/${slug}/hero-6mb`), {
      timeout: 120_000,
    })
    const url1 = await urlInput.inputValue()
    uploaded.push(url1)
    expect((await head(url1)).size).toBe(size)

    await page.getByRole("button", { name: "Salva e pubblica" }).click()
    await expect(page).toHaveURL(/\/admin\/works\/[a-z0-9]+\?created=1$/)
    const editorUrl = page.url().replace("?created=1", "")
    const [row1] = await sql`SELECT hero_image FROM works WHERE slug = ${slug}`
    expect(row1.hero_image).toBe(url1)

    // 2. Compare sulla pagina pubblica (via next/image)
    await page.goto(`/it/works/${slug}`)
    const hero = page.getByRole("img", { name: "Alt di prova" })
    await expect(hero).toHaveAttribute("src", new RegExp(encodeURIComponent(new URL(url1).hostname)))
    await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBeGreaterThan(0)

    // 3. Sostituzione → il blob precedente viene cancellato al salvataggio
    await page.goto(editorUrl)
    await page.getByRole("tab", { name: /Hero/ }).click()
    await page.getByLabel("File Immagine hero").setInputFiles(small)
    await expect(urlInput).toHaveValue(/hero-small/, { timeout: 60_000 })
    const url2 = await urlInput.inputValue()
    uploaded.push(url2)
    await page.getByRole("button", { name: "Salva e pubblica" }).click()
    await expect(page.getByRole("status").filter({ hasText: "Salvato e pubblicato" })).toBeVisible()
    const [row2] = await sql`SELECT hero_image FROM works WHERE slug = ${slug}`
    expect(row2.hero_image).toBe(url2)
    await expect.poll(() => blobExists(url1), { timeout: 30_000 }).toBe(false)
    expect(await blobExists(url2)).toBe(true)

    // 4. Eliminazione del lavoro → anche il blob in uso viene cancellato
    await page.goto("/admin/works")
    await page.getByTestId(`work-row-${slug}`).getByRole("button", { name: /^Elimina/ }).click()
    await page.getByRole("dialog").getByLabel("Slug di conferma").fill(slug)
    await page.getByRole("dialog").getByRole("button", { name: "Elimina definitivamente" }).click()
    await expect(page.getByTestId(`work-row-${slug}`)).toHaveCount(0)
    await expect.poll(() => blobExists(url2), { timeout: 30_000 }).toBe(false)
  })
})

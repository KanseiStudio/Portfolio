import { execSync } from "node:child_process"
import { expect, test } from "@playwright/test"
import { loginAsAdmin, testDb } from "./helpers"

const sql = testDb()
const SUFFIX = " [e2e seed]"

test.describe("seed:works non distruttivo", () => {
  let original: string | null = null

  test.beforeAll(async () => {
    const [row] = await sql`SELECT tagline_it FROM works WHERE slug = 'kdoors'`
    original = row?.tagline_it ?? null
    // Se una run precedente è stata interrotta, togli il suffisso rimasto
    if (original?.endsWith(SUFFIX)) original = original.slice(0, -SUFFIX.length)
  })

  // Ripristina sempre il valore originale
  test.afterAll(async () => {
    if (original !== null) await sql`UPDATE works SET tagline_it = ${original} WHERE slug = 'kdoors'`
  })

  test("dopo una modifica dall'admin, seed:works senza --force non la tocca", async ({ page }) => {
    test.setTimeout(180_000)
    expect(original, "KDoors deve esistere (esegui npm run seed:works)").not.toBeNull()

    // Modifica dall'admin
    await loginAsAdmin(page)
    await page.goto("/admin/works")
    await page.getByRole("link", { name: "Modifica KDoors" }).click()
    const tagline = page.getByLabel("Tagline IT")
    await tagline.fill(`${original}${SUFFIX}`)
    await page.getByRole("button", { name: "Salva e pubblica" }).click()
    await expect(page.getByRole("status").filter({ hasText: "Salvato e pubblicato" })).toBeVisible()

    const [before] = await sql`SELECT tagline_it, updated_at FROM works WHERE slug = 'kdoors'`
    expect(before.tagline_it).toBe(`${original}${SUFFIX}`)

    // Seed senza --force
    const out = execSync("npm run seed:works", { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })
    expect(out).toContain("KDoors: esiste già, lasciato intatto")

    const [after] = await sql`SELECT tagline_it, updated_at FROM works WHERE slug = 'kdoors'`
    expect(after.tagline_it).toBe(`${original}${SUFFIX}`)
    expect(new Date(after.updated_at).getTime()).toBe(new Date(before.updated_at).getTime())
  })
})

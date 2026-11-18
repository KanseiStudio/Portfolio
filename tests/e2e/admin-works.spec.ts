import { expect, test } from "@playwright/test"
import { TEST_SLUG_PREFIX, fillRequired, loginAsAdmin, testDb } from "./helpers"

const sql = testDb()
const slug = `${TEST_SLUG_PREFIX}${Date.now().toString(36)}`

async function cleanup() {
  // il cascade elimina tag, stats, sezioni e voci
  await sql`DELETE FROM works WHERE slug LIKE ${TEST_SLUG_PREFIX + "%"} OR name = 'E2E duplicato'`
}

test.beforeAll(cleanup)
test.afterAll(cleanup)

test("/admin/works senza sessione reindirizza al login", async ({ page }) => {
  await page.goto("/admin/works")
  await expect(page).toHaveURL(/\/admin\/login$/)
})

test("la lista mostra i 3 lavori del seed", async ({ page }) => {
  await loginAsAdmin(page)
  await page.goto("/admin/works")
  for (const s of ["kdoors", "kbox", "k-avatar"]) {
    await expect(page.getByTestId(`work-row-${s}`)).toBeVisible()
  }
})

test("crea → bozza → pubblica → modifica EN → elimina", async ({ page }) => {
  page.on("dialog", (d) => d.accept()) // eventuale avviso "modifiche non salvate"
  await loginAsAdmin(page)
  await page.goto("/admin/works/new")

  // Lo slug si genera dal nome
  await page.getByLabel(/^Nome/).fill("Lavoro di prova E2E")
  await expect(page.getByLabel("Slug")).toHaveValue("lavoro-di-prova-e2e")

  await fillRequired(page, { name: "Lavoro di prova E2E", slug })

  // Stats: 1 stat
  await page.getByRole("tab", { name: /Stats/ }).click()
  await page.getByRole("button", { name: "Aggiungi stat" }).click()
  await page.getByLabel("Valore").fill("42")
  await page.getByLabel("Etichetta IT", { exact: true }).fill("risposta")
  await page.getByLabel("Etichetta EN", { exact: true }).fill("answer")

  // Sezioni: 1 sezione CARDS con 1 cella
  await page.getByRole("tab", { name: /Sezioni/ }).click()
  await page.getByLabel("Tipo della nuova sezione").selectOption("CARDS")
  await page.getByRole("button", { name: "Aggiungi sezione" }).click()
  const section = page.getByTestId("section-0")
  await section.getByLabel("Eyebrow IT").fill("01 — Prova")
  await section.getByLabel("Titolo IT", { exact: true }).fill("Titolo sezione")
  await section.getByLabel("Titolo EN", { exact: true }).fill("Section title")
  await section.getByRole("button", { name: "Aggiungi cella" }).click()
  await section.getByLabel("Titolo IT", { exact: true }).nth(1).fill("Cella uno")

  // Salva bozza → redirect all'editor del nuovo lavoro
  await page.getByRole("button", { name: "Salva bozza" }).click()
  await expect(page).toHaveURL(/\/admin\/works\/[a-z0-9]+\?created=1$/)
  await expect(page.getByRole("status")).toContainText("Lavoro creato")

  // Compare in lista come Bozza
  await page.goto("/admin/works")
  const row = page.getByTestId(`work-row-${slug}`)
  await expect(row.getByTestId("work-status")).toHaveText("Bozza")

  // Pubblica dallo switch (persistito)
  await row.getByRole("switch").click()
  await expect(row.getByTestId("work-status")).toHaveText("Pubblicato") // ottimistico
  await expect(row.getByRole("switch")).toBeEnabled() // server action conclusa
  await page.reload()
  await expect(page.getByTestId(`work-row-${slug}`).getByTestId("work-status")).toHaveText("Pubblicato")

  // Modifica il titolo EN della sezione
  await page.getByTestId(`work-row-${slug}`).getByRole("link", { name: /^Modifica/ }).click()
  await page.getByRole("tab", { name: /Sezioni/ }).click()
  const saved = page.getByTestId("section-0")
  await saved.getByRole("button", { name: /Titolo sezione/ }).click() // espandi
  await saved.getByLabel("Titolo EN", { exact: true }).first().fill("Updated section title")
  await page.getByRole("button", { name: "Salva e pubblica" }).click()
  await expect(page.getByRole("status")).toContainText("Salvato e pubblicato")

  const [db] = await sql`
    SELECT w.id, w.published,
      (SELECT count(*)::int FROM work_stats WHERE work_id = w.id) AS stats,
      (SELECT count(*)::int FROM work_sections WHERE work_id = w.id) AS sections,
      (SELECT title_en FROM work_sections WHERE work_id = w.id ORDER BY sort_order LIMIT 1) AS title_en,
      (SELECT i.title_it FROM work_section_items i JOIN work_sections s ON s.id = i.section_id
        WHERE s.work_id = w.id ORDER BY i.sort_order LIMIT 1) AS item_title
    FROM works w WHERE w.slug = ${slug}`
  expect(db.published).toBe(true)
  expect(db.stats).toBe(1)
  expect(db.sections).toBe(1)
  expect(db.title_en).toBe("Updated section title")
  expect(db.item_title).toBe("Cella uno")

  // Elimina con conferma dello slug
  await page.goto("/admin/works")
  await page.getByTestId(`work-row-${slug}`).getByRole("button", { name: /^Elimina/ }).click()
  const dialog = page.getByRole("dialog")
  const confirm = dialog.getByRole("button", { name: "Elimina definitivamente" })
  await expect(confirm).toBeDisabled()
  await dialog.getByLabel("Slug di conferma").fill("slug-sbagliato")
  await expect(confirm).toBeDisabled()
  await dialog.getByLabel("Slug di conferma").fill(slug)
  await confirm.click()
  await expect(page.getByTestId(`work-row-${slug}`)).toHaveCount(0)
  expect(await sql`SELECT 1 FROM works WHERE slug = ${slug}`).toHaveLength(0)
  expect(await sql`SELECT 1 FROM work_sections WHERE work_id = ${db.id}`).toHaveLength(0) // cascade
})

test("lo slug duplicato mostra un errore visibile nel form", async ({ page }) => {
  await loginAsAdmin(page)
  await page.goto("/admin/works/new")
  await fillRequired(page, { name: "E2E duplicato", slug: "kdoors" })

  await page.getByRole("button", { name: "Salva bozza" }).click()

  // L'editor torna sulla scheda Generale con l'errore sotto il campo slug
  await expect(page.getByRole("tab", { name: /Generale/ })).toHaveAttribute("aria-selected", "true")
  await expect(page.getByRole("alert").filter({ hasText: "già usato" })).toBeVisible()
  await expect(page.getByLabel("Slug")).toHaveAttribute("aria-invalid", "true")
  await expect(page.locator("#panel-general").getByText(/Lo slug "kdoors" è già usato/)).toBeVisible()
  expect(await sql`SELECT 1 FROM works WHERE name = 'E2E duplicato'`).toHaveLength(0)
})

import { expect, test } from "@playwright/test"
import { loginAsAdmin, testDb } from "./helpers"

const sql = testDb()

const WORKS = [
  { slug: "kdoors", name: "KDoors" },
  { slug: "kbox", name: "KBox" },
  { slug: "k-avatar", name: "K-Avatar" },
]

for (const locale of ["it", "en"]) {
  test(`/${locale}/works risponde 200 e mostra 3 schede`, async ({ page }) => {
    const res = await page.goto(`/${locale}/works`)
    expect(res?.status()).toBe(200)
    await expect(page.getByTestId("work-card")).toHaveCount(3)
    await expect(page.getByTestId("works-count")).toHaveText("03")
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Works")
  })
}

test("ogni pagina progetto ha l'H1 giusto", async ({ page }) => {
  for (const w of WORKS) {
    const res = await page.goto(`/it/works/${w.slug}`)
    expect(res?.status()).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(w.name)
    await expect(page).toHaveTitle(`${w.name} · Works · Kansei Studio`)
  }
})

test("il «Prossimo» cicla: l'ultimo torna al primo", async ({ page }) => {
  await page.goto("/it/works/k-avatar")
  const next = page.getByRole("link", { name: /Prossimo · 01\s*KDoors/ })
  await expect(next).toHaveAttribute("href", "/it/works/kdoors")
})

test("/it/works/inesistente risponde 404", async ({ page }) => {
  const res = await page.goto("/it/works/inesistente")
  expect(res?.status()).toBe(404)
})

test("la tabella indice usa la tipologia breve", async ({ page }) => {
  await page.goto("/it/works")
  const index = page.getByRole("navigation", { name: "Indice progetti" })
  await expect(index.getByText("Installazione fisica · AI", { exact: true })).toBeVisible()
  await expect(index.getByText("Assistente digitale · AI", { exact: true })).toBeVisible()
  // la scheda continua a usare la tipologia completa
  await expect(page.getByTestId("work-card").first()).toContainText("Installazione fisica · Motore AI")
})

const NAV_ORDER = {
  it: ["About", "Technologies", "Works", "Contatti", "Radio"],
  en: ["About", "Technologies", "Works", "Contact", "Radio"],
}

for (const [locale, labels] of Object.entries(NAV_ORDER)) {
  test(`nav desktop ${locale}: 5 voci in ordine`, async ({ page }) => {
    await page.goto(`/${locale}/works`)
    const nav = page.getByRole("navigation", { name: "Main navigation" })
    await expect(nav.getByRole("link")).toHaveText(labels)
  })
}

test("nav mobile: 5 voci in ordine, attiva anche su /works/* e /radio", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  for (const [path, active] of [
    ["/it/works/kbox", "Works"],
    ["/it/radio", "Radio"],
  ]) {
    await page.goto(path)
    await page.getByRole("button", { name: "Apri menu" }).click()
    const drawer = page.getByRole("navigation", { name: "Mobile navigation" })
    await expect(drawer.getByRole("link")).toHaveText(NAV_ORDER.it)
    await expect(drawer.getByRole("link", { name: active })).toHaveAttribute("aria-current", "page")
    await expect(drawer.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current", "page")
  }
  await ctx.close()
})

test("la voce Works del nav è attiva su /works e /works/*", async ({ page }) => {
  for (const path of ["/it/works", "/it/works/kbox", "/en/works/k-avatar"]) {
    await page.goto(path)
    const nav = page.getByRole("navigation", { name: "Main navigation" })
    await expect(nav.getByRole("link", { name: "Works" })).toHaveAttribute("aria-current", "page")
    await expect(nav.getByRole("link", { name: "Technologies" })).not.toHaveAttribute("aria-current", "page")
  }
})

test.describe("bozza", () => {
  // Ripristina sempre KBox pubblicato, anche se il test fallisce a metà
  test.afterEach(async () => {
    await sql`UPDATE works SET published = true WHERE slug = 'kbox'`
  })

  test("un lavoro messo in bozza dall'admin sparisce dall'indice e dà 404; l'anteprima admin lo mostra", async ({
    page,
    browser,
  }) => {
    await loginAsAdmin(page)
    await page.goto("/admin/works")
    const row = page.getByTestId("work-row-kbox")
    await row.getByRole("switch").click()
    await expect(row.getByTestId("work-status")).toHaveText("Bozza")
    await expect(row.getByRole("switch")).toBeEnabled() // server action conclusa

    // Visitatore anonimo: niente scheda, 404
    const anon = await browser.newContext()
    const visitor = await anon.newPage()
    await visitor.goto("/it/works")
    await expect(visitor.getByTestId("work-card")).toHaveCount(2)
    await expect(visitor.getByTestId("works-count")).toHaveText("02")
    expect((await visitor.goto("/it/works/kbox"))?.status()).toBe(404)
    expect((await visitor.goto("/it/works/kbox?preview=1"))?.status()).toBe(404) // senza sessione
    // Il "Prossimo" salta la bozza
    await visitor.goto("/it/works/kdoors")
    await expect(visitor.getByRole("link", { name: /Prossimo · 02\s*K-Avatar/ })).toBeVisible()
    await anon.close()

    // Admin con ?preview=1: pagina visibile, badge BOZZA, noindex
    const res = await page.goto("/it/works/kbox?preview=1")
    expect(res?.status()).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("KBox")
    await expect(page.getByRole("status").filter({ hasText: /Bozza/ })).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)

    // Ripubblica dall'admin
    await page.goto("/admin/works")
    await page.getByTestId("work-row-kbox").getByRole("switch").click()
    await expect(page.getByTestId("work-row-kbox").getByTestId("work-status")).toHaveText("Pubblicato")
    await expect(page.getByTestId("work-row-kbox").getByRole("switch")).toBeEnabled()
  })
})

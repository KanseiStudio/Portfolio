import { expect, type Page } from "@playwright/test"
import { neon } from "@neondatabase/serverless"

export async function loginAsAdmin(page: Page) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) throw new Error("ADMIN_PASSWORD mancante in .env.local")
  await page.goto("/admin/login")
  await page.locator('input[name="password"]').fill(password)
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/\/admin$/)
}

/**
 * SQL diretto per verifiche e pulizia dei dati di test.
 * (Il client Prisma generato è solo ESM e il runner Playwright carica i test come CJS.)
 */
export function testDb() {
  return neon(process.env.DATABASE_URL!)
}

/** Tutti i lavori creati dai test usano questo prefisso e vengono sempre cancellati */
export const TEST_SLUG_PREFIX = "e2e-test-"

/** Compila i campi obbligatori di Generale + Hero */
export async function fillRequired(page: Page, { name, slug }: { name: string; slug: string }) {
  await page.getByLabel(/^Nome/).fill(name)
  await page.getByLabel("Slug").fill(slug)
  await page.getByLabel("Tipologia IT").fill("Installazione di prova")
  await page.getByLabel("Tipologia EN").fill("Test installation")
  await page.getByLabel("Stato IT").fill("Disponibile")
  await page.getByLabel("Stato EN").fill("Available")
  await page.getByLabel("Tagline IT").fill("Tagline di prova.")
  await page.getByLabel("Tagline EN").fill("Test tagline.")
  await page.getByLabel("Intro IT").fill("Intro di prova.")
  await page.getByLabel("Intro EN").fill("Test intro.")

  await page.getByRole("tab", { name: /Hero/ }).click()
  await page.getByPlaceholder("/works/slug/file.jpg oppure https://…").fill("/works/kbox/hero.jpg")
  await page.getByLabel("Testo alternativo IT").fill("Alt di prova")
  await page.getByLabel("Testo alternativo EN").fill("Test alt")
}

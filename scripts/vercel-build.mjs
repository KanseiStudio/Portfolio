#!/usr/bin/env node
/**
 * Build su Vercel (`npm run vercel-build`, che Vercel usa al posto di `build`).
 *
 * 1. Solo con VERCEL_ENV=production: `prisma migrate deploy` sul DB di produzione,
 *    usando DIRECT_URL (connessione diretta Neon, non il pooler) come DATABASE_URL.
 *    Su Preview e in locale NON migra mai.
 * 2. `prisma generate`
 * 3. `next build`
 *
 * Nei log stampa solo l'host del DB, mai credenziali.
 * Se una migration fallisce la build si ferma e il deploy non va in produzione.
 */
import { spawnSync } from "node:child_process"

const isWindows = process.platform === "win32"

function run(cmd, args, env = process.env) {
  console.log(`\n> ${cmd} ${args.join(" ")}`)
  const result = spawnSync(cmd, args, { stdio: "inherit", env, shell: isWindows })
  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function dbHost(url) {
  try {
    return new URL(url).host
  } catch {
    return null
  }
}

const vercelEnv = process.env.VERCEL_ENV ?? "(non impostato)"

if (process.env.VERCEL_ENV === "production") {
  const directUrl = process.env.DIRECT_URL
  const host = directUrl ? dbHost(directUrl) : null
  if (!host) {
    console.error("[vercel-build] VERCEL_ENV=production ma DIRECT_URL manca o non è un URL valido: migration impossibili, build interrotta.")
    process.exit(1)
  }
  if (host.includes("-pooler")) {
    console.error(`[vercel-build] DIRECT_URL punta al pooler (${host}): serve la connessione diretta per le migration. Build interrotta.`)
    process.exit(1)
  }
  console.log(`[vercel-build] VERCEL_ENV=production → prisma migrate deploy su ${host}`)
  run("npx", ["prisma", "migrate", "deploy"], { ...process.env, DATABASE_URL: directUrl })
} else {
  console.log(`[vercel-build] VERCEL_ENV=${vercelEnv} → nessuna migration`)
}

run("npx", ["prisma", "generate"])
run("npx", ["next", "build"])

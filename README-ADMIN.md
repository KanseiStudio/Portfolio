# Kansei Studio — Admin Panel

Pannello di gestione accessibile da `/admin`. Protetto da password singola via cookie firmato.

## Setup iniziale

### 1. Genera il session secret

In PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia l'output (64 caratteri hex).

### 2. Aggiungi le variabili a `.env.local`

```
ADMIN_PASSWORD="scegli-una-password-complessa"
ADMIN_SESSION_SECRET="incolla-qui-il-secret-generato-sopra"
```

Riavvia il dev server dopo aver modificato `.env.local`.

### 3. Accedi

Vai a [http://localhost:3000/admin](http://localhost:3000/admin) — verrai rediretto alla login page. Inserisci la password configurata.

---

## Password dimenticata

Se dimentichi la password:

1. Apri `.env.local`
2. Cambia il valore di `ADMIN_PASSWORD` con una nuova password
3. Riavvia il dev server

La sessione attiva viene invalidata automaticamente al prossimo accesso (il cookie firmato con il vecchio secret non sarà più valido se cambi anche `ADMIN_SESSION_SECRET`).

---

## Sicurezza

- Il cookie di sessione è firmato e crittografato con `iron-session` v8
- La sessione dura 7 giorni, poi scade automaticamente
- `secure: true` in produzione (HTTPS only)
- Il pannello admin non è indicizzato dai motori di ricerca (`robots: noindex`)
- La route `/admin` non è accessibile via `/it/admin` o `/en/admin`

---

## Struttura

```
app/admin/
  layout.tsx              ← Layout admin (robots noindex)
  page.tsx                ← Dashboard (statistiche + ultimi progetti)
  login/
    page.tsx              ← Pagina login pubblica
    _components/
      LoginForm.tsx       ← Form client con useActionState
  _actions/
    auth.ts               ← loginAction + logoutAction (Server Actions)
  projects/
    page.tsx              ← Gestione progetti (Task 08b)
  categories/
    page.tsx              ← Gestione categorie (Task 08b)

lib/
  env.ts                  ← Validazione ADMIN_PASSWORD e ADMIN_SESSION_SECRET
  session.ts              ← getAdminSession() per Server Components

proxy.ts                  ← Protezione route /admin/* (Next.js 16 proxy)
```

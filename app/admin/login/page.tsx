import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/session"
import { Container } from "@/components/atoms/Container"
import { LoginForm } from "./_components/LoginForm"

const envConfigured =
  Boolean(process.env.ADMIN_SESSION_SECRET) && Boolean(process.env.ADMIN_PASSWORD)

export default async function AdminLoginPage() {
  if (envConfigured) {
    const session = await getAdminSession()
    if (session.isAdmin) {
      redirect("/admin")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ks-bg">
      <Container className="max-w-md">
        <div className="border border-ks-hairline-active p-12">
          <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-4">
            Admin
          </p>
          <h1 className="font-display text-4xl leading-tight mb-12">
            Accedi al pannello
          </h1>

          {envConfigured ? (
            <LoginForm />
          ) : (
            <p className="text-small border border-ks-hairline-active p-4 opacity-70">
              Configura <code className="font-mono">ADMIN_PASSWORD</code> e{" "}
              <code className="font-mono">ADMIN_SESSION_SECRET</code> in{" "}
              <code className="font-mono">.env.local</code> per abilitare il login.
            </p>
          )}

          <p className="mt-8 text-eyebrow font-mono uppercase tracking-widest opacity-40">
            Kansei Studio · admin
          </p>
        </div>
      </Container>
    </main>
  )
}

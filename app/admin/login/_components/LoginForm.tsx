"use client"

import { useActionState } from "react"
import { loginAction } from "@/app/admin/_actions/auth"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-small font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
          autoFocus
          disabled={isPending}
          className="w-full border border-ks-hairline-active px-4 py-3 bg-ks-bg text-ks-fg focus:outline focus:outline-1 focus:outline-ks-fg focus:outline-offset-2 disabled:opacity-50"
        />
      </div>

      {state?.error && (
        <p className="text-small" role="alert" style={{ color: "#b91c1c" }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full border border-ks-fg bg-ks-fg text-ks-bg px-4 py-3 font-medium transition-colors duration-600 ease-kansei hover:bg-ks-bg hover:text-ks-fg disabled:opacity-50"
      >
        {isPending ? "Accesso in corso…" : "Accedi"}
      </button>
    </form>
  )
}

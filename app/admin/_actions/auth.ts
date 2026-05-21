"use server"

import { redirect } from "next/navigation"
import { getAdminPassword } from "@/lib/env"
import { getAdminSession } from "@/lib/session"

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = formData.get("password")?.toString() ?? ""

  if (password !== getAdminPassword()) {
    return { error: "Password non corretta" }
  }

  const session = await getAdminSession()
  session.isAdmin = true
  session.loginAt = Date.now()
  await session.save()

  redirect("/admin")
}

export async function logoutAction(): Promise<void> {
  const session = await getAdminSession()
  await session.destroy()
  redirect("/admin/login")
}

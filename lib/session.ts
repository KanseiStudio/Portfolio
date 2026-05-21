import { getIronSession, type IronSession, type SessionOptions } from "iron-session"
import { cookies } from "next/headers"
import { getAdminSessionSecret } from "./env"

export interface AdminSession {
  isAdmin: boolean
  loginAt?: number
}

export function getSessionOptions(): SessionOptions {
  return {
    password: getAdminSessionSecret(),
    cookieName: "kansei_admin_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  }
}

export async function getAdminSession(): Promise<IronSession<AdminSession>> {
  const cookieStore = await cookies()
  // iron-session v8 accepts ReadonlyRequestCookies; type cast needed for Next 15 compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getIronSession<AdminSession>(cookieStore as any, getSessionOptions())
}

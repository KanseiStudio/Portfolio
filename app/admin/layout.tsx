import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin · Kansei Studio",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#0A0A0A]">
      {children}
    </div>
  )
}

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MetadataRow {
  label: string
  value: string | ReactNode
}

interface MetadataTableProps {
  rows: MetadataRow[]
  variant?: "default" | "compact"
  className?: string
}

export function MetadataTable({ rows, variant = "default", className }: MetadataTableProps) {
  const py = variant === "compact" ? "py-2" : "py-3"

  return (
    <table className={cn("w-full block sm:table border-collapse", className)}>
      <tbody className="block sm:table-row-group">
        {rows.map((row, i) => (
          <tr
            key={i}
            className="block sm:table-row border-t border-ks-hairline-active last:border-b"
          >
            <td
              className={cn(
                "block sm:table-cell sm:w-1/3 align-top pr-4",
                "text-mono-ks font-mono uppercase tracking-widest opacity-70",
                py
              )}
            >
              {row.label}
            </td>
            <td
              className={cn(
                "block sm:table-cell align-top",
                "text-small font-body",
                py
              )}
            >
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

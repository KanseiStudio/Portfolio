import Link from "next/link"
import { CirclePlusButton } from "@/components/atoms/CirclePlusButton"
import { cn } from "@/lib/utils"

interface NumberedFeatureCardProps {
  number: string
  title: string
  description: string
  items?: string[]
  href?: string
  onClick?: () => void
  className?: string
}

export function NumberedFeatureCard({
  number,
  title,
  description,
  items,
  href,
  onClick,
  className,
}: NumberedFeatureCardProps) {
  return (
    <div className={cn("relative flex flex-col h-full", className)}>
      {/* Transparent link overlay — covers the card body, z-0 */}
      {href && (
        <Link
          href={href}
          className="absolute inset-0 z-0"
          aria-label={title}
          tabIndex={0}
        />
      )}

      <span className="text-mono-ks font-mono relative z-10">{number}</span>

      <div className="relative z-10 mt-16 lg:mt-20">
        <h3 className="text-ks-h3 font-display mb-3">{title}</h3>
        <p className="text-body font-body opacity-80 leading-relaxed">{description}</p>

        {items && items.length > 0 && (
          <ul className="mt-3 space-y-1.5" aria-label="Details">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-small font-body opacity-70">
                <span className="shrink-0" aria-hidden="true">·</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CirclePlusButton — z-10, above the overlay link. Always interactive. */}
      <div className="flex justify-start mt-auto pt-12 relative z-10">
        {href ? (
          <CirclePlusButton icon="arrow" size="md" aria-label={`View ${title}`} href={href} />
        ) : (
          <CirclePlusButton icon="arrow" size="md" aria-label="Learn more" onClick={onClick} />
        )}
      </div>
    </div>
  )
}

import type { ReactNode } from "react"
export default function Sign({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`road-sign relative border-2 border-gold bg-asphalt p-3 ${className}`}
    >
      <div className="relative border border-gold/60 px-6 py-7">{children}</div>
    </div>
  )
}

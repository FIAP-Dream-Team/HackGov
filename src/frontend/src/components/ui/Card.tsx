import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6 ${className}`}>
      {children}
    </section>
  )
}

interface EmptyStateProps {
  title: string
  icon?: LucideIcon
  children?: ReactNode
}

/** Estado vazio: diz o que não há e o que vai acontecer, sem parecer erro. */
export function EmptyState({ title, icon: Icon, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
      {Icon && (
        <span className="mb-3 flex size-14 items-center justify-center rounded-full bg-green-100 text-green-700">
          <Icon aria-hidden="true" className="size-7" strokeWidth={1.75} />
        </span>
      )}
      <p className="font-semibold text-neutral-900">{title}</p>
      {children && <div className="mt-1 max-w-sm text-sm text-neutral-600">{children}</div>}
    </div>
  )
}

type BadgeTone = 'neutral' | 'green' | 'blue' | 'yellow' | 'red'

const badgeTones: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-200 text-neutral-800',
  green: 'bg-green-200 text-green-800',
  blue: 'bg-blue-200 text-blue-800',
  yellow: 'bg-yellow-200 text-yellow-800',
  red: 'bg-red-200 text-red-800',
}

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeTones[tone]}`}>
      {children}
    </span>
  )
}

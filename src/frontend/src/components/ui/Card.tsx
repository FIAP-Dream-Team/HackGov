import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6 ${className}`}>
      {children}
    </section>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 px-4 py-6 text-center">
      <p className="font-semibold text-neutral-800">{title}</p>
      {children && <div className="mt-1 text-sm text-neutral-600">{children}</div>}
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
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeTones[tone]}`}>
      {children}
    </span>
  )
}

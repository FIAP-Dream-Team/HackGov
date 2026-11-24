import { AlertTriangle, CircleAlert, CircleCheck, Info, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Tone = 'error' | 'success' | 'info' | 'warning'

const tones: Record<Tone, string> = {
  error: 'border-red-200 bg-red-100 text-red-800',
  success: 'border-green-200 bg-green-100 text-green-800',
  info: 'border-blue-200 bg-blue-100 text-blue-800',
  warning: 'border-yellow-300 bg-yellow-100 text-yellow-900',
}

const icons: Record<Tone, LucideIcon> = {
  error: CircleAlert,
  success: CircleCheck,
  info: Info,
  warning: AlertTriangle,
}

interface AlertProps {
  tone: Tone
  title?: string
  children: ReactNode
  action?: { label: string; onClick: () => void }
}

export function Alert({ tone, title, children, action }: AlertProps) {
  const Icon = icons[tone]

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        <div>{children}</div>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-2 font-semibold underline underline-offset-2 hover:no-underline"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

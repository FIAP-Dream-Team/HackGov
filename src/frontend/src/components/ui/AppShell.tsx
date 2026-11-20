import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

interface AppShellProps {
  /** Nome do canal mostrado ao lado da marca. */
  channel: string
  tone?: 'citizen' | 'staff'
  actions?: ReactNode
  width?: 'narrow' | 'wide'
  children: ReactNode
}

export function AppShell({ channel, tone = 'citizen', actions, width = 'narrow', children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className={`border-b ${tone === 'staff' ? 'border-blue-200 bg-blue-500 text-neutral-50' : 'border-neutral-200 bg-neutral-50'}`}>
        <div className={`mx-auto flex items-center justify-between gap-3 px-4 py-3 ${width === 'wide' ? 'max-w-[1080px]' : 'max-w-[560px]'}`}>
          <Link to="/" className="flex min-w-0 items-center gap-2 font-bold text-inherit no-underline">
            <Logo />
            <span className="whitespace-nowrap">Minha Vez</span>
            <span className={`hidden truncate text-sm font-medium sm:inline ${tone === 'staff' ? 'text-blue-100' : 'text-neutral-500'}`}>
              · {channel}
            </span>
          </Link>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </header>
      <main className={`mx-auto px-4 py-6 ${width === 'wide' ? 'max-w-[1080px]' : 'max-w-[560px]'}`}>{children}</main>
    </div>
  )
}

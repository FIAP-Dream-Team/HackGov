import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

interface AppShellProps {
  /** Nome do canal mostrado ao lado da marca. */
  channel: string
  tone?: 'citizen' | 'staff'
  actions?: ReactNode
  width?: 'narrow' | 'wide'
  /**
   * Faixa colorida logo abaixo do cabeçalho. O conteúdo principal sobe por
   * cima dela, para a tela não parecer um formulário solto no cinza.
   */
  hero?: ReactNode
  children: ReactNode
}

export function AppShell({ channel, tone = 'citizen', actions, width = 'narrow', hero, children }: AppShellProps) {
  const container = width === 'wide' ? 'max-w-[1080px]' : 'max-w-[560px]'
  const staff = tone === 'staff'

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className={staff ? 'bg-blue-500 text-neutral-50' : hero ? 'bg-green-800 text-neutral-50' : 'border-b border-neutral-200 bg-neutral-50'}>
        <div className={`mx-auto flex items-center justify-between gap-3 px-4 py-3 ${container}`}>
          <Link to="/" className="flex min-w-0 items-center gap-2 font-bold text-inherit no-underline">
            <Logo tone={staff || hero ? 'light' : 'color'} />
            <span className="whitespace-nowrap">Minha Vez</span>
            <span
              className={`hidden truncate text-sm font-medium sm:inline ${
                staff ? 'text-blue-100' : hero ? 'text-green-200' : 'text-neutral-500'
              }`}
            >
              · {channel}
            </span>
          </Link>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </header>

      {hero && (
        <div className={staff ? 'bg-blue-500 text-neutral-50' : 'bg-green-800 text-neutral-50'}>
          <div className={`mx-auto px-4 pt-4 pb-20 ${container}`}>{hero}</div>
        </div>
      )}

      <main className={`mx-auto px-4 pb-10 ${hero ? '-mt-14' : 'pt-6'} ${container}`}>{children}</main>
    </div>
  )
}

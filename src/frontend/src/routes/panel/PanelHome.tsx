import { useEffect, useState } from 'react'
import { panelApi } from '../../api/panel'
import type { Panel } from '../../api/types'
import { toApiError } from '../../api/client'
import Logo from '../../components/Logo'

type Connection = 'connecting' | 'open' | 'reconnecting' | 'failed'

/**
 * Painel da sala de espera (US04). Público, sem token. Mostra só senha e sala:
 * nome, protocolo e especialidade nunca chegam aqui.
 */
export default function PanelHome() {
  const [panel, setPanel] = useState<Panel | null>(null)
  const [connection, setConnection] = useState<Connection>('connecting')
  const [failure, setFailure] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    // Leitura por GET ao abrir e a cada 15 s. O SSE entrega a chamada na hora;
    // o GET é a rede de segurança para quando o fluxo morre sem avisar (proxy
    // que segura a conexão aberta depois de o servidor cair).
    const refresh = () =>
      panelApi
        .current(controller.signal)
        .then((data) => {
          setPanel(data)
          setFailure(null)
          setConnection((current) => (current === 'failed' ? 'reconnecting' : current))
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return
          setFailure(toApiError(error).message)
          setConnection('failed')
        })

    refresh()
    const poll = window.setInterval(refresh, 15_000)

    const close = panelApi.subscribe({
      onUpdate: (data) => {
        setPanel(data)
        setFailure(null)
        setConnection('open')
      },
      onStatus: (status) => setConnection((current) => (status === 'open' ? 'open' : current === 'failed' ? 'failed' : 'reconnecting')),
    })

    return () => {
      controller.abort()
      window.clearInterval(poll)
      close()
    }
  }, [])

  const calling = panel?.temChamada

  return (
    <div className="flex min-h-dvh flex-col bg-green-900 text-neutral-50">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 font-bold">
          <Logo />
          Minha Vez · Sala de espera
        </div>
        <ConnectionBadge connection={connection} />
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        {!panel && !failure && (
          <p role="status" className="animate-pulse text-xl text-green-200">
            Conectando ao painel…
          </p>
        )}

        {!panel && failure && (
          <div role="alert" className="max-w-md rounded-2xl bg-green-800 p-6 text-center">
            <p className="text-lg font-bold">Painel sem conexão</p>
            <p className="mt-1 text-green-200">{failure}</p>
            <p className="mt-3 text-sm text-green-300">A tela tenta reconectar sozinha.</p>
          </div>
        )}

        {panel && calling && (
          <div
            aria-live="assertive"
            className="w-full max-w-[640px] rounded-3xl bg-yellow-500 px-6 py-10 text-center text-neutral-950 sm:py-14"
          >
            <p className="text-lg sm:text-2xl">{panel.mensagem ?? 'É a vez de alguém.'}</p>
            <p className="my-2 text-[clamp(4.5rem,18vw,10rem)] font-extrabold leading-none tracking-tight">{panel.senha}</p>
            <p className="text-2xl font-bold sm:text-4xl">Sala {panel.sala}</p>
          </div>
        )}

        {panel && !calling && (
          <div aria-live="polite" className="text-center">
            <p className="text-2xl font-bold sm:text-4xl">{panel.mensagem ?? 'Nenhuma senha chamada no momento.'}</p>
            <p className="mt-2 text-green-200">Quando for a sua vez, a senha aparece aqui em amarelo.</p>
          </div>
        )}
      </main>

      <footer className="px-6 py-4 text-center text-sm text-green-300">
        Este painel não mostra nome, protocolo nem dado clínico.
      </footer>
    </div>
  )
}

function ConnectionBadge({ connection }: { connection: Connection }) {
  const label = {
    connecting: 'Conectando',
    open: 'Ao vivo',
    reconnecting: 'Reconectando',
    failed: 'Sem conexão',
  }[connection]
  const dot = connection === 'open' ? 'bg-green-400' : connection === 'failed' ? 'bg-red-400' : 'bg-yellow-400'

  return (
    <span className="flex items-center gap-2 rounded-full bg-green-800 px-3 py-1 text-sm" role="status">
      <span className={`size-2 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}

// Painel público da sala de espera (US04). Sem token.

import { apiUrl, request } from './client'
import type { Panel } from './types'

export const panelApi = {
  current(signal?: AbortSignal) {
    return request<Panel>('/painel', { signal })
  },

  /**
   * Abre o fluxo SSE do painel. Devolve a função que fecha a conexão.
   * O EventSource só reconecta sozinho quando a conexão cai no meio do fluxo.
   * Se o servidor responde com erro (fora do ar, proxy sem destino), ele
   * desiste: aqui a conexão é refeita com espera crescente, até 30 s.
   */
  subscribe(handlers: { onUpdate: (panel: Panel) => void; onStatus: (status: 'open' | 'reconnecting') => void }) {
    let source: EventSource | null = null
    let retryTimer: number | undefined
    let delay = 1000
    let closed = false

    const connect = () => {
      source = new EventSource(apiUrl('/painel/eventos'))

      source.addEventListener('open', () => {
        delay = 1000
        handlers.onStatus('open')
      })
      source.addEventListener('error', () => {
        handlers.onStatus('reconnecting')
        if (source?.readyState === EventSource.CLOSED && !closed) {
          retryTimer = window.setTimeout(connect, delay)
          delay = Math.min(delay * 2, 30_000)
        }
      })
      source.addEventListener('painel', (event) => {
        try {
          handlers.onUpdate(JSON.parse((event as MessageEvent<string>).data) as Panel)
        } catch {
          // Evento malformado: mantém o último painel válido na tela.
        }
      })
    }

    connect()

    return () => {
      closed = true
      window.clearTimeout(retryTimer)
      source?.close()
    }
  },
}

// Guarda do token de sessão, por canal.
//
// - Aplicativo e equipe: sessionStorage. Sobrevive a um recarregar da aba,
//   some quando a aba fecha. Não usamos localStorage para o token não ficar
//   no navegador depois que a pessoa vai embora.
// - Totem: só em memória (estado do React). É equipamento público: nada da
//   sessão pode ficar gravado para a próxima pessoa da fila.

import { useCallback, useState } from 'react'

type StoredChannel = 'app' | 'equipe'

const KEY: Record<StoredChannel, string> = {
  app: 'minhavez.sessao.app',
  equipe: 'minhavez.sessao.equipe',
}

function read(channel: StoredChannel): string | null {
  try {
    return window.sessionStorage.getItem(KEY[channel])
  } catch {
    return null
  }
}

function write(channel: StoredChannel, token: string | null) {
  try {
    if (token) {
      window.sessionStorage.setItem(KEY[channel], token)
    } else {
      window.sessionStorage.removeItem(KEY[channel])
    }
  } catch {
    // Armazenamento bloqueado: a sessão vale só enquanto a tela estiver aberta.
  }
}

export function useStoredSession(channel: StoredChannel) {
  const [token, setToken] = useState<string | null>(() => read(channel))

  const signIn = useCallback(
    (value: string) => {
      write(channel, value)
      setToken(value)
    },
    [channel],
  )

  const signOut = useCallback(() => {
    write(channel, null)
    setToken(null)
  }, [channel])

  return { token, signIn, signOut }
}

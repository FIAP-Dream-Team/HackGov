import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, toApiError } from '../api/client'

// Os quatro estados de integração que toda tela trata de forma explícita.
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: ApiError }

/**
 * Ação disparada pela pessoa (enviar formulário, confirmar horário).
 * `run` devolve o dado em caso de sucesso, ou `undefined` em caso de falha,
 * para a tela decidir o próximo passo sem precisar de try/catch.
 */
export function useAction<Args extends unknown[], T>(action: (...args: Args) => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' })
  const mounted = useRef(true)
  const actionRef = useRef(action)
  actionRef.current = action

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const run = useCallback(async (...args: Args): Promise<T | undefined> => {
    setState({ status: 'loading' })
    try {
      const data = await actionRef.current(...args)
      if (mounted.current) setState({ status: 'success', data })
      return data
    } catch (error) {
      if (mounted.current) setState({ status: 'error', error: toApiError(error) })
      return undefined
    }
  }, [])

  const reset = useCallback(() => setState({ status: 'idle' }), [])

  return { state, run, reset }
}

/**
 * Leitura feita ao abrir a tela (acompanhamento, fila, horários). Cancela a
 * requisição anterior quando as dependências mudam ou a tela é desmontada.
 * `reload` refaz a leitura sem voltar para o esqueleto de carregamento quando
 * já existe dado na tela.
 */
export function useQuery<T>(load: ((signal: AbortSignal) => Promise<T>) | null, deps: unknown[]) {
  const [state, setState] = useState<AsyncState<T>>(load ? { status: 'loading' } : { status: 'idle' })
  const [refreshing, setRefreshing] = useState(false)
  const [version, setVersion] = useState(0)
  const loadRef = useRef(load)
  loadRef.current = load
  const hasData = useRef(false)

  useEffect(() => {
    const current = loadRef.current
    if (!current) {
      setState({ status: 'idle' })
      return
    }

    const controller = new AbortController()

    if (hasData.current) {
      setRefreshing(true)
    } else {
      setState({ status: 'loading' })
    }

    current(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        hasData.current = true
        setState({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        hasData.current = false
        setState({ status: 'error', error: toApiError(error) })
      })
      .finally(() => {
        if (!controller.signal.aborted) setRefreshing(false)
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version])

  const reload = useCallback(() => setVersion((value) => value + 1), [])

  return { state, reload, refreshing }
}

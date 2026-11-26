// Cliente HTTP único da aplicação. Toda chamada ao backend passa por aqui,
// para que o formato de erro do contrato ({ codigo, mensagem }) seja lido
// sempre do mesmo jeito.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export type ErrorCode =
  | 'DADOS_INVALIDOS'
  | 'SENHA_INCORRETA'
  | 'CONTA_GOVBR'
  | 'CANAL_INCORRETO'
  | 'CONFIRMACAO_AUSENTE'
  | 'SESSAO_AUSENTE'
  | 'SESSAO_INVALIDA'
  | 'ACESSO_NEGADO'
  | 'ENCAMINHAMENTO_NAO_ENCONTRADO'
  | 'HORARIO_NAO_ENCONTRADO'
  | 'CIDADAO_NAO_ENCONTRADO'
  | 'REGRA_VIOLADA'
  | 'CPF_JA_CADASTRADO'
  | 'CARTAO_JA_CADASTRADO'
  | 'FALHA_INTERNA'
  | 'MUITAS_TENTATIVAS'
  // Códigos gerados no próprio cliente, quando o servidor nem respondeu.
  | 'SEM_CONEXAO'
  | 'RESPOSTA_INESPERADA'

export class ApiError extends Error {
  readonly status: number
  readonly code: ErrorCode | string

  constructor(status: number, code: ErrorCode | string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }

  /** Sessão ausente ou vencida: a tela deve voltar ao login. */
  get isSessionError(): boolean {
    return this.status === 401 && (this.code === 'SESSAO_AUSENTE' || this.code === 'SESSAO_INVALIDA')
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  token?: string | null
  signal?: AbortSignal
}

const FALLBACK_MESSAGES: Record<number, string> = {
  400: 'Os dados enviados não estão completos.',
  401: 'Sua sessão terminou. Entre de novo.',
  403: 'Este canal não pode fazer essa ação.',
  404: 'Não encontramos o que você procurou.',
  409: 'Essa ação não é permitida agora.',
  429: 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
  500: 'O servidor teve um problema. Tente de novo em instantes.',
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause
    }
    throw new ApiError(0, 'SEM_CONEXAO', 'Não foi possível falar com o servidor. Confira a conexão e tente de novo.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  const payload = await readJson(response)

  if (!response.ok) {
    // O backend sempre manda { codigo, mensagem }, até no 500. Um 5xx sem esse
    // corpo veio do proxy ou do gateway: o servidor nem chegou a responder.
    if (!isErrorBody(payload) && response.status >= 500) {
      throw new ApiError(response.status, 'SEM_CONEXAO', 'Não foi possível falar com o servidor. Tente de novo em instantes.')
    }
    const code = isErrorBody(payload) ? payload.codigo : 'RESPOSTA_INESPERADA'
    const message = isErrorBody(payload)
      ? payload.mensagem
      : FALLBACK_MESSAGES[response.status] ?? FALLBACK_MESSAGES[500]
    throw new ApiError(response.status, code, message)
  }

  return payload as T
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text()

  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text)
  } catch {
    if (response.ok) {
      throw new ApiError(response.status, 'RESPOSTA_INESPERADA', 'O servidor respondeu num formato inesperado.')
    }
    return undefined
  }
}

function isErrorBody(value: unknown): value is { codigo: string; mensagem: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { codigo?: unknown }).codigo === 'string' &&
    typeof (value as { mensagem?: unknown }).mensagem === 'string'
  )
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }
  return new ApiError(0, 'RESPOSTA_INESPERADA', 'Algo deu errado. Tente de novo.')
}

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}

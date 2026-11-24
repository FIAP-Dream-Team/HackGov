import type { ApiError } from '../../api/client'
import { describeError } from '../../lib/errors'
import { Alert } from './Alert'

interface ErrorAlertProps {
  error: ApiError
  /** Mostra "Tentar de novo" quando o erro é passageiro (rede, falha interna). */
  onRetry?: () => void
  /** Troca o título padrão do código, quando a tela sabe dizer melhor o contexto. */
  title?: string
}

/** Erro que fica no lugar onde aconteceu: formulário, lista que não carregou. */
export function ErrorAlert({ error, onRetry, title }: ErrorAlertProps) {
  const description = describeError(error)

  return (
    <Alert
      tone="error"
      title={title ?? description.title}
      action={onRetry && description.retryable ? { label: 'Tentar de novo', onClick: onRetry } : undefined}
    >
      <p>{description.message}</p>
      {description.hint && <p className="mt-1 text-red-700">{description.hint}</p>}
    </Alert>
  )
}

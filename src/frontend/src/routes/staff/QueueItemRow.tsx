import { useEffect, useState, type FormEvent } from 'react'
import { staffApi } from '../../api/staff'
import { CheckCheck, Megaphone, TriangleAlert, Unlock, UserX } from 'lucide-react'
import type { QueueItem, ReferralStatus, StaffRole } from '../../api/types'
import { Badge, Button, ErrorAlert, TextField, useToast } from '../../components/ui'
import { useAction } from '../../hooks/useAsync'
import { useForm } from '../../hooks/useForm'
import { describeError } from '../../lib/errors'
import { STATUS_LABEL } from '../../lib/labels'
import { validateRequired } from '../../lib/validation'

interface QueueItemRowProps {
  item: QueueItem
  /** Mostrada só na aba "Todas", onde as especialidades se misturam. */
  specialty?: string
  /** Define os botões: atendente opera, gestor só conclui. */
  role?: StaffRole
  token: string
  onChanged: () => void
  onSessionExpired: () => void
}

type RowAction = 'release' | 'noShow' | 'conclude'

/** Colunas da tabela da fila, compartilhadas com o cabeçalho em QueueView. */
export const QUEUE_COLUMNS = 'md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_21rem]'

const STATUS_TONE: Record<ReferralStatus, 'neutral' | 'green' | 'blue'> = {
  RECEBIDO_TRIADO: 'neutral',
  AGUARDANDO_AGENDAMENTO: 'green',
  AGENDADO: 'blue',
  CONCLUIDO: 'neutral',
}

/**
 * Uma linha da fila. As ações seguem as transições que o domínio aceita
 * (Encaminhamento.transicaoPermitida): só aparece o botão que faz sentido para
 * a etapa atual.
 */
export function QueueItemRow({ item, specialty, role = 'ATENDENTE', token, onChanged, onSessionExpired }: QueueItemRowProps) {
  const [calling, setCalling] = useState(false)
  // Falta e conclusão não têm volta no backend: pedem confirmação na linha.
  const [confirming, setConfirming] = useState<'noShow' | 'conclude' | null>(null)
  const toast = useToast()
  const action = useAction(async (kind: RowAction) => {
    if (kind === 'release') {
      await staffApi.updateStatus(token, item.protocolo, 'AGUARDANDO_AGENDAMENTO')
      return { title: 'Agendamento liberado', message: `${item.nome} (${item.protocolo}) já pode escolher o horário.` }
    }
    if (kind === 'noShow') {
      const result = await staffApi.recordNoShow(token, item.protocolo)
      return {
        title: 'Falta registrada',
        message: `${item.protocolo} ficou com a ação pendente "${result.rotuloAcao}". A senha saiu do painel.`,
      }
    }
    await staffApi.updateStatus(token, item.protocolo, 'CONCLUIDO')
    return { title: 'Encaminhamento concluído', message: `${item.protocolo} saiu das ações pendentes.` }
  })

  // As ações de linha avisam por toast: a lista recarrega e a linha pode até
  // mudar de lugar, então um aviso preso nela some junto.
  async function run(kind: RowAction) {
    const done = await action.run(kind)
    setConfirming(null)
    if (done) {
      toast.success(done.title, done.message)
      onChanged()
    }
  }

  const { state: actionState, reset: resetAction } = action
  useEffect(() => {
    if (actionState.status !== 'error') return
    const error = actionState.error
    resetAction()
    if (error.isSessionError) {
      onSessionExpired()
    } else {
      const { title, message, hint } = describeError(error)
      toast.error(`${title} (${item.protocolo})`, hint ? `${message} ${hint}` : message)
    }
  }, [actionState, resetAction, onSessionExpired, toast, item.protocolo])

  const busy = action.state.status === 'loading'
  const activeAppointment = item.status === 'AGENDADO' && item.acaoPendente !== 'REAGENDAR'
  const attendant = role === 'ATENDENTE'
  const initials = item.nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <li className={`px-5 py-4 ${item.acaoPendente ? 'bg-yellow-100/40' : ''}`}>
      <div className={`grid items-center gap-3 md:gap-4 ${QUEUE_COLUMNS}`}>
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700"
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-neutral-950">{item.nome}</p>
            <p className="truncate text-sm text-neutral-600">
              <span className="font-mono">{item.protocolo}</span>
              {specialty && <> · {specialty}</>}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:contents">
          <div>
            <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
          </div>
          <div>
            {item.rotuloAcao ? (
              <Badge tone="yellow">
                <TriangleAlert aria-hidden="true" className="size-3.5" />
                {item.rotuloAcao}
              </Badge>
            ) : (
              <span className="hidden text-sm text-neutral-400 md:inline">—</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-end">
          {attendant && item.status === 'RECEBIDO_TRIADO' && (
            <Button tone="staff" onClick={() => run('release')} loading={busy}>
              <Unlock aria-hidden="true" className="size-4" />
              Liberar agendamento
            </Button>
          )}
          {attendant && activeAppointment && !calling && !confirming && (
            <>
              <Button tone="staff" onClick={() => setCalling(true)} disabled={busy}>
                <Megaphone aria-hidden="true" className="size-4" />
                Chamar
              </Button>
              <Button tone="staff" variant="secondary" onClick={() => setConfirming('noShow')} disabled={busy} title="Registrar falta">
                <UserX aria-hidden="true" className="size-4" />
                Falta
              </Button>
            </>
          )}
          {!attendant && item.status === 'AGENDADO' && !confirming && (
            <Button tone="staff" variant="secondary" onClick={() => setConfirming('conclude')} disabled={busy} title="Concluir encaminhamento">
              <CheckCheck aria-hidden="true" className="size-4" />
              Concluir
            </Button>
          )}
          {!attendant && item.status !== 'AGENDADO' && item.status !== 'CONCLUIDO' && (
            <span className="text-sm text-neutral-500">Com o atendente</span>
          )}
          {attendant && item.status === 'AGUARDANDO_AGENDAMENTO' && (
            <span className="text-sm text-neutral-500">Aguardando o cidadão</span>
          )}
        </div>
      </div>

      {confirming && (
        <ConfirmRowAction
          kind={confirming}
          name={item.nome}
          protocol={item.protocolo}
          busy={busy}
          onConfirm={() => run(confirming)}
          onCancel={() => setConfirming(null)}
        />
      )}

      {calling && (
        <CallForm
          token={token}
          protocol={item.protocolo}
          onCancel={() => setCalling(false)}
          onSessionExpired={onSessionExpired}
          onCalled={(senha, sala) => {
            setCalling(false)
            toast.success(`Senha ${senha} chamada`, `O painel da sala de espera já mostra a senha ${senha} para a sala ${sala}.`)
            onChanged()
          }}
        />
      )}
    </li>
  )
}

const CONFIRM_TEXT = {
  noShow: {
    title: 'Registrar falta',
    body: 'A senha sai do painel e o horário continua ocupado. Não dá para desfazer pelo sistema.',
    confirm: 'Sim, registrar falta',
    icon: UserX,
  },
  conclude: {
    title: 'Concluir encaminhamento',
    body: 'O encaminhamento sai das ações da fila. Não dá para reabrir pelo sistema.',
    confirm: 'Sim, concluir',
    icon: CheckCheck,
  },
} as const

function ConfirmRowAction({
  kind,
  name,
  protocol,
  busy,
  onConfirm,
  onCancel,
}: {
  kind: 'noShow' | 'conclude'
  name: string
  protocol: string
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const text = CONFIRM_TEXT[kind]
  const Icon = text.icon

  return (
    <div role="alertdialog" aria-labelledby={`confirmar-${protocol}`} className="panel-enter mt-3 flex flex-col gap-3 rounded-xl border border-red-200 bg-white p-4 md:flex-row md:items-center">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p id={`confirmar-${protocol}`} className="font-semibold text-neutral-950">
          {text.title} de {name} ({protocol})?
        </p>
        <p className="text-sm text-neutral-600">{text.body}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button tone="staff" variant="secondary" onClick={onCancel} disabled={busy} autoFocus>
          Voltar
        </Button>
        <Button tone="staff" variant="danger" onClick={onConfirm} loading={busy}>
          {text.confirm}
        </Button>
      </div>
    </div>
  )
}

function CallForm({
  token,
  protocol,
  onCancel,
  onCalled,
  onSessionExpired,
}: {
  token: string
  protocol: string
  onCancel: () => void
  onCalled: (senha: string, sala: string) => void
  onSessionExpired: () => void
}) {
  const form = useForm(
    { senha: '', sala: '' },
    {
      senha: (value) =>
        validateRequired(value, 'Informe a senha da chamada.') ??
        (/^[A-Za-z]?\s?\d{1,4}$/.test(value.trim()) ? null : 'Use letra e número, como A12.'),
      sala: (value) => validateRequired(value, 'Informe a sala.'),
    },
  )
  const call = useAction(staffApi.call)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.validateAll()) return
    const senha = form.values.senha.trim().toUpperCase()
    const result = await call.run(token, protocol, senha, form.values.sala.trim())
    if (result) onCalled(result.senha ?? senha, result.sala ?? form.values.sala.trim())
  }

  const error = call.state.status === 'error' ? call.state.error : null
  useEffect(() => {
    if (error?.isSessionError) onSessionExpired()
  }, [error, onSessionExpired])

  return (
    <form onSubmit={submit} noValidate className="panel-enter mt-3 rounded-xl border border-blue-200 bg-blue-100 p-4">
      <p className="mb-3 text-sm text-blue-900">A senha e a sala aparecem no painel público. Nome e protocolo não.</p>
      {error && !error.isSessionError && (
        <div className="mb-3">
          <ErrorAlert error={error} title="A senha não foi chamada" />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-start">
        <TextField label="Senha" placeholder="A12" maxLength={6} {...form.field('senha')} />
        <TextField label="Sala" placeholder="2" maxLength={10} {...form.field('sala')} />
        <Button type="submit" tone="staff" loading={call.state.status === 'loading'} className="sm:mt-6">
          Chamar
        </Button>
        <Button tone="staff" variant="secondary" onClick={onCancel} className="sm:mt-6">
          Voltar
        </Button>
      </div>
    </form>
  )
}

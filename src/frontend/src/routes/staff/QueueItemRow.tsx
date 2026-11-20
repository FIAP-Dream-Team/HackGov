import { useState, type FormEvent } from 'react'
import { staffApi } from '../../api/staff'
import type { QueueItem } from '../../api/types'
import { Alert, Badge, Button, TextField } from '../../components/ui'
import { useAction } from '../../hooks/useAsync'
import { useForm } from '../../hooks/useForm'
import { STATUS_LABEL } from '../../lib/labels'
import { validateRequired } from '../../lib/validation'

interface QueueItemRowProps {
  item: QueueItem
  token: string
  onChanged: (message: string) => void
}

/**
 * Uma linha da fila. As ações seguem as transições que o domínio aceita
 * (Encaminhamento.transicaoPermitida): só aparece o botão que faz sentido para
 * a etapa atual.
 */
export function QueueItemRow({ item, token, onChanged }: QueueItemRowProps) {
  const [calling, setCalling] = useState(false)
  const action = useAction(async (kind: 'release' | 'noShow' | 'conclude') => {
    if (kind === 'release') {
      const result = await staffApi.updateStatus(token, item.protocolo, 'AGUARDANDO_AGENDAMENTO')
      return `${result.protocolo}: agendamento liberado. O cidadão já pode escolher o horário.`
    }
    if (kind === 'noShow') {
      const result = await staffApi.recordNoShow(token, item.protocolo)
      return `${result.protocolo}: falta registrada. Ação pendente: ${result.rotuloAcao.toLowerCase()}.`
    }
    const result = await staffApi.updateStatus(token, item.protocolo, 'CONCLUIDO')
    return `${result.protocolo}: encaminhamento concluído.`
  })

  async function run(kind: 'release' | 'noShow' | 'conclude') {
    const message = await action.run(kind)
    if (message) onChanged(message)
  }

  const busy = action.state.status === 'loading'
  const activeAppointment = item.status === 'AGENDADO' && item.acaoPendente !== 'REAGENDAR'

  return (
    <li className="px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-neutral-950">{item.nome}</p>
          <p className="text-sm text-neutral-600">
            {item.protocolo} · {STATUS_LABEL[item.status]}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {item.rotuloAcao && <Badge tone="yellow">{item.rotuloAcao}</Badge>}
          {item.status === 'RECEBIDO_TRIADO' && (
            <Button tone="staff" onClick={() => run('release')} loading={busy}>
              Liberar agendamento
            </Button>
          )}
          {activeAppointment && !calling && (
            <>
              <Button tone="staff" onClick={() => setCalling(true)} disabled={busy}>
                Chamar senha
              </Button>
              <Button tone="staff" variant="secondary" onClick={() => run('noShow')} loading={busy}>
                Registrar falta
              </Button>
              <Button tone="staff" variant="secondary" onClick={() => run('conclude')} disabled={busy}>
                Concluir
              </Button>
            </>
          )}
        </div>
      </div>

      {action.state.status === 'error' && (
        <div className="mt-3">
          <Alert tone="error">{action.state.error.message}</Alert>
        </div>
      )}

      {calling && (
        <CallForm
          token={token}
          protocol={item.protocolo}
          onCancel={() => setCalling(false)}
          onCalled={(message) => {
            setCalling(false)
            onChanged(message)
          }}
        />
      )}
    </li>
  )
}

function CallForm({
  token,
  protocol,
  onCancel,
  onCalled,
}: {
  token: string
  protocol: string
  onCancel: () => void
  onCalled: (message: string) => void
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
    if (result) onCalled(`Senha ${result.senha} chamada para a sala ${result.sala}. O painel já mostra.`)
  }

  return (
    <form onSubmit={submit} noValidate className="mt-3 rounded-xl border border-blue-200 bg-blue-100 p-4">
      <p className="mb-3 text-sm text-blue-900">A senha e a sala aparecem no painel público. Nome e protocolo não.</p>
      {call.state.status === 'error' && (
        <div className="mb-3">
          <Alert tone="error">{call.state.error.message}</Alert>
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

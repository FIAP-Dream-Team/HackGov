import { useState } from 'react'
import { citizenApi } from '../../api/citizen'
import type { Referral } from '../../api/types'
import { Alert, Badge, Button, Card, StatusTrail } from '../../components/ui'
import { useAction } from '../../hooks/useAsync'
import { formatDateTime } from '../../lib/format'
import { SlotPicker } from './SlotPicker'

interface ReferralCardProps {
  referral: Referral
  /** Ausente no totem: lá só se acompanha a etapa, não se agenda. */
  token?: string
  onChanged?: (message: string) => void
}

type Panel = 'none' | 'book' | 'reschedule' | 'cancel'

/** Um encaminhamento: trilha, próximo passo e, no app, as ações de horário. */
export function ReferralCard({ referral, token, onChanged }: ReferralCardProps) {
  const [panel, setPanel] = useState<Panel>('none')
  const cancel = useAction(() => citizenApi.cancel(token!, referral.protocolo))
  const canAct = Boolean(token)

  async function confirmCancel() {
    const result = await cancel.run()
    if (result) {
      setPanel('none')
      onChanged?.(result.mensagem)
    }
  }

  return (
    <Card>
      <div className="mb-1 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Protocolo</p>
          <h2 className="text-lg font-bold text-neutral-950">{referral.protocolo}</h2>
        </div>
        <Badge tone={referral.status === 'CONCLUIDO' ? 'neutral' : referral.status === 'AGENDADO' ? 'blue' : 'green'}>
          {referral.rotulo}
        </Badge>
      </div>
      <p className="mb-4 text-sm text-neutral-600">
        {referral.especialidade} · {referral.unidadeDestino}
      </p>

      <StatusTrail steps={referral.trilha} />

      <p className="mt-4 rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-800">{referral.proximoPasso}</p>

      {referral.horarioMarcado && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-100 px-4 py-3 text-blue-900">
          <p className="text-xs font-semibold uppercase tracking-wide">Horário marcado</p>
          <p className="text-base font-bold">{formatDateTime(referral.horarioMarcado.dataHora)}</p>
        </div>
      )}

      {canAct && panel === 'none' && (referral.podeAgendar || referral.podeAlterarHorario) && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {referral.podeAgendar && (
            <Button block onClick={() => setPanel('book')}>
              Escolher horário
            </Button>
          )}
          {referral.podeAlterarHorario && (
            <>
              <Button block variant="secondary" onClick={() => setPanel('reschedule')}>
                Reagendar
              </Button>
              <Button block variant="danger" onClick={() => { cancel.reset(); setPanel('cancel') }}>
                Cancelar horário
              </Button>
            </>
          )}
        </div>
      )}

      {canAct && (panel === 'book' || panel === 'reschedule') && (
        <SlotPicker
          token={token!}
          protocol={referral.protocolo}
          mode={panel}
          onCancel={() => setPanel('none')}
          onDone={(confirmation) => {
            setPanel('none')
            onChanged?.(confirmation.mensagem)
          }}
        />
      )}

      {canAct && panel === 'cancel' && referral.horarioMarcado && (
        <div className="mt-4 rounded-xl border border-red-200 bg-white p-4">
          <h3 className="font-bold text-neutral-950">Cancelar o horário de {formatDateTime(referral.horarioMarcado.dataHora)}?</h3>
          <p className="mt-1 text-sm text-neutral-600">
            O horário volta a ficar livre para outra pessoa e o encaminhamento volta para aguardando agendamento.
          </p>
          {cancel.state.status === 'error' && (
            <div className="mt-3">
              <Alert tone="error">{cancel.state.error.message}</Alert>
            </div>
          )}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
            <Button variant="danger" onClick={confirmCancel} loading={cancel.state.status === 'loading'} className="sm:flex-1">
              {cancel.state.status === 'loading' ? 'Cancelando…' : 'Sim, cancelar'}
            </Button>
            <Button variant="secondary" onClick={() => setPanel('none')} className="sm:flex-1">
              Manter horário
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

import { useEffect, useState } from 'react'
import { citizenApi } from '../../api/citizen'
import type { Referral } from '../../api/types'
import { ArrowRight, CalendarClock, CalendarPlus, CalendarX2, Stethoscope } from 'lucide-react'
import { AppointmentTicket, Badge, Button, Card, ErrorAlert, StatusTrail, useToast } from '../../components/ui'
import { useAction } from '../../hooks/useAsync'
import { formatDateTime } from '../../lib/format'
import { SlotPicker } from './SlotPicker'

interface ReferralCardProps {
  referral: Referral
  /** Ausente no totem: lá só se acompanha a etapa, não se agenda. */
  token?: string
  /** Chamado depois de uma ação que muda o encaminhamento, para recarregar. */
  onChanged?: () => void
  onSessionExpired?: () => void
  /** Letra e trilha maiores, para o totem. */
  size?: 'md' | 'lg'
}

type Panel = 'none' | 'book' | 'reschedule' | 'cancel'

/** Um encaminhamento: trilha, próximo passo e, no app, as ações de horário. */
export function ReferralCard({ referral, token, onChanged, onSessionExpired, size = 'md' }: ReferralCardProps) {
  const [panel, setPanel] = useState<Panel>('none')
  const toast = useToast()
  const cancel = useAction(() => citizenApi.cancel(token!, referral.protocolo))
  const canAct = Boolean(token)

  async function confirmCancel() {
    const result = await cancel.run()
    if (result) {
      setPanel('none')
      toast.success('Horário cancelado', 'A vaga voltou para a lista e o encaminhamento aguarda um novo horário.')
      onChanged?.()
    }
  }

  useEffect(() => {
    if (cancel.state.status === 'error' && cancel.state.error.isSessionError) onSessionExpired?.()
  }, [cancel.state, onSessionExpired])

  return (
    <Card>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <Stethoscope aria-hidden="true" className="size-6" />
          </span>
          <div className="min-w-0">
            <h2 className={`font-bold text-neutral-950 ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>{referral.especialidade}</h2>
            <p className="truncate text-sm text-neutral-600">
              {referral.unidadeDestino} · <span className="font-mono">{referral.protocolo}</span>
            </p>
          </div>
        </div>
        <Badge tone={referral.status === 'AGENDADO' ? 'green' : referral.podeAgendar ? 'yellow' : 'neutral'}>
          {referral.rotulo}
        </Badge>
      </div>

      <StatusTrail steps={referral.trilha} size={size} />

      <p className={`mt-5 flex items-start gap-2 rounded-xl px-3 py-2.5 text-neutral-800 ${
        referral.podeAgendar ? 'bg-green-100 text-green-900' : 'bg-neutral-100'
      } ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
        <ArrowRight aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>
          <span className="font-semibold">Próximo passo: </span>
          {referral.proximoPasso}
        </span>
      </p>

      {referral.horarioMarcado && (
        <div className="mt-4">
          <AppointmentTicket
            dateTime={referral.horarioMarcado.dataHora}
            specialty={referral.especialidade}
            unit={referral.unidadeDestino}
            protocol={referral.protocolo}
          />
        </div>
      )}

      {canAct && panel === 'none' && (referral.podeAgendar || referral.podeAlterarHorario) && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {referral.podeAgendar && (
            <Button block onClick={() => setPanel('book')}>
              <CalendarPlus aria-hidden="true" className="size-4" />
              Escolher horário
            </Button>
          )}
          {referral.podeAlterarHorario && (
            <>
              <Button block variant="secondary" onClick={() => setPanel('reschedule')}>
                <CalendarClock aria-hidden="true" className="size-4" />
                Reagendar
              </Button>
              <Button block variant="danger" onClick={() => { cancel.reset(); setPanel('cancel') }}>
                <CalendarX2 aria-hidden="true" className="size-4" />
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
          onSessionExpired={onSessionExpired}
          onDone={(confirmation) => {
            setPanel('none')
            toast.success(panel === 'book' ? 'Horário confirmado' : 'Horário reagendado', confirmation.mensagem)
            onChanged?.()
          }}
        />
      )}

      {canAct && panel === 'cancel' && referral.horarioMarcado && (
        <div className="panel-enter mt-4 rounded-xl border border-red-200 bg-white p-4">
          <h3 className="font-bold text-neutral-950">Cancelar o horário de {formatDateTime(referral.horarioMarcado.dataHora)}?</h3>
          <p className="mt-1 text-sm text-neutral-600">
            O horário volta a ficar livre para outra pessoa e o encaminhamento volta para aguardando agendamento.
          </p>
          {cancel.state.status === 'error' && !cancel.state.error.isSessionError && (
            <div className="mt-3">
              <ErrorAlert error={cancel.state.error} onRetry={confirmCancel} title="O horário não foi cancelado" />
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

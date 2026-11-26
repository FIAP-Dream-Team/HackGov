import { useEffect, useState } from 'react'
import { citizenApi } from '../../api/citizen'
import type { BookingConfirmation } from '../../api/types'
import { Button, EmptyState, ErrorAlert, Skeleton } from '../../components/ui'
import { useAction, useQuery } from '../../hooks/useAsync'
import { CalendarDays, CalendarOff, Check, MapPin } from 'lucide-react'
import type { FreeSlot } from '../../api/types'
import { formatLongDay } from '../../lib/format'

interface SlotPickerProps {
  token: string
  protocol: string
  /** Reagendar troca um horário ativo; agendar marca o primeiro. */
  mode: 'book' | 'reschedule'
  onDone: (confirmation: BookingConfirmation) => void
  onCancel: () => void
  onSessionExpired?: () => void
}

/** Escolha de horário livre (US03). Só lista vaga real da especialidade. */
export function SlotPicker({ token, protocol, mode, onDone, onCancel, onSessionExpired }: SlotPickerProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const slots = useQuery((signal) => citizenApi.freeSlots(token, protocol, signal), [token, protocol])
  const confirm = useAction((horarioId: number) =>
    mode === 'book' ? citizenApi.book(token, protocol, horarioId) : citizenApi.reschedule(token, protocol, horarioId),
  )

  useEffect(() => {
    const failed =
      (slots.state.status === 'error' && slots.state.error.isSessionError) ||
      (confirm.state.status === 'error' && confirm.state.error.isSessionError)
    if (failed) onSessionExpired?.()
  }, [slots.state, confirm.state, onSessionExpired])

  async function submit() {
    if (selected === null) return
    const result = await confirm.run(selected)
    if (result) {
      onDone(result)
    } else {
      // A vaga pode ter sido ocupada por outra pessoa: recarrega a lista.
      setSelected(null)
      slots.reload()
    }
  }

  return (
    <div className="panel-enter mt-4 rounded-xl border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 font-bold text-neutral-950">
        {mode === 'book' ? 'Escolha um horário' : 'Escolha o novo horário'}
      </h3>

      {confirm.state.status === 'error' && !confirm.state.error.isSessionError && (
        <div className="mb-3">
          <ErrorAlert
            error={confirm.state.error}
            title={mode === 'book' ? 'O horário não foi marcado' : 'O horário não foi trocado'}
          />
        </div>
      )}

      {slots.state.status === 'loading' && <Skeleton lines={3} label="Buscando horários livres" />}

      {slots.state.status === 'error' && !slots.state.error.isSessionError && (
        <ErrorAlert error={slots.state.error} onRetry={slots.reload} title="Não foi possível buscar os horários" />
      )}

      {slots.state.status === 'success' && !slots.state.data.temHorario && (
        <EmptyState icon={CalendarOff} title="Sem horário livre agora">
          {slots.state.data.mensagem ?? 'A unidade ainda não publicou vagas para esta especialidade.'}
        </EmptyState>
      )}

      {slots.state.status === 'success' && slots.state.data.temHorario && (
        <>
          <p className="mb-4 flex items-center gap-1.5 text-sm text-neutral-600">
            <MapPin aria-hidden="true" className="size-4" />
            {slots.state.data.especialidade} · {slots.state.data.unidade}
          </p>
          <fieldset className="flex flex-col gap-4">
            <legend className="sr-only">Horários livres</legend>
            {groupByDay(slots.state.data.horarios).map(([day, daySlots]) => (
              <div key={day}>
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-800">
                  <CalendarDays aria-hidden="true" className="size-4 text-green-600" />
                  <span>{formatLongDay(day)}</span>
                  <span className="font-normal text-neutral-500">
                    · {daySlots.length} {daySlots.length === 1 ? 'vaga' : 'vagas'}
                  </span>
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {daySlots.map((slot) => {
                    const active = selected === slot.id
                    return (
                      <label
                        key={slot.id}
                        className={`flex min-h-12 cursor-pointer items-center justify-center gap-1 rounded-xl border-2 text-base font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-green-300 ${
                          active
                            ? 'border-green-500 bg-green-500 text-neutral-50'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-green-400 hover:bg-green-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`horario-${protocol}`}
                          value={slot.id}
                          checked={active}
                          onChange={() => setSelected(slot.id)}
                          className="sr-only"
                        />
                        {active && <Check aria-hidden="true" className="size-4" strokeWidth={3} />}
                        <span>{slot.hora}</span>
                        <span className="sr-only"> de {formatLongDay(day)}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
          </fieldset>
        </>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
        {slots.state.status === 'success' && slots.state.data.temHorario && (
          <Button onClick={submit} disabled={selected === null} loading={confirm.state.status === 'loading'} className="sm:flex-1">
            {confirm.state.status === 'loading' ? 'Confirmando…' : 'Confirmar horário'}
          </Button>
        )}
        <Button variant="secondary" onClick={onCancel} className="sm:flex-1">
          Voltar
        </Button>
      </div>
    </div>
  )
}

/** Agrupa os horários por data, mantendo a ordem em que o servidor mandou. */
function groupByDay(slots: FreeSlot[]): [string, FreeSlot[]][] {
  const groups = new Map<string, FreeSlot[]>()
  for (const slot of slots) {
    groups.set(slot.data, [...(groups.get(slot.data) ?? []), slot])
  }
  return [...groups.entries()]
}

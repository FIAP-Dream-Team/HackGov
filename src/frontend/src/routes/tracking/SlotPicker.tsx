import { useState } from 'react'
import { citizenApi } from '../../api/citizen'
import type { BookingConfirmation } from '../../api/types'
import { Alert, Button, EmptyState, Skeleton } from '../../components/ui'
import { useAction, useQuery } from '../../hooks/useAsync'
import { formatDate, formatWeekday } from '../../lib/format'

interface SlotPickerProps {
  token: string
  protocol: string
  /** Reagendar troca um horário ativo; agendar marca o primeiro. */
  mode: 'book' | 'reschedule'
  onDone: (confirmation: BookingConfirmation) => void
  onCancel: () => void
}

/** Escolha de horário livre (US03). Só lista vaga real da especialidade. */
export function SlotPicker({ token, protocol, mode, onDone, onCancel }: SlotPickerProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const slots = useQuery((signal) => citizenApi.freeSlots(token, protocol, signal), [token, protocol])
  const confirm = useAction((horarioId: number) =>
    mode === 'book' ? citizenApi.book(token, protocol, horarioId) : citizenApi.reschedule(token, protocol, horarioId),
  )

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
    <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 font-bold text-neutral-950">
        {mode === 'book' ? 'Escolha um horário' : 'Escolha o novo horário'}
      </h3>

      {confirm.state.status === 'error' && (
        <div className="mb-3">
          <Alert tone="error">{confirm.state.error.message}</Alert>
        </div>
      )}

      {slots.state.status === 'loading' && <Skeleton lines={3} label="Buscando horários livres" />}

      {slots.state.status === 'error' && (
        <Alert tone="error" action={{ label: 'Tentar de novo', onClick: slots.reload }}>
          {slots.state.error.message}
        </Alert>
      )}

      {slots.state.status === 'success' && !slots.state.data.temHorario && (
        <EmptyState title="Sem horário livre agora">
          {slots.state.data.mensagem ?? 'A unidade ainda não publicou vagas para esta especialidade.'}
        </EmptyState>
      )}

      {slots.state.status === 'success' && slots.state.data.temHorario && (
        <>
          <p className="mb-3 text-sm text-neutral-600">
            {slots.state.data.especialidade} · {slots.state.data.unidade}
          </p>
          <fieldset>
            <legend className="sr-only">Horários livres</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.state.data.horarios.map((slot) => {
                const active = selected === slot.id
                return (
                  <label
                    key={slot.id}
                    className={`cursor-pointer rounded-[10px] border px-2 py-2.5 text-center text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-green-300 ${
                      active
                        ? 'border-green-500 bg-green-100 font-bold text-green-800'
                        : 'border-neutral-300 bg-neutral-50 text-neutral-800 hover:border-green-400'
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
                    <span className="block capitalize">
                      {formatWeekday(slot.data)} {formatDate(slot.data).slice(0, 5)}
                    </span>
                    <span className="block text-base">{slot.hora}</span>
                  </label>
                )
              })}
            </div>
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

import { useEffect, useState } from 'react'
import { staffApi } from '../../api/staff'
import type { Queue } from '../../api/types'
import { Alert, Button, Card, EmptyState, Skeleton } from '../../components/ui'
import { useQuery } from '../../hooks/useAsync'
import { formatDuration } from '../../lib/format'
import { QueueItemRow } from './QueueItemRow'

interface QueueViewProps {
  token: string
  onSessionExpired: () => void
}

/** Fila da unidade por especialidade, com indicadores (US05). */
export function QueueView({ token, onSessionExpired }: QueueViewProps) {
  const [specialty, setSpecialty] = useState('')
  const [specialties, setSpecialties] = useState<string[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const queue = useQuery((signal) => staffApi.queue(token, specialty || undefined, signal), [token, specialty])

  useEffect(() => {
    if (queue.state.status === 'error' && queue.state.error.isSessionError) onSessionExpired()
    // Guarda as especialidades da fila completa para o filtro não encolher ao filtrar.
    if (queue.state.status === 'success' && !specialty) {
      setSpecialties(queue.state.data.especialidades.map((segment) => segment.especialidade))
    }
  }, [queue.state, specialty, onSessionExpired])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Fila de encaminhamentos</h1>
          <p className="text-sm text-neutral-600">Encaminhamentos da sua unidade de lotação.</p>
        </div>
        <div className="flex items-end gap-2">
          <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
            Especialidade
            <select
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              className="min-h-11 rounded-[10px] border border-neutral-300 bg-white px-3 text-base font-normal"
            >
              <option value="">Todas</option>
              {specialties.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <Button tone="staff" variant="secondary" onClick={queue.reload} loading={queue.refreshing}>
            Atualizar
          </Button>
        </div>
      </div>

      {notice && (
        <Alert tone="success" action={{ label: 'Fechar', onClick: () => setNotice(null) }}>
          {notice}
        </Alert>
      )}

      {queue.state.status === 'loading' && (
        <Card>
          <Skeleton lines={5} label="Carregando a fila" />
        </Card>
      )}

      {queue.state.status === 'error' && !queue.state.error.isSessionError && (
        <Alert tone="error" title="Não foi possível carregar a fila" action={{ label: 'Tentar de novo', onClick: queue.reload }}>
          {queue.state.error.message}
        </Alert>
      )}

      {queue.state.status === 'success' && (
        <>
          <Indicators queue={queue.state.data} />
          <QueueSegments
            queue={queue.state.data}
            token={token}
            onChanged={(message) => {
              setNotice(message)
              queue.reload()
            }}
          />
        </>
      )}
    </div>
  )
}

function Indicators({ queue }: { queue: Queue }) {
  const total = queue.especialidades.reduce((sum, segment) => sum + segment.encaminhamentos.length, 0)
  const pending = queue.especialidades.reduce(
    (sum, segment) => sum + segment.encaminhamentos.filter((item) => item.acaoPendente).length,
    0,
  )

  const tiles = [
    { label: 'Na fila', value: String(total) },
    { label: 'Com ação pendente', value: String(pending) },
    {
      label: 'Espera média para marcar',
      value: queue.esperaMediaSegundos !== undefined ? formatDuration(queue.esperaMediaSegundos) : '—',
      note: queue.mensagemEspera,
    },
    {
      label: 'Taxa de faltas',
      value: queue.taxaFaltasPercentual !== undefined ? `${Math.round(queue.taxaFaltasPercentual)}%` : '—',
      note: queue.mensagemFaltas ?? `${queue.faltas} de ${queue.agendamentos} agendamentos`,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200">
          <p className="text-xs font-semibold text-neutral-500">{tile.label}</p>
          <p className="text-2xl font-bold text-neutral-950">{tile.value}</p>
          {tile.note && <p className="mt-0.5 text-xs text-neutral-500">{tile.note}</p>}
        </div>
      ))}
    </div>
  )
}

function QueueSegments({ queue, token, onChanged }: { queue: Queue; token: string; onChanged: (message: string) => void }) {
  if (queue.especialidades.length === 0) {
    return <EmptyState title={queue.mensagem ?? 'Nenhum encaminhamento nesta unidade.'} />
  }

  return (
    <div className="flex flex-col gap-4">
      {queue.especialidades.map((segment) => (
        <Card key={segment.especialidade} className="p-0 sm:p-0">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
            <h2 className="font-bold text-neutral-950">{segment.especialidade}</h2>
            <span className="text-sm text-neutral-500">
              {segment.encaminhamentos.length} {segment.encaminhamentos.length === 1 ? 'pessoa' : 'pessoas'}
            </span>
          </div>
          {segment.encaminhamentos.length === 0 ? (
            <p className="px-5 py-4 text-sm text-neutral-600">Nenhum encaminhamento desta especialidade.</p>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {segment.encaminhamentos.map((item) => (
                <QueueItemRow key={item.protocolo} item={item} token={token} onChanged={onChanged} />
              ))}
            </ul>
          )}
        </Card>
      ))}
    </div>
  )
}

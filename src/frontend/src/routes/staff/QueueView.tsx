import { CalendarX2, ClipboardList, Clock, Inbox, RefreshCw, TriangleAlert, UserCog, type LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { staffApi } from '../../api/staff'
import type { Queue, StaffRole } from '../../api/types'
import { Card, EmptyState, ErrorAlert, Skeleton } from '../../components/ui'
import { useQuery } from '../../hooks/useAsync'
import { formatDuration } from '../../lib/format'
import { QueueItemRow, QUEUE_COLUMNS } from './QueueItemRow'

interface QueueViewProps {
  token: string
  onSessionExpired: () => void
}

const ALL = ''

/**
 * Fila da unidade por especialidade, com indicadores (US05). Carrega a fila
 * inteira uma vez e filtra por aba no navegador: assim cada aba mostra a
 * contagem sem uma chamada por especialidade.
 */
export function QueueView({ token, onSessionExpired }: QueueViewProps) {
  const [tab, setTab] = useState(ALL)
  const queue = useQuery((signal) => staffApi.queue(token, undefined, signal), [token])

  useEffect(() => {
    if (queue.state.status === 'error' && queue.state.error.isSessionError) onSessionExpired()
  }, [queue.state, onSessionExpired])

  const data = queue.state.status === 'success' ? queue.state.data : null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Fila de encaminhamentos</h1>
          <p className="text-sm text-neutral-600">Encaminhamentos da sua unidade de lotação, com o que falta fazer em cada um.</p>
        </div>
        <button
          type="button"
          onClick={queue.reload}
          disabled={queue.refreshing}
          className="flex min-h-11 items-center gap-2 rounded-[10px] border border-neutral-300 bg-neutral-50 px-4 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 disabled:opacity-60"
        >
          <RefreshCw aria-hidden="true" className={`size-4 ${queue.refreshing ? 'animate-spin motion-reduce:animate-none' : ''}`} />
          Atualizar
        </button>
      </div>

      {queue.state.status === 'loading' && (
        <Card>
          <Skeleton lines={5} label="Carregando a fila" />
        </Card>
      )}

      {queue.state.status === 'error' && !queue.state.error.isSessionError && (
        <ErrorAlert error={queue.state.error} onRetry={queue.reload} title="Não foi possível carregar a fila" />
      )}

      {data && (
        <>
          <RoleNotice role={data.perfil} />
          <Indicators queue={data} />
          <QueueTable queue={data} tab={tab} onTab={setTab} token={token} onChanged={queue.reload} onSessionExpired={onSessionExpired} />
        </>
      )}
    </div>
  )
}

/** Diz o que o perfil logado pode fazer (segregação de funções). */
function RoleNotice({ role }: { role: StaffRole }) {
  const gestor = role === 'GESTOR'
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-100 px-4 py-3 text-sm text-blue-900">
      <UserCog aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <p>
        <strong>Você entrou como {gestor ? 'gestor' : 'atendente'}.</strong>{' '}
        {gestor
          ? 'Você acompanha a fila e os indicadores e conclui encaminhamentos. Liberar, chamar senha e registrar falta ficam com o atendente.'
          : 'Você libera agendamentos, chama senhas e registra faltas. Concluir o encaminhamento fica com o gestor, que confere o que foi registrado.'}
      </p>
    </div>
  )
}

function Indicators({ queue }: { queue: Queue }) {
  const total = queue.especialidades.reduce((sum, segment) => sum + segment.encaminhamentos.length, 0)
  const pending = queue.especialidades.reduce(
    (sum, segment) => sum + segment.encaminhamentos.filter((item) => item.acaoPendente).length,
    0,
  )

  const tiles: { label: string; value: string; note?: string; icon: LucideIcon; alert?: boolean }[] = [
    { label: 'Na fila', value: String(total), icon: ClipboardList, note: `${queue.especialidades.length} especialidades` },
    {
      label: 'Com ação pendente',
      value: String(pending),
      icon: TriangleAlert,
      alert: pending > 0,
      note: pending > 0 ? 'Precisam de contato da equipe' : 'Nada pendente agora',
    },
    {
      label: 'Espera média para marcar',
      value: queue.esperaMediaSegundos !== undefined ? formatDuration(queue.esperaMediaSegundos) : '—',
      note: queue.mensagemEspera ?? 'Da liberação até a marcação',
      icon: Clock,
    },
    {
      label: 'Taxa de faltas',
      value: queue.taxaFaltasPercentual !== undefined ? `${Math.round(queue.taxaFaltasPercentual)}%` : '—',
      note: queue.mensagemFaltas ?? `${queue.faltas} de ${queue.agendamentos} agendamentos`,
      icon: CalendarX2,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ label, value, note, icon: Icon, alert }) => (
        <div
          key={label}
          className={`flex gap-3 rounded-2xl border p-4 ${alert ? 'border-yellow-300 bg-yellow-100' : 'border-neutral-200 bg-neutral-50'}`}
        >
          <span
            className={`hidden size-10 shrink-0 items-center justify-center rounded-xl sm:flex ${
              alert ? 'bg-yellow-500 text-neutral-950' : 'bg-blue-100 text-blue-600'
            }`}
          >
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className={`text-xs font-semibold ${alert ? 'text-yellow-900' : 'text-neutral-500'}`}>{label}</p>
            <p className="text-2xl font-bold text-neutral-950">{value}</p>
            {note && <p className={`mt-0.5 text-xs ${alert ? 'text-yellow-900' : 'text-neutral-500'}`}>{note}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

interface QueueTableProps {
  queue: Queue
  tab: string
  onTab: (tab: string) => void
  token: string
  onChanged: () => void
  onSessionExpired: () => void
}

function QueueTable({ queue, tab, onTab, token, onChanged, onSessionExpired }: QueueTableProps) {
  const rows = useMemo(
    () =>
      queue.especialidades
        .filter((segment) => tab === ALL || segment.especialidade === tab)
        .flatMap((segment) => segment.encaminhamentos.map((item) => ({ item, specialty: segment.especialidade }))),
    [queue, tab],
  )

  if (queue.especialidades.length === 0) {
    return <EmptyState icon={Inbox} title={queue.mensagem ?? 'Nenhum encaminhamento nesta unidade.'} />
  }

  const total = queue.especialidades.reduce((sum, segment) => sum + segment.encaminhamentos.length, 0)
  const tabs = [
    { id: ALL, label: 'Todas', count: total },
    ...queue.especialidades.map((segment) => ({
      id: segment.especialidade,
      label: segment.especialidade,
      count: segment.encaminhamentos.length,
    })),
  ]

  return (
    <Card className="overflow-hidden p-0! sm:p-0!">
      <div role="tablist" aria-label="Especialidade" className="flex gap-1 overflow-x-auto border-b border-neutral-200 px-3 pt-3">
        {tabs.map((option) => {
          const active = option.id === tab
          return (
            <button
              key={option.id || 'todas'}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTab(option.id)}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                active ? 'border-blue-500 text-blue-600' : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {option.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${active ? 'bg-blue-500 text-neutral-50' : 'bg-neutral-200 text-neutral-700'}`}
              >
                {option.count}
              </span>
            </button>
          )
        })}
      </div>

      <div role="tabpanel">
        <div
          aria-hidden="true"
          className={`hidden gap-4 border-b border-neutral-200 bg-neutral-100 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 md:grid ${QUEUE_COLUMNS}`}
        >
          <span>Pessoa</span>
          <span>Etapa</span>
          <span>Ação pendente</span>
          <span className="text-right">O que fazer</span>
        </div>

        {rows.length === 0 ? (
          <p className="px-5 py-6 text-sm text-neutral-600">Nenhum encaminhamento desta especialidade.</p>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {rows.map(({ item, specialty }) => (
              <QueueItemRow
                key={item.protocolo}
                item={item}
                specialty={tab === ALL ? specialty : undefined}
                role={queue.perfil}
                token={token}
                onChanged={onChanged}
                onSessionExpired={onSessionExpired}
              />
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}

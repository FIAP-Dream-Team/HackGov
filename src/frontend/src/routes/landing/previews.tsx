import { AArrowUp, CircleHelp, CreditCard, IdCard, Volume2 } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import type { QueueItem, Referral, TrailStep } from '../../api/types'
import { NumericKeypad } from '../../components/ui'
import { MethodCard } from '../kiosk/KioskHome'
import { QUEUE_COLUMNS, QueueItemRow } from '../staff/QueueItemRow'
import { ReferralCard } from '../tracking/ReferralCard'

// Previews da home montados com os componentes de verdade do app, alimentados
// com dados de exemplo (sintéticos). Quando o app muda, a home muda junto.

const noop = () => undefined

/**
 * Moldura de vitrine: o componente aparece igual ao app, mas não recebe
 * clique nem foco (`inert`), porque na home ele é só ilustração.
 */
export function Showcase({ children, label, className = '' }: { children: ReactNode; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.setAttribute('inert', '')
  }, [])

  return (
    <figure className={`w-full ${className}`}>
      <div ref={ref} aria-hidden="true" className="select-none">
        {children}
      </div>
      <figcaption className="mt-2 text-center text-xs text-neutral-500">{label}</figcaption>
    </figure>
  )
}

/** Data daqui a `days` dias, às `hour` horas, no formato do backend. */
function inDays(days: number, hour: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(hour)}:00:00`
}

function trail(current: number): TrailStep[] {
  const steps: [TrailStep['status'], string][] = [
    ['RECEBIDO_TRIADO', 'Recebido e triado'],
    ['AGUARDANDO_AGENDAMENTO', 'Aguardando agendamento'],
    ['AGENDADO', 'Agendado'],
    ['CONCLUIDO', 'Concluído'],
  ]
  return steps.map(([status, rotulo], index) => ({
    status,
    rotulo,
    situacao: index < current ? 'CONCLUIDA' : index === current ? 'ATUAL' : 'PENDENTE',
  }))
}

const SCHEDULED: Referral = {
  protocolo: 'MV-2026-0004',
  status: 'AGENDADO',
  rotulo: 'Agendado',
  especialidade: 'Ortopedia',
  unidadeDestino: 'Ambulatório Central',
  podeAgendar: false,
  podeAlterarHorario: false,
  proximoPasso: 'No dia, chegue com 15 minutos de antecedência.',
  horarioMarcado: { id: 1, dataHora: inDays(9, 10) },
  trilha: trail(2),
  agendamentos: [],
}

const WAITING: Referral = {
  protocolo: 'MV-2026-0002',
  status: 'AGUARDANDO_AGENDAMENTO',
  rotulo: 'Aguardando agendamento',
  especialidade: 'Dermatologia',
  unidadeDestino: 'Ambulatório Central',
  podeAgendar: true,
  podeAlterarHorario: false,
  proximoPasso: 'Já é possível escolher um horário no aplicativo.',
  trilha: trail(1),
  agendamentos: [],
}

/** Cartão do app com horário marcado: o resultado da jornada. */
export function HeroPreview() {
  return (
    <Showcase label="Tela do aplicativo · exemplo com dados sintéticos">
      <ReferralCard referral={SCHEDULED} />
    </Showcase>
  )
}

export function TrackingPreview() {
  return (
    <Showcase label="Acompanhamento no aplicativo">
      <ReferralCard referral={WAITING} token="exemplo" />
    </Showcase>
  )
}

export function TotemPreview() {
  return (
    <Showcase label="Totem da UBS, com teclado e acessibilidade" className="mx-auto max-w-[360px]">
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="grid grid-cols-2 gap-2 [&_button]:p-3 [&_span.block.text-base]:hidden [&_span.block.text-xl]:text-base">
          <MethodCard icon={CreditCard} title="Cartão SUS" text="" selected onSelect={noop} />
          <MethodCard icon={IdCard} title="CPF" text="" selected={false} onSelect={noop} />
        </div>
        <div className="rounded-[10px] border border-green-500 bg-white px-3 py-2 text-lg tracking-wider text-neutral-950">
          100 0000 0006 00<span className="animate-pulse text-green-600">|</span>
        </div>
        <div className="[&_button]:h-11 [&_button]:text-lg">
          <NumericKeypad onDigit={noop} onBackspace={noop} onClear={noop} targetLabel="Cartão SUS" />
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-neutral-200 pt-3">
          {[
            [AArrowUp, 'Aumentar letra'],
            [Volume2, 'Ouvir a tela'],
            [CircleHelp, 'Ajuda'],
          ].map(([Icon, label]) => {
            const I = Icon as typeof AArrowUp
            return (
              <span
                key={label as string}
                className="flex flex-col items-center gap-1 rounded-xl border-2 border-neutral-200 bg-white px-1 py-2 text-center text-xs font-bold text-neutral-800"
              >
                <I aria-hidden="true" className="size-5" />
                {label as string}
              </span>
            )
          })}
        </div>
      </div>
    </Showcase>
  )
}

export function PanelPreview() {
  return (
    <Showcase label="Painel da sala de espera">
      <div className="rounded-2xl bg-green-900 p-5 text-neutral-50">
        <div className="mb-4 flex items-center justify-between text-xs text-green-200">
          <span>Minha Vez · Sala de espera</span>
          <span className="flex items-center gap-1.5 rounded-full bg-green-800 px-2.5 py-0.5">
            <span className="size-1.5 rounded-full bg-green-400" /> Ao vivo
          </span>
        </div>
        <div className="rounded-2xl bg-yellow-500 px-4 py-6 text-center text-neutral-950">
          <p className="text-sm">É a vez de alguém.</p>
          <p className="my-1 text-6xl leading-none font-extrabold tracking-tight">A12</p>
          <p className="text-xl font-bold">Sala 2</p>
        </div>
        <p className="mt-3 text-center text-xs text-green-300">Sem nome, protocolo nem dado clínico.</p>
      </div>
    </Showcase>
  )
}

const QUEUE: { item: QueueItem; specialty: string }[] = [
  { item: { protocolo: 'MV-2026-0001', nome: 'Maria Andrade', status: 'RECEBIDO_TRIADO' }, specialty: 'Cardiologia' },
  {
    item: {
      protocolo: 'MV-2026-0002',
      nome: 'João Pedro Ribeiro',
      status: 'AGUARDANDO_AGENDAMENTO',
      acaoPendente: 'COBRAR_MARCACAO',
      rotuloAcao: 'Cobrar marcação',
    },
    specialty: 'Dermatologia',
  },
  { item: { protocolo: 'MV-2026-0004', nome: 'Carlos Eduardo Souza', status: 'AGENDADO' }, specialty: 'Ortopedia' },
]

export function StaffPreview() {
  return (
    <Showcase label="Fila da equipe · exemplo com dados sintéticos">
      {/* No computador, a tabela tem a largura do app e é reduzida com zoom
          para caber na coluna; no celular ela empilha, como no próprio app. */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
        <div className="md:w-[980px] md:[zoom:0.48]">
          <div className="flex gap-1 overflow-hidden border-b border-neutral-200 px-3 pt-3 text-sm font-semibold">
            <span className="-mb-px shrink-0 border-b-2 border-blue-500 px-3 py-2.5 text-blue-600">Todas 6</span>
            <span className="shrink-0 px-3 py-2.5 text-neutral-600">Cardiologia 1</span>
            <span className="shrink-0 px-3 py-2.5 text-neutral-600">Dermatologia 2</span>
            <span className="shrink-0 px-3 py-2.5 text-neutral-600">Ortopedia 3</span>
          </div>
          <div
            className={`hidden gap-4 border-b border-neutral-200 bg-neutral-100 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 md:grid ${QUEUE_COLUMNS}`}
          >
            <span>Pessoa</span>
            <span>Etapa</span>
            <span>Ação pendente</span>
            <span className="text-right">O que fazer</span>
          </div>
          <ul className="divide-y divide-neutral-200">
            {QUEUE.map(({ item, specialty }) => (
              <QueueItemRow
                key={item.protocolo}
                item={item}
                specialty={specialty}
                token="exemplo"
                onChanged={noop}
                onSessionExpired={noop}
              />
            ))}
          </ul>
        </div>
      </div>
    </Showcase>
  )
}

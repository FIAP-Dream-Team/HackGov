// Tipos espelhando docs/fase-4/contrato-da-api.md. Campo opcional é campo que o
// servidor omite quando é nulo.

export type Channel = 'TOTEM' | 'APP' | 'EQUIPE'

export type ReferralStatus = 'RECEBIDO_TRIADO' | 'AGUARDANDO_AGENDAMENTO' | 'AGENDADO' | 'CONCLUIDO'

export type AppointmentStatus = 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO' | 'FALTA'

export interface TrailStep {
  status: ReferralStatus
  rotulo: string
  situacao: 'CONCLUIDA' | 'ATUAL' | 'PENDENTE'
}

export interface ScheduledSlot {
  id: number
  dataHora: string
}

export interface AppointmentSummary {
  id: number
  dataHora: string
  status: AppointmentStatus
}

export interface Referral {
  protocolo: string
  status: ReferralStatus
  rotulo: string
  especialidade: string
  unidadeDestino: string
  podeAgendar: boolean
  podeAlterarHorario: boolean
  proximoPasso: string
  horarioMarcado?: ScheduledSlot
  trilha: TrailStep[]
  agendamentos: AppointmentSummary[]
}

export interface PersonalArea {
  temEncaminhamento: boolean
  situacao: 'COM_ENCAMINHAMENTO' | 'SEM_ENCAMINHAMENTO'
  mensagem?: string
  encaminhamentos: Referral[]
}

export interface IdentificationResponse {
  token: string
  canal: Channel
  provedor?: string
  oauthSimulado?: boolean
  areaPessoal: PersonalArea
}

export interface SignUpRequest {
  nome: string
  cpf: string
  dataNascimento: string
  senha: string
  cartaoSus?: string
}

export interface FreeSlot {
  id: number
  data: string
  hora: string
  especialidade: string
  unidade: string
}

export interface FreeSlotList {
  temHorario: boolean
  protocolo: string
  especialidade: string
  unidade: string
  horarios: FreeSlot[]
  mensagem?: string
}

export interface BookingConfirmation {
  protocolo: string
  especialidade: string
  data: string
  hora: string
  unidade: string
  status: ReferralStatus
  agendamentoId: number
  agendamentoAnteriorId?: number
  mensagem: string
}

export interface CancellationResponse {
  protocolo: string
  status: ReferralStatus
  mensagem: string
}

export interface StaffLoginResponse {
  token: string
  canal: 'EQUIPE'
}

export type PendingAction = 'COBRAR_MARCACAO' | 'REAGENDAR'

export interface QueueItem {
  protocolo: string
  nome: string
  status: ReferralStatus
  acaoPendente?: PendingAction
  rotuloAcao?: string
}

export interface QueueSegment {
  especialidade: string
  encaminhamentos: QueueItem[]
}

export interface Queue {
  especialidades: QueueSegment[]
  mensagem?: string
  esperaMediaSegundos?: number
  mensagemEspera?: string
  faltas: number
  agendamentos: number
  taxaFaltasPercentual?: number
  mensagemFaltas?: string
}

export interface StatusUpdated {
  protocolo: string
  status: ReferralStatus
  rotulo: string
}

export interface NoShowRecorded {
  protocolo: string
  acaoPendente: PendingAction
  rotuloAcao: string
}

export interface Panel {
  temChamada: boolean
  senha?: string
  sala?: string
  estado?: string
  cor?: string
  mensagem?: string
}

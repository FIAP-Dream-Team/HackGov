import type { ReferralStatus } from '../api/types'

// Mesmos rótulos de AreaPessoal.rotulo() no backend. A fila da equipe manda só
// o código do status, então o texto vem daqui.
export const STATUS_LABEL: Record<ReferralStatus, string> = {
  RECEBIDO_TRIADO: 'Recebido e triado',
  AGUARDANDO_AGENDAMENTO: 'Aguardando agendamento',
  AGENDADO: 'Agendado',
  CONCLUIDO: 'Concluído',
}

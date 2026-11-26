// Endpoints do canal institucional (US05 e as ações da equipe nas US02 e US04).

import { request } from './client'
import type { NoShowRecorded, Panel, Queue, ReferralStatus, StaffLoginResponse, StatusUpdated } from './types'

export const staffApi = {
  login(login: string, senha: string) {
    return request<StaffLoginResponse>('/equipe/login', { method: 'POST', body: { login, senha } })
  },

  /** Encerra a sessão no servidor: o token deixa de valer na hora. */
  logout(token: string) {
    return request<void>('/equipe/sessao', { method: 'DELETE', token })
  },

  queue(token: string, specialty?: string, signal?: AbortSignal) {
    const query = specialty ? `?especialidade=${encodeURIComponent(specialty)}` : ''
    return request<Queue>(`/equipe/fila${query}`, { token, signal })
  },

  updateStatus(token: string, protocol: string, status: Exclude<ReferralStatus, 'AGENDADO'>) {
    return request<StatusUpdated>(`/equipe/encaminhamentos/${encodeURIComponent(protocol)}/status`, {
      method: 'POST',
      token,
      body: { status },
    })
  },

  recordNoShow(token: string, protocol: string) {
    return request<NoShowRecorded>(`/equipe/encaminhamentos/${encodeURIComponent(protocol)}/falta`, {
      method: 'POST',
      token,
    })
  },

  call(token: string, protocol: string, senha: string, sala: string) {
    return request<Panel>(`/equipe/encaminhamentos/${encodeURIComponent(protocol)}/chamada`, {
      method: 'POST',
      token,
      body: { senha, sala },
    })
  },
}

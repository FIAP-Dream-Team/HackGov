// Endpoints do cidadão: identificação (US01), acompanhamento (US02) e
// agendamento (US03).

import { request } from './client'
import type {
  BookingConfirmation,
  CancellationResponse,
  FreeSlotList,
  IdentificationResponse,
  PersonalArea,
  SignUpRequest,
} from './types'

export type KioskIdentification =
  | { cartaoSus: string }
  | { cpf: string; dataNascimento: string }

export const citizenApi = {
  identifyAtKiosk(body: KioskIdentification) {
    return request<IdentificationResponse>('/totem/identificacao', { method: 'POST', body })
  },

  signUp(body: SignUpRequest) {
    return request<IdentificationResponse>('/app/cadastro', { method: 'POST', body })
  },

  login(cpf: string, senha: string) {
    return request<IdentificationResponse>('/app/login', { method: 'POST', body: { cpf, senha } })
  },

  // Gov.br ilustrado: o backend não redireciona, só recebe o que o provedor teria confirmado.
  loginWithGovBr(body: { cpf: string; nome?: string; dataNascimento?: string }) {
    return request<IdentificationResponse>('/app/oauth', {
      method: 'POST',
      body: { provedor: 'gov.br', ...body },
    })
  },

  logout(token: string) {
    return request<void>('/sessoes/atual', { method: 'DELETE', token })
  },

  tracking(token: string, signal?: AbortSignal) {
    return request<PersonalArea>('/acompanhamento', { token, signal })
  },

  freeSlots(token: string, protocol: string, signal?: AbortSignal) {
    return request<FreeSlotList>(`/app/encaminhamentos/${encodeURIComponent(protocol)}/horarios`, {
      token,
      signal,
    })
  },

  book(token: string, protocol: string, horarioId: number) {
    return request<BookingConfirmation>(`/app/encaminhamentos/${encodeURIComponent(protocol)}/agendamento`, {
      method: 'POST',
      token,
      body: { horarioId },
    })
  },

  reschedule(token: string, protocol: string, horarioId: number) {
    return request<BookingConfirmation>(`/app/encaminhamentos/${encodeURIComponent(protocol)}/reagendamento`, {
      method: 'POST',
      token,
      body: { horarioId },
    })
  },

  cancel(token: string, protocol: string) {
    return request<CancellationResponse>(`/app/encaminhamentos/${encodeURIComponent(protocol)}/cancelamento`, {
      method: 'POST',
      token,
      body: { confirmado: true },
    })
  },
}

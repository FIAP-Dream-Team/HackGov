import { Inbox, LogOut, MessageCircleQuestion, RefreshCw } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { citizenApi } from '../../api/citizen'
import type { PersonalArea as PersonalAreaData } from '../../api/types'
import { AppShell, EmptyState, ErrorAlert, Skeleton, useToast } from '../../components/ui'
import { useQuery } from '../../hooks/useAsync'
import { HOW_IT_WORKS } from '../../lib/howItWorks'
import { useStoredSession } from '../../session/session'
import { AuthScreen } from './AuthForms'
import { ReferralCard } from './ReferralCard'

/** Aplicativo do cidadão: identificação (US01), acompanhamento (US02) e horário (US03). */
export default function TrackingHome() {
  const session = useStoredSession('app')
  const toast = useToast()

  async function logout() {
    if (session.token) {
      // Encerra no servidor; se falhar, a sessão local é apagada do mesmo jeito.
      await citizenApi.logout(session.token).catch(() => undefined)
    }
    session.signOut()
    toast.info('Você saiu do aplicativo')
  }

  const expire = useCallback(() => {
    session.signOut()
    toast.warning('Sua sessão terminou', 'Por segurança, entre de novo para continuar.')
  }, [session, toast])

  if (!session.token) {
    return (
      <AppShell
        channel="Aplicativo"
        hero={
          <div className="text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Acompanhe seu encaminhamento</h1>
            <p className="mt-1 text-green-100">Sem ligar para a UBS e sem ir até lá só para perguntar.</p>
          </div>
        }
      >
        <AuthScreen onAuthenticated={(response) => session.signIn(response.token)} />
      </AppShell>
    )
  }

  return <PersonalArea token={session.token} onLogout={logout} onSessionExpired={expire} />
}

function PersonalArea({
  token,
  onLogout,
  onSessionExpired,
}: {
  token: string
  onLogout: () => void
  onSessionExpired: () => void
}) {
  const area = useQuery((signal) => citizenApi.tracking(token, signal), [token])

  useEffect(() => {
    if (area.state.status === 'error' && area.state.error.isSessionError) onSessionExpired()
  }, [area.state, onSessionExpired])

  const data = area.state.status === 'success' ? area.state.data : null

  return (
    <AppShell
      channel="Aplicativo"
      width="wide"
      actions={
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-50 hover:bg-green-700"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Sair
        </button>
      }
      hero={<Summary data={data} refreshing={area.refreshing} onRefresh={area.reload} />}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="flex flex-col gap-4">
          {area.state.status === 'loading' && (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <Skeleton lines={4} label="Carregando seus encaminhamentos" />
            </div>
          )}

          {area.state.status === 'error' && !area.state.error.isSessionError && (
            <div className="rounded-2xl bg-neutral-50 p-1">
              <ErrorAlert error={area.state.error} onRetry={area.reload} title="Não foi possível carregar seus encaminhamentos" />
            </div>
          )}

          {data && !data.temEncaminhamento && (
            <EmptyState icon={Inbox} title={data.mensagem ?? 'Você não tem encaminhamento em andamento.'}>
              Quando a UBS registrar um encaminhamento para você, ele aparece aqui com cada etapa.
            </EmptyState>
          )}

          {data?.encaminhamentos.map((referral) => (
            <ReferralCard
              key={referral.protocolo}
              referral={referral}
              token={token}
              onChanged={area.reload}
              onSessionExpired={onSessionExpired}
            />
          ))}
        </div>

        <HowItWorks />
      </div>
    </AppShell>
  )
}

function Summary({
  data,
  refreshing,
  onRefresh,
}: {
  data: PersonalAreaData | null
  refreshing: boolean
  onRefresh: () => void
}) {
  const total = data?.encaminhamentos.length ?? 0
  const needsAction = data?.encaminhamentos.filter((referral) => referral.podeAgendar).length ?? 0
  const scheduled = data?.encaminhamentos.filter((referral) => referral.horarioMarcado).length ?? 0

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm text-green-200">Olá! Este é o seu acompanhamento.</p>
        <h1 className="text-2xl font-bold sm:text-3xl">Seus encaminhamentos</h1>
        {data && (
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-green-700 px-3 py-1">
              {total} {total === 1 ? 'encaminhamento' : 'encaminhamentos'}
            </span>
            {needsAction > 0 && (
              <span className="rounded-full bg-yellow-500 px-3 py-1 font-semibold text-neutral-950">
                {needsAction} {needsAction === 1 ? 'pede' : 'pedem'} sua ação
              </span>
            )}
            {scheduled > 0 && (
              <span className="rounded-full bg-green-700 px-3 py-1">
                {scheduled} com horário marcado
              </span>
            )}
          </div>
        )}
      </div>
      {data && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-lg border border-green-600 px-3 py-2 text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
        >
          <RefreshCw aria-hidden="true" className={`size-4 ${refreshing ? 'animate-spin motion-reduce:animate-none' : ''}`} />
          Atualizar
        </button>
      )}
    </div>
  )
}

function HowItWorks() {
  return (
    <aside className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
      <h2 className="font-bold text-neutral-950">Como funciona</h2>
      <ol className="mt-4 flex flex-col gap-4">
        {HOW_IT_WORKS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{title}</p>
              <p className="text-sm text-neutral-600">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex gap-3 rounded-xl bg-blue-100 p-3 text-sm text-blue-900">
        <MessageCircleQuestion aria-hidden="true" className="size-5 shrink-0" />
        <p>Dúvida sobre o encaminhamento? O balcão da sua UBS atende pessoalmente.</p>
      </div>
    </aside>
  )
}

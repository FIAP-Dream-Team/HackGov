import { useEffect, useState } from 'react'
import { citizenApi } from '../../api/citizen'
import { Alert, AppShell, Button, EmptyState, Skeleton } from '../../components/ui'
import { useQuery } from '../../hooks/useAsync'
import { useStoredSession } from '../../session/session'
import { AuthScreen } from './AuthForms'
import { ReferralCard } from './ReferralCard'

/** Aplicativo do cidadão: identificação (US01), acompanhamento (US02) e horário (US03). */
export default function TrackingHome() {
  const session = useStoredSession('app')

  async function logout() {
    if (session.token) {
      // Encerra no servidor; se falhar, a sessão local é apagada do mesmo jeito.
      await citizenApi.logout(session.token).catch(() => undefined)
    }
    session.signOut()
  }

  return (
    <AppShell
      channel="Aplicativo"
      actions={
        session.token && (
          <Button variant="ghost" onClick={logout}>
            Sair
          </Button>
        )
      }
    >
      {session.token ? (
        <PersonalArea token={session.token} onSessionExpired={session.signOut} />
      ) : (
        <AuthScreen onAuthenticated={(response) => session.signIn(response.token)} />
      )}
    </AppShell>
  )
}

function PersonalArea({ token, onSessionExpired }: { token: string; onSessionExpired: () => void }) {
  const area = useQuery((signal) => citizenApi.tracking(token, signal), [token])
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (area.state.status === 'error' && area.state.error.isSessionError) onSessionExpired()
  }, [area.state, onSessionExpired])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-neutral-950">Seus encaminhamentos</h1>
        {area.state.status === 'success' && (
          <Button variant="ghost" onClick={area.reload} loading={area.refreshing}>
            Atualizar
          </Button>
        )}
      </div>

      {notice && (
        <Alert tone="success" action={{ label: 'Fechar', onClick: () => setNotice(null) }}>
          {notice}
        </Alert>
      )}

      {area.state.status === 'loading' && <Skeleton lines={4} label="Carregando seus encaminhamentos" />}

      {area.state.status === 'error' && !area.state.error.isSessionError && (
        <Alert tone="error" title="Não foi possível carregar" action={{ label: 'Tentar de novo', onClick: area.reload }}>
          {area.state.error.message}
        </Alert>
      )}

      {area.state.status === 'success' && !area.state.data.temEncaminhamento && (
        <EmptyState title={area.state.data.mensagem ?? 'Você não tem encaminhamento em andamento.'}>
          Quando a UBS registrar um encaminhamento para você, ele aparece aqui.
        </EmptyState>
      )}

      {area.state.status === 'success' &&
        area.state.data.encaminhamentos.map((referral) => (
          <ReferralCard
            key={referral.protocolo}
            referral={referral}
            token={token}
            onChanged={(message) => {
              setNotice(message)
              area.reload()
            }}
          />
        ))}
    </div>
  )
}

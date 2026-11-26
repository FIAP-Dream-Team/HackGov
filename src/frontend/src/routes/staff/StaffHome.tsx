import { LogOut, ShieldCheck } from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { staffApi } from '../../api/staff'
import { AppShell, Button, Card, ErrorAlert, TextField, useToast } from '../../components/ui'
import { useAction } from '../../hooks/useAsync'
import { useForm } from '../../hooks/useForm'
import { useStoredSession } from '../../session/session'
import { validatePassword, validateRequired } from '../../lib/validation'
import { QueueView } from './QueueView'

/** Canal web da equipe e do gestor (US05). Login próprio, separado do cidadão. */
export default function StaffHome() {
  const session = useStoredSession('equipe')
  const toast = useToast()

  const expire = useCallback(() => {
    session.signOut()
    toast.warning('Sua sessão terminou', 'Por segurança, entre de novo para continuar.')
  }, [session, toast])

  async function logout() {
    // Encerra no servidor para o token deixar de valer; se falhar, a sessão
    // local é apagada do mesmo jeito.
    if (session.token) await staffApi.logout(session.token).catch(() => undefined)
    session.signOut()
    toast.info('Você saiu do canal da equipe')
  }

  return (
    <AppShell
      channel="Equipe"
      tone="staff"
      width="wide"
      actions={
        session.token && (
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-50 hover:bg-blue-600"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Sair
          </button>
        )
      }
    >
      {session.token ? (
        <QueueView token={session.token} onSessionExpired={expire} />
      ) : (
        <div className="mx-auto max-w-[420px]">
          <StaffLogin onAuthenticated={session.signIn} />
        </div>
      )}
    </AppShell>
  )
}

function StaffLogin({ onAuthenticated }: { onAuthenticated: (token: string) => void }) {
  const form = useForm(
    { login: '', senha: '' },
    { login: (value) => validateRequired(value, 'Informe o login institucional.'), senha: validatePassword },
  )
  const login = useAction(staffApi.login)
  const [attempted, setAttempted] = useState(false)

  useEffect(() => {
    if (login.state.status === 'success') onAuthenticated(login.state.data.token)
  }, [login.state, onAuthenticated])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setAttempted(true)
    if (!form.validateAll()) return
    await login.run(form.values.login.trim(), form.values.senha)
  }

  return (
    <Card>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <ShieldCheck aria-hidden="true" className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-neutral-950">Entrar no canal da equipe</h1>
            <p className="text-sm text-neutral-600">Acesso restrito a atendentes e gestores da unidade.</p>
          </div>
        </div>
        {attempted && login.state.status === 'error' && <ErrorAlert error={login.state.error} />}
        <TextField label="Login institucional" autoComplete="username" {...form.field('login')} />
        <TextField label="Senha" type="password" autoComplete="current-password" {...form.field('senha')} />
        <Button type="submit" tone="staff" block loading={login.state.status === 'loading'}>
          {login.state.status === 'loading' ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </Card>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import { citizenApi } from '../../api/citizen'
import type { IdentificationResponse } from '../../api/types'
import { Alert, Button, Card, ErrorAlert, TextField, useToast } from '../../components/ui'
import { useAction } from '../../hooks/useAsync'
import { useForm } from '../../hooks/useForm'
import { describeError } from '../../lib/errors'
import {
  formatCpf,
  formatSusCard,
  onlyDigits,
  validateBirthDate,
  validateCpf,
  validatePassword,
  validateRequired,
  validateSusCard,
} from '../../lib/validation'

type Mode = 'login' | 'signup' | 'govbr'

interface AuthProps {
  onAuthenticated: (response: IdentificationResponse) => void
}

/** Identificação no aplicativo (US01): CPF e senha, cadastro ou Gov.br. */
export function AuthScreen({ onAuthenticated }: AuthProps) {
  const [mode, setMode] = useState<Mode>('login')

  return (
    <Card>
      {mode === 'login' && <LoginForm onAuthenticated={onAuthenticated} onGovBr={() => setMode('govbr')} />}
      {mode === 'signup' && <SignUpForm onAuthenticated={onAuthenticated} />}
      {mode === 'govbr' && <GovBrForm onAuthenticated={onAuthenticated} />}

      <div className="mt-5 border-t border-neutral-200 pt-4 text-center text-sm text-neutral-600">
        {mode === 'login' ? (
          <>
            Ainda não tem acesso?{' '}
            <button type="button" className="font-semibold text-blue-500 hover:underline" onClick={() => setMode('signup')}>
              Criar cadastro
            </button>
          </>
        ) : (
          <button type="button" className="font-semibold text-blue-500 hover:underline" onClick={() => setMode('login')}>
            Voltar para entrar com CPF e senha
          </button>
        )}
      </div>
    </Card>
  )
}

function LoginForm({ onAuthenticated, onGovBr }: AuthProps & { onGovBr: () => void }) {
  const form = useForm({ cpf: '', senha: '' }, { cpf: validateCpf, senha: validatePassword })
  const login = useAction(citizenApi.login)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.validateAll()) return
    const response = await login.run(onlyDigits(form.values.cpf), form.values.senha)
    if (response) onAuthenticated(response)
  }

  const error = login.state.status === 'error' ? login.state.error : null

  function submitAgain() {
    void login.run(onlyDigits(form.values.cpf), form.values.senha).then((response) => {
      if (response) onAuthenticated(response)
    })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-950">Entrar</h1>
        <p className="text-sm text-neutral-600">Acompanhe seu encaminhamento sem ligar para a UBS.</p>
      </div>

      {error &&
        (error.code === 'CONTA_GOVBR' ? (
          <Alert tone="info" title="Esta conta entra pelo Gov.br" action={{ label: 'Entrar com Gov.br', onClick: onGovBr }}>
            {error.message}
          </Alert>
        ) : (
          <ErrorAlert error={error} onRetry={submitAgain} />
        ))}

      <TextField
        label="CPF"
        inputMode="numeric"
        autoComplete="username"
        placeholder="000.000.000-00"
        {...form.field('cpf')}
        onChange={(value) => form.setValue('cpf', formatCpf(value))}
      />
      <TextField label="Senha" type="password" autoComplete="current-password" {...form.field('senha')} />

      <Button type="submit" block loading={login.state.status === 'loading'}>
        {login.state.status === 'loading' ? 'Entrando…' : 'Entrar'}
      </Button>
      <Button variant="secondary" block onClick={onGovBr}>
        Continuar com Gov.br
      </Button>
    </form>
  )
}

function SignUpForm({ onAuthenticated }: AuthProps) {
  const form = useForm(
    { nome: '', cpf: '', dataNascimento: '', cartaoSus: '', senha: '', confirmacao: '' },
    {
      nome: (value) => validateRequired(value, 'Informe seu nome.'),
      cpf: validateCpf,
      dataNascimento: validateBirthDate,
      cartaoSus: (value) => (value.trim() ? validateSusCard(value) : null),
      senha: validatePassword,
      confirmacao: (value, all) => (value === all.senha ? null : 'As senhas não são iguais.'),
    },
  )
  const signUp = useAction(citizenApi.signUp)
  const { setError } = form
  const toast = useToast()

  // CPF ou Cartão SUS já cadastrado: o erro aparece também embaixo do campo.
  useEffect(() => {
    if (signUp.state.status !== 'error') return
    const { field, title } = describeError(signUp.state.error)
    if (field) setError(field, `${title}.`)
  }, [signUp.state, setError])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.validateAll()) return
    const { nome, cpf, dataNascimento, cartaoSus, senha } = form.values
    const response = await signUp.run({
      nome: nome.trim(),
      cpf: onlyDigits(cpf),
      dataNascimento,
      senha,
      cartaoSus: cartaoSus.trim() ? onlyDigits(cartaoSus) : undefined,
    })
    if (response) {
      toast.success('Cadastro criado', 'Você já está dentro do Minha Vez.')
      onAuthenticated(response)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-950">Criar cadastro</h1>
        <p className="text-sm text-neutral-600">Use os mesmos dados do seu cadastro na UBS.</p>
      </div>

      {signUp.state.status === 'error' && <ErrorAlert error={signUp.state.error} title="O cadastro não foi criado" />}

      <TextField label="Nome completo" autoComplete="name" {...form.field('nome')} />
      <TextField
        label="CPF"
        inputMode="numeric"
        placeholder="000.000.000-00"
        {...form.field('cpf')}
        onChange={(value) => form.setValue('cpf', formatCpf(value))}
      />
      <TextField label="Data de nascimento" type="date" autoComplete="bday" {...form.field('dataNascimento')} />
      <TextField
        label="Cartão SUS (opcional)"
        inputMode="numeric"
        placeholder="000 0000 0000 0000"
        {...form.field('cartaoSus')}
        onChange={(value) => form.setValue('cartaoSus', formatSusCard(value))}
      />
      <TextField
        label="Senha"
        type="password"
        autoComplete="new-password"
        hint="Pelo menos 8 caracteres."
        {...form.field('senha')}
      />
      <TextField label="Repita a senha" type="password" autoComplete="new-password" {...form.field('confirmacao')} />

      <Button type="submit" block loading={signUp.state.status === 'loading'}>
        {signUp.state.status === 'loading' ? 'Criando cadastro…' : 'Criar cadastro'}
      </Button>
    </form>
  )
}

function GovBrForm({ onAuthenticated }: AuthProps) {
  const [firstAccess, setFirstAccess] = useState(false)
  const form = useForm(
    { cpf: '', nome: '', dataNascimento: '' },
    {
      cpf: validateCpf,
      nome: (value) => (firstAccess ? validateRequired(value, 'Informe seu nome.') : null),
      dataNascimento: (value) => (firstAccess ? validateBirthDate(value) : null),
    },
  )
  const govBr = useAction(citizenApi.loginWithGovBr)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.validateAll()) return
    const response = await govBr.run({
      cpf: onlyDigits(form.values.cpf),
      ...(firstAccess ? { nome: form.values.nome.trim(), dataNascimento: form.values.dataNascimento } : {}),
    })
    if (response) onAuthenticated(response)
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-950">Entrar com Gov.br</h1>
        <p className="text-sm text-neutral-600">
          Protótipo: o Gov.br é simulado. Nenhum redirecionamento acontece; o servidor recebe o CPF que o provedor teria
          confirmado.
        </p>
      </div>

      {govBr.state.status === 'error' && <ErrorAlert error={govBr.state.error} />}

      <TextField
        label="CPF confirmado pelo Gov.br"
        inputMode="numeric"
        placeholder="000.000.000-00"
        {...form.field('cpf')}
        onChange={(value) => form.setValue('cpf', formatCpf(value))}
      />

      <label className="flex items-center gap-2 text-sm text-neutral-800">
        <input type="checkbox" checked={firstAccess} onChange={(e) => setFirstAccess(e.target.checked)} className="size-4 accent-green-500" />
        É meu primeiro acesso
      </label>

      {firstAccess && (
        <>
          <TextField label="Nome completo" {...form.field('nome')} />
          <TextField label="Data de nascimento" type="date" {...form.field('dataNascimento')} />
        </>
      )}

      <Button type="submit" block loading={govBr.state.status === 'loading'}>
        {govBr.state.status === 'loading' ? 'Confirmando…' : 'Continuar'}
      </Button>
    </form>
  )
}

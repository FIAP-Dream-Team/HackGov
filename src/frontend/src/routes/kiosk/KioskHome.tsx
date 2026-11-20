import { useState, type FormEvent } from 'react'
import { citizenApi, type KioskIdentification } from '../../api/citizen'
import type { IdentificationResponse } from '../../api/types'
import { Alert, AppShell, Button, Card, EmptyState, TextField } from '../../components/ui'
import { useAction } from '../../hooks/useAsync'
import { useForm } from '../../hooks/useForm'
import {
  formatCpf,
  formatSusCard,
  onlyDigits,
  validateBirthDate,
  validateCpf,
  validateSusCard,
} from '../../lib/validation'
import { ReferralCard } from '../tracking/ReferralCard'

type Method = 'card' | 'cpf'

/**
 * Totem da UBS (US01 e US02). Sem senha, porque senha em equipamento público é
 * barreira para o público da unidade. A sessão fica só em memória e "Encerrar"
 * apaga tudo, para a próxima pessoa não herdar a tela.
 */
export default function KioskHome() {
  const [session, setSession] = useState<IdentificationResponse | null>(null)

  async function finish() {
    if (session) await citizenApi.logout(session.token).catch(() => undefined)
    setSession(null)
  }

  return (
    <AppShell channel="Totem · UBS Centro">
      {session ? <KioskStatus session={session} onFinish={finish} /> : <KioskIdentify onIdentified={setSession} />}
    </AppShell>
  )
}

function KioskIdentify({ onIdentified }: { onIdentified: (response: IdentificationResponse) => void }) {
  const [method, setMethod] = useState<Method>('card')
  const form = useForm(
    { cartaoSus: '', cpf: '', dataNascimento: '' },
    {
      cartaoSus: (value) => (method === 'card' ? validateSusCard(value) : null),
      cpf: (value) => (method === 'cpf' ? validateCpf(value) : null),
      dataNascimento: (value) => (method === 'cpf' ? validateBirthDate(value) : null),
    },
  )
  const identify = useAction((body: KioskIdentification) => citizenApi.identifyAtKiosk(body))

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.validateAll()) return
    const body: KioskIdentification =
      method === 'card'
        ? { cartaoSus: onlyDigits(form.values.cartaoSus) }
        : { cpf: onlyDigits(form.values.cpf), dataNascimento: form.values.dataNascimento }
    const response = await identify.run(body)
    if (response) onIdentified(response)
  }

  const error = identify.state.status === 'error' ? identify.state.error : null

  return (
    <Card>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Veja em que etapa está seu pedido</h1>
          <p className="text-neutral-600">Consulta com especialista ou exame. Não precisa de senha.</p>
        </div>

        <div role="radiogroup" aria-label="Como você quer se identificar" className="grid grid-cols-2 gap-2">
          {(
            [
              ['card', 'Cartão SUS'],
              ['cpf', 'CPF e nascimento'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={method === value}
              onClick={() => {
                setMethod(value)
                identify.reset()
              }}
              className={`min-h-12 rounded-[10px] border px-3 text-sm font-semibold ${
                method === value ? 'border-green-500 bg-green-100 text-green-800' : 'border-neutral-300 bg-neutral-50 text-neutral-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <Alert tone="error">
            {error.code === 'CIDADAO_NAO_ENCONTRADO'
              ? 'Não encontramos esse cadastro. Confira os números ou peça ajuda no balcão.'
              : error.message}
          </Alert>
        )}

        {method === 'card' ? (
          <TextField
            label="Número do Cartão SUS"
            inputMode="numeric"
            placeholder="000 0000 0000 0000"
            hint="No totem real, é só encostar o cartão. Aqui, digite o número."
            {...form.field('cartaoSus')}
            onChange={(value) => form.setValue('cartaoSus', formatSusCard(value))}
          />
        ) : (
          <>
            <TextField
              label="CPF"
              inputMode="numeric"
              placeholder="000.000.000-00"
              {...form.field('cpf')}
              onChange={(value) => form.setValue('cpf', formatCpf(value))}
            />
            <TextField label="Data de nascimento" type="date" {...form.field('dataNascimento')} />
          </>
        )}

        <Button type="submit" block loading={identify.state.status === 'loading'} className="min-h-12 text-base">
          {identify.state.status === 'loading' ? 'Consultando…' : 'Consultar'}
        </Button>

        <p className="rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-600">
          Seus dados clínicos não aparecem nesta tela.
        </p>
      </form>
    </Card>
  )
}

function KioskStatus({ session, onFinish }: { session: IdentificationResponse; onFinish: () => void }) {
  const area = session.areaPessoal

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-neutral-950">Seu encaminhamento</h1>

      {!area.temEncaminhamento && (
        <EmptyState title={area.mensagem ?? 'Você não tem encaminhamento em andamento.'}>
          Se você esperava um encaminhamento, procure o balcão da UBS.
        </EmptyState>
      )}

      {area.encaminhamentos.map((referral) => (
        <ReferralCard key={referral.protocolo} referral={referral} />
      ))}

      {area.encaminhamentos.some((referral) => referral.podeAgendar || referral.podeAlterarHorario) && (
        <Alert tone="info">Para marcar, reagendar ou cancelar horário, use o aplicativo Minha Vez.</Alert>
      )}

      <Button variant="secondary" block onClick={onFinish} className="min-h-12 text-base">
        Encerrar e limpar a tela
      </Button>
    </div>
  )
}

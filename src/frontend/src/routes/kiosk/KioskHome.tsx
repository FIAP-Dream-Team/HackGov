import { CreditCard, IdCard, Inbox, Info, LogOut, ShieldCheck, Smartphone, type LucideIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { citizenApi, type KioskIdentification } from '../../api/citizen'
import type { IdentificationResponse } from '../../api/types'
import { AppShell, Button, Card, EmptyState, ErrorAlert, NumericKeypad, TextField, useToast } from '../../components/ui'
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
import { AccessibilityBar, HelpPanel, TEXT_SCALES, screenText, useScreenReader } from './Accessibility'

type Method = 'card' | 'cpf'
type Field = 'cartaoSus' | 'cpf' | 'nascimento'

const MAX_DIGITS: Record<Field, number> = { cartaoSus: 15, cpf: 11, nascimento: 8 }

/**
 * Totem da UBS (US01 e US02). Sem senha, porque senha em equipamento público é
 * barreira para o público da unidade. A sessão fica só em memória e "Encerrar"
 * apaga tudo, para a próxima pessoa não herdar a tela. Letra grande e teclado
 * na tela: totem não tem teclado físico.
 */
export default function KioskHome() {
  const [session, setSession] = useState<IdentificationResponse | null>(null)
  const [scaleIndex, setScaleIndex] = useState(0)
  const [helpOpen, setHelpOpen] = useState(false)
  const reader = useScreenReader()
  const toast = useToast()

  async function finish() {
    if (session) await citizenApi.logout(session.token).catch(() => undefined)
    setSession(null)
    // A próxima pessoa começa do padrão: letra normal e leitura parada.
    setScaleIndex(0)
    reader.stop()
    toast.info('Tela limpa', 'Seus dados não ficaram no totem. A próxima pessoa já pode usar.')
  }

  function identified(response: IdentificationResponse) {
    setSession(response)
    // Quem pediu leitura continua ouvindo: a tela nova é lida em seguida.
    if (reader.speaking) reader.speak(screenText(response))
  }

  function listen() {
    if (reader.speaking) {
      reader.stop()
      return
    }
    if (!reader.speak(screenText(session))) {
      toast.warning('Leitura em voz alta indisponível', 'Este aparelho não tem voz instalada. Peça ajuda no balcão.')
    }
  }

  return (
    <>
      <div style={{ zoom: TEXT_SCALES[scaleIndex] }} className="pb-28">
        <KioskScreen session={session} onIdentified={identified} onFinish={finish} />
      </div>
      <AccessibilityBar
        scaleIndex={scaleIndex}
        onScale={() => setScaleIndex((index) => (index + 1) % TEXT_SCALES.length)}
        speaking={reader.speaking}
        speechSupported={reader.supported}
        onListen={listen}
        onHelp={() => setHelpOpen(true)}
      />
      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}

function KioskScreen({
  session,
  onIdentified,
  onFinish,
}: {
  session: IdentificationResponse | null
  onIdentified: (response: IdentificationResponse) => void
  onFinish: () => void
}) {
  return (
    <AppShell
      channel="Totem · UBS Centro"
      width="wide"
      hero={
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {session ? 'Seu encaminhamento' : 'Veja em que etapa está seu pedido'}
          </h1>
          <p className="mt-2 text-lg text-green-100">
            {session ? 'Confira a etapa e o próximo passo.' : 'Consulta com especialista ou exame. Não precisa de senha.'}
          </p>
        </div>
      }
    >
      {session ? <KioskStatus session={session} onFinish={onFinish} /> : <KioskIdentify onIdentified={onIdentified} />}
    </AppShell>
  )
}

/** Data digitada no teclado (ddmmaaaa) para o formato do servidor (aaaa-mm-dd). */
function birthDateToIso(digits: string): string {
  if (digits.length !== 8) return ''
  return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`
}

function formatBirthDate(value: string): string {
  const d = onlyDigits(value).slice(0, 8)
  return d.replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
}

const FORMAT: Record<Field, (value: string) => string> = {
  cartaoSus: formatSusCard,
  cpf: formatCpf,
  nascimento: formatBirthDate,
}

const FIELD_LABEL: Record<Field, string> = {
  cartaoSus: 'Número do Cartão SUS',
  cpf: 'CPF',
  nascimento: 'Data de nascimento',
}

function KioskIdentify({ onIdentified }: { onIdentified: (response: IdentificationResponse) => void }) {
  const [method, setMethod] = useState<Method>('card')
  const [active, setActive] = useState<Field>('cartaoSus')
  const form = useForm(
    { cartaoSus: '', cpf: '', nascimento: '' },
    {
      cartaoSus: (value) => (method === 'card' ? validateSusCard(value) : null),
      cpf: (value) => (method === 'cpf' ? validateCpf(value) : null),
      nascimento: (value) => {
        if (method !== 'cpf') return null
        const digits = onlyDigits(value)
        if (digits.length !== 8) return 'Digite dia, mês e ano: 8 números.'
        return validateBirthDate(birthDateToIso(digits))
      },
    },
  )
  const identify = useAction((body: KioskIdentification) => citizenApi.identifyAtKiosk(body))

  function choose(next: Method) {
    setMethod(next)
    setActive(next === 'card' ? 'cartaoSus' : 'cpf')
    identify.reset()
  }

  function type(field: Field, raw: string) {
    form.setValue(field, FORMAT[field](raw))
  }

  function pressDigit(digit: string) {
    const current = onlyDigits(form.values[active])
    if (current.length >= MAX_DIGITS[active]) {
      // CPF cheio: o teclado passa sozinho para a data de nascimento.
      if (active === 'cpf') {
        setActive('nascimento')
        type('nascimento', onlyDigits(form.values.nascimento) + digit)
      }
      return
    }
    type(active, current + digit)
    if (active === 'cpf' && current.length + 1 === MAX_DIGITS.cpf) setActive('nascimento')
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.validateAll()) return
    const body: KioskIdentification =
      method === 'card'
        ? { cartaoSus: onlyDigits(form.values.cartaoSus) }
        : { cpf: onlyDigits(form.values.cpf), dataNascimento: birthDateToIso(onlyDigits(form.values.nascimento)) }
    const response = await identify.run(body)
    if (response) onIdentified(response)
  }

  const error = identify.state.status === 'error' ? identify.state.error : null
  const fieldProps = (field: Field) => ({
    ...form.field(field),
    onChange: (value: string) => type(field, value),
    onFocus: () => setActive(field),
    inputMode: 'numeric' as const,
    className: active === field ? '[&_input]:border-green-500 [&_input]:ring-2 [&_input]:ring-green-200' : '',
  })

  return (
    <div className="flex flex-col gap-5">
      <div role="radiogroup" aria-label="Como você quer se identificar" className="grid gap-3 sm:grid-cols-2">
        <MethodCard
          icon={CreditCard}
          title="Cartão SUS"
          text="Encoste o cartão no leitor ou digite os 15 números."
          selected={method === 'card'}
          onSelect={() => choose('card')}
        />
        <MethodCard
          icon={IdCard}
          title="CPF e nascimento"
          text="Para quem não está com o cartão."
          selected={method === 'cpf'}
          onSelect={() => choose('cpf')}
        />
      </div>

      <Card>
        <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="flex flex-col gap-4 [&_input]:min-h-14 [&_input]:text-2xl [&_input]:tracking-wider [&_label]:text-base!">
            {error && <ErrorAlert error={error} />}

            {method === 'card' ? (
              <TextField label={FIELD_LABEL.cartaoSus} placeholder="000 0000 0000 0000" {...fieldProps('cartaoSus')} />
            ) : (
              <>
                <TextField label={FIELD_LABEL.cpf} placeholder="000.000.000-00" {...fieldProps('cpf')} />
                <TextField label={FIELD_LABEL.nascimento} placeholder="dd/mm/aaaa" {...fieldProps('nascimento')} />
              </>
            )}

            <Button type="submit" block loading={identify.state.status === 'loading'} className="min-h-14 text-lg!">
              {identify.state.status === 'loading' ? 'Consultando…' : 'Consultar'}
            </Button>

            <p className="flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-3 text-base text-neutral-700">
              <ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-green-600" />
              Seus dados clínicos não aparecem nesta tela.
            </p>
          </div>

          <NumericKeypad
            targetLabel={FIELD_LABEL[active]}
            onDigit={pressDigit}
            onBackspace={() => type(active, onlyDigits(form.values[active]).slice(0, -1))}
            onClear={() => type(active, '')}
          />
        </form>
      </Card>
    </div>
  )
}

export function MethodCard({
  icon: Icon,
  title,
  text,
  selected,
  onSelect,
}: {
  icon: LucideIcon
  title: string
  text: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${title}: ${text}`}
      onClick={onSelect}
      className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 ${
        selected ? 'border-green-500 bg-green-100' : 'border-neutral-200 bg-neutral-50 hover:border-green-300'
      }`}
    >
      <span
        className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${
          selected ? 'bg-green-500 text-neutral-50' : 'bg-neutral-200 text-neutral-700'
        }`}
      >
        <Icon aria-hidden="true" className="size-7" />
      </span>
      <span>
        <span className={`block text-xl font-bold ${selected ? 'text-green-900' : 'text-neutral-900'}`}>{title}</span>
        <span className="block text-base text-neutral-600">{text}</span>
      </span>
    </button>
  )
}

function KioskStatus({ session, onFinish }: { session: IdentificationResponse; onFinish: () => void }) {
  const area = session.areaPessoal
  const canAct = area.encaminhamentos.some((referral) => referral.podeAgendar || referral.podeAlterarHorario)

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-4">
      {!area.temEncaminhamento && (
        <EmptyState icon={Inbox} title={area.mensagem ?? 'Você não tem encaminhamento em andamento.'}>
          Se você esperava um encaminhamento, procure o balcão da UBS.
        </EmptyState>
      )}

      {area.encaminhamentos.map((referral) => (
        <ReferralCard key={referral.protocolo} referral={referral} size="lg" />
      ))}

      {canAct && (
        <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-100 p-4 text-base text-blue-900">
          <Smartphone aria-hidden="true" className="size-6 shrink-0" />
          <p>Para marcar, reagendar ou cancelar horário, use o aplicativo Minha Vez no celular.</p>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
        <Info aria-hidden="true" className="size-5 shrink-0" />
        <p>Quando terminar, encerre para que a próxima pessoa não veja seus dados.</p>
      </div>

      <Button block onClick={onFinish} className="min-h-14 text-lg!">
        <LogOut aria-hidden="true" className="size-5" />
        Encerrar e limpar a tela
      </Button>
    </div>
  )
}

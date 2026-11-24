import { AArrowUp, CircleHelp, CreditCard, IdCard, KeyRound, Smartphone, Volume2, VolumeX, X, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { IdentificationResponse } from '../../api/types'
import { formatDateTime } from '../../lib/format'

// Acessibilidade do totem: aumentar letra, ouvir a tela e ajuda. O totem
// atende quem tem baixa visão, quem não lê bem e quem nunca usou um. Tudo
// volta ao padrão quando a pessoa encerra, para a próxima começar do zero.

export const TEXT_SCALES = [1, 1.2, 1.4] as const

// ---------------------------------------------------------------- ouvir a tela

/**
 * Leitura em voz da tela, pela síntese de voz do próprio navegador (Web
 * Speech API), em português. Não manda nada para fora do totem.
 */
export function useScreenReader() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [speaking, setSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (!supported) return
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      voiceRef.current = voices.find((v) => v.lang === 'pt-BR') ?? voices.find((v) => v.lang.startsWith('pt')) ?? null
    }
    pickVoice()
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', pickVoice)
      window.speechSynthesis.cancel()
    }
  }, [supported])

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  const speak = useCallback(
    (text: string) => {
      if (!supported) return false
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'pt-BR'
      utterance.rate = 0.95
      if (voiceRef.current) utterance.voice = voiceRef.current
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      setSpeaking(true)
      window.speechSynthesis.speak(utterance)
      return true
    },
    [supported],
  )

  return { supported, speaking, speak, stop }
}

/** O que a voz lê em cada momento do totem. */
export function screenText(session: IdentificationResponse | null): string {
  if (!session) {
    return [
      'Totem Minha Vez. Aqui você vê em que etapa está seu pedido de consulta com especialista ou de exame.',
      'Não precisa de senha.',
      'Escolha como se identificar: Cartão SUS, ou CPF com data de nascimento.',
      'Digite os números no teclado da tela e toque em Consultar.',
      'Se precisar, toque em Ajuda, no canto de baixo da tela, ou procure o balcão da UBS.',
    ].join(' ')
  }

  const area = session.areaPessoal
  if (!area.temEncaminhamento) {
    return `${area.mensagem ?? 'Você não tem encaminhamento em andamento.'} Se você esperava um encaminhamento, procure o balcão da UBS. Quando terminar, toque em Encerrar e limpar a tela.`
  }

  const parts = area.encaminhamentos.map((referral) => {
    const slot = referral.horarioMarcado ? ` Horário marcado: ${formatDateTime(referral.horarioMarcado.dataHora)}.` : ''
    return `Encaminhamento para ${referral.especialidade}, no ${referral.unidadeDestino}. Etapa atual: ${referral.rotulo}. Próximo passo: ${referral.proximoPasso}${slot}`
  })
  return `${parts.join(' ')} Quando terminar, toque em Encerrar e limpar a tela.`
}

// ------------------------------------------------------------- barra de botões

interface AccessibilityBarProps {
  scaleIndex: number
  onScale: () => void
  speaking: boolean
  speechSupported: boolean
  onListen: () => void
  onHelp: () => void
}

/** Três botões grandes, fixos no rodapé do totem, sempre ao alcance. */
export function AccessibilityBar({ scaleIndex, onScale, speaking, speechSupported, onListen, onHelp }: AccessibilityBarProps) {
  const percent = Math.round(TEXT_SCALES[scaleIndex] * 100)
  const atMax = scaleIndex === TEXT_SCALES.length - 1

  return (
    <nav
      aria-label="Acessibilidade"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-neutral-50/95 backdrop-blur-sm"
    >
      <div className="mx-auto grid max-w-[1080px] grid-cols-3 gap-2 px-4 py-3">
        <BarButton
          icon={AArrowUp}
          label={atMax ? 'Letra normal' : 'Aumentar letra'}
          detail={`Tamanho ${percent}%`}
          pressed={scaleIndex > 0}
          onClick={onScale}
        />
        <BarButton
          icon={speaking ? VolumeX : Volume2}
          label={speaking ? 'Parar leitura' : 'Ouvir a tela'}
          detail={speechSupported ? (speaking ? 'Lendo em voz alta…' : 'Leitura em voz alta') : 'Indisponível neste aparelho'}
          pressed={speaking}
          onClick={onListen}
        />
        <BarButton icon={CircleHelp} label="Ajuda" detail="Como usar o totem" onClick={onHelp} />
      </div>
    </nav>
  )
}

function BarButton({
  icon: Icon,
  label,
  detail,
  pressed,
  onClick,
}: {
  icon: LucideIcon
  label: string
  detail: string
  pressed?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`flex min-h-16 items-center justify-center gap-3 rounded-2xl border-2 px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 ${
        pressed ? 'border-green-500 bg-green-100 text-green-900' : 'border-neutral-200 bg-white text-neutral-900 hover:border-green-300'
      }`}
    >
      <Icon aria-hidden="true" className="size-7 shrink-0" />
      <span className="min-w-0">
        <span className="block text-base leading-tight font-bold sm:text-lg">{label}</span>
        <span className="hidden text-sm text-neutral-600 sm:block">{detail}</span>
      </span>
    </button>
  )
}

// ----------------------------------------------------------------------- ajuda

const HELP_STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: CreditCard,
    title: 'Com o Cartão SUS',
    text: 'Toque em "Cartão SUS" e digite os 15 números que estão na frente do cartão. Depois toque em Consultar.',
  },
  {
    icon: IdCard,
    title: 'Sem o cartão',
    text: 'Toque em "CPF e nascimento". Digite os 11 números do CPF e a data de nascimento (dia, mês e ano). O teclado passa sozinho de um para o outro.',
  },
  {
    icon: KeyRound,
    title: 'Não precisa de senha',
    text: 'O totem só mostra a etapa do seu pedido. Nenhum dado clínico aparece na tela.',
  },
  {
    icon: Smartphone,
    title: 'Para marcar ou mudar horário',
    text: 'Use o aplicativo Minha Vez no celular. O totem serve para consultar.',
  },
]

const STAGES = [
  ['Recebido e triado', 'A UBS registrou o pedido. Aguarde a unidade liberar os horários.'],
  ['Aguardando agendamento', 'Já é possível escolher um horário, pelo aplicativo.'],
  ['Agendado', 'O horário está marcado. No dia, sua senha aparece no painel da sala de espera.'],
  ['Concluído', 'O atendimento deste encaminhamento terminou.'],
] as const

/**
 * Painel de ajuda em tela cheia. Fecha pelo botão grande, pelo X ou pela
 * tecla Esc, e devolve o foco para quem abriu.
 */
export function HelpPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    // Abre sempre do topo, com o foco no "fechar", sem rolar o painel.
    closeRef.current?.focus({ preventScroll: true })
    if (dialogRef.current) dialogRef.current.scrollTop = 0
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/50 p-4 sm:items-center" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ajuda-titulo"
        onClick={(event) => event.stopPropagation()}
        className="panel-enter max-h-[90dvh] w-full max-w-[720px] overflow-y-auto rounded-3xl bg-neutral-50 p-6 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)]"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="ajuda-titulo" className="text-2xl font-bold text-neutral-950">
              Como usar o totem
            </h2>
            <p className="text-neutral-600">Em caso de dúvida, o balcão da UBS ajuda pessoalmente.</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar ajuda"
            className="flex size-12 shrink-0 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-200"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2">
          {HELP_STEPS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="text-lg font-bold text-neutral-950">{title}</p>
                <p className="text-base text-neutral-700">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="mt-6 mb-2 text-lg font-bold text-neutral-950">O que cada etapa quer dizer</h3>
        <dl className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {STAGES.map(([stage, meaning]) => (
            <div key={stage} className="grid gap-1 px-4 py-3 sm:grid-cols-[200px_1fr]">
              <dt className="font-bold text-green-800">{stage}</dt>
              <dd className="text-neutral-700">{meaning}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 min-h-14 w-full rounded-2xl bg-green-500 text-lg font-bold text-neutral-50 hover:bg-green-600"
        >
          Entendi, voltar
        </button>
      </div>
    </div>
  )
}

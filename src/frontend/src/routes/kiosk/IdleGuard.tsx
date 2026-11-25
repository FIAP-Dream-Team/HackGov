import { Hand, Timer } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/** Tempo parado até o aviso aparecer, e duração da contagem do aviso. */
export const IDLE_BEFORE_WARNING_MS = 60_000
export const WARNING_SECONDS = 15

/**
 * Encerra a sessão do totem quando a pessoa vai embora sem apertar
 * "Encerrar". Depois de 1 minuto sem toque, mostra uma contagem de 15 s com
 * "Continuar usando"; se ninguém tocar, limpa a tela. O servidor também
 * expira a sessão do totem em 3 minutos parada, como segunda barreira.
 */
export function IdleGuard({ active, onTimeout }: { active: boolean; onTimeout: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const idleTimer = useRef<number>()
  const onTimeoutRef = useRef(onTimeout)
  onTimeoutRef.current = onTimeout

  useEffect(() => {
    if (!active) {
      setSecondsLeft(null)
      return
    }

    const restart = () => {
      window.clearTimeout(idleTimer.current)
      setSecondsLeft(null)
      idleTimer.current = window.setTimeout(() => setSecondsLeft(WARNING_SECONDS), IDLE_BEFORE_WARNING_MS)
    }

    restart()
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    events.forEach((name) => window.addEventListener(name, restart, { passive: true }))

    return () => {
      window.clearTimeout(idleTimer.current)
      events.forEach((name) => window.removeEventListener(name, restart))
    }
  }, [active])

  useEffect(() => {
    if (secondsLeft === null) return
    if (secondsLeft <= 0) {
      setSecondsLeft(null)
      onTimeoutRef.current()
      return
    }
    const tick = window.setTimeout(() => setSecondsLeft((value) => (value === null ? null : value - 1)), 1000)
    return () => window.clearTimeout(tick)
  }, [secondsLeft])

  if (secondsLeft === null) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="inatividade-titulo"
        aria-describedby="inatividade-texto"
        className="panel-enter w-full max-w-[480px] rounded-3xl bg-neutral-50 p-6 text-center shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)]"
      >
        <span className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-yellow-200 text-yellow-800">
          <Timer aria-hidden="true" className="size-7" />
        </span>
        <h2 id="inatividade-titulo" className="text-2xl font-bold text-neutral-950">
          Ainda está aí?
        </h2>
        <p id="inatividade-texto" className="mt-2 text-lg text-neutral-700">
          Para proteger seus dados, a tela será limpa em{' '}
          <strong className="text-neutral-950" aria-live="polite">
            {secondsLeft} {secondsLeft === 1 ? 'segundo' : 'segundos'}
          </strong>
          .
        </p>
        <button
          type="button"
          autoFocus
          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-green-500 text-lg font-bold text-neutral-50 hover:bg-green-600"
        >
          <Hand aria-hidden="true" className="size-5" />
          Continuar usando
        </button>
      </div>
    </div>
  )
}

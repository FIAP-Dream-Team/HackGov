import { Delete } from 'lucide-react'

interface NumericKeypadProps {
  onDigit: (digit: string) => void
  onBackspace: () => void
  onClear: () => void
  /** Rótulo do campo que está recebendo os números, lido pelo leitor de tela. */
  targetLabel: string
}

/**
 * Teclado numérico na tela, para o totem: equipamento público não tem
 * teclado físico. Teclas grandes (64 px) para toque com o dedo.
 */
export function NumericKeypad({ onDigit, onBackspace, onClear, targetLabel }: NumericKeypadProps) {
  const key =
    'flex h-16 items-center justify-center rounded-xl border border-neutral-300 bg-white text-2xl font-bold text-neutral-900 shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-colors active:bg-green-100 hover:border-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500'

  return (
    <div role="group" aria-label={`Teclado numérico para ${targetLabel}`} className="grid grid-cols-3 gap-2">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
        <button key={digit} type="button" className={key} onClick={() => onDigit(digit)}>
          {digit}
        </button>
      ))}
      <button type="button" className={`${key} text-base text-neutral-600`} onClick={onClear}>
        Limpar
      </button>
      <button type="button" className={key} onClick={() => onDigit('0')}>
        0
      </button>
      <button type="button" className={key} onClick={onBackspace} aria-label="Apagar último número">
        <Delete aria-hidden="true" className="size-7" />
      </button>
    </div>
  )
}

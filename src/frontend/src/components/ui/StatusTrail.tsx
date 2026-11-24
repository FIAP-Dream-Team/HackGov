import { Check } from 'lucide-react'
import type { TrailStep } from '../../api/types'

/**
 * Trilha do encaminhamento, igual no totem e no aplicativo (US02): bolinhas
 * numeradas ligadas por uma linha. Concluída leva ✓, a atual pulsa de leve,
 * a pendente fica apagada. `size="lg"` é a versão do totem.
 */
export function StatusTrail({ steps, size = 'md' }: { steps: TrailStep[]; size?: 'md' | 'lg' }) {
  const dot = size === 'lg' ? 'size-10 text-base' : 'size-8 text-sm'
  const label = size === 'lg' ? 'text-sm' : 'text-xs'
  const lineTop = size === 'lg' ? 'top-5' : 'top-4'

  return (
    <ol className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((step, index) => {
        const done = step.situacao === 'CONCLUIDA'
        const current = step.situacao === 'ATUAL'
        const next = steps[index + 1]
        const lineFilled = done && next !== undefined

        return (
          <li
            key={step.status}
            aria-current={current ? 'step' : undefined}
            className="relative flex flex-col items-center gap-2 text-center"
          >
            {next && (
              <span aria-hidden="true" className={`absolute ${lineTop} left-1/2 h-0.5 w-full bg-neutral-200`}>
                <span
                  className={`block h-full bg-green-500 transition-[width] duration-500 ease-out motion-reduce:transition-none ${
                    lineFilled ? 'w-full' : 'w-0'
                  }`}
                />
              </span>
            )}

            <span className={`relative z-10 flex items-center justify-center rounded-full font-bold ${dot} ${
              done
                ? 'bg-green-500 text-neutral-50'
                : current
                  ? 'border-2 border-green-500 bg-white text-green-700'
                  : 'border-2 border-neutral-200 bg-white text-neutral-400'
            }`}>
              {current && (
                <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-green-300 opacity-40 motion-reduce:hidden" />
              )}
              {done ? <Check aria-hidden="true" className="size-[55%]" strokeWidth={3} /> : index + 1}
            </span>

            <span className={`px-1 leading-tight ${label} ${current ? 'font-bold text-green-800' : done ? 'text-neutral-700' : 'text-neutral-400'}`}>
              {step.rotulo}
              <span className="sr-only">{current ? ' (etapa atual)' : done ? ' (concluída)' : ' (pendente)'}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

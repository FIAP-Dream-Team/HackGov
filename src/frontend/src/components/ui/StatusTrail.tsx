import type { TrailStep } from '../../api/types'

/** Trilha do encaminhamento, igual no totem e no aplicativo (US02). */
export function StatusTrail({ steps }: { steps: TrailStep[] }) {
  return (
    <ol className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((step) => {
        const bar =
          step.situacao === 'PENDENTE'
            ? 'bg-neutral-200'
            : step.situacao === 'ATUAL'
              ? 'bg-green-500 ring-2 ring-green-200'
              : 'bg-green-500'
        return (
          <li key={step.status} aria-current={step.situacao === 'ATUAL' ? 'step' : undefined} className="flex flex-col gap-1.5">
            <span className={`h-1.5 rounded-full ${bar}`} />
            <span
              className={`text-xs leading-tight ${
                step.situacao === 'ATUAL' ? 'font-bold text-green-700' : 'text-neutral-500'
              }`}
            >
              {step.rotulo}
              <span className="sr-only">
                {step.situacao === 'ATUAL' ? ' (etapa atual)' : step.situacao === 'CONCLUIDA' ? ' (concluída)' : ' (pendente)'}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

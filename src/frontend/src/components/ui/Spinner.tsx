export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2" role={label ? 'status' : undefined}>
      <span
        aria-hidden="true"
        className="inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      />
      {label && <span>{label}</span>}
    </span>
  )
}

/** Esqueleto de carregamento: mostra a forma do conteúdo antes de ele chegar. */
export function Skeleton({ lines = 3, label = 'Carregando' }: { lines?: number; label?: string }) {
  return (
    <div role="status" aria-label={label} className="flex animate-pulse flex-col gap-2.5 py-2">
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className="block h-3.5 rounded bg-neutral-200"
          style={{ width: `${[85, 60, 72, 50][i % 4]}%` }}
        />
      ))}
      <span className="sr-only">{label}…</span>
    </div>
  )
}

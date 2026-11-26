import { useId } from 'react'

interface LogoProps {
  size?: number
  /**
   * `color`: ingresso verde, para fundo claro.
   * `light`: ingresso branco, para fundo verde ou azul (cabeçalhos, painel).
   */
  tone?: 'color' | 'light'
}

/**
 * Marca do Minha Vez: um ingresso de senha. A parte verde leva a cruz da
 * saúde; o canhoto picotado é amarelo, a cor de "é a sua vez" no painel.
 * A cruz é verde ou branca, nunca vermelha: cruz vermelha sobre branco é
 * emblema protegido e não pode ser marca.
 */
export default function Logo({ size = 28, tone = 'color' }: LogoProps) {
  const maskId = useId()
  const body = tone === 'light' ? 'var(--color-neutral-50)' : 'var(--color-green-500)'
  const cross = tone === 'light' ? 'var(--color-green-500)' : 'var(--color-neutral-50)'
  const perforation = tone === 'light' ? 'var(--color-green-800)' : 'var(--color-neutral-50)'

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect width="48" height="48" fill="#fff" />
          <circle cx="5" cy="24" r="5" fill="#000" />
          <circle cx="43" cy="24" r="5" fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect x="5" y="11" width="38" height="26" rx="6" fill={body} />
        <rect x="31" y="11" width="12" height="26" fill="var(--color-yellow-500)" />
      </g>
      <line x1="31" y1="12" x2="31" y2="36" stroke={perforation} strokeWidth="1.6" strokeDasharray="2.2 2.2" />
      <path d="M20 18 V30 M14 24 H26" stroke={cross} strokeWidth="4.6" strokeLinecap="round" />
    </svg>
  )
}

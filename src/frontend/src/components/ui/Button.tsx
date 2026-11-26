import type { ButtonHTMLAttributes } from 'react'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Tone = 'citizen' | 'staff'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  /** Verde no canal do cidadão, azul no canal da equipe. */
  tone?: Tone
  loading?: boolean
  block?: boolean
}

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Tone, Record<Variant, string>> = {
  citizen: {
    primary: 'border-green-500 bg-green-500 text-neutral-50 hover:bg-green-600 focus-visible:outline-green-500',
    secondary: 'border-neutral-300 bg-neutral-50 text-neutral-950 hover:bg-neutral-100 focus-visible:outline-green-500',
    ghost: 'border-transparent bg-transparent text-blue-500 hover:bg-blue-100 focus-visible:outline-blue-500',
    danger: 'border-red-500 bg-neutral-50 text-red-700 hover:bg-red-100 focus-visible:outline-red-500',
  },
  staff: {
    primary: 'border-blue-500 bg-blue-500 text-neutral-50 hover:bg-blue-600 focus-visible:outline-blue-500',
    secondary: 'border-neutral-300 bg-neutral-50 text-neutral-950 hover:bg-neutral-100 focus-visible:outline-blue-500',
    ghost: 'border-transparent bg-transparent text-blue-500 hover:bg-blue-100 focus-visible:outline-blue-500',
    danger: 'border-red-500 bg-neutral-50 text-red-700 hover:bg-red-100 focus-visible:outline-red-500',
  },
}

export function Button({
  variant = 'primary',
  tone = 'citizen',
  loading = false,
  block = false,
  disabled,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${base} ${variants[tone][variant]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

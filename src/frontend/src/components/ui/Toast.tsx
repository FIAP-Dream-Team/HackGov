import { AlertTriangle, CircleAlert, CircleCheck, Info, X, type LucideIcon } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

// Notificações passageiras: confirmam uma ação ("Horário confirmado") ou
// avisam de algo que aconteceu fora do formulário ("Sua sessão terminou").
// Erro de campo e erro de carregamento continuam no próprio lugar, com Alert,
// porque a pessoa precisa deles enquanto corrige ou tenta de novo.

export type ToastTone = 'success' | 'error' | 'info' | 'warning'

export interface ToastInput {
  tone: ToastTone
  title: string
  message?: string
  /** Em milissegundos. Erro fica mais tempo na tela por padrão. */
  duration?: number
}

interface ToastItem extends Required<Omit<ToastInput, 'message'>> {
  id: number
  message?: string
}

interface ToastApi {
  show: (toast: ToastInput) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const MAX_VISIBLE = 3
const DEFAULT_DURATION: Record<ToastTone, number> = {
  success: 5000,
  info: 5000,
  warning: 7000,
  error: 8000,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback((input: ToastInput) => {
    const toast: ToastItem = {
      id: nextId.current++,
      tone: input.tone,
      title: input.title,
      message: input.message,
      duration: input.duration ?? DEFAULT_DURATION[input.tone],
    }
    // A mais nova entra por cima; as mais antigas saem quando passa do limite.
    setToasts((current) => [toast, ...current].slice(0, MAX_VISIBLE))
  }, [])

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (title, message) => show({ tone: 'success', title, message }),
      error: (title, message) => show({ tone: 'error', title, message }),
      info: (title, message) => show({ tone: 'info', title, message }),
      warning: (title, message) => show({ tone: 'warning', title, message }),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast precisa estar dentro de <ToastProvider>.')
  }
  return context
}

const toneStyles: Record<ToastTone, { box: string; bar: string; icon: LucideIcon; label: string }> = {
  success: { box: 'border-green-200 bg-white', bar: 'bg-green-500', icon: CircleCheck, label: 'Sucesso' },
  error: { box: 'border-red-200 bg-white', bar: 'bg-red-500', icon: CircleAlert, label: 'Erro' },
  info: { box: 'border-blue-200 bg-white', bar: 'bg-blue-500', icon: Info, label: 'Aviso' },
  warning: { box: 'border-yellow-300 bg-white', bar: 'bg-yellow-500', icon: AlertTriangle, label: 'Atenção' },
}

const iconStyles: Record<ToastTone, string> = {
  success: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-yellow-200 text-yellow-800',
}

function Toaster({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    // Fica no rodapé no celular (perto do polegar) e no canto superior
    // direito em tela larga, abaixo do cabeçalho para não cobrir o "Sair". Duas regiões vivas: erro interrompe a leitura,
    // o resto espera a pessoa terminar o que está lendo.
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:top-0 sm:right-0 sm:bottom-auto sm:items-end sm:pt-[4.5rem]">
      <div aria-live="assertive" className="contents">
        {toasts.filter((t) => t.tone === 'error').map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
      <div aria-live="polite" className="contents">
        {toasts.filter((t) => t.tone !== 'error').map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </div>
  )
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false)
  const style = toneStyles[toast.tone]
  const Icon = style.icon

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => window.clearTimeout(timer)
  }, [paused, toast.id, toast.duration, onDismiss])

  return (
    <div
      role={toast.tone === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`toast-enter pointer-events-auto relative flex w-full max-w-[380px] gap-3 overflow-hidden rounded-xl border py-3 pr-3 pl-4 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.35)] ${style.box}`}
    >
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${style.bar}`} />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${iconStyles[toast.tone]}`}
      >
        <Icon className="size-4" strokeWidth={2.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-neutral-950">
          <span className="sr-only">{style.label}: </span>
          {toast.title}
        </p>
        {toast.message && <p className="mt-0.5 text-sm text-neutral-700">{toast.message}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificação"
        className="-mt-1 -mr-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

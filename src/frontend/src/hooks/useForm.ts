import { useCallback, useState } from 'react'

type Validators<V> = Partial<{ [K in keyof V]: (value: V[K], all: V) => string | null }>
type Errors<V> = Partial<Record<keyof V, string>>

/**
 * Formulário controlado com validação por campo. O erro de um campo aparece
 * depois que a pessoa sai dele (blur) ou tenta enviar, e some assim que ela
 * corrige o valor.
 */
export function useForm<V extends Record<string, string>>(initial: V, validators: Validators<V>) {
  const [values, setValues] = useState<V>(initial)
  const [errors, setErrors] = useState<Errors<V>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof V, boolean>>>({})

  const validateField = useCallback(
    (name: keyof V, nextValues: V) => validators[name]?.(nextValues[name], nextValues) ?? null,
    [validators],
  )

  const setValue = useCallback(
    (name: keyof V, value: string) => {
      setValues((current) => {
        const next = { ...current, [name]: value }
        if (touched[name]) {
          setErrors((errs) => ({ ...errs, [name]: validateField(name, next) ?? undefined }))
        }
        return next
      })
    },
    [touched, validateField],
  )

  const blur = useCallback(
    (name: keyof V) => {
      setTouched((t) => ({ ...t, [name]: true }))
      setErrors((errs) => ({ ...errs, [name]: validateField(name, values) ?? undefined }))
    },
    [validateField, values],
  )

  /** Valida tudo. Devolve true quando o formulário pode ser enviado. */
  const validateAll = useCallback(() => {
    const nextErrors: Errors<V> = {}
    const allTouched: Partial<Record<keyof V, boolean>> = {}
    for (const name of Object.keys(validators) as (keyof V)[]) {
      allTouched[name] = true
      const message = validateField(name, values)
      if (message) nextErrors[name] = message
    }
    setTouched(allTouched)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [validateField, validators, values])

  /** Coloca um erro vindo do servidor ao lado do campo (ex.: CPF já cadastrado). */
  const setError = useCallback((name: keyof V, message: string) => {
    setErrors((errs) => ({ ...errs, [name]: message }))
  }, [])

  /** Liga um campo ao TextField: value, onChange, onBlur e error. */
  const field = (name: keyof V) => ({
    value: values[name],
    onChange: (value: string) => setValue(name, value),
    onBlur: () => blur(name),
    error: errors[name] ?? null,
  })

  return { values, errors, setValue, setError, field, validateAll }
}

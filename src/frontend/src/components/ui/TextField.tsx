import { useId, type InputHTMLAttributes } from 'react'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string | null
  hint?: string
}

export function TextField({ label, value, onChange, error, hint, className = '', ...rest }: TextFieldProps) {
  const id = useId()
  const messageId = `${id}-mensagem`
  const describedBy = error || hint ? messageId : undefined

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold text-neutral-800">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`min-h-11 rounded-[10px] border bg-white px-3 py-2 text-base text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-neutral-300 focus:border-green-500 focus:ring-green-200'
        }`}
        {...rest}
      />
      {error ? (
        <p id={messageId} className="text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-sm text-neutral-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

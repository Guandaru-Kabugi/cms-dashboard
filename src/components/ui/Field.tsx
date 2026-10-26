import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'

export const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/70 focus:border-transparent focus:outline-2 focus:outline-accent aria-invalid:border-danger'

interface FieldShellProps {
  id: string
  label: string
  error?: string
  hint?: ReactNode
  required?: boolean
  children: ReactNode
}

// Label + control + hint/error, so every field in the app is laid out the same way.
function FieldShell({ id, label, error, hint, required, children }: FieldShellProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  )
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: ReactNode
}

export function TextField({ label, error, hint, required, className = '', ...props }: TextFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <input
        id={id}
        className={`${inputClass} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
    </FieldShell>
  )
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
  hint?: ReactNode
}

export function TextAreaField({ label, error, hint, required, rows = 3, ...props }: TextAreaFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        rows={rows}
        className={`${inputClass} resize-y`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
    </FieldShell>
  )
}

interface CheckboxFieldProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxField({ label, description, checked, onChange }: CheckboxFieldProps) {
  const id = useId()
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-accent"
      />
      <label htmlFor={id} className="text-sm">
        <span className="font-medium">{label}</span>
        {description && <span className="block text-muted">{description}</span>}
      </label>
    </div>
  )
}

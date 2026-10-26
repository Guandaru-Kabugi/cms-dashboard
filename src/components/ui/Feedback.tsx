import type { ReactNode } from 'react'
import { ApiError } from '../../api/client'

interface ErrorAlertProps {
  error: unknown
  // Field errors already shown next to their inputs, so the alert doesn't repeat them
  shownFields?: string[]
}

// Shows the API's error message, plus any field errors no input is displaying.
export function ErrorAlert({ error, shownFields = [] }: ErrorAlertProps) {
  if (!error) return null

  const message = error instanceof Error ? error.message : 'Something went wrong'
  const extra =
    error instanceof ApiError
      ? Object.entries(error.fieldErrors).filter(([field]) => !shownFields.includes(field))
      : []

  return (
    <div role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
      <p className="font-medium">{message}</p>
      {extra.length > 0 && (
        <ul className="mt-1 list-disc pl-5">
          {extra.map(([field, msg]) => (
            <li key={field}>
              <span className="font-mono">{field}</span>: {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SuccessAlert({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="rounded-lg bg-success-soft px-4 py-3 text-sm font-medium text-success-fg">
      {children}
    </div>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-6 py-12 text-center">
      <p className="font-medium">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  )
}

export function LoadingRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid gap-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-14 rounded-lg bg-skeleton motion-safe:animate-pulse" />
      ))}
    </div>
  )
}

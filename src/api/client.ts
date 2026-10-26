// Thin wrapper around fetch that understands the backend's error format.
//
// Spring's GlobalExceptionHandler returns errors as ProblemDetail JSON:
//   { "status": 400, "title": "Bad Request", "detail": "Validation failed",
//     "errors": { "email": "must be a well-formed email address" } }

export class ApiError extends Error {
  // HTTP status, or 0 when the API couldn't be reached
  status: number
  // Field name → message, from validation failures (400)
  fieldErrors: Record<string, string>

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

// Field-level message for a given field name, if the last request failed validation.
export function fieldError(error: unknown, field: string): string | undefined {
  return error instanceof ApiError ? error.fieldErrors[field] : undefined
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    // fetch only throws when there's no response at all
    throw new ApiError(0, 'Could not reach the server. Is the Spring Boot API running?')
  }

  if (!res.ok) {
    throw await toApiError(res)
  }

  // 204 No Content (deletes, the contact form) has no body to parse
  if (res.status === 204) {
    return undefined as T
  }
  return (await res.json()) as T
}

async function toApiError(res: Response): Promise<ApiError> {
  // The Vite proxy (and Nginx in production) answers 502/503/504 when Spring Boot
  // isn't running. Treat it like no response at all: status 0 means "API offline".
  if (res.status >= 502 && res.status <= 504) {
    return new ApiError(0, 'Could not reach the server. Is the Spring Boot API running on port 8081?')
  }
  try {
    const body = await res.json()
    return new ApiError(res.status, body.detail ?? body.title ?? `Request failed (${res.status})`, body.errors ?? {})
  } catch {
    return new ApiError(res.status, `Request failed (${res.status})`)
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}
